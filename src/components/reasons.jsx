import React from "react";
import { Heart, Shield, Users } from "lucide-react";
import ReasonCard from "./reasonCard";

const Reasons = () => {
  return (
    <div className="w-full py-16 md:py-24 flex flex-col justify-center items-center bg-[#effdf4] px-7">
      <h1 className="font-bold text-4xl mb-5">¿Por qué adoptar?</h1>
      <p className="text-center text-gray-700 text-xl max-w-[40rem]">
        Adoptar una mascota no solo cambia su vida, también transforma la tuya
        de maneras increíbles.
      </p>
      <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 lg:gap-20">
        <ReasonCard
          icono={<Heart className="size-10 text-[#00a63e] m-4" />}
          titulo="Salvas una vida"
          descripcion="Cada adopción es una segunda oportunidad para una mascota que lo necesita."
        />
        <ReasonCard
          icono={<Users className="size-10 text-[#00a63e] m-4" />}
          titulo="Salvas una vida"
          descripcion="Cada adopción es una segunda oportunidad para una mascota que lo necesita."
        />
        <ReasonCard
          icono={<Shield className="size-10 text-[#00a63e] m-4" />}
          titulo="Salvas una vida"
          descripcion="Cada adopción es una segunda oportunidad para una mascota que lo necesita."
        />
      </div>
    </div>
  );
};

export default Reasons;
