// src/components/NavbarAdopter.jsx
import React from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

const NavbarAdopter = ({ logoSrc = "/public/ICONOO.svg", onLogout }) => {
  const navigate = useNavigate();

  function handleLogout() {
    // Si te pasaron una función de logout, úsala
    if (typeof onLogout === "function") {
      onLogout();
    } else {
      // Ejemplo genérico: limpia sesión y redirige
      localStorage.removeItem("authToken");
      sessionStorage.clear();
    }
    navigate("/login");
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:p-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <span className="sr-only">Huellitas Felices</span>
            <img
              src={logoSrc}
              alt="Huellitas Felices"
              className="h-9 w-auto sm:h-10"
            />
          </Link>
        </div>

        {/* Solo botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Cerrar sesión</span>
          <span className="sm:hidden">Salir</span>
        </button>
      </nav>
    </header>
  );
};

export default NavbarAdopter;
