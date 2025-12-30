import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { getUser } from "../lib/auth";

function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs text-slate-600">{label}</div>
      {children}
    </div>
  );
}

export default function Members() {
  const user = getUser();
  const canDelete = user?.role === "admin";

  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", status: "active", join_date: "", notes: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setError("");
    try {
      const r = await api.members(q);
      setItems(r.members || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!selected) {
      setForm({ full_name: "", phone: "", email: "", status: "active", join_date: "", notes: "" });
      return;
    }
    setForm({
      full_name: selected.full_name || "",
      phone: selected.phone || "",
      email: selected.email || "",
      status: selected.status || "active",
      join_date: selected.join_date || "",
      notes: selected.notes || ""
    });
  }, [selected]);

  const selectedId = selected?.id;

  async function save() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        phone: form.phone || null,
        email: form.email || null,
        join_date: form.join_date || null,
        notes: form.notes || null
      };
      if (selectedId) {
        const r = await api.updateMember(selectedId, payload);
        setSelected(r.member);
      } else {
        const r = await api.createMember(payload);
        setSelected(r.member);
      }
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selectedId) return;
    if (!confirm("¿Eliminar miembro?")) return;
    setSaving(true);
    setError("");
    try {
      await api.deleteMember(selectedId);
      setSelected(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-semibold">Miembros</div>
        <div className="flex-1" />
        <input
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-full max-w-sm"
          placeholder="Buscar nombre / email / teléfono"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") load(); }}
        />
        <button className="btn" onClick={load}>Buscar</button>
        <button className="btn btnPrimary" onClick={() => setSelected(null)}>Nuevo</button>
      </div>

      {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
        <div className="card p-3 lg:col-span-1">
          <div className="text-xs text-slate-600 mb-2">{items.length} resultados</div>
          <div className="space-y-1 max-h-[70vh] overflow-auto">
            {items.map((m) => (
              <button
                key={m.id}
                className={`w-full text-left px-3 py-2 rounded-xl border ${selectedId === m.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-slate-50"}`}
                onClick={() => setSelected(m)}
              >
                <div className="font-medium">{m.full_name}</div>
                <div className="text-xs text-slate-600">{m.email || "—"} · {m.phone || "—"}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{selectedId ? "Editar miembro" : "Nuevo miembro"}</div>
            <div className="flex-1" />
            {selectedId && canDelete ? <button className="btn btnDanger" onClick={remove} disabled={saving}>Eliminar</button> : null}
            <button className="btn btnPrimary" onClick={save} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <Field label="Nombre">
              <input className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </Field>
            <Field label="Estatus">
              <select className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </Field>
            <Field label="Email">
              <input className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Teléfono">
              <input className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Fecha de alta">
              <input type="date" className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2" value={form.join_date} onChange={(e) => setForm({ ...form, join_date: e.target.value })} />
            </Field>
            <Field label="Notas">
              <textarea className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 min-h-[90px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
