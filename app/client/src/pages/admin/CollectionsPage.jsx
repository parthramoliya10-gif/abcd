import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, ImagePlus, Images } from 'lucide-react'
import * as collectionService from '../../services/collection.service'
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
import { formatDate } from '../../utils/formatDate'
import { debounce } from '../../utils/debounce'

const EMPTY = {
  name: '',
  brandId: '',
  description: '',
  category: '',
  specification: '',
  ctaTitle: '',
  ctaButtonText: '',
  featured: false,
  isActive: true,
  bannerFile: null,
  bannerUrl: '',
}

// Values kept identical to the old native <select> ('all' = no filter).
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

export default function CollectionsPage() {
  const { notify } = useToast()
  const [rows, setRows] = useState([])
  const [brands, setBrands] = useState([])
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
  const [galleryCollection, setGalleryCollection] = useState(null)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    brandService.listBrands().then(setBrands).catch((err) => {
      notify(err.message || 'Failed to load brands.', { tone: 'error' })
    })
  }, [notify])

  // Themed options for the Brand field's StatusFilterDropdown. A leading
  // placeholder entry (value: '') mirrors the toolbar's "All statuses" row
  // above, so the trigger shows "Select a brand" until one is chosen —
  // same pattern, no native <select> required.
  const brandOptions = useMemo(
    () => [
      { value: '', label: 'Select a brand' },
      ...brands.filter((b) => b.isActive).map((b) => ({ value: b.id, label: b.name })),
    ],
    [brands]
  )

  const load = useMemo(
    () =>
      debounce((params) => {
        setLoading(true)
        setError('')
        collectionService.listCollections(params).then((r) => {
          setRows(r)
          setLoading(false)
        }).catch((err) => {
          setError(err.message || 'Failed to load collections.')
          setLoading(false)
          notify(err.message || 'Failed to load collections.', { tone: 'error' })
        })
      }, 250),
    [notify]
  )

  useEffect(() => {
    load({ search, isActive: statusFilter === 'all' ? undefined : statusFilter })
  }, [search, statusFilter, load])

  function brandName(id) {
    return brands.find((b) => b.id === id)?.name || '—'
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  function openEdit(row) {
    setEditing(row)
    setForm({
      name: row.name,
      brandId: row.brandId,
      description: row.description || '',
      category: row.category || '',
      specification: row.specification || '',
      ctaTitle: row.ctaTitle || '',
      ctaButtonText: row.ctaButtonText || '',
      featured: !!row.featured,
      isActive: !!row.isActive,
      bannerFile: null,
      bannerUrl: row.bannerUrl || '',
    })
    setModalOpen(true)
  }

  // Banner is now submitted together with the rest of the form in a single
  // multipart request (uploadCollectionImages on create/update), so there's
  // no more "save first, then upload" step — one Save does everything.
  async function handleSave(e) {
    e.preventDefault()
    if (!form.brandId) {
      notify('Please select a brand.', { tone: 'error' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        brandId: form.brandId,
        description: form.description,
        category: form.category,
        specification: form.specification,
        ctaTitle: form.ctaTitle,
        ctaButtonText: form.ctaButtonText,
        featured: form.featured,
        isActive: form.isActive,
        banner: form.bannerFile || undefined,
      }
      if (editing) {
        const updated = await collectionService.updateCollection(editing.id, payload)
        setEditing(updated)
        notify('Collection updated.')
      } else {
        const created = await collectionService.createCollection(payload)
        setEditing(created)
        notify('Collection created.')
      }
      load({ search, isActive: statusFilter === 'all' ? undefined : statusFilter })
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

  function handleBannerSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((f) => ({ ...f, bannerFile: file, bannerUrl: URL.createObjectURL(file) }))
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await collectionService.deleteCollection(confirmId)
      notify('Collection deleted.')
      setConfirmId(null)
      load({ search, isActive: statusFilter === 'all' ? undefined : statusFilter })
    } catch (err) {
      notify(err.message || 'Could not delete.', { tone: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  function openGallery(row) {
    setGalleryCollection(row)
    setGalleryOpen(true)
  }

  // Adding a gallery image goes through the same update() multipart route
  // as everything else — there's no dedicated /gallery upload endpoint.
  async function handleGalleryUpload(file) {
    if (!galleryCollection) return
    setUploadingGallery(true)
    try {
      const updated = await collectionService.updateCollection(galleryCollection.id, { images: [file] })
      setGalleryCollection(updated)
      notify('Gallery image added.')
      load({ search, isActive: statusFilter === 'all' ? undefined : statusFilter })
    } catch (err) {
      notify(err.message || 'Upload failed.', { tone: 'error' })
    } finally {
      setUploadingGallery(false)
    }
  }

  async function handleGalleryDelete(imageId) {
    if (!galleryCollection) return
    try {
      await collectionService.deleteCollectionGalleryImage(galleryCollection.id, imageId)
      setGalleryCollection((prev) => ({ ...prev, gallery: (prev.gallery || []).filter((i) => i.id !== imageId) }))
      notify('Image removed.')
      load({ search, isActive: statusFilter === 'all' ? undefined : statusFilter })
    } catch (err) {
      notify(err.message || 'Could not delete.', { tone: 'error' })
    }
  }

  const columns = [
    {
      key: 'banner', header: 'Banner', headClassName: 'w-16',
      render: (r) => (
        r.bannerUrl ? (
          <img
            src={r.bannerUrl}
            alt={r.name}
            className="h-10 w-10 rounded-lg object-cover border border-ink-100"
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-ink-50 flex items-center justify-center text-[10px] text-ink-400 font-bold">
            N/A
          </div>
        )
      ),
    },
    {
      key: 'name', header: 'Collection',
      render: (r) => (
        <div>
          <p className="text-ink-900 font-medium">{r.name}</p>
          <p className="text-ink-400 text-xs">/{r.slug}</p>
        </div>
      ),
    },
    { key: 'brand', header: 'Brand', render: (r) => <span className="text-ink-600">{brandName(r.brandId)}</span> },
    { key: 'category', header: 'Category', render: (r) => <span className="text-ink-600">{r.category || '—'}</span> },
    { key: 'featured', header: 'Featured', render: (r) => <span className="text-ink-600">{r.featured ? '★' : '—'}</span> },
    { key: 'images', header: 'Images', render: (r) => (
      <span className="inline-flex items-center gap-1.5 text-ink-600"><ImagePlus size={13} className="text-ink-400" />{r.images}</span>
    ) },
    {
      key: 'status', header: 'Status',
      render: (r) => <Badge dark tone={r.isActive ? 'emerald' : 'ink'}>{r.isActive ? 'active' : 'inactive'}</Badge>,
    },
    { key: 'created_at', header: 'Created', render: (r) => <span className="text-ink-400">{formatDate(r.created_at)}</span> },
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
          Couldn't load collections: {error}
        </div>
      )}
      <DataTable
        rows={rows}
        loading={loading}
        columns={columns}
        emptyProps={{
          title: 'No collections yet',
          description: 'Create your first collection to feature it on the public site.',
          action: <Button size="sm" icon={Plus} onClick={openCreate}>Add collection</Button>,
        }}
        toolbar={
          <TableToolbar
            dark
            search={search}
            onSearchChange={setSearch}
            placeholder="Search collections…"
            filters={
              <StatusFilterDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
              />
            }
            actions={<Button size="sm" icon={Plus} onClick={openCreate}>Add collection</Button>}
          />
        }
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit collection' : 'New collection'}
        subtitle={editing ? `/${editing.slug}` : 'Add the collection details and a banner.'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={closeModal}>{editing ? 'Done' : 'Cancel'}</Button>
            <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
              {editing ? 'Save changes' : 'Create collection'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Name" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Brand" required>
            <StatusFilterDropdown
              fullWidth
              value={form.brandId}
              onChange={(value) => setForm({ ...form, brandId: value })}
              options={brandOptions}
            />
          </Field>
          <Field label="Description" required hint="At least 10 characters — shown on the public collection listing.">
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              minLength={10}
              required
            />
          </Field>
          <Field label="Category" hint="Optional, e.g. Rings, Necklaces, Bridal…">
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Rings" />
          </Field>
          <Field label="Specifications" hint="Material, weight, purity, gemstone details…">
            <Textarea rows={3} value={form.specification} onChange={(e) => setForm({ ...form, specification: e.target.value })} />
          </Field>
          <Field label="Inquiry CTA heading">
            <Input value={form.ctaTitle} onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })} placeholder="e.g. Interested in this collection?" />
          </Field>
          <Field label="CTA button text">
            <Input value={form.ctaButtonText} onChange={(e) => setForm({ ...form, ctaButtonText: e.target.value })} placeholder="e.g. Enquire now" />
          </Field>
          <Field label="Featured">
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded border-ink-200 accent-ink-900"
              />
              Feature this collection
            </label>
          </Field>
          <Field label="Status">
            <StatusFilterDropdown
              fullWidth
              value={form.isActive}
              onChange={(value) => setForm({ ...form, isActive: value })}
              options={FORM_STATUS_OPTIONS}
            />
          </Field>

          <div className="pt-2 border-t border-ink-100 space-y-3">
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
                  onChange={handleBannerSelect}
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
            {!editing?.id && (
              <p className="text-xs text-ink-400">Gallery images can be added from the gallery icon once the collection is created.</p>
            )}
          </div>
        </form>
      </Modal>

      <GalleryModal
        open={galleryOpen}
        onClose={() => { setGalleryOpen(false); setGalleryCollection(null) }}
        title={galleryCollection ? `${galleryCollection.name} — Gallery` : 'Gallery'}
        subtitle="Manage collection gallery images"
        images={galleryCollection?.gallery || []}
        uploading={uploadingGallery}
        onUpload={handleGalleryUpload}
        onDelete={handleGalleryDelete}
      />

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete collection?"
        description="This removes the collection and its gallery images from the public site. This can't be undone."
      />
    </div>
  )
}