import { createBrowserRouter } from "react-router-dom";
import Landing from "./public/landing";
import Login from "./public/login";
import React from "react";
import Catalogo from "./public/catalogo";
import Adoptador from "./public/adopter_profile";
import AdopterLayout from "./layout/adopterLayout";
import AdopterProfile from "./public/adopter_profile";
import EmployeeDashboard from "./public/employeeDashboard";
import DashboardAdmin from "./public/adminDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/catalogo",
    element: <Catalogo />
  },
  {
    path: "/adoptador",
    element: <AdopterLayout />,
    children: [
      { index: true, element: <AdopterProfile /> },   // /adoptador
      // { path: "mis-citas", element: <MisCitas /> }, // más vistas futuras
    ],
  },
  {
    path: "/empleado",
    element: <AdopterLayout />,
    children: [
      { index: true, element: <EmployeeDashboard /> },   // /empleado
      // { path: "mis-citas", element: <MisCitas /> }, // más vistas futuras
    ],
  },
  {
    path: "/admin",
    element: <AdopterLayout />,
    children: [
      { index: true, element: <DashboardAdmin /> },   // /empleado
      // { path: "mis-citas", element: <MisCitas /> }, // más vistas futuras
    ],
  },
]);

export default router;
