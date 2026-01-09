import React, { useState } from 'react'
import { api, apiErrorMessage } from '../lib/api'

export default function Checkin() {
  const [memberId, setMemberId] = useState('')
  const [msg, setMsg] = useState('')

  const onCheckin = async () => {
    setMsg('')
    try {
      const r = await api.post(`/api/members/${memberId}/checkin`, {})
      const a = r.data.attendance
      if (a.warned) setMsg(`Advertencia: ${a.warning_message}`)
      else setMsg('Check-in OK')
    } catch (e) {
      setMsg(apiErrorMessage(e))
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Asistencia</h1>
      <p className="text-sv-muted mt-1">Registra check-in (por ahora usando UUID del miembro).</p>

      <div className="mt-6 sv-card p-4 max-w-xl">
        <label className="text-sm text-sv-muted">Member UUID</label>
        <input className="sv-input mt-1" value={memberId} onChange={(e)=>setMemberId(e.target.value)} placeholder="uuid" />
        <button className="sv-btn-primary w-full mt-3" onClick={onCheckin} disabled={!memberId}>Registrar</button>
        {msg ? <div className="mt-3 text-sm">{msg}</div> : null}
      </div>
    </div>
  )
}
