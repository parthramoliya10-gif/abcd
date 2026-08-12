import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, MapPin, Images } from 'lucide-react'
import * as exhibitionService from '../../services/exhibition.service'
import { useToast } from '../../Components/ui/Toast'
import DataTable from '../../Components/admin/DataTable'
import GalleryModal from '../../Components/admin/GalleryModal'
import TableToolbar from '../../Components/admin/TableToolbar'
import StatusFilterDropdown from '../../Components/ui/StatusFilterDropdown'
import Button from '../../Components/ui/Button'
import Badge from '../../Components/ui/Badge'
import Modal from '../../Components/ui/Modal'
import ConfirmDialog from '../../Components/ui/ConfirmDialog'
import { Field, Input, Textarea } from '../../Components/ui/Field'
import { statusTone } from '../../utils/helpers'
import { formatDate } from '../../utils/formatDate'
import { debounce } from '../../utils/debounce'

const EMPTY = { title: '', description: '', venue: '', location: '', start_date: '', end_date: '', status: 'upcoming' }

// Values kept identical to the old native <select> ('' = all, so the
// existing load({ search, status: statusFilter }) call needs no changes).
const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'live', label: 'Live' },
  { value: 'past', label: 'Past' },
]

// Same two values as STATUS_OPTIONS minus the toolbar-only "All statuses"
// entry — a form field always has one real status selected, never "all".
// const FORM_STATUS_OPTIONS = [
//   { value: 'upcoming', label: 'Upcoming' },
//   { value: 'past', label: 'Past' },
// ]

