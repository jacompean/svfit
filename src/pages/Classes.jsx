import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Classes() {
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("HIIT");
  const [coach_name, setCoachName] = useState("SVFIT Coach");
  const [starts_at, setStartsAt] = useState("");
  const [ends_at, setEndsAt] = useState("");
  const [capacity, setCapacity] = useState("20");

  const [enrollClassId, setEnrollClassId] = useState("");
  const [enrollMemberId, setEnrollMemberId] = useState("");

  async function load() {
    setError("");
    try {
      const r = await api.classes();
      setItems(r.classes || []);
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
    setError("");
    try {
      if (!starts_at || !ends_at) {
        setError("Define fecha/hora de inicio y fin (ISO). Ej: 2025-12-20T18:00:00-06:00");
        return;
      }
      await api.createClass({ title, coach_name, starts_at, ends_at, capacity: Number(capacity) });
      setStartsAt("");
      setEndsAt("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function enroll() {
    setError("");
    try {
      if (!enrollClassId || !enrollMemberId) return;
      await api.enroll(enrollClassId, enrollMemberId);
      setEnrollMemberId("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-2xl font-semibold">Clases</div>

      <div className="card p-4 mt-4">
        <div className="text-sm font-medium">Crear clase</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-3">
          <input className="border border-slate-200 rounded-xl px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
          <input className="border border-slate-200 rounded-xl px-3 py-2" value={coach_name} onChange={(e) => setCoachName(e.target.value)} placeholder="Coach" />
          <input className="border border-slate-200 rounded-xl px-3 py-2" value={starts_at} onChange={(e) => setStartsAt(e.target.value)} placeholder="starts_at (ISO)" />
          <input className="border border-slate-200 rounded-xl px-3 py-2" value={ends_at} onChange={(e) => setEndsAt(e.target.value)} placeholder="ends_at (ISO)" />
          <input className="border border-slate-200 rounded-xl px-3 py-2" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Capacidad" />
        </div>
        <div className="flex gap-2 mt-3">
          <button className="btn btnPrimary" onClick={create}>Crear</button>
          <button className="btn" onClick={load}>Actualizar</button>
          <div className="flex-1" />
        </div>
        <p className="text-xs text-slate-600 mt-2">
          Nota: En producción, puedes capturar ISO con tu zona horaria, ej. <code className="px-1 bg-slate-100 rounded">2025-12-20T18:00:00-06:00</code>.
        </p>
        {error ? <div className="text-sm text-red-600 mt-2">{error}</div> : null}
      </div>

      <div className="card p-4 mt-4">
        <div className="text-sm font-medium">Inscribir miembro</div>
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <select className="border border-slate-200 rounded-xl px-3 py-2" value={enrollClassId} onChange={(e) => setEnrollClassId(e.target.value)}>
            <option value="">Clase…</option>
            {items.map(c => <option key={c.id} value={c.id}>{c.title} ({new Date(c.starts_at).toLocaleString()})</option>)}
          </select>
          <select className="border border-slate-200 rounded-xl px-3 py-2" value={enrollMemberId} onChange={(e) => setEnrollMemberId(e.target.value)}>
            <option value="">Miembro…</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
          </select>
          <button className="btn btnPrimary" onClick={enroll} disabled={!enrollClassId || !enrollMemberId}>Inscribir</button>
        </div>
      </div>

      <div className="card p-4 mt-4">
        <div className="text-sm font-medium">Agenda</div>
        <div className="mt-3 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-slate-600">
              <tr>
                <th className="text-left py-2">Inicio</th>
                <th className="text-left py-2">Fin</th>
                <th className="text-left py-2">Clase</th>
                <th className="text-left py-2">Coach</th>
                <th className="text-left py-2">Cupo</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="py-2">{new Date(c.starts_at).toLocaleString()}</td>
                  <td className="py-2">{new Date(c.ends_at).toLocaleString()}</td>
                  <td className="py-2">{c.title}</td>
                  <td className="py-2">{c.coach_name || "—"}</td>
                  <td className="py-2">{c.enrolled}/{c.capacity}</td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr><td className="py-4 text-slate-600" colSpan="5">Sin clases</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
