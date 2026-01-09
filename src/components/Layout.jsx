import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearSession, getSession } from '../lib/auth'
import { apiErrorMessage, getTenant } from '../lib/api'

function Item({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded-xl px-3 py-2 text-sm border ${
          isActive ? 'border-sv-neon bg-white/5' : 'border-transparent hover:bg-white/5'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

export default function Layout() {
  const nav = useNavigate()
  const { user } = getSession()
  const role = user?.role

  const [tenant, setTenant] = useState(null)
  const [tenantError, setTenantError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const t = await getTenant()
        setTenant(t)
        setTenantError('')
        if (t?.accent_color) document.documentElement.style.setProperty('--sv-accent', t.accent_color)
      } catch (e) {
        setTenant(null)
        setTenantError(apiErrorMessage(e))
      }
    })()
  }, [])

  const menu = useMemo(() => {
    if (!role) return []
    if (role === 'admin') {
      return [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/admin/tenants', label: 'Gimnasios (Tenants)' },
      ]
    }

    if (role === 'member') {
      return [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/member', label: 'Mi Panel' },
      ]
    }

    // admin_tenant / staff / coach
    return [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/members', label: 'Miembros' },
      { to: '/plans', label: 'Planes' },
      { to: '/expiring', label: 'Por vencer' },
      { to: '/checkin', label: 'Asistencia' },
      { to: '/products', label: 'Inventario' },
      { to: '/sales', label: 'Ventas' },
      { to: '/cash', label: 'Caja' },
      { to: '/users', label: 'Usuarios' },
    ]
  }, [role])

  const onLogout = () => {
    clearSession()
    nav('/login')
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr]">
      <aside className="border-b lg:border-b-0 lg:border-r border-sv-border bg-black/20">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-svfit.jpeg" alt="logo" className="w-10 h-10 rounded-xl border border-sv-border object-cover" />
            <div className="leading-tight">
              <div className="font-black tracking-tight">{tenant?.name || 'SVFIT'}</div>
              <div className="text-xs text-sv-muted">{role || ''}{user?.id_code ? ` • ${user.id_code}` : ''}</div>
            </div>
          </div>
          <button className="sv-btn-ghost text-xs" onClick={onLogout}>Salir</button>
        </div>

        {tenantError ? (
          <div className="mx-4 mb-4 sv-card p-3">
            <div className="text-sm font-semibold">Tenant no configurado</div>
            <div className="text-xs text-sv-muted mt-1">{tenantError}</div>
            <div className="text-xs text-sv-muted mt-2">Si este dominio es nuevo, agrégalo en el panel del admin global (dominios del gimnasio).</div>
          </div>
        ) : null}

        <nav className="px-4 pb-6 space-y-1">
          {menu.map((m) => <Item key={m.to} to={m.to} label={m.label} />)}
        </nav>
      </aside>

      <main className="p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
