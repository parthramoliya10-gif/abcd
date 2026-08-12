import request, { USE_MOCK_EXHIBITIONS, mockDelay } from './api'
import { mockExhibitions } from '../mock/data'
import { generateSlug } from '../utils/generateSlug'

let store = [...mockExhibitions]

// The real exhibitions model (server/prisma/schema.prisma) has no `status`
// or single `location` field the way the mock/UI do — it stores venue,
// city, country, startDate and endDate separately, plus featured/isActive
// booleans. This derives the two-value status the UI actually uses
// ('upcoming' | 'past') from endDate, and joins city/country into the
// single "City, Country" string the form and table already render.
function deriveStatus(startDate, endDate) {
  const now = new Date()
  if (startDate && now < new Date(startDate)) return 'upcoming'
  if (endDate && now > new Date(endDate)) return 'past'
  return 'live'
}
function joinLocation(city, country) {
  return [city, country].filter(Boolean).join(', ')
}

function splitLocation(location) {
  const [city, ...rest] = String(location || '').split(',').map((s) => s.trim())
  return { city: city || undefined, country: rest.join(', ') || undefined }
}

function normalizeExhibition(row) {
  if (!row) return row
  const gallery = row.gallery ?? (row.exhibition_images || []).map((img) => ({
    id: img.id,
    image_url: img.imageUrl,
    alt_text: img.altText,
  }))
  return {
    ...row,
    location: row.location ?? joinLocation(row.city, row.country),
    start_date: row.start_date ?? (row.startDate ? String(row.startDate).slice(0, 10) : undefined),
    end_date: row.end_date ?? (row.endDate ? String(row.endDate).slice(0, 10) : undefined),
    status: row.status ?? deriveStatus(row.startDate ?? row.start_date, row.endDate ?? row.end_date),
    image_url: row.image_url ?? row.thumbnailUrl,
    images: row.images ?? gallery.length,
    gallery,
  }
}

// Maps the form shape (title/description/venue/location/start_date/
// end_date) to what createExhibitionSchema / updateExhibitionSchema
// actually accept. `status` isn't a real backend field — it's derived
// from dates on read — so it's intentionally dropped here.
function toBackendPayload(payload) {
  const { location, start_date, end_date, ...rest } = payload
  const backendFields = { ...rest }
  delete backendFields.status

  const { city, country } = splitLocation(location)

  return {
    ...backendFields,
    city,
    country,
    ...(start_date ? { startDate: start_date } : {}),
    ...(end_date ? { endDate: end_date } : {}),
  }
}
export async function listExhibitions({ search, status } = {}) {
  if (USE_MOCK_EXHIBITIONS) {
    let rows = [...store]
    if (search) rows = rows.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
    if (status) rows = rows.filter((e) => e.status === status)
    return mockDelay(rows)
  }
  // The backend has no status filter — 'upcoming'/'past' is derived
  // client-side from dates below — and search only exists as a separate
  // /exhibitions/search?keyword= endpoint, not a query param on the list
  // route, so route to whichever one the caller actually needs.
  const result = search
    ? await request('/exhibitions/search', { params: { keyword: search } })
    : await request('/exhibitions', { params: status ? { status } : {} }) 
  let rows = result.items.map(normalizeExhibition)
  return rows
}
export async function createExhibition(payload) {
  if (USE_MOCK_EXHIBITIONS) {
    const row = {
      id: `e${Date.now()}`,
      slug: generateSlug(payload.title),
      status: 'upcoming',
      images: 0,
      ...payload,
    }
    store = [row, ...store]
    return mockDelay(row)
  }
  const row = await request('/exhibitions', { method: 'POST', body: toBackendPayload(payload) })
  return normalizeExhibition(row)
}

export async function updateExhibition(id, payload) {
  if (USE_MOCK_EXHIBITIONS) {
    store = store.map((e) => (e.id === id ? { ...e, ...payload } : e))
    return mockDelay(store.find((e) => e.id === id))
  }
  const row = await request(`/exhibitions/${id}`, { method: 'PATCH', body: toBackendPayload(payload) })
  return normalizeExhibition(row)
}

export async function deleteExhibition(id) {
  if (USE_MOCK_EXHIBITIONS) {
    store = store.filter((e) => e.id !== id)
    return mockDelay(null)
  }
  return request(`/exhibitions/${id}`, { method: 'DELETE' })
}

export async function uploadExhibitionGalleryImage(id, file) {
  if (USE_MOCK_EXHIBITIONS) {
    const image = { id: `img${Date.now()}`, image_url: URL.createObjectURL(file) }
    store = store.map((e) =>
      e.id === id ? { ...e, gallery: [...(e.gallery || []), image], images: (e.images || 0) + 1 } : e
    )
    return mockDelay(image)
  }
  const formData = new FormData()
  formData.append('image', file)
  const image = await request(`/exhibitions/${id}/gallery`, { method: 'POST', body: formData })
  return { id: image.id, image_url: image.imageUrl, alt_text: image.altText }
}

export async function deleteExhibitionGalleryImage(exhibitionId, imageId) {
  if (USE_MOCK_EXHIBITIONS) {
    store = store.map((e) =>
      e.id === exhibitionId
        ? { ...e, gallery: (e.gallery || []).filter((i) => i.id !== imageId), images: Math.max(0, (e.images || 1) - 1) }
        : e
    )
    return mockDelay(null)
  }
  // Backend mounts this at /exhibitions/gallery/:imageId (not nested under
  // the exhibition id) — exhibitionId is only needed for the mock branch.
  return request(`/exhibitions/gallery/${imageId}`, { method: 'DELETE' })
}
export async function uploadExhibitionImage(id, file) {
  if (USE_MOCK_EXHIBITIONS) {
    const url = URL.createObjectURL(file)
    store = store.map((e) => (e.id === id ? { ...e, image_url: url } : e))
    return mockDelay({ image_url: url })
  }
  const formData = new FormData()
  formData.append('image', file)
  // Real route is /thumbnail, not /image, and returns { thumbnailUrl }.
  const result = await request(`/exhibitions/${id}/thumbnail`, { method: 'POST', body: formData })
  return { image_url: result.thumbnailUrl }
}
