// src/pages/Login.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerAdopter, login } from "../lib/api";
import { toast } from "react-hot-toast";

/* ========================= Helpers: errores y roles ========================= */
const statusToMessage = (status, fallback) => {
  switch (status) {
    case 0:
      return "No se pudo conectar con el servidor. Verifica tu red o que el backend esté encendido.";
    case 400:
      return "Datos inválidos. Revisa los campos e inténtalo de nuevo.";
    case 401:
      return "Credenciales inválidas. Verifica tu correo y contraseña.";
    case 403:
      return "No tienes permisos para esta acción.";
    case 404:
      return "Recurso no encontrado en el servidor.";
    case 409:
      return "Ya existe un usuario con ese correo.";
    case 422:
      return "Datos no procesables. Corrige los campos e inténtalo de nuevo.";
    case 500:
      return "Error interno del servidor. Intenta más tarde.";
    default:
      return fallback || "Ocurrió un error. Intenta de nuevo.";
  }
};

// Decodifica JWT (sin validar firma) para leer claims
const decodeJwt = (token) => {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    // decodeURIComponent(escape(...)) para compatibilidad UTF-8
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
};

// Extrae y normaliza un rol: "adoptador" | "admin" | "empleado"
const extractRole = ({ data, token }) => {
  const direct =
    data?.user?.rol ||
    data?.user?.role ||
    data?.role ||
    (Array.isArray(data?.roles) ? data.roles[0] : null) ||
    (Array.isArray(data?.user?.roles) ? data.user.roles[0] : null);

  let jwtRole = null;
  if (token) {
    const claims = decodeJwt(token) || {};
    jwtRole =
      claims.role ||
      (Array.isArray(claims.roles) ? claims.roles[0] : null) ||
      (Array.isArray(claims.authorities) ? claims.authorities[0] : null) ||
      claims.authority ||
      claims.rol;
  }

  const raw = (direct || jwtRole || "").toString().toLowerCase();
  const mapNumeric = { "1": "adoptador", "2": "empleado", "3": "admin" };
  if (mapNumeric[raw]) return mapNumeric[raw];

  const cleaned = raw.replace(/^role[_-]?/i, "");
  if (/(admin)/.test(cleaned)) return "admin";
  if (/(empleado|staff|worker)/.test(cleaned)) return "empleado";
  if (/(adoptador|adopter)/.test(cleaned)) return "adoptador";
  return "adoptador"; // fallback
};

const redirectByRole = (navigate, role) => {
  const r = (role || "").toLowerCase();
  if (r === "admin") return navigate("/admin", { replace: true });
  if (r === "empleado") return navigate("/empleado", { replace: true });
  return navigate("/adoptador", { replace: true }); // default adoptador
};
/* ========================================================================== */

