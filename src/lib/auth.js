import { api } from './api'

export function getSession() {
  const token = localStorage.getItem('svfit_token')
  const user = localStorage.getItem('svfit_user')
  return { token, user: user ? JSON.parse(user) : null }
}

export function setSession(token, user) {
  localStorage.setItem('svfit_token', token)
  localStorage.setItem('svfit_user', JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem('svfit_token')
  localStorage.removeItem('svfit_user')
}

export async function login(identifier, password) {
  const r = await api.post('/api/auth/login', { identifier, password })
  if (r.data?.token) setSession(r.data.token, r.data.user)
  return r.data
}

export async function me() {
  const r = await api.get('/api/me')
  return r.data.user
}
