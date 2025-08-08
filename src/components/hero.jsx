import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const MyHero = () => {
  return (
    <div className="w-full h-screen justify-center items-center flex relative bg-[url('https://images.unsplash.com/photo-1525253013412-55c1a69a5738?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="flex flex-col justify-center items-center text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-white">Adopta</h1>
        <h1 className="text-5xl md:text-7xl font-bold text-white">
          Salva una vida
        </h1>
        <h2 className="text-lg md:text-2xl font-medium text-white max-w-2xl mt-5 px-5">
          Cada mascota merece un hogar lleno de amor. Encuentra tu compañero
          perfecto y cambia dos vidas para siempre.
        </h2>

        <Link to={"/catalogo"}>
          <button className="flex mt-8 px-6 py-3 bg-[#ff6900] text-white font-semibold rounded-lg hover:bg-orange-600 cursor-pointer transform transition-transform duration-300 hover:scale-105">
            Ver mascotas
            <ArrowRight className="ml-2 w-5" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MyHero;

// imagen https://images.unsplash.com/photo-1525253013412-55c1a69a5738?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
// #ffd6a7
