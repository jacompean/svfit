import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Attendance() {
  const [members, setMembers] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setError("");
    try {
      const r = await api.attendance();
      setItems(r.attendance || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const m = await api.members();
        setMembers(m.members || []);
      } catch {}
      await load();
    })();
  }, []);

  async function checkin() {
    if (!memberId) return;
    setLoading(true);
    setError("");
    try {
      await api.checkin(memberId);
      setMemberId("");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-2xl font-semibold">Asistencia</div>
      <div className="card p-4 mt-4">
        <div className="text-sm font-medium">Registrar check-in</div>
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <select className="border border-slate-200 rounded-xl px-3 py-2" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
            <option value="">Selecciona miembro…</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
          </select>
          <button className="btn btnPrimary" onClick={checkin} disabled={loading || !memberId}>{loading ? "Registrando..." : "Check-in"}</button>
          <div className="flex-1" />
          <button className="btn" onClick={load}>Actualizar</button>
        </div>
        {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}
      </div>

      <div className="card p-4 mt-4">
        <div className="text-sm font-medium">Últimos check-ins</div>
        <div className="mt-3 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-slate-600">
              <tr>
                <th className="text-left py-2">Fecha</th>
                <th className="text-left py-2">Miembro</th>
                <th className="text-left py-2">Método</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="border-t border-slate-100">
                  <td className="py-2">{new Date(i.checkin_at).toLocaleString()}</td>
                  <td className="py-2">{i.member_name}</td>
                  <td className="py-2"><span className="badge">{i.method}</span></td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr><td className="py-4 text-slate-600" colSpan="3">Sin registros</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
