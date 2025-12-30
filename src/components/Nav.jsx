import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearSession, getUser } from "../lib/auth";

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl text-sm ${isActive ? "bg-slate-900 text-white" : "hover:bg-slate-100"}`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Nav() {
  const nav = useNavigate();
  const user = getUser();
  return (
    <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="font-semibold">SVFIT</div>
        <div className="text-xs text-slate-500">Portal</div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-2">
          <Item to="/">Dashboard</Item>
          <Item to="/members">Miembros</Item>
          <Item to="/attendance">Asistencia</Item>
          <Item to="/payments">Pagos</Item>
          <Item to="/classes">Clases</Item>
        </div>
        <div className="flex-1 md:hidden" />
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-slate-600">{user?.email}</span>
          <span className="badge">{user?.role || "—"}</span>
          <button
            className="btn"
            onClick={() => {
              clearSession();
              nav("/login");
            }}
          >
            Salir
          </button>
        </div>
      </div>
      <div className="md:hidden max-w-6xl mx-auto px-4 pb-3 flex flex-wrap gap-2">
        <Item to="/">Dashboard</Item>
        <Item to="/members">Miembros</Item>
        <Item to="/attendance">Asistencia</Item>
        <Item to="/payments">Pagos</Item>
        <Item to="/classes">Clases</Item>
      </div>
    </div>
  );
}
