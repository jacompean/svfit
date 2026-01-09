import React, { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../lib/api'

export default function MemberPortal() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    api.get('/api/member/summary')
      .then(r=>setData(r.data))
      .catch(e=>setErr(apiErrorMessage(e)))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-black">Mi Panel</h1>
      <p className="text-sv-muted mt-1">Resumen de tu membresía y asistencias.</p>
      {err ? <div className="mt-4 text-sm text-red-300">{err}</div> : null}

      {data ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="sv-card p-4">
            <div className="text-sv-muted text-sm">ID</div>
            <div className="text-2xl font-black mt-1">{data.member?.id_code}</div>
          </div>
          <div className="sv-card p-4">
            <div className="text-sv-muted text-sm">Membresía</div>
            <div className="text-xl font-black mt-1">{data.membership?.plan_name || 'Sin membresía'}</div>
            {data.membership ? <div className="text-xs text-sv-muted mt-1">Vence: {data.membership.end_date}</div> : null}
          </div>
          <div className="sv-card p-4">
            <div className="text-sv-muted text-sm">Asistencias (30 días)</div>
            <div className="text-2xl font-black mt-1">{data.attendance_last_30_days}</div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 sv-card p-4">
        <div className="font-semibold">Próximamente</div>
        <div className="text-sm text-sv-muted mt-1">Rutina asignada y progreso (peso/medidas) se activan en la siguiente iteración.</div>
      </div>
    </div>
  )
}
