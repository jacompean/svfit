import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function MemberPortal() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await api.me();
        if (alive) setMe(r.user);
      } catch (e) {
        if (alive) setErr(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <img src="/svfit-logo.jpeg" className="h-12 w-12 rounded-2xl border border-svfit-border" alt="SVFIT" />
          <div>
            <div className="h1">Mi panel</div>
            <div className="muted">Acceso para miembros</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="h2">Tu cuenta</div>
        {loading ? <div className="muted mt-2">Cargando…</div> : null}
        {err ? <div className="text-red-300 mt-2">{err}</div> : null}
        {me ? (
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-svfit-muted">Nombre</div>
              <div className="font-semibold">{me.full_name || "—"}</div>
            </div>
            <div>
              <div className="text-xs text-svfit-muted">Correo</div>
              <div className="font-semibold">{me.email}</div>
            </div>
            <div>
              <div className="text-xs text-svfit-muted">Rol</div>
              <div className="font-semibold">{me.role}</div>
            </div>
            <div>
              <div className="text-xs text-svfit-muted">Creado</div>
              <div className="font-semibold">{me.created_at ? new Date(me.created_at).toLocaleString() : "—"}</div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="card p-6">
        <div className="h2">Membresía, pagos y asistencia</div>
        <div className="muted mt-2">
          Esta versión del backend aún no expone endpoints de autoservicio para miembros (membresía/pagos/asistencia).
          Tu recepción/administración puede consultarlo desde el panel de operación.
        </div>
      </div>
    </div>
  );
}
