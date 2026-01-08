import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleGuard from "./components/RoleGuard.jsx";
import Layout from "./Layout.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Members from "./pages/Members.jsx";
import Attendance from "./pages/Attendance.jsx";
import Payments from "./pages/Payments.jsx";
import Classes from "./pages/Classes.jsx";
import MemberPortal from "./pages/MemberPortal.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />

        <Route
          path="dashboard"
          element={
            <RoleGuard allow={["admin", "coach"]}>
              <Dashboard />
            </RoleGuard>
          }
        />
        <Route
          path="members"
          element={
            <RoleGuard allow={["admin", "coach"]}>
              <Members />
            </RoleGuard>
          }
        />
        <Route
          path="attendance"
          element={
            <RoleGuard allow={["admin", "coach"]}>
              <Attendance />
            </RoleGuard>
          }
        />
        <Route
          path="payments"
          element={
            <RoleGuard allow={["admin", "coach"]}>
              <Payments />
            </RoleGuard>
          }
        />
        <Route
          path="classes"
          element={
            <RoleGuard allow={["admin", "coach"]}>
              <Classes />
            </RoleGuard>
          }
        />

        <Route path="member" element={<MemberPortal />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
