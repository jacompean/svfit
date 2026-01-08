import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./components/Nav.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen flex">
      <Nav />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
