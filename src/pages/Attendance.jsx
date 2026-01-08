import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

export default function Attendance() {
  const [members, setMembers] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [method, setMethod] = useState("manual");
  const [log, setLog] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.members("").then((r) => setMembers(r.members || [])).catch(() => {});
    api.attendance({ from: new Date().toISOString().slice(0, 10) }).then((r) => setLog(r.attendance || [])).catch(() => {});
  }, []);

  const options = useMemo(() => members, [members]);

  async function checkin() {
    setErr("");
    try {
      if (!memberId) throw new Error("Selecciona un miembro");
      await api.checkin(memberId, method);
      const r = await api.attendance({ from: new Date().toISOString().slice(0, 10) });
      setLog(r.attendance || []);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-2xl font-semibold">Asistencia</div>
      <div className="mt-1 text-sm text-svfit-muted">Check-in rápido.</div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="card p-5 md:col-span-1">
          <div className="text-lg font-semibold">Registrar</div>
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-xs text-svfit-muted mb-1">Miembro</div>
              <select className="select" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                <option value="">Selecciona…</option>
                {options.map((m) => (
                  <option key={m.id} value={m.id}>{m.full_name}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-svfit-muted mb-1">Método</div>
              <select className="select" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="manual">manual</option>
                <option value="qr">qr</option>
              </select>
            </div>

            {err ? <div className="text-sm text-red-300">{err}</div> : null}

            <button className="btn btnPrimary w-full" onClick={checkin}>Registrar</button>
          </div>
        </div>

        <div className="card p-5 md:col-span-2">
          <div className="text-lg font-semibold">Hoy</div>
          <div className="mt-3 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Miembro</th>
                  <th>Método</th>
                </tr>
              </thead>
              <tbody>
                {log.map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.checkin_at).toLocaleString()}</td>
                    <td>{a.member_name}</td>
                    <td><span className="badge">{a.method}</span></td>
                  </tr>
                ))}
                {log.length === 0 ? (
                  <tr><td colSpan={3} className="py-6 text-svfit-muted">Sin registros.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
