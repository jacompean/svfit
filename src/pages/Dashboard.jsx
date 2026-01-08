import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

function StatCard({ label, value, sub }) {
  return (
    <div className="card p-5">
      <div className="kpi">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
        {sub ? <div className="text-xs text-svfit-muted">{sub}</div> : null}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.dashboard()
      .then((r) => setSummary(r.summary))
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <div className="h1">Dashboard</div>
            <div className="muted mt-1">
              Resumen rápido de operación.
            </div>
          </div>
          <div className="hidden md:block text-xs text-svfit-muted">
            Tip: usa “Asistencia” para check-in rápido.
          </div>
        </div>
      </div>

      {err ? <div className="text-red-300 text-sm">{err}</div> : null}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Miembros activos" value={summary?.active_members ?? "—"} />
        <StatCard label="Check-ins hoy" value={summary?.checkins_today ?? "—"} />
        <StatCard label="Ingresos hoy" value={summary ? `$${summary.revenue_today}` : "—"} />
        <StatCard label="Clases próximos 7 días" value={summary?.classes_next_7_days ?? "—"} />
      </div>

      <div className="card p-6">
        <div className="h2">Acciones rápidas</div>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a className="btn" href="/members">Buscar miembro</a>
          <a className="btn" href="/attendance">Registrar asistencia</a>
          <a className="btn" href="/payments">Registrar pago</a>
          <a className="btn" href="/classes">Administrar clases</a>
        </div>
      </div>
    </div>
  );
}
