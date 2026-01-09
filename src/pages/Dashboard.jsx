import React, { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { apiErrorMessage, getTenant, api } from '../lib/api'
import { getSession } from '../lib/auth'

export default function Dashboard() {
  const { user } = getSession()
  const role = user?.role

  const [tenant, setTenant] = useState(null)
  const [expiring, setExpiring] = useState([])
  const [memberSummary, setMemberSummary] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const t = await getTenant()
        setTenant(t)
        if (role === 'member') {
          const r = await api.get('/api/member/summary')
          setMemberSummary(r.data)
        } else if (role && role !== 'admin') {
          const r = await api.get('/api/memberships/expiring?days=7')
          setExpiring(r.data.expiring || [])
        }
      } catch (e) {
        setErr(apiErrorMessage(e))
      }
    })()
  }, [role])

  if (!role) return null

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <div className="text-sv-muted text-sm">{tenant?.name || ''}</div>
        </div>
        <span className="sv-badge">{role === 'admin' ? 'Admin global' : role}</span>
      </div>

      {err ? <div className="mt-4 text-sm text-red-300">{err}</div> : null}

      {role === 'member' ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Tu ID" value={memberSummary?.member?.id_code || user?.id_code || '—'} />
          <StatCard label="Membresía" value={memberSummary?.membership?.plan_name || 'Sin membresía'} hint={memberSummary?.membership ? `Vence: ${memberSummary.membership.end_date}` : ''} />
          <StatCard label="Asistencias (30 días)" value={memberSummary?.attendance_last_30_days ?? '—'} />
        </div>
      ) : role === 'admin' ? (
        <div className="mt-6 sv-card p-4">
          <div className="font-semibold">Panel de Admin Global</div>
          <div className="text-sm text-sv-muted mt-1">Administra gimnasios (tenants), dominios permitidos y branding.</div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Por vencer (7 días)" value={expiring.length} hint="Revisa la lista para renovar" />
            <StatCard label="Inventario" value="Disponible" hint="Admin/Staff/Coach" />
            <StatCard label="Ventas" value="Disponible" hint="Con caja abierta para efectivo" />
          </div>

          <div className="mt-6 sv-card p-4">
            <div className="font-semibold">Próximos vencimientos</div>
            <div className="text-sm text-sv-muted">Los más próximos a vencer</div>
            <div className="mt-3 overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-sv-muted">
                  <tr>
                    <th className="text-left py-2">Miembro</th>
                    <th className="text-left py-2">Vence</th>
                  </tr>
                </thead>
                <tbody>
                  {(expiring || []).slice(0, 8).map((x) => (
                    <tr key={x.membership_id} className="border-t border-sv-border">
                      <td className="py-2">{x.full_name}</td>
                      <td className="py-2">{x.end_date}</td>
                    </tr>
                  ))}
                  {(!expiring || expiring.length === 0) ? (
                    <tr><td className="py-3 text-sv-muted" colSpan={2}>Sin vencimientos cercanos.</td></tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
