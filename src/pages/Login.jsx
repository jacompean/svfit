import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setSession } from "../lib/auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const r = await api.login(email, password);
      setSession({ token: r.token, user: r.user });
      if (r.user?.role === "member") nav("/member");
      else nav("/");
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <img src="/svfit-logo.jpeg" className="h-12 w-12 rounded-2xl border border-svfit-border" alt="SVFIT" />
            <div>
              <div className="text-xl font-semibold">SVFIT</div>
              <div className="text-sm text-svfit-muted">Acceso al portal</div>
            </div>
          </div>

          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <div>
              <label className="block text-xs text-svfit-muted mb-1">Correo</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@svfit.mx" />
            </div>
            <div>
              <label className="block text-xs text-svfit-muted mb-1">Contraseña</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {err ? <div className="text-sm text-red-300">{err}</div> : null}

            <button className={`btn btnPrimary w-full ${loading ? "opacity-70" : ""}`} disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </button>

            <div className="text-xs text-svfit-muted">
              Si necesitas una cuenta, solicítala a recepción.
            </div>
          </form>
        </div>

        <div className="mt-3 text-center text-xs text-svfit-muted">
          Hecho para operación real de gimnasio • SVFIT
        </div>
      </div>
    </div>
  );
}
