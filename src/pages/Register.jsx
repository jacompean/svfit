import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { setSession } from "../lib/auth";

export default function Register() {
  const nav = useNavigate();
  const [full_name, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await api.register({ full_name, phone, email, password });
      setSession({ token: r.token, user: r.user });
      nav("/");
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-6">
        <div className="text-xl font-semibold">Registrar miembro</div>
        <p className="text-sm text-slate-600 mt-1">Crea una cuenta (rol member). Para administrar, usa admin/coach.</p>

        <form className="mt-5 space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="text-xs text-slate-600">Nombre</label>
            <input className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2" value={full_name} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-600">Teléfono (opcional)</label>
            <input className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-600">Email</label>
            <input className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-600">Contraseña (mínimo 8)</label>
            <input type="password" className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button disabled={loading} className={`btn btnPrimary w-full ${loading ? "opacity-70" : ""}`}>
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600">
          <Link className="underline" to="/login">Volver a login</Link>
        </div>
      </div>
    </div>
  );
}
