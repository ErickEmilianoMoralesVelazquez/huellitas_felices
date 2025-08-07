import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const SignUpForm = ({ switchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

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
        Hola! estamos muy contentos de que seas parte de nosotros
      </p>

      <form className="flex flex-col gap-4 w-full mt-5 max-w-md">
        <label className="text-md">Nombre:</label>
        <input
          type="text"
          placeholder="Nombre completo"
          className="outline outline-gray-300 rounded-sm h-10 pl-2"
        />

        <label className="text-md">Dirección:</label>
        <input
          type="text"
          placeholder="Dirección"
          className="outline outline-gray-300 rounded-sm h-10 pl-2"
        />

        <label className="text-md">Teléfono:</label>
        <input
          type="tel"
          placeholder="Número telefónico"
          className="outline outline-gray-300 rounded-sm h-10 pl-2"
        />

        <label className="text-md">Correo electrónico:</label>
        <input
          type="email"
          placeholder="Correo electrónico"
          className="outline outline-gray-300 rounded-sm h-10 pl-2"
        />

        <label className="text-md">Contraseña:</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="outline outline-gray-300 rounded-sm h-10 pl-2 pr-10 w-full"
          />
          <button
            type="button"
            className="absolute right-2 top-2.5 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button className="bg-[#ff6900] mt-5 text-white rounded-sm h-10 hover:bg-[#e85c00] cursor-pointer">
          Crear cuenta
        </button>
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

      <form className="flex flex-col gap-4 w-full mt-5 max-w-md">
        <label className="text-md">Correo electrónico:</label>
        <input
          type="email"
          placeholder="Correo electrónico"
          className="outline outline-gray-300 rounded-sm h-10 pl-2"
        />

        <label className="text-md">Contraseña:</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="outline outline-gray-300 rounded-sm h-10 pl-2 pr-10 w-full"
          />
          <button
            type="button"
            className="absolute right-2 top-2.5 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button className="bg-[#ff6900] mt-5 text-white rounded-sm h-10 hover:bg-[#e85c00] cursor-pointer">
          Iniciar sesión
        </button>
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
