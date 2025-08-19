import React, { useState } from "react";
import { Funnel, Search } from "lucide-react";

const FiltersSidebar = ({ categories = [], filters, setFilters, searchTerm, setSearchTerm }) => {

  return (
    <div className="flex flex-col w-96 h-auto p-6 border border-gray-300 bg-white rounded-lg md:sticky md:top-24">
      <div className="flex flex-row">
        <Funnel className="w-6 h-6 text-gray-700" />
        <h2 className="text-xl ml-2">Filtros</h2>
      </div>

      {/* Búsqueda */}
      <div className="flex flex-col mt-6">
        <label className="text-md mb-3 font-semibold">Buscar</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Nombre, raza, descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col mt-6">
        <label className="text-md mb-3 font-semibold">Categorías</label>
        <select 
          value={filters.categoria}
          onChange={(e) => setFilters({...filters, categoria: e.target.value})}
          className="outline outline-gray-300 rounded-sm h-10 pl-2 mb-4"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
          ))}
        </select>

        <label className="text-md font-semibold mb-3">Estado:</label>
        <select 
          value={filters.estado}
          onChange={(e) => setFilters({...filters, estado: e.target.value})}
          className="outline outline-gray-300 rounded-sm h-10 pl-2 mb-4"
        >
          <option value="">Todos los estados</option>
          <option value="DISPONIBLE">Disponibles</option>
          <option value="EN_PROCESO_ADOPCION">En proceso</option>
          <option value="ADOPTADO">Adoptados</option>
        </select>

        <label className="text-md font-semibold mb-3">Raza:</label>
        <input
          type="text"
          placeholder="Ej: Labrador, Siamés..."
          value={filters.raza}
          onChange={(e) => setFilters({...filters, raza: e.target.value})}
          className="outline outline-gray-300 rounded-sm h-10 pl-2 mb-4"
        />

        <button 
          onClick={() => {
            setFilters({categoria: '', estado: 'DISPONIBLE', raza: ''});
            setSearchTerm('');
          }}
          className="bg-gray-500 text-white rounded-sm h-10 hover:bg-gray-600 cursor-pointer mb-2"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default FiltersSidebar;