const SignUpForm = ({ switchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    password: "",
    rol: "1",
  });
  const [loading, setLoading] = useState(false);
  const [errorInline, setErrorInline] = useState(""); // errores del cliente
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorInline("");

    // Validaciones rápidas (cliente)
    if (!form.nombre || !form.correo || !form.password) {
      setErrorInline("Nombre, correo y contraseña son obligatorios.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) {
      setErrorInline("Correo no válido.");
      return;
    }
    if (!/^\d{10}$/.test(form.telefono)) {
      setErrorInline("El teléfono debe tener 10 dígitos.");
      return;
    }

    try {
      setLoading(true);
      await registerAdopter({
        nombre: form.nombre,
        correo: form.correo,
        password: form.password,
        telefono: form.telefono,
        direccion: form.direccion,
        rol: form.rol,
      });

      toast.success("Registro exitoso. Ahora puedes iniciar sesión.");
      // O cambiar automáticamente a login:
      setTimeout(() => {
        switchToLogin();
      }, 800);
    } catch (err) {
      const preferred = err?.message && err.message !== "Error" ? err.message : null;
      const msg = statusToMessage(err?.status ?? -1, preferred);

      // Si backend manda "errors" de validación (array/obj), los concatenamos
      let details = "";
      if (err?.details) {
        if (Array.isArray(err.details)) {
          details = err.details
            .map((d) => d?.message || d?.defaultMessage || d)
            .join(" · ");
        } else if (typeof err.details === "object") {
          details = Object.values(err.details).join(" · ");
        } else if (typeof err.details === "string") {
          details = err.details;
        }
      }
      toast.error(details ? `${msg}\n${details}` : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center w-full"
    >
      <Link to={"/"}>
        <img
          src="../../public/ICONOO.svg"
          alt="huellitas felices"
          className="w-20 mb-5 cursor-pointer"
        />
      </Link>
      <h1 className="text-2xl font-bold mt-2">Crear cuenta</h1>
      <p className="text-sm text-gray-500 mt-2">
        ¡Hola! Estamos muy contentos de que seas parte de nosotros
      </p>

      <form className="flex flex-col gap-4 w-full mt-5 max-w-md" onSubmit={handleSubmit}>
        <label className="text-md">Nombre:</label>
        <input
          name="nombre"
          type="text"
          placeholder="Nombre completo"
          className="outline outline-gray-300 rounded-sm h-10 pl-2"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <label className="text-md">Dirección:</label>
        <input
          name="direccion"
          type="text"
          placeholder="Dirección"
          className="outline outline-gray-300 rounded-sm h-10 pl-2"
          value={form.direccion}
          onChange={handleChange}
        />

        <label className="text-md">Teléfono:</label>
        <input
          name="telefono"
          type="tel"
          placeholder="Número telefónico (10 dígitos)"
          className="outline outline-gray-300 rounded-sm h-10 pl-2"
          value={form.telefono}
          onChange={handleChange}
        />

        <label className="text-md">Correo electrónico:</label>
        <input
          name="correo"
          type="email"
          placeholder="Correo electrónico"
          className="outline outline-gray-300 rounded-sm h-10 pl-2"
          value={form.correo}
          onChange={handleChange}
          required
        />

        <label className="text-md">Contraseña:</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="outline outline-gray-300 rounded-sm h-10 pl-2 pr-10 w-full"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-2.5 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <input type="hidden" name="rol" value={form.rol} />

        <button
          disabled={loading}
          className="bg-[#ff6900] mt-2 text-white rounded-sm h-10 hover:bg-[#e85c00] cursor-pointer disabled:opacity-60"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        {/* Errores del lado del cliente (inputs) */}
        {errorInline && <p className="text-red-600 text-sm mt-2">{errorInline}</p>}
      </form>

      <p className="text-sm text-gray-500 mt-5">
        ¿Ya tienes una cuenta?{" "}
        <button onClick={switchToLogin} className="text-[#ff6900] underline cursor-pointer">
          Inicia sesión
        </button>
      </p>
    </motion.div>
  );
};

const LoginForm = ({ switchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ correo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorInline, setErrorInline] = useState(""); // errores del cliente (inputs)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorInline("");

    if (!form.correo || !form.password) {
      setErrorInline("Ingresa tu correo y contraseña.");
      return;
    }

    try {
      setLoading(true);
      const data = await login({ correo: form.correo, password: form.password });

      const token =
        data?.token || data?.accessToken || data?.jwt || data?.authorization;

      if (!token)
        throw Object.assign(new Error("No se recibió token de autenticación."), {
          status: 500,
        });

      localStorage.setItem("token", token);
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

      // Extraer rol y redirigir
      const role = extractRole({ data, token });
      localStorage.setItem("role", role);

      toast.success("Bienvenido 👋");
      redirectByRole(navigate, role);
    } catch (err) {
      const preferred = err?.message && err.message !== "Error" ? err.message : null;
      const msg = statusToMessage(err?.status ?? -1, preferred);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center w-full"
    >
      <Link to={"/"}>
        <img
          src="../../public/ICONOO.svg"
          alt="huellitas felices"
          className="w-20 mb-5"
        />
      </Link>

      <h1 className="text-2xl font-bold mt-2">Iniciar sesión</h1>
      <p className="text-sm text-gray-500 mt-2">
        ¡Bienvenido! Estamos felices de que estés de regreso
      </p>

      <form className="flex flex-col gap-4 w-full mt-5 max-w-md" onSubmit={handleSubmit}>
        <label className="text-md">Correo electrónico:</label>
        <input
          name="correo"
          type="email"
          placeholder="Correo electrónico"
          className="outline outline-gray-300 rounded-sm h-10 pl-2"
          value={form.correo}
          onChange={handleChange}
          required
        />

        <label className="text-md">Contraseña:</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="outline outline-gray-300 rounded-sm h-10 pl-2 pr-10 w-full"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-2.5 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          disabled={loading}
          className="bg-[#ff6900] mt-2 text-white rounded-sm h-10 hover:bg-[#e85c00] cursor-pointer disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>

        {/* Errores del lado del cliente (inputs) */}
        {errorInline && <p className="text-red-600 text-sm mt-2">{errorInline}</p>}
      </form>

      <p className="text-sm text-gray-500 mt-5">
        ¿No tienes una cuenta?{" "}
        <button onClick={switchToRegister} className="text-[#ff6900] underline cursor-pointer">
          Regístrate
        </button>
      </p>
    </motion.div>
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full min-h-screen items-center justify-center flex p-4">
      {/* Imagen - Solo visible en desktop */}
      <div className="hidden md:flex justify-center items-center w-1/2 px-10">
        <img
          src="../../public/pets.webp"
          alt="imagen de inicio de sesión"
          className="rounded-4xl w-full max-h-[800px] object-cover"
        />
      </div>

      {/* Formulario con animación */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-xl md:shadow-none">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <LoginForm key="login" switchToRegister={() => setIsLogin(false)} />
          ) : (
            <SignUpForm key="signup" switchToLogin={() => setIsLogin(true)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
