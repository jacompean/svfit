import React from "react";
import { getUser } from "../lib/auth";
import Dashboard from "./Dashboard.jsx";
import MemberPortal from "./MemberPortal.jsx";

export default function Home() {
  const role = getUser()?.role;
  if (role === "member") return <MemberPortal />;
  return <Dashboard />;
}
