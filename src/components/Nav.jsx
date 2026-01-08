import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearSession, getUser } from "../lib/auth";

function Item({ to, children, end = false }) {
  return (
    <NavLink
      end={end}
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition border ${
          isActive
            ? "bg-svfit-panel border-svfit-neon/30 text-svfit-text shadow-neon"
            : "bg-transparent border-transparent text-svfit-muted hover:bg-svfit-panel2 hover:border-svfit-border"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function DisabledItem({ children }) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border border-svfit-border bg-svfit-panel2/50 text-svfit-muted opacity-60">
      {children}
      <span className="ml-auto text-xs">Próximamente</span>
    </div>
  );
}

export default function Nav() {
  const nav = useNavigate();
  const user = getUser();
  const role = user?.role || "";
  const [open, setOpen] = useState(false);

  const menu = useMemo(() => {
    if (role === "member") {
      return [{ to: "/member", label: "Mi panel", end: true }];
    }
    // Current backend supports admin/coach only.
    return [
      { to: "/", label: "Dashboard", end: true },
      { to: "/members", label: "Miembros" },
      { to: "/attendance", label: "Asistencia" },
      { to: "/payments", label: "Pagos" },
      { to: "/classes", label: "Clases" }
    ];
  }, [role]);

  const canSeeBackoffice = role !== "member";

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden sticky top-0 z-20 border-b border-svfit-border bg-svfit-bg/90 backdrop-blur">
        <div className="px-4 py-3 flex items-center gap-3">
          <button className="btn" onClick={() => setOpen(true)} aria-label="Menú">
            ☰
          </button>
          <img src="/svfit-logo.jpeg" className="h-9 w-9 rounded-xl border border-svfit-border" alt="SVFIT" />
          <div className="min-w-0">
            <div className="font-extrabold tracking-tight">SVFIT</div>
            <div className="text-xs text-svfit-muted truncate">{user?.email}</div>
          </div>
          <div className="flex-1" />
          <span className="badge">{role || "—"}</span>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-30 md:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/70 transition ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-80 bg-svfit-bg border-r border-svfit-border p-4 transition-transform ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent
            menu={menu}
            user={user}
            role={role}
            canSeeBackoffice={canSeeBackoffice}
            onLogout={() => {
              clearSession();
              nav("/login");
            }}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-72 shrink-0 border-r border-svfit-border bg-svfit-bg/60 backdrop-blur">
        <div className="w-full p-5">
          <SidebarContent
            menu={menu}
            user={user}
            role={role}
            canSeeBackoffice={canSeeBackoffice}
            onLogout={() => {
              clearSession();
              nav("/login");
            }}
          />
        </div>
      </aside>
    </>
  );
}

function SidebarContent({ menu, user, role, canSeeBackoffice, onLogout, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <img src="/svfit-logo.jpeg" className="h-11 w-11 rounded-2xl border border-svfit-border" alt="SVFIT" />
        <div className="min-w-0">
          <div className="text-lg font-extrabold tracking-tight">SVFIT</div>
          <div className="text-xs text-svfit-muted">Portal de gimnasio</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-svfit-border bg-svfit-panel p-3">
        <div className="text-xs text-svfit-muted">Sesión</div>
        <div className="text-sm font-semibold truncate">{user?.email || "—"}</div>
        <div className="mt-1 inline-flex items-center gap-2">
          <span className="badge">{role || "—"}</span>
        </div>
      </div>

      <nav className="mt-5 flex flex-col gap-2">
        {menu.map((m) => (
          <div key={m.to} onClick={onNavigate}>
            <Item to={m.to} end={!!m.end}>
              {m.label}
            </Item>
          </div>
        ))}

        {/* Placeholders (requested features) */}
        {canSeeBackoffice ? (
          <>
            <div className="mt-2" />
            <DisabledItem>Ventas</DisabledItem>
            <DisabledItem>Inventario</DisabledItem>
            <DisabledItem>Usuarios</DisabledItem>
            <DisabledItem>Corte de caja</DisabledItem>
          </>
        ) : null}
      </nav>

      <div className="flex-1" />

      <button className="btn w-full" onClick={onLogout}>
        Salir
      </button>

      <div className="mt-3 text-xs text-svfit-muted">
        Operación real • SVFIT
      </div>
    </div>
  );
}
