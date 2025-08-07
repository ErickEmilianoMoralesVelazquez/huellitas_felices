import { createBrowserRouter } from "react-router-dom";
import Landing from "./public/landing";
import Login from "./public/login";
import React from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "/login",
    element: <Login />
  }
]);

export default router;
