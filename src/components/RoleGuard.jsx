import React from "react";
import { getUser } from "../lib/auth";
import NotAllowed from "../pages/NotAllowed.jsx";

export default function RoleGuard({ allow = [], children }) {
  const role = getUser()?.role;
  if (allow.length === 0) return children;
  if (allow.includes(role)) return children;
  return <NotAllowed />;
}
