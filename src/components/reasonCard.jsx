import React, { useState } from "react";

const ReasonCard = ({ icono, titulo, descripcion }) => {
  return (
    <div className="bg-white h-auto p-8 rounded-2xl shadow-lg mt-10 flex transform transition-transform duration-300 md:flex-col flex-row justify-center items-center gap-6 md:gap-12 lg:gap-20 hover:scale-105">
      <div className="flex flex-col items-center">
        <div className="bg-[#b9f8cf] rounded-full">{icono}</div>
        <div className="flex flex-col max-w-md mt-4">
          <h2 className="font-bold text-xl text-center">{titulo}</h2>
          <p className="text-gray-600 text-center mt-2 px-4 max-w-[20rem]">
            {descripcion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReasonCard;
