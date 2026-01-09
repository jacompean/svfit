import React, { useState } from 'react'
import { api, apiErrorMessage } from '../lib/api'

export default function Cash() {
  const [opening, setOpening] = useState(0)
  const [closing, setClosing] = useState(0)
  const [cashId, setCashId] = useState('')
  const [summary, setSummary] = useState(null)
  const [msg, setMsg] = useState('')

  const open = async () => {
    setMsg('')
    try {
      const r = await api.post('/api/cash-sessions/open', { opening_cash_cents: Number(opening) })
      setCashId(r.data.cash_session.id)
      setMsg('Caja abierta')
    } catch (e) {
      setMsg(apiErrorMessage(e))
    }
  }

  const close = async () => {
    setMsg('')
    try {
      await api.post(`/api/cash-sessions/${cashId}/close`, { closing_cash_cents: Number(closing) })
      setMsg('Caja cerrada')
    } catch (e) {
      setMsg(apiErrorMessage(e))
    }
  }

  const loadSummary = async () => {
    setMsg('')
    try {
      const r = await api.get(`/api/cash-sessions/${cashId}/summary`)
      setSummary(r.data)
    } catch (e) {
      setMsg(apiErrorMessage(e))
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Caja</h1>
      <p className="text-sv-muted mt-1">Solo una caja abierta a la vez. Ventas en efectivo requieren caja abierta.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sv-card p-4">
          <div className="font-semibold">Abrir caja</div>
          <label className="text-sm text-sv-muted mt-2 block">Efectivo inicial (centavos)</label>
          <input className="sv-input mt-1" type="number" value={opening} onChange={(e)=>setOpening(e.target.value)} />
          <button className="sv-btn-primary w-full mt-3" onClick={open}>Abrir</button>
        </div>

        <div className="sv-card p-4">
          <div className="font-semibold">Cerrar / Resumen</div>
          <label className="text-sm text-sv-muted mt-2 block">Cash session ID</label>
          <input className="sv-input mt-1" value={cashId} onChange={(e)=>setCashId(e.target.value)} placeholder="uuid" />

          <label className="text-sm text-sv-muted mt-3 block">Efectivo final (centavos)</label>
          <input className="sv-input mt-1" type="number" value={closing} onChange={(e)=>setClosing(e.target.value)} />

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button className="sv-btn-ghost" onClick={loadSummary} disabled={!cashId}>Resumen</button>
            <button className="sv-btn-primary" onClick={close} disabled={!cashId}>Cerrar</button>
          </div>

          {msg ? <div className="mt-3 text-sm">{msg}</div> : null}

          {summary ? (
            <div className="mt-4 rounded-xl border border-sv-border p-3 text-sm">
              <div className="font-semibold">Ventas por método</div>
              <div className="mt-2 space-y-1">
                {(summary.sales_by_method||[]).map((x, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-sv-muted">{x.payment_method}</span>
                    <span>{(x.total_cents/100).toFixed(2)} ({x.count})</span>
                  </div>
                ))}
                {(summary.sales_by_method||[]).length===0 ? <div className="text-sv-muted">Sin ventas.</div> : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
