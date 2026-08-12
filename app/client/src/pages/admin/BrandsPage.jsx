import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Building2, Images } from 'lucide-react'
import * as brandService from '../../services/brand.service'
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
import { debounce } from '../../utils/debounce'

const EMPTY = {
  name: '',
  description: '',
  overview: '',
  ctaTitle: '',
  ctaButtonText: '',
  isActive: true,
  logoFile: null,
  bannerFile: null,
  logoUrl: '',
  bannerUrl: '',
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
]

// Same two values as STATUS_OPTIONS minus the toolbar-only "All statuses"
// entry — a form field always has one real status selected, never "all".
const FORM_STATUS_OPTIONS = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
]

export default function BrandsPage() {
  const { notify } = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryBrand, setGalleryBrand] = useState(null)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [error, setError] = useState('')

  const load = useMemo(() => debounce(() => {
    setLoading(true)
    setError('')
    brandService.listBrands().then((r) => { setRows(r); setLoading(false) }).catch((err) => {
      setError(err.message || 'Failed to load brands.')
      setLoading(false)
      notify(err.message || 'Failed to load brands.', { tone: 'error' })
    })
  }, 200), [notify])

  useEffect(() => { load() }, [load])

  const filtered = rows
    .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
    .filter((b) => statusFilter === 'all' || b.isActive === statusFilter)

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true) }

  function openEdit(row) {
    setEditing(row)
    setForm({
      name: row.name,
      description: row.description || '',
      overview: row.overview || '',
      ctaTitle: row.ctaTitle || '',
      ctaButtonText: row.ctaButtonText || '',
      isActive: !!row.isActive,
      logoFile: null,
      bannerFile: null,
      logoUrl: row.logoUrl || '',
      bannerUrl: row.bannerUrl || '',
    })
    setModalOpen(true)
  }

  // Logo/banner are now submitted together with the rest of the form in a
  // single multipart request (uploadBrandImages on create/update), so there's
  // no more "save first, then upload" step — one Save does everything.
  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        overview: form.overview,
        ctaTitle: form.ctaTitle,
        ctaButtonText: form.ctaButtonText,
        isActive: form.isActive,
        logo: form.logoFile || undefined,
        banner: form.bannerFile || undefined,
      }
      if (editing) {
        const updated = await brandService.updateBrand(editing.id, payload)
        setEditing(updated)
        notify('Brand details updated.')
      } else {
        const created = await brandService.createBrand(payload)
        setEditing(created)
        notify('Brand created.')
      }
      load()
    } catch (err) {
      notify(err.message || 'Something went wrong.', { tone: 'error' })
    } finally {
      setSaving(false)
    }
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
    setForm(EMPTY)
  }

  function handleFileSelect(e, target) {
    const file = e.target.files?.[0]
    if (!file) return
    const fileField = target === 'logo' ? 'logoFile' : 'bannerFile'
    const urlField = target === 'logo' ? 'logoUrl' : 'bannerUrl'
    setForm((f) => ({ ...f, [fileField]: file, [urlField]: URL.createObjectURL(file) }))
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await brandService.deleteBrand(confirmId)
      notify('Brand deleted.')
      setConfirmId(null)
      load()
    } catch (err) {
      notify(err.message || 'Could not delete.', { tone: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  function openGallery(row) {
    setGalleryBrand(row)
    setGalleryOpen(true)
  }

  // Adding a gallery image goes through the same update() multipart route
  // as everything else — there's no dedicated /gallery upload endpoint.
  async function handleGalleryUpload(file) {
    if (!galleryBrand) return
    setUploadingGallery(true)
    try {
      const updated = await brandService.updateBrand(galleryBrand.id, { images: [file] })
      setGalleryBrand(updated)
      notify('Gallery image added.')
      load()
    } catch (err) {
      notify(err.message || 'Upload failed.', { tone: 'error' })
    } finally {
      setUploadingGallery(false)
    }
  }

  async function handleGalleryDelete(imageId) {
    if (!galleryBrand) return
    try {
      await brandService.deleteBrandGalleryImage(galleryBrand.id, imageId)
      setGalleryBrand((prev) => ({ ...prev, gallery: (prev.gallery || []).filter((i) => i.id !== imageId) }))
      notify('Image removed.')
      load()
    } catch (err) {
      notify(err.message || 'Could not delete.', { tone: 'error' })
    }
  }

  const columns = [
  {
    key: 'logo', header: 'Logo', headClassName: 'w-16',
    render: (r) => (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-50 text-ink-400 shrink-0 overflow-hidden">
        {r.logoUrl ? (
          <img src={r.logoUrl} alt={r.name} className="h-full w-full object-cover" />
        ) : (
          <Building2 size={15} />
        )}
      </div>
    ),
  },
  {
    key: 'name', header: 'Brand',
    render: (r) => (
      <div>
        <p className="text-ink-900 font-medium">{r.name}</p>
        <p className="text-ink-400 text-xs">/{r.slug}</p>
      </div>
    ),
  },
  { key: 'collections', header: 'Collections', render: (r) => <span className="text-ink-600">{r.collections}</span> },
  {
    key: 'status', header: 'Status',
    render: (r) => <Badge dark tone={r.isActive ? 'emerald' : 'ink'}>{r.isActive ? 'active' : 'inactive'}</Badge>,
  },
  {
    key: 'actions', header: '', headClassName: 'w-28',
    render: (r) => (
      <div className="flex items-center gap-1 justify-end">
        <button onClick={() => openGallery(r)} className="p-1.5 rounded-md text-ink-400 hover:text-ink-900 hover:bg-ink-50" aria-label={`Gallery for ${r.name}`}>
          <Images size={15} />
        </button>
        <button onClick={() => openEdit(r)} className="p-1.5 rounded-md text-ink-400 hover:text-ink-900 hover:bg-ink-50" aria-label={`Edit ${r.name}`}>
          <Pencil size={15} />
        </button>
        <button onClick={() => setConfirmId(r.id)} className="p-1.5 rounded-md text-ink-400 hover:text-rose hover:bg-rose/5" aria-label={`Delete ${r.name}`}>
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
          Couldn't load brands: {error}
        </div>
      )}
      <DataTable
        rows={filtered}
        loading={loading}
        columns={columns}
        emptyProps={{
          title: 'No brands yet',
          description: 'Add a brand so its collections can be organized under it.',
          action: <Button size="sm" icon={Plus} onClick={openCreate}>Add brand</Button>,
        }}
        toolbar={
          <TableToolbar
            dark
            search={search}
            onSearchChange={setSearch}
            placeholder="Search brands…"
            actions={<Button size="sm" icon={Plus} onClick={openCreate}>Add brand</Button>}
            filters={
              <StatusFilterDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
              />
            }
          />
        }
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit brand' : 'New brand'}
        subtitle={editing ? `/${editing.slug}` : 'Add the brand details, logo, and banner.'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={closeModal}>{editing ? 'Done' : 'Cancel'}</Button>
            <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
              {editing ? 'Save changes' : 'Create brand'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Brand name" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Description" required hint="At least 10 characters — shown on the public brand listing.">
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              minLength={10}
              required
            />
          </Field>
          <Field label="Inquiry CTA heading">
            <Input value={form.ctaTitle} onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })} placeholder="e.g. Schedule a private viewing" />
          </Field>
          <Field label="CTA button text">
            <Input value={form.ctaButtonText} onChange={(e) => setForm({ ...form, ctaButtonText: e.target.value })} placeholder="e.g. Book inquiry" />
          </Field>
          <Field label="Brand overview">
            <Textarea rows={5} value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} />
          </Field>
          <Field label="Status">
            <StatusFilterDropdown
              fullWidth
              value={form.isActive}
              onChange={(value) => setForm({ ...form, isActive: value })}
              options={FORM_STATUS_OPTIONS}
            />
          </Field>

          <div className="pt-2 border-t border-ink-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Logo">
                <div
                  className="relative rounded-3xl border border-dashed p-6 text-center transition-colors backdrop-blur-sm"
                  style={{ borderColor: '#FFFFFF3D', background: 'rgba(255,255,255,0.08)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#D8C287B3')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#FFFFFF3D')}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'logo')}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <p className="text-sm text-ivory">Click or drop an image</p>
                  <p className="mt-1 text-xs text-brass-300">PNG, JPG, WEBP up to 5MB</p>
                </div>
                {form.logoUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={form.logoUrl} alt="Logo preview" className="h-10 w-10 rounded-full object-cover border border-white/15" />
                    <p className="truncate text-xs text-brass-300">{form.logoFile ? form.logoFile.name : form.logoUrl}</p>
                  </div>
                )}
              </Field>

              <Field label="Banner">
                <div
                  className="relative rounded-3xl border border-dashed p-6 text-center transition-colors backdrop-blur-sm"
                  style={{ borderColor: '#FFFFFF3D', background: 'rgba(255,255,255,0.08)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#D8C287B3')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#FFFFFF3D')}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'banner')}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <p className="text-sm text-ivory">Click or drop an image</p>
                  <p className="mt-1 text-xs text-brass-300">PNG, JPG, WEBP up to 5MB</p>
                </div>
                {form.bannerUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={form.bannerUrl} alt="Banner preview" className="h-10 w-10 rounded-md object-cover border border-white/15" />
                    <p className="truncate text-xs text-brass-300">{form.bannerFile ? form.bannerFile.name : form.bannerUrl}</p>
                  </div>
                )}
              </Field>
            </div>
            {!editing?.id && (
              <p className="text-xs text-ink-400">Gallery images can be added from the gallery icon once the brand is created.</p>
            )}
          </div>
        </form>
      </Modal>

      <GalleryModal
        open={galleryOpen}
        onClose={() => { setGalleryOpen(false); setGalleryBrand(null) }}
        title={galleryBrand ? `${galleryBrand.name} — Gallery` : 'Gallery'}
        subtitle="Manage brand gallery images"
        images={galleryBrand?.gallery || []}
        uploading={uploadingGallery}
        onUpload={handleGalleryUpload}
        onDelete={handleGalleryDelete}
      />

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete brand?"
        description="Collections under this brand will be orphaned. Reassign them first if you want to keep them live."
      />
    </div>
  )
}
