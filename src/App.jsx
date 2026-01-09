import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminTenants from './pages/AdminTenants'
import AdminTenantDetail from './pages/AdminTenantDetail'
import Users from './pages/Users'
import Members from './pages/Members'
import Plans from './pages/Plans'
import Expiring from './pages/Expiring'
import Checkin from './pages/Checkin'
import Products from './pages/Products'
import Sales from './pages/Sales'
import Cash from './pages/Cash'
import MemberPortal from './pages/MemberPortal'
import { getSession } from './lib/auth'

function RequireAuth({ children }) {
  const { token } = getSession()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="admin/tenants" element={<AdminTenants />} />
        <Route path="admin/tenants/:id" element={<AdminTenantDetail />} />

        <Route path="users" element={<Users />} />
        <Route path="members" element={<Members />} />
        <Route path="plans" element={<Plans />} />
        <Route path="expiring" element={<Expiring />} />
        <Route path="checkin" element={<Checkin />} />
        <Route path="products" element={<Products />} />
        <Route path="sales" element={<Sales />} />
        <Route path="cash" element={<Cash />} />
        <Route path="member" element={<MemberPortal />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
