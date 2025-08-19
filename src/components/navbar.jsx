import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, isAdmin, isAdopter, logout, loading } = useAuth();

  // Debug: Agregar console.log para verificar el estado
  useEffect(() => {
    console.log('Navbar - User state:', { user, isAdmin: isAdmin(), isAdopter: isAdopter() });
  }, [user, isAdmin, isAdopter]);

  const navItemClass = (path) =>
    `text-sm font-semibold ${
      currentPath === path
        ? "text-[#ff6900]"
        : "text-gray-900 hover:text-[#ff6900]"
    }`;

  const getDashboardLink = () => {
    if (isAdmin()) return "/admin"; // Cambiado de "/admin/dashboard" a "/admin"
    if (isAdopter()) return "/adoptador"; // Cambiado de "/adopter/profile" a "/adoptador"
    return "/";
  };

  // Función para obtener el texto del enlace de perfil
  const getProfileText = () => {
    if (isAdmin()) return "Mi Dashboard";
    if (isAdopter()) return "Mi Perfil";
    return "Mi Perfil";
  };

  // Si está cargando, no mostrar nada o mostrar un estado de carga
  if (loading) {
    return (
      <header className="bg-white fixed top-0 left-0 w-full z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Huellitas Felices</span>
              <img
                alt="Huellitas Felices"
                src="/ICONOO.svg"
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <div className="text-sm text-gray-500">Cargando...</div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white fixed top-0 left-0 w-full z-50">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link to={user ? getDashboardLink() : "/"} className="-m-1.5 p-1.5">
            <span className="sr-only">Huellitas Felices</span>
            <img
              alt="Huellitas Felices"
              src="/ICONOO.svg"
              className="h-10 w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {!user ? (
            <>
              <Link
                to={"/"}
                className={navItemClass("/")}
              >
                Inicio
              </Link>
              <Link
                to={"/catalogo"}
                className={navItemClass("/catalogo")}
              >
                Catálogo
              </Link>
              <a
                href="#aboutus"
                className="text-sm/6 font-semibold text-gray-900 hover:text-[#ff6900]"
              >
                Sobre Nosotros
              </a>
            </>
          ) : (
            <>
              <Link
                to={"/catalogo"}
                className={navItemClass("/catalogo")}
              >
                Catálogo
              </Link>
              <Link
                to={getDashboardLink()}
                className={navItemClass(getDashboardLink())}
              >
                {getProfileText()}
              </Link>
              {/* Agregamos enlace de regreso a inicio solo si hay sesión */}
              <Link
                to={"/"}
                className={navItemClass("/")}
              >
                Inicio
              </Link>
            </>
          )}
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#ff6900]"
              >
                <UserCircleIcon className="h-6 w-6" />
                {getProfileText()}
              </Link>
              <button
                onClick={logout}
                className="text-sm font-semibold text-gray-900 hover:text-[#ff6900]"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to={"/login"}
              className="text-sm font-semibold text-gray-900 hover:text-[#ff6900]"
            >
              Iniciar sesión <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-2/3 overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
            >
              <div className="flex items-center justify-between">
                <Link to={user ? getDashboardLink() : "/"} className="-m-1.5 p-1.5">
                  <span className="sr-only">Huellitas Felices</span>
                  <img alt="" src="/ICONOO.svg" className="h-8 w-auto" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 flow-root"
              >
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {!user ? (
                      <>
                        <Link
                          to={"/"}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          Inicio
                        </Link>
                        <Link
                          to={"/catalogo"}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          Catálogo
                        </Link>
                        <Link
                          to={"#aboutus"}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          Sobre Nosotros
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to={"/"}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          Inicio
                        </Link>
                        <Link
                          to={"/catalogo"}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          Catálogo
                        </Link>
                        <Link
                          to={getDashboardLink()}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          {getProfileText()}
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="py-6">
                    {user ? (
                      <>
                        <Link
                          to={getDashboardLink()}
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          {getProfileText()}
                        </Link>
                        <button
                          onClick={logout}
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 w-full text-left"
                        >
                          Cerrar sesión
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Iniciar sesión
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;