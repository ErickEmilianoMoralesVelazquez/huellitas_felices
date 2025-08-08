import React, { useState } from "react";
import { Funnel } from "lucide-react";

const FiltersSidebar = () => {
  const [perro, setPerro] = useState(false);
  const [gato, setGato] = useState(false);
  const [ave, setAve] = useState(false);
  const [reptil, setReptil] = useState(false);
  const [roedor, setRoedor] = useState(false);

  return (
    <div className="flex flex-col w-96 h-auto p-6 border border-gray-300 bg-white rounded-lg md:fixed">
      <div className="flex flex-row">
        <Funnel className="w-6 h-6 text-gray-700" />
        <h2 className="text-xl ml-2">Filtros</h2>
      </div>

      <div className="flex flex-col mt-6">
        <label className="text-md mb-3 font-semibold">Categorias</label>
        <div className="flex flex-row items-center mb-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            name="Perro"
            id="perro"
            value={perro}

          />
          <label className="text-md ml-2 " for='perro'>Perro</label>
        </div>
        <div className="flex flex-row items-center mb-2">
          <input
            type="checkbox"
            name="Gato"
            className="h-4 w-4"
            id="gato"
            value={gato}
          />
          <label for='gato' className="text-md ml-2 ">Gato</label>
        </div>
        <div className="flex flex-row items-center mb-2">
          <input
            type="checkbox"
            name="Reptil"
            id="reptil"
            value={reptil}
            className="h-4 w-4"
          />
          <label for='reptil' className="text-md ml-2 ">Reptil</label>
        </div>
        <div className="flex flex-row items-center mb-2">
          <input
            type="checkbox"
            name="Roedor"
            id="roedor"
            value={roedor}
            className="h-4 w-4"
          />
          <label for='roedor' className="text-md ml-2">Roedor</label>
        </div>

        <form action="" className="flex flex-col mt-4">
          <label className="text-md font-semibold mb-3">Edad:</label>
          <select className="outline outline-gray-300 rounded-sm h-10 pl-2  mb-4">
            <option value="">Todas</option>
            <option value="cachorro">Cachorro</option>
            <option value="adulto">Adulto</option>
            <option value="senior">Senior</option>
          </select>
          <label className="text-md font-semibold mb-3">Tamaño:</label>
          <select className="outline outline-gray-300 rounded-sm h-10 pl-2 mb-4">
            <option value="">Todos</option>
            <option value="pequeño">Pequeño</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
          </select>
          <button className="bg-[#ff6900] text-white rounded-sm h-10 hover:bg-[#e85c00] cursor-pointer">
            Aplicar filtros
          </button>
        </form>
      </div>
    </div>
  );
};

export default FiltersSidebar;
