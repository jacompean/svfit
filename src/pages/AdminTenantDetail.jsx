import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, apiErrorMessage } from '../lib/api'

export default function AdminTenantDetail() {
  const { id } = useParams()
  const [tenant, setTenant] = useState(null)
  const [domains, setDomains] = useState([])
  const [err, setErr] = useState('')
  const [domain, setDomain] = useState('')
  const [saving, setSaving] = useState(false)
  const [pwd, setPwd] = useState('Admin123!')
  const [createdAdmin, setCreatedAdmin] = useState(null)

  const load = async () => {
    const r = await api.get('/api/admin/tenants')
    setTenant((r.data.tenants||[]).find(x=>x.id===id) || null)
    const d = await api.get(`/api/admin/tenants/${id}/domains`)
    setDomains(d.data.domains || [])
  }

  useEffect(() => {
    load().catch(e => setErr(apiErrorMessage(e)))
  }, [id])

  const addDomain = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErr('')
    try {
      await api.post(`/api/admin/tenants/${id}/domains`, { domain })
      setDomain('')
      await load()
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    } finally {
      setSaving(false)
    }
  }

  const toggleDomain = async (domainId, is_active) => {
    setErr('')
    try {
      await api.put(`/api/admin/domains/${domainId}`, { is_active })
      await load()
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    }
  }

  const createAdminTenant = async () => {
    setErr('')
    try {
      const r = await api.post(`/api/admin/tenants/${id}/create-admin-tenant`, { temp_password: pwd })
      setCreatedAdmin(r.data)
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Configurar gimnasio</h1>
      <p className="text-sv-muted mt-1">Dominios permitidos y admin del gimnasio.</p>

      {err ? <div className="mt-4 text-sm text-red-300">{err}</div> : null}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sv-card p-4">
          <div className="font-semibold">Información</div>
          <div className="mt-3 text-sm">
            <div><span className="text-sv-muted">Código:</span> <span className="font-semibold">{tenant?.code || '—'}</span></div>
            <div className="mt-1"><span className="text-sv-muted">Nombre:</span> <span className="font-semibold">{tenant?.name || '—'}</span></div>
          </div>

          <div className="mt-6 font-semibold">Crear Admin del gimnasio</div>
          <div className="text-xs text-sv-muted mt-1">Genera el primer usuario admin_tenant (si no existe).</div>
          <div className="mt-2">
            <label className="text-sm text-sv-muted">Password temporal</label>
            <input className="sv-input mt-1" value={pwd} onChange={(e)=>setPwd(e.target.value)} />
          </div>
          <button className="sv-btn-primary w-full mt-3" onClick={createAdminTenant}>Crear admin_tenant</button>
          {createdAdmin ? (
            <div className="mt-3 rounded-xl border border-sv-border p-3 text-sm">
              <div className="font-semibold">Resultado</div>
              <div className="mt-1">ID: <span className="text-sv-neon font-bold">{createdAdmin.id_code}</span></div>
              <div>Password: <span className="font-semibold">{createdAdmin.temp_password}</span></div>
            </div>
          ) : null}
        </div>

        <div className="sv-card p-4">
          <div className="font-semibold">Dominios permitidos</div>
          <form className="mt-3 flex gap-2" onSubmit={addDomain}>
            <input className="sv-input" value={domain} onChange={(e)=>setDomain(e.target.value)} placeholder="svfit.vercel.app" />
            <button className="sv-btn-primary" disabled={saving}>Agregar</button>
          </form>

          <div className="mt-3 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-sv-muted">
                <tr>
                  <th className="text-left py-2">Dominio</th>
                  <th className="text-left py-2">Activo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {domains.map(d => (
                  <tr key={d.id} className="border-t border-sv-border">
                    <td className="py-2">{d.domain}</td>
                    <td className="py-2">{d.is_active ? 'Sí' : 'No'}</td>
                    <td className="py-2 text-right">
                      {d.is_active ? (
                        <button className="sv-btn-ghost text-xs" onClick={()=>toggleDomain(d.id, false)}>Desactivar</button>
                      ) : (
                        <button className="sv-btn-primary text-xs" onClick={()=>toggleDomain(d.id, true)}>Activar</button>
                      )}
                    </td>
                  </tr>
                ))}
                {domains.length === 0 ? <tr><td colSpan={3} className="py-3 text-sv-muted">Aún no hay dominios.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
