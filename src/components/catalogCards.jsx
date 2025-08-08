import { Button } from "@headlessui/react";
import React from "react";

const CatalogCards = ({ tipo, nombre, raza, edad, descripcion, imagen }) => {
  return (
    <>
      <a
        href="#"
        className="group relative block bg-black rounded-xl overflow-hidden"
      >
        <img
          alt=""
          src={imagen}
          className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
        />

        <div className="relative p-4 sm:p-6 lg:p-8">
          <div className="flex flex-row items-center gap-2 justify-between">
            <p className="text-xl font-bold text-white sm:text-2xl">{nombre}</p>
            <p className="text-sm font-medium tracking-widest text-white uppercase bg-[#ff6900] inline-block px-2 py-1 rounded-lg">
              {tipo}
            </p>
          </div>

          <div className="mt-32 sm:mt-48 lg:mt-64">
            <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex flex-col mb-4">
                <span className="text-lg font-semibold text-white">{raza}</span>
                <span className="text-md text-white">{edad}</span>
                <span className="text-sm text-white">{descripcion}</span>
                {/* <span className="text-md text-white">{estado}</span> */}
              </div>
              <Button className="text-sm font-medium text-white bg-[#ff6900] hover:bg-orange-600 rounded-md px-4 py-2 w-full">
                Adoptar
              </Button>
            </div>
          </div>
        </div>
      </a>
    </>
  );
};

export default CatalogCards;
