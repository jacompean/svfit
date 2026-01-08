import React from "react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <img src="/svfit-logo.jpeg" className="h-12 w-12 rounded-2xl border border-svfit-border" alt="SVFIT" />
            <div>
              <div className="text-xl font-extrabold tracking-tight">Registro deshabilitado</div>
              <div className="text-sm text-svfit-muted">Las cuentas las crea recepción/administración.</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="muted">
              Para que tu gimnasio opere con control, el alta de miembros y usuarios se realiza desde administración.
              Si necesitas acceso, solicita que te creen una cuenta.
            </div>
            <Link to="/login" className="btn btnPrimary w-full text-center">
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
