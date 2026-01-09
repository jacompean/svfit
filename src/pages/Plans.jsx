import React, { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../lib/api'

export default function Plans() {
  const [plans, setPlans] = useState([])
  const [err, setErr] = useState('')
  const [form, setForm] = useState({ name: '', price_cents: 0, duration_days: 30, includes_personalized: false, sessions_included: 0, teens_allowed_start: '', teens_allowed_end: '', teens_warning_message: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const r = await api.get('/api/plans')
    setPlans(r.data.plans || [])
  }

  useEffect(() => {
    load().catch(e => setErr(apiErrorMessage(e)))
  }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await api.post('/api/plans', {
        ...form,
        price_cents: Number(form.price_cents),
        duration_days: Number(form.duration_days),
        sessions_included: form.includes_personalized ? Number(form.sessions_included || 0) : null,
        teens_allowed_start: form.teens_allowed_start || null,
        teens_allowed_end: form.teens_allowed_end || null,
        teens_warning_message: form.teens_warning_message || null,
      })
      setForm({ name: '', price_cents: 0, duration_days: 30, includes_personalized: false, sessions_included: 0, teens_allowed_start: '', teens_allowed_end: '', teens_warning_message: '' })
      await load()
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Planes</h1>
      <p className="text-sv-muted mt-1">Administra tipos de membresía (incluye teens soft rule).</p>
      {err ? <div className="mt-4 text-sm text-red-300">{err}</div> : null}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sv-card p-4">
          <div className="font-semibold">Crear plan</div>
          <form className="mt-3 space-y-3" onSubmit={onCreate}>
            <div>
              <label className="text-sm text-sv-muted">Nombre</label>
              <input className="sv-input mt-1" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Membresía Estándar" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-sv-muted">Precio (centavos)</label>
                <input className="sv-input mt-1" type="number" value={form.price_cents} onChange={(e)=>setForm({...form, price_cents:e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-sv-muted">Duración (días)</label>
                <input className="sv-input mt-1" type="number" value={form.duration_days} onChange={(e)=>setForm({...form, duration_days:e.target.value})} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.includes_personalized} onChange={(e)=>setForm({...form, includes_personalized:e.target.checked})} />
              Incluye personalizado
            </label>
            {form.includes_personalized ? (
              <div>
                <label className="text-sm text-sv-muted">Sesiones incluidas</label>
                <input className="sv-input mt-1" type="number" value={form.sessions_included} onChange={(e)=>setForm({...form, sessions_included:e.target.value})} />
              </div>
            ) : null}
            <div className="sv-card p-3 border border-sv-border">
              <div className="font-semibold text-sm">Teens (soft warning)</div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="text-sm text-sv-muted">Inicio (HH:MM)</label>
                  <input className="sv-input mt-1" value={form.teens_allowed_start} onChange={(e)=>setForm({...form, teens_allowed_start:e.target.value})} placeholder="15:00" />
                </div>
                <div>
                  <label className="text-sm text-sv-muted">Fin (HH:MM)</label>
                  <input className="sv-input mt-1" value={form.teens_allowed_end} onChange={(e)=>setForm({...form, teens_allowed_end:e.target.value})} placeholder="18:00" />
                </div>
              </div>
              <div className="mt-2">
                <label className="text-sm text-sv-muted">Mensaje</label>
                <input className="sv-input mt-1" value={form.teens_warning_message} onChange={(e)=>setForm({...form, teens_warning_message:e.target.value})} placeholder="Teens: fuera de horario recomendado" />
              </div>
            </div>

            <button className="sv-btn-primary w-full" disabled={loading}>{loading ? 'Guardando…' : 'Crear plan'}</button>
          </form>
        </div>

        <div className="sv-card p-4">
          <div className="font-semibold">Lista</div>
          <div className="mt-3 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-sv-muted">
                <tr>
                  <th className="text-left py-2">Nombre</th>
                  <th className="text-left py-2">Duración</th>
                  <th className="text-left py-2">Precio</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(p => (
                  <tr key={p.id} className="border-t border-sv-border">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2">{p.duration_days} días</td>
                    <td className="py-2">{(p.price_cents/100).toFixed(2)}</td>
                  </tr>
                ))}
                {plans.length===0 ? <tr><td colSpan={3} className="py-3 text-sv-muted">Sin planes.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
