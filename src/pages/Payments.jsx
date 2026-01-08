import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

export default function Payments() {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [reference, setReference] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    const m = await api.members("");
    setMembers(m.members || []);
    const p = await api.payments({});
    setPayments(p.payments || []);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const memberOptions = useMemo(() => members, [members]);

  async function addPayment() {
    setErr("");
    try {
      if (!memberId) throw new Error("Selecciona un miembro");
      if (!amount) throw new Error("Captura el monto");
      await api.createPayment({ member_id: memberId, amount_mxn: Number(amount), method, reference });
      setAmount("");
      setReference("");
      const p = await api.payments({});
      setPayments(p.payments || []);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-2xl font-semibold">Pagos</div>
      <div className="mt-1 text-sm text-svfit-muted">Registra pagos y consulta historial.</div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-lg font-semibold">Nuevo pago</div>
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-xs text-svfit-muted mb-1">Miembro</div>
              <select className="select" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                <option value="">Selecciona…</option>
                {memberOptions.map((m) => (
                  <option key={m.id} value={m.id}>{m.full_name}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-svfit-muted mb-1">Monto (MXN)</div>
              <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ej. 500" />
            </div>
            <div>
              <div className="text-xs text-svfit-muted mb-1">Método</div>
              <select className="select" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="cash">cash</option>
                <option value="transfer">transfer</option>
                <option value="card">card</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-svfit-muted mb-1">Referencia (opcional)</div>
              <input className="input" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Folio / banco" />
            </div>

            {err ? <div className="text-sm text-red-300">{err}</div> : null}

            <button className="btn btnPrimary w-full" onClick={addPayment}>Registrar</button>
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="text-lg font-semibold">Historial</div>
          <div className="mt-3 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Miembro</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Ref</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.paid_at).toLocaleString()}</td>
                    <td>{p.member_name}</td>
                    <td>${p.amount_mxn}</td>
                    <td><span className="badge">{p.method}</span></td>
                    <td className="text-svfit-muted">{p.reference || "—"}</td>
                  </tr>
                ))}
                {payments.length === 0 ? (
                  <tr><td colSpan={5} className="py-6 text-svfit-muted">Sin pagos.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
