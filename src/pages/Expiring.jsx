import React, { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../lib/api'

export default function Expiring() {
  const [days, setDays] = useState(7)
  const [list, setList] = useState([])
  const [err, setErr] = useState('')

  const load = async (d) => {
    const r = await api.get(`/api/memberships/expiring?days=${d}`)
    setList(r.data.expiring || [])
  }

  useEffect(() => {
    load(days).catch(e => setErr(apiErrorMessage(e)))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-black">Por vencer</h1>
      <p className="text-sv-muted mt-1">Lista de membresías activas próximas a vencer.</p>

      <div className="mt-4 flex items-end gap-2">
        <div>
          <label className="text-sm text-sv-muted">Días</label>
          <input className="sv-input mt-1 w-32" type="number" value={days} onChange={(e)=>setDays(e.target.value)} />
        </div>
        <button className="sv-btn-primary" onClick={()=>load(days).catch(e=>setErr(apiErrorMessage(e)))}>Buscar</button>
      </div>

      {err ? <div className="mt-4 text-sm text-red-300">{err}</div> : null}

      <div className="mt-6 sv-card p-4 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-sv-muted">
            <tr>
              <th className="text-left py-2">Miembro</th>
              <th className="text-left py-2">Vence</th>
            </tr>
          </thead>
          <tbody>
            {list.map(x => (
              <tr key={x.membership_id} className="border-t border-sv-border">
                <td className="py-2">{x.full_name}</td>
                <td className="py-2">{x.end_date}</td>
              </tr>
            ))}
            {list.length===0 ? <tr><td colSpan={2} className="py-3 text-sv-muted">No hay resultados.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
