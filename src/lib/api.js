import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://svfit-backend.vercel.app').replace(/\/$/, '')

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('svfit_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function apiErrorMessage(err) {
  const msg = err?.response?.data?.error
  if (Array.isArray(msg)) return msg.map(i => i.message).join(', ')
  if (typeof msg === 'string') return msg
  if (typeof err?.message === 'string') return err.message
  return 'Ocurrió un error'
}

export async function getTenant() {
  const r = await api.get('/api/tenant')
  return r.data.tenant
}
