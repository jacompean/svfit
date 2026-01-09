import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiErrorMessage, getTenant } from '../lib/api'
import { getSession, login } from '../lib/auth'

export default function LoginPage() {
  const nav = useNavigate()
  const { token } = getSession()

  const [tenant, setTenant] = useState(null)
  const [tenantError, setTenantError] = useState('')

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (token) nav('/dashboard')
  }, [token, nav])

  useEffect(() => {
    ;(async () => {
      try {
        const t = await getTenant()
        setTenant(t)
        setTenantError('')
        if (t?.accent_color) document.documentElement.style.setProperty('--sv-accent', t.accent_color)
      } catch (e) {
        setTenant(null)
        setTenantError(apiErrorMessage(e))
      }
    })()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const r = await login(identifier.trim(), password)
      if (r.ok) nav('/dashboard')
      else setErr('Login falló')
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md sv-card p-6">
        <div className="flex items-center gap-3">
          <img src="/logo-svfit.jpeg" className="w-12 h-12 rounded-2xl border border-sv-border object-cover" />
          <div>
            <div className="text-2xl font-black">{tenant?.name || 'SVFIT'}</div>
            <div className="text-sm text-sv-muted">Acceso al portal</div>
          </div>
        </div>

        {tenantError ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
            <div className="font-semibold">Dominio no autorizado</div>
            <div className="text-sv-muted text-xs mt-1">{tenantError}</div>
            <div className="text-sv-muted text-xs mt-2">Pídele al admin global que agregue este dominio al gimnasio en el panel.</div>
          </div>
        ) : null}

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-sv-muted">ID</label>
            <input className="sv-input mt-1" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} placeholder="SV0001" autoComplete="username" />
            <div className="text-xs text-sv-muted mt-1">Admin global: usa <span className="text-sv-neon font-semibold">admin</span>.</div>
          </div>
          <div>
            <label className="text-sm text-sv-muted">Contraseña</label>
            <input className="sv-input mt-1" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {err ? <div className="text-sm text-red-300">{err}</div> : null}
          <button className="sv-btn-primary w-full" disabled={loading || tenantError}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-xs text-sv-muted">
          Nota: los miembros se preregistran y se activan en recepción después de pagar.
        </div>
      </div>
    </div>
  )
}
