import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [members, setMembers] = useState([]);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({ title: "", coach_name: "", starts_at: "", ends_at: "", capacity: 20 });
  const [enroll, setEnroll] = useState({ class_id: "", member_id: "" });

  async function load() {
    const c = await api.classes();
    setClasses(c.classes || []);
    const m = await api.members("");
    setMembers(m.members || []);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const memberOptions = useMemo(() => members, [members]);

  async function create() {
    setErr("");
    try {
      if (!form.title || !form.starts_at || !form.ends_at) throw new Error("Título y fechas requeridas");
      await api.createClass(form);
      setForm({ title: "", coach_name: "", starts_at: "", ends_at: "", capacity: 20 });
      const c = await api.classes();
      setClasses(c.classes || []);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function doEnroll() {
    setErr("");
    try {
      if (!enroll.class_id || !enroll.member_id) throw new Error("Selecciona clase y miembro");
      await api.enroll(enroll.class_id, enroll.member_id);
      const c = await api.classes();
      setClasses(c.classes || []);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-2xl font-semibold">Clases</div>
      <div className="mt-1 text-sm text-svfit-muted">Crea clases e inscribe miembros.</div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-lg font-semibold">Nueva clase</div>
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-xs text-svfit-muted mb-1">Título</div>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <div className="text-xs text-svfit-muted mb-1">Coach (opcional)</div>
              <input className="input" value={form.coach_name} onChange={(e) => setForm({ ...form, coach_name: e.target.value })} />
            </div>
            <div>
              <div className="text-xs text-svfit-muted mb-1">Inicio</div>
              <input className="input" type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
            </div>
            <div>
              <div className="text-xs text-svfit-muted mb-1">Fin</div>
              <input className="input" type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} />
            </div>
            <div>
              <div className="text-xs text-svfit-muted mb-1">Cupo</div>
              <input className="input" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
            </div>

            {err ? <div className="text-sm text-red-300">{err}</div> : null}

            <button className="btn btnPrimary w-full" onClick={create}>Crear</button>
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1">
              <div className="text-lg font-semibold">Próximas clases</div>
              <div className="text-sm text-svfit-muted">Incluye inscritos.</div>
            </div>
            <div className="flex gap-2">
              <select className="select w-[220px]" value={enroll.class_id} onChange={(e) => setEnroll({ ...enroll, class_id: e.target.value })}>
                <option value="">Clase…</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <select className="select w-[220px]" value={enroll.member_id} onChange={(e) => setEnroll({ ...enroll, member_id: e.target.value })}>
                <option value="">Miembro…</option>
                {memberOptions.map((m) => (
                  <option key={m.id} value={m.id}>{m.full_name}</option>
                ))}
              </select>
              <button className="btn btnPrimary" onClick={doEnroll}>Inscribir</button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Coach</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Inscritos</th>
                  <th>Cupo</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium">{c.title}</td>
                    <td className="text-svfit-muted">{c.coach_name || "—"}</td>
                    <td>{new Date(c.starts_at).toLocaleString()}</td>
                    <td>{new Date(c.ends_at).toLocaleString()}</td>
                    <td><span className="badge">{c.enrolled}</span></td>
                    <td>{c.capacity}</td>
                  </tr>
                ))}
                {classes.length === 0 ? (
                  <tr><td colSpan={6} className="py-6 text-svfit-muted">Sin clases.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