export default function ExhibitionsPage() {
  const { notify } = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryExhibition, setGalleryExhibition] = useState(null)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [error, setError] = useState('')

  const load = useMemo(
    () => debounce((params) => {
      setLoading(true)
      setError('')
      exhibitionService.listExhibitions(params).then((r) => { setRows(r); setLoading(false) }).catch((err) => {
        setError(err.message || 'Failed to load exhibitions.')
        setLoading(false)
        notify(err.message || 'Failed to load exhibitions.', { tone: 'error' })
      })
    }, 250),
    [notify]
  )

  useEffect(() => { load({ search, status: statusFilter }) }, [search, statusFilter, load])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setFormError('')
    setImageFile(null)
    setImagePreview('')
    setModalOpen(true)
  }

  function openEdit(row) {
    setEditing(row)
    setForm({
      title: row.title,
      description: row.description || '',
      venue: row.venue || '',
      location: row.location,
      start_date: row.start_date,
      end_date: row.end_date,
      status: row.status,
    })
    setFormError('')
    setImageFile(null)
    setImagePreview(row.image_url || '')
    setModalOpen(true)
  }

  function handleImageSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (form.end_date < form.start_date) {
      setFormError('End date must be on or after the start date.')
      return
    }
    setFormError('')
    setSaving(true)
    try {
      let record
      if (editing) {
        record = await exhibitionService.updateExhibition(editing.id, form)
        notify('Exhibition updated.')
      } else {
        record = await exhibitionService.createExhibition(form)
        notify('Exhibition created.')
      }
      if (imageFile) {
        setUploadingImage(true)
        await exhibitionService.uploadExhibitionImage(record.id, imageFile)
        setUploadingImage(false)
      }
      setModalOpen(false)
      load({ search, status: statusFilter })
    } catch (err) {
      notify(err.message || 'Something went wrong.', { tone: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await exhibitionService.deleteExhibition(confirmId)
      notify('Exhibition deleted.')
      setConfirmId(null)
      load({ search, status: statusFilter })
    } catch (err) {
      notify(err.message || 'Could not delete.', { tone: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  function openGallery(row) {
    setGalleryExhibition(row)
    setGalleryOpen(true)
  }

  async function handleGalleryUpload(file) {
    if (!galleryExhibition) return
    setUploadingGallery(true)
    try {
      const image = await exhibitionService.uploadExhibitionGalleryImage(galleryExhibition.id, file)
      setGalleryExhibition((prev) => ({ ...prev, gallery: [...(prev.gallery || []), image] }))
      notify('Gallery image added.')
      load({ search, status: statusFilter })
    } catch (err) {
      notify(err.message || 'Upload failed.', { tone: 'error' })
    } finally {
      setUploadingGallery(false)
    }
  }

  async function handleGalleryDelete(imageId) {
    if (!galleryExhibition) return
    try {
      await exhibitionService.deleteExhibitionGalleryImage(galleryExhibition.id, imageId)
      setGalleryExhibition((prev) => ({ ...prev, gallery: (prev.gallery || []).filter((i) => i.id !== imageId) }))
      notify('Image removed.')
      load({ search, status: statusFilter })
    } catch (err) {
      notify(err.message || 'Could not delete.', { tone: 'error' })
    }
  }

  const columns = [
    {
      key: 'thumbnail', header: '', headClassName: 'w-14',
      render: (r) => (
        r.image_url ? (
          <img src={r.image_url} alt={r.title} className="h-9 w-9 rounded-lg object-cover border border-ink-100" />
        ) : (
          <div className="h-9 w-9 rounded-lg bg-ink-50 flex items-center justify-center text-[10px] text-ink-400 font-bold">
            N/A
          </div>
        )
      ),
    },
    {
      key: 'title', header: 'Exhibition',
      render: (r) => (
        <div>
          <p className="text-ink-900 font-medium">{r.title}</p>
          <p className="text-ink-400 text-xs flex items-center gap-1"><MapPin size={11} />{r.location}</p>
        </div>
      ),
    },
    { key: 'venue', header: 'Venue', render: (r) => <span className="text-ink-600">{r.venue || '—'}</span> },
    { key: 'dates', header: 'Dates', render: (r) => <span className="text-ink-600">{formatDate(r.start_date)} – {formatDate(r.end_date)}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge dark tone={statusTone(r.status)}>{r.status}</Badge> },
    {
      key: 'actions', header: '', headClassName: 'w-28',
      render: (r) => (
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => openGallery(r)} className="p-1.5 rounded-md text-ink-400 hover:text-ink-900 hover:bg-ink-50" aria-label={`Gallery for ${r.title}`}>
            <Images size={15} />
          </button>
          <button onClick={() => openEdit(r)} className="p-1.5 rounded-md text-ink-400 hover:text-ink-900 hover:bg-ink-50" aria-label={`Edit ${r.title}`}>
            <Pencil size={15} />
          </button>
          <button onClick={() => setConfirmId(r.id)} className="p-1.5 rounded-md text-ink-400 hover:text-rose hover:bg-rose/5" aria-label={`Delete ${r.title}`}>
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {error && !loading && (
        <div className="rounded-lg border border-rose/30 bg-rose/5 px-4 py-3 text-sm text-rose">
          Couldn't load exhibitions: {error}
        </div>
      )}
      <DataTable
        rows={rows}
        loading={loading}
        columns={columns}
        emptyProps={{
          title: 'No exhibitions yet',
          description: 'List an exhibition to surface it on the public site.',
          action: <Button size="sm" icon={Plus} onClick={openCreate}>Add exhibition</Button>,
        }}
        toolbar={
          <TableToolbar
            dark
            search={search}
            onSearchChange={setSearch}
            placeholder="Search exhibitions…"
            filters={
              <StatusFilterDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
              />
            }
            actions={<Button size="sm" icon={Plus} onClick={openCreate}>Add exhibition</Button>}
          />
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit exhibition' : 'New exhibition'}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
              {saving && uploadingImage ? 'Uploading…' : editing ? 'Save changes' : 'Create exhibition'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </Field>
          <Field label="Description" required hint="Shown on the public exhibition page.">
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              minLength={1}
              required
            />
          </Field>
          <Field label="Venue">
            <Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="e.g. Grand Hyatt Ballroom" />
          </Field>
          <Field label="Location" required>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required placeholder="City, Country" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start date" required>
              <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
            </Field>
            <Field label="End date" required error={formError}>
              <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
            </Field>
          </div>
          <Field label="Exhibition image">
            <div
              className="relative rounded-3xl border border-dashed p-6 text-center transition-colors backdrop-blur-sm"
              style={{ borderColor: '#FFFFFF3D', background: 'rgba(255,255,255,0.08)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#D8C287B3')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#FFFFFF3D')}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <p className="text-sm text-ivory">Click or drop an image</p>
              <p className="mt-1 text-xs text-brass-300">PNG, JPG, WEBP up to 5MB</p>
            </div>
            {imagePreview && (
              <div className="mt-2 flex items-center gap-2">
                <img src={imagePreview} alt="Preview" className="h-10 w-10 rounded-lg object-cover border border-white/15" />
                <p className="truncate text-xs text-brass-300">{imageFile ? imageFile.name : 'Current image'}</p>
              </div>
            )}
          </Field>
          {/* <Field label="Status">
            <StatusFilterDropdown
              fullWidth
              value={form.status}
              onChange={(value) => setForm({ ...form, status: value })}
              options={FORM_STATUS_OPTIONS}
            />
          </Field> */}
        </form>
      </Modal>

      <GalleryModal
        open={galleryOpen}
        onClose={() => { setGalleryOpen(false); setGalleryExhibition(null) }}
        title={galleryExhibition ? `${galleryExhibition.title} — Gallery` : 'Gallery'}
        subtitle="Manage exhibition gallery images"
        images={galleryExhibition?.gallery || []}
        uploading={uploadingGallery}
        onUpload={handleGalleryUpload}
        onDelete={handleGalleryDelete}
      />

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete exhibition?"
        description="This removes the exhibition and its gallery from the public site. This can't be undone."
      />
    </div>
  )
}