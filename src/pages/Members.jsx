import React, { useEffect, useMemo, useState } from 'react'
import { api, apiErrorMessage } from '../lib/api'

function Recent({ items, onPick }) {
  return (
    <div className="mt-3 space-y-2">
      {items.length === 0 ? <div className="text-sm text-sv-muted">Sin recientes.</div> : null}
      {items.map((m) => (
        <button key={m.id} className="w-full text-left sv-card p-3 hover:bg-white/5" onClick={()=>onPick(m)}>
          <div className="font-semibold">{m.full_name}</div>
          <div className="text-xs text-sv-muted">{m.id}</div>
        </button>
      ))}
    </div>
  )
}

export default function Members() {
  const [err, setErr] = useState('')
  const [plans, setPlans] = useState([])

  const [createForm, setCreateForm] = useState({ full_name:'', phone:'', email:'', notes:'' })
  const [createLoading, setCreateLoading] = useState(false)
  const [created, setCreated] = useState(null)

  const [selected, setSelected] = useState(null)

  const [activatePwd, setActivatePwd] = useState('Member123!')
  const [planId, setPlanId] = useState('')

  const recent = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('svfit_recent_members') || '[]') } catch { return [] }
  }, [created])

  const saveRecent = (member) => {
    const cur = (() => { try { return JSON.parse(localStorage.getItem('svfit_recent_members')||'[]') } catch { return [] } })()
    const next = [member, ...cur.filter(x=>x.id!==member.id)].slice(0, 10)
    localStorage.setItem('svfit_recent_members', JSON.stringify(next))
  }

  useEffect(() => {
    api.get('/api/plans').then(r=>setPlans(r.data.plans||[])).catch(()=>{})
  }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    setErr('')
    setCreateLoading(true)
    try {
      const r = await api.post('/api/members', createForm)
      setCreated(r.data.member)
      setSelected(r.data.member)
      saveRecent(r.data.member)
      setCreateForm({ full_name:'', phone:'', email:'', notes:'' })
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    } finally {
      setCreateLoading(false)
    }
  }

  const onActivate = async () => {
    if (!selected) return
    setErr('')
    try {
      const r = await api.post(`/api/members/${selected.id}/activate`, { password: activatePwd })
      alert(`Acceso activado. ID de login: ${r.data.id_code}`)
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    }
  }

  const onAssignMembership = async () => {
    if (!selected) return
    if (!planId) return setErr('Selecciona un plan')
    setErr('')
    try {
      await api.post(`/api/members/${selected.id}/membership`, { plan_id: planId })
      alert('Membresía asignada')
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    }
  }

  const onCheckin = async () => {
    if (!selected) return
    setErr('')
    try {
      const r = await api.post(`/api/members/${selected.id}/checkin`, {})
      const warned = r.data.attendance?.warned
      const msg = r.data.attendance?.warning_message
      alert(warned ? `Check-in con advertencia: ${msg}` : 'Check-in OK')
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Miembros</h1>
      <p className="text-sv-muted mt-1">En V2 puedes preregistrar, activar acceso, asignar membresía y hacer check-in. (Lista completa con búsqueda por nombre llega en la siguiente mejora de backend).</p>
      {err ? <div className="mt-4 text-sm text-red-300">{err}</div> : null}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sv-card p-4">
          <div className="font-semibold">Preregistro</div>
          <form className="mt-3 space-y-3" onSubmit={onCreate}>
            <div>
              <label className="text-sm text-sv-muted">Nombre completo</label>
              <input className="sv-input mt-1" value={createForm.full_name} onChange={(e)=>setCreateForm({...createForm, full_name:e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-sv-muted">Teléfono</label>
                <input className="sv-input mt-1" value={createForm.phone} onChange={(e)=>setCreateForm({...createForm, phone:e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-sv-muted">Email</label>
                <input className="sv-input mt-1" value={createForm.email} onChange={(e)=>setCreateForm({...createForm, email:e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-sm text-sv-muted">Notas</label>
              <input className="sv-input mt-1" value={createForm.notes} onChange={(e)=>setCreateForm({...createForm, notes:e.target.value})} />
            </div>
            <button className="sv-btn-primary w-full" disabled={createLoading}>{createLoading ? 'Guardando…' : 'Crear miembro (sin acceso)'}</button>
          </form>

          {created ? (
            <div className="mt-4 rounded-xl border border-sv-border p-3 text-sm">
              <div className="font-semibold">Creado</div>
              <div className="mt-1">Nombre: <span className="font-semibold">{created.full_name}</span></div>
              <div className="mt-1">UUID: <span className="text-sv-neon font-mono">{created.id}</span></div>
              <div className="text-xs text-sv-muted mt-2">Por ahora usamos el UUID para operar; pronto agregaremos búsqueda por nombre y listado completo.</div>
            </div>
          ) : null}

          <div className="mt-6">
            <div className="font-semibold">Recientes</div>
            <Recent items={recent} onPick={(m)=>setSelected(m)} />
          </div>
        </div>

        <div className="sv-card p-4">
          <div className="font-semibold">Operaciones</div>
          <div className="text-xs text-sv-muted mt-1">Selecciona un miembro (recientes) o crea uno.</div>

          {selected ? (
            <div className="mt-3 rounded-xl border border-sv-border p-3 text-sm">
              <div className="font-semibold">Seleccionado</div>
              <div className="mt-1">{selected.full_name}</div>
              <div className="text-xs text-sv-muted font-mono">{selected.id}</div>
            </div>
          ) : (
            <div className="mt-3 text-sm text-sv-muted">No hay miembro seleccionado.</div>
          )}

          <div className="mt-5">
            <div className="font-semibold text-sm">Activar acceso</div>
            <div className="text-xs text-sv-muted">Crea el usuario member (ID tipo SV0001) para que pueda iniciar sesión.</div>
            <label className="text-sm text-sv-muted mt-2 block">Password inicial</label>
            <input className="sv-input mt-1" value={activatePwd} onChange={(e)=>setActivatePwd(e.target.value)} />
            <button className="sv-btn-primary w-full mt-2" onClick={onActivate} disabled={!selected}>Activar acceso</button>
          </div>

          <div className="mt-6">
            <div className="font-semibold text-sm">Asignar membresía</div>
            <label className="text-sm text-sv-muted mt-2 block">Plan</label>
            <select className="sv-input mt-1" value={planId} onChange={(e)=>setPlanId(e.target.value)}>
              <option value="">Selecciona…</option>
              {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button className="sv-btn-primary w-full mt-2" onClick={onAssignMembership} disabled={!selected}>Asignar</button>
          </div>

          <div className="mt-6">
            <div className="font-semibold text-sm">Check-in</div>
            <button className="sv-btn-primary w-full mt-2" onClick={onCheckin} disabled={!selected}>Registrar asistencia</button>
          </div>
        </div>
      </div>
    </div>
  )
}
