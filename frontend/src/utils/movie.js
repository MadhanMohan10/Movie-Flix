import { TMDB_BACKDROP_BASE, TMDB_POSTER_BASE } from './constants'

export function posterUrl(path) {
  if (!path) {
    return 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22600%22 viewBox=%220 0 400 600%22%3E%3Crect width=%22400%22 height=%22600%22 fill=%22%230f172a%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 fill=%22%239ca3af%22 font-family=%22Arial%2Csans-serif%22 font-size=%2232%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EMovie Poster%3C/text%3E%3C/svg%3E'
  }

  return `${TMDB_POSTER_BASE}${path}`
}

export function backdropUrl(path) {
  if (!path) {
    return posterUrl()
  }

  return `${TMDB_BACKDROP_BASE}${path}`
}

export function formatDate(value) {
  if (!value) return 'Release date unavailable'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(value) {
  if (!value) return 'Unavailable'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatRuntime(minutes) {
  if (!minutes && minutes !== 0) return 'Runtime unavailable'

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (!hours) return `${mins}m`

  return `${hours}h ${String(mins).padStart(2, '0')}m`
}

export function formatRating(value) {
  if (typeof value !== 'number') return 'N/A'

  return value.toFixed(1)
}
