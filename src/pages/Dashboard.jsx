import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { getUser } from "../lib/auth";

function Stat({ label, value }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const user = getUser();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await api.dashboard();
        if (alive) setSummary(r.summary);
      } catch (e) {
        if (alive) setError(e.message);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-semibold">Dashboard</div>
        <div className="text-sm text-slate-600">Hola, {user?.name || user?.email}</div>
      </div>

      {user?.role === "member" ? (
        <div className="card p-4 mt-4">
          <div className="font-medium">Acceso limitado</div>
          <p className="text-sm text-slate-600 mt-1">
            Este portal está pensado para administración (admin/coach). Si quieres, lo extendemos para que el miembro vea su historial.
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="card p-4 mt-4 border-red-200">
          <div className="text-sm text-red-600">{error}</div>
          <p className="text-xs text-slate-600 mt-2">
            Tip: verifica que <code className="px-1 bg-slate-100 rounded">VITE_API_BASE_URL</code> apunte a tu backend y que el backend permita tu origin en <code className="px-1 bg-slate-100 rounded">FRONTEND_ORIGINS</code>.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <Stat label="Miembros activos" value={summary?.active_members ?? "—"} />
        <Stat label="Check-ins hoy" value={summary?.checkins_today ?? "—"} />
        <Stat label="Ingresos hoy (MXN)" value={summary?.revenue_today ?? "—"} />
        <Stat label="Clases próximos 7 días" value={summary?.classes_next_7_days ?? "—"} />
      </div>
    </div>
  );
}
