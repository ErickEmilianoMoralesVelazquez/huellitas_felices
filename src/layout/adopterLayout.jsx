// src/layout/adopterLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import NavbarAdopter from "../components/navbarAdopter";

export default function AdopterLayout() {
  return (
    <>
      <NavbarAdopter
        onLogout={() => {
          console.log("Cerrar sesión"); // temporal
        }}
        logoSrc="/ICONOO.svg"
      />
      {/* margen para no tapar contenido con el navbar fijo */}
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
}
