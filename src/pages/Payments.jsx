import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Payments() {
  const [members, setMembers] = useState([]);
  const [member_id, setMemberId] = useState("");
  const [amount_mxn, setAmount] = useState("699");
  const [method, setMethod] = useState("cash");
  const [reference, setReference] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setError("");
    try {
      const r = await api.payments();
      setItems(r.payments || []);
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

  async function create() {
    if (!member_id) return;
    setLoading(true);
    setError("");
    try {
      await api.createPayment({ member_id, amount_mxn: Number(amount_mxn), method, reference: reference || null });
      setMemberId("");
      setReference("");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-2xl font-semibold">Pagos</div>

      <div className="card p-4 mt-4">
        <div className="text-sm font-medium">Registrar pago</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
          <select className="border border-slate-200 rounded-xl px-3 py-2" value={member_id} onChange={(e) => setMemberId(e.target.value)}>
            <option value="">Miembro…</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
          </select>
          <input className="border border-slate-200 rounded-xl px-3 py-2" value={amount_mxn} onChange={(e) => setAmount(e.target.value)} placeholder="Monto MXN" />
          <select className="border border-slate-200 rounded-xl px-3 py-2" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="cash">Efectivo</option>
            <option value="transfer">Transferencia</option>
            <option value="card">Tarjeta</option>
          </select>
          <input className="border border-slate-200 rounded-xl px-3 py-2" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Referencia (opcional)" />
        </div>
        <div className="flex gap-2 mt-3">
          <button className="btn btnPrimary" onClick={create} disabled={loading || !member_id}>{loading ? "Guardando..." : "Guardar pago"}</button>
          <button className="btn" onClick={load}>Actualizar</button>
          <div className="flex-1" />
        </div>
        {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}
      </div>

      <div className="card p-4 mt-4">
        <div className="text-sm font-medium">Historial reciente</div>
        <div className="mt-3 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-slate-600">
              <tr>
                <th className="text-left py-2">Fecha</th>
                <th className="text-left py-2">Miembro</th>
                <th className="text-left py-2">Monto</th>
                <th className="text-left py-2">Método</th>
                <th className="text-left py-2">Referencia</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="py-2">{new Date(p.paid_at).toLocaleString()}</td>
                  <td className="py-2">{p.member_name}</td>
                  <td className="py-2">${Number(p.amount_mxn).toFixed(2)}</td>
                  <td className="py-2"><span className="badge">{p.method}</span></td>
                  <td className="py-2">{p.reference || "—"}</td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr><td className="py-4 text-slate-600" colSpan="5">Sin pagos</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
