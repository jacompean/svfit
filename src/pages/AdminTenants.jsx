import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, apiErrorMessage } from '../lib/api'

export default function AdminTenants() {
  const [tenants, setTenants] = useState([])
  const [err, setErr] = useState('')
  const [form, setForm] = useState({ code: '', name: '', accent_color: '#39FF14', logo_url: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const r = await api.get('/api/admin/tenants')
    setTenants(r.data.tenants || [])
  }

  useEffect(() => {
    load().catch(e => setErr(apiErrorMessage(e)))
  }, [])

  const createTenant = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErr('')
    try {
      await api.post('/api/admin/tenants', {
        code: form.code.toUpperCase().trim(),
        name: form.name.trim(),
        accent_color: form.accent_color,
        logo_url: form.logo_url.trim()
      })
      setForm({ code: '', name: '', accent_color: '#39FF14', logo_url: '' })
      await load()
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Gimnasios (Tenants)</h1>
      <p className="text-sv-muted mt-1">Crea gimnasios, configura branding y dominios permitidos.</p>

      {err ? <div className="mt-4 text-sm text-red-300">{err}</div> : null}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sv-card p-4">
          <div className="font-semibold">Crear gimnasio</div>
          <form className="mt-3 space-y-3" onSubmit={createTenant}>
            <div>
              <label className="text-sm text-sv-muted">Código (2 letras)</label>
              <input className="sv-input mt-1" value={form.code} onChange={(e)=>setForm({...form, code: e.target.value})} placeholder="SV" maxLength={2} />
            </div>
            <div>
              <label className="text-sm text-sv-muted">Nombre</label>
              <input className="sv-input mt-1" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="SVFIT" />
            </div>
            <div>
              <label className="text-sm text-sv-muted">Color acento</label>
              <input className="sv-input mt-1" value={form.accent_color} onChange={(e)=>setForm({...form, accent_color: e.target.value})} placeholder="#39FF14" />
            </div>
            <div>
              <label className="text-sm text-sv-muted">Logo URL (opcional)</label>
              <input className="sv-input mt-1" value={form.logo_url} onChange={(e)=>setForm({...form, logo_url: e.target.value})} placeholder="https://.../logo.png" />
            </div>
            <button className="sv-btn-primary w-full" disabled={saving}>Crear</button>
            <div className="text-xs text-sv-muted">Después agrega dominios permitidos dentro del tenant.</div>
          </form>
        </div>

        <div className="sv-card p-4">
          <div className="font-semibold">Lista</div>
          <div className="mt-3 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-sv-muted">
                <tr>
                  <th className="text-left py-2">Código</th>
                  <th className="text-left py-2">Nombre</th>
                  <th className="text-left py-2">Activo</th>
                  <th className="text-left py-2"></th>
                </tr>
              </thead>
              <tbody>
                {(tenants||[]).map(t => (
                  <tr key={t.id} className="border-t border-sv-border">
                    <td className="py-2 font-semibold">{t.code}</td>
                    <td className="py-2">{t.name}</td>
                    <td className="py-2">{t.is_active ? 'Sí' : 'No'}</td>
                    <td className="py-2 text-right">
                      <Link className="sv-btn-ghost text-xs" to={`/admin/tenants/${t.id}`}>Configurar</Link>
                    </td>
                  </tr>
                ))}
                {tenants.length === 0 ? <tr><td colSpan={4} className="py-3 text-sv-muted">Aún no hay gimnasios.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
