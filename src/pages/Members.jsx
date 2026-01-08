import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs text-svfit-muted mb-1">{label}</div>
      {children}
    </div>
  );
}

export default function Members() {
  const [q, setQ] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [edit, setEdit] = useState(null);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const r = await api.members(q);
      setList(r.members || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => list, [list]);

  function openNew() {
    setEdit({ full_name: "", phone: "", email: "", status: "active", join_date: "", notes: "" });
    setModalOpen(true);
  }

  function openEdit(m) {
    setEdit({ ...m, join_date: m.join_date ? String(m.join_date).slice(0, 10) : "" });
    setModalOpen(true);
  }

  async function save() {
    setErr("");
    try {
      if (edit.id) {
        await api.updateMember(edit.id, edit);
      } else {
        await api.createMember(edit);
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function remove(m) {
    if (!confirm(`¿Eliminar a ${m.full_name}?`)) return;
    try {
      await api.deleteMember(m.id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[260px]">
          <div className="text-2xl font-semibold">Miembros</div>
          <div className="mt-1 text-sm text-svfit-muted">Altas, edición y estatus.</div>
        </div>
        <div className="flex gap-2">
          <input className="input w-[260px]" placeholder="Buscar por nombre, correo o teléfono…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn" onClick={load} disabled={loading}>
            {loading ? "Buscando…" : "Buscar"}
          </button>
          <button className="btn btnPrimary" onClick={openNew}>Nuevo</button>
        </div>
      </div>

      {err ? <div className="mt-4 text-red-300 text-sm">{err}</div> : null}

      <div className="mt-6 card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="pl-4">Nombre</th>
                <th>Contacto</th>
                <th>Estatus</th>
                <th>Ingreso</th>
                <th className="pr-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td className="pl-4">
                    <div className="font-medium">{m.full_name}</div>
                    <div className="text-xs text-svfit-muted">{m.email || "—"}</div>
                  </td>
                  <td>
                    <div className="text-sm">{m.phone || "—"}</div>
                  </td>
                  <td>
                    <span className="badge">{m.status}</span>
                  </td>
                  <td>
                    <div className="text-sm">{m.join_date ? String(m.join_date).slice(0, 10) : "—"}</div>
                  </td>
                  <td className="pr-4">
                    <div className="flex gap-2">
                      <button className="btn" onClick={() => openEdit(m)}>Editar</button>
                      <button className="btn btnDanger" onClick={() => remove(m)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="pl-4 py-6 text-svfit-muted">
                    Sin resultados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-xl p-5">
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold">{edit?.id ? "Editar miembro" : "Nuevo miembro"}</div>
              <div className="flex-1" />
              <button className="btn" onClick={() => setModalOpen(false)}>Cerrar</button>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <Field label="Nombre">
                <input className="input" value={edit.full_name} onChange={(e) => setEdit({ ...edit, full_name: e.target.value })} />
              </Field>
              <Field label="Estatus">
                <select className="select" value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </Field>
              <Field label="Teléfono">
                <input className="input" value={edit.phone || ""} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} />
              </Field>
              <Field label="Correo">
                <input className="input" value={edit.email || ""} onChange={(e) => setEdit({ ...edit, email: e.target.value })} />
              </Field>
              <Field label="Fecha de ingreso">
                <input className="input" type="date" value={edit.join_date || ""} onChange={(e) => setEdit({ ...edit, join_date: e.target.value })} />
              </Field>
              <Field label="Notas">
                <textarea className="textarea" rows={3} value={edit.notes || ""} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} />
              </Field>
            </div>

            {err ? <div className="mt-3 text-red-300 text-sm">{err}</div> : null}

            <div className="mt-4 flex justify-end gap-2">
              <button className="btn" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="btn btnPrimary" onClick={save}>Guardar</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
