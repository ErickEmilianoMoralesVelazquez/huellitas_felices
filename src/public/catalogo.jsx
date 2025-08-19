import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import FiltersSidebar from "../components/filtersSidebar";
import CatalogCards from "../components/catalogCards";
import Footer from "../components/footer";
import { getAllPets, getAllCategories } from "../lib/api";
import { motion } from "framer-motion";

const Catalogo = () => {
  const [mascotas, setMascotas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoria: '',
    estado: 'DISPONIBLE',
    raza: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPets();
    fetchCategories();
  }, [filters]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await getAllPets();
      
      // Filtrar las mascotas según los filtros aplicados
      let filteredPets = response || [];
      
      if (filters.categoria) {
        filteredPets = filteredPets.filter(pet => 
          pet.categoria?.nombre === filters.categoria
        );
      }
      
      if (filters.estado) {
        filteredPets = filteredPets.filter(pet => pet.estado === filters.estado);
      }
      
      if (filters.raza) {
        filteredPets = filteredPets.filter(pet => 
          pet.raza.toLowerCase().includes(filters.raza.toLowerCase())
        );
      }
      
      setMascotas(filteredPets);
    } catch (error) {
      console.error('Error fetching pets:', error);
      // Fallback a datos de ejemplo si hay error
      setMascotas([
        {
          id: "1",
          nombre: "Luna",
          categoria: { nombre: "Perro" },
          raza: "Labrador",
          color: "Dorado",
          peso: 25.5,
          estatura: 0.65,
          descripcion: "Luna es una perrita muy cariñosa y juguetona. Le encantan los niños y es muy activa.",
          estado: "DISPONIBLE",
          imagen: "../../public/pets3.webp"
        },
        {
          id: "2",
          nombre: "Milo",
          categoria: { nombre: "Gato" },
          raza: "Siamés",
          color: "Blanco y Negro",
          peso: 4.2,
          estatura: 0.25,
          descripcion: "Milo es un gato tranquilo y muy limpio. Ideal para apartamentos.",
          estado: "EN_PROCESO_ADOPCION",
          imagen: "../../public/Hero2.avif"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([
        { id: 1, nombre: "Perro" },
        { id: 2, nombre: "Gato" }
      ]);
    }
  };

  const filteredPets = mascotas.filter(pet =>
    pet.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.raza.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row w-full bg-gray-100 p-4 md:p-6 mt-20 gap-6">
        {/* Filtros */}
        <div className="w-full flex md:items-start md:w-1/4 justify-center items-center">
          <FiltersSidebar 
            categories={categories}
            filters={filters}
            setFilters={setFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Contenido principal */}
        <main className="w-full md:w-3/4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-left md:text-left">
            Mascotas {filteredPets.length > 0 && `(${filteredPets.length})`}
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-[#ff6900] border-t-transparent rounded-full"
              />
            </div>
          ) : filteredPets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron mascotas
              </h3>
              <p className="text-gray-600">
                Intenta modificar tus filtros de búsqueda
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPets.map((mascota) => (
                <CatalogCards
                  key={mascota.id}
                  {...mascota}
                  fetchPets={fetchPets}
                />
              ))}
            </motion.div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Catalogo;
