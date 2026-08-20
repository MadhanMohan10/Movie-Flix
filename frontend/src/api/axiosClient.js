import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data
    const fallback = error?.response?.statusText || error.message || 'Request failed'
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' && data.trim()) ||
      fallback

    if (data && typeof data === 'object' && data.errors) {
      const details = Object.entries(data.errors)
        .map(([field, value]) => `${field}: ${value}`)
        .join(', ')
      return Promise.reject(new Error(details ? `${message} (${details})` : message))
    }

    return Promise.reject(new Error(message))
  },
)

export default axiosClient
