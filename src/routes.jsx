import { createBrowserRouter } from "react-router-dom";
import Landing from "./public/landing";
import Login from "./public/login";
import React from "react";
import Catalogo from "./public/catalogo";

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
  }
]);

export default router;
