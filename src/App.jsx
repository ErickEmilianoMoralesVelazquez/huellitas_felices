import { Routes, Route } from "react-router-dom";
import Landing from "@/public/landing.jsx";
import Catalogo from "@/public/catalogo.jsx";
import Login from "@/public/login.jsx";
import AdopterProfile from "./public/adopter_profile";
import AdopterLayout from "./layout/adopterLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/login" element={<Login />} />

      <Route element={<AdopterLayout />}>
        <Route path="/adoptador" element={<AdopterProfile />} />
        {/* Aquí puedes agregar más rutas internas */}
      </Route>
    </Routes>
  );
}
