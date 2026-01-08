import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../lib/auth";

export default function RoleRoute({ allow = [], children }) {
  const user = getUser();
  const role = user?.role;

  if (!role) return <Navigate to="/login" replace />;
  if (allow.length === 0) return children;
  if (allow.includes(role)) return children;

  // Member gets redirected to their panel
  if (role === "member") return <Navigate to="/member" replace />;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card p-6">
        <div className="text-lg font-semibold">Acceso restringido</div>
        <p className="mt-2 text-svfit-muted">Tu perfil no tiene permiso para ver esta sección.</p>
      </div>
    </div>
  );
}
