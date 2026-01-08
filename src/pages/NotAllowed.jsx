import React from "react";

export default function NotAllowed() {
  return (
    <div className="card p-6">
      <div className="h1">Acceso restringido</div>
      <div className="muted mt-2">
        No tienes permiso para ver esta sección.
      </div>
    </div>
  );
}
