import React, { useState } from 'react'
import { api, apiErrorMessage } from '../lib/api'

export default function Users() {
  const [role, setRole] = useState('staff')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const onCreate = async (e) => {
    e.preventDefault()
    setErr('')
    setResult(null)
    setLoading(true)
    try {
      const r = await api.post('/api/users', { role, password })
      setResult(r.data)
      setPassword('')
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Usuarios</h1>
      <p className="text-sv-muted mt-1">Crear staff/coach (ID automático por gimnasio).</p>

      <div className="mt-6 sv-card p-4 max-w-xl">
        <form className="space-y-3" onSubmit={onCreate}>
          <div>
            <label className="text-sm text-sv-muted">Rol</label>
            <select className="sv-input mt-1" value={role} onChange={(e)=>setRole(e.target.value)}>
              <option value="staff">staff (recepción)</option>
              <option value="coach">coach</option>
              <option value="admin_tenant">admin_tenant</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-sv-muted">Password inicial</label>
            <input className="sv-input mt-1" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="mínimo 6 caracteres" />
          </div>
          {err ? <div className="text-sm text-red-300">{err}</div> : null}
          <button className="sv-btn-primary w-full" disabled={loading}>{loading ? 'Creando…' : 'Crear usuario'}</button>
        </form>

        {result?.id_code ? (
          <div className="mt-4 rounded-xl border border-sv-border p-3 text-sm">
            <div className="font-semibold">Usuario creado</div>
            <div className="mt-1">ID: <span className="text-sv-neon font-bold">{result.id_code}</span></div>
            <div className="text-xs text-sv-muted mt-1">Guarda este ID, es el username de login.</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
