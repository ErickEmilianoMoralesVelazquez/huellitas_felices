import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import FiltersSidebar from "../components/filtersSidebar";
import CatalogCards from "../components/catalogCards";
import Footer from "../components/footer";

const Catalogo = () => {
  // Datos de ejemplo - En un caso real, esto vendría de una API o base de datos
  const mascotasEjemplo = [
    {
      id: "1",
      nombre: "Luna",
      tipo: "Perro",
      raza: "Labrador",
      edad: "2 años",
      descripcion: "Luna es una perrita muy cariñosa y juguetona. Le encantan los niños y es muy activa.",
      estado: "Disponible",
      imagen: "../../public/pets3.webp"
    },
    {
      id: "2",
      nombre: "Milo",
      tipo: "Gato",
      raza: "Siamés",
      edad: "1 año",
      descripcion: "Milo es un gato tranquilo y muy limpio. Ideal para apartamentos.",
      estado: "En proceso",
      imagen: "../../public/Hero2.avif"
    },
    {
      id: "3",
      nombre: "Rocky",
      tipo: "Perro",
      raza: "Pastor Alemán",
      edad: "3 años",
      descripcion: "Rocky es un perro muy inteligente y protector. Excelente guardián.",
      estado: "Disponible",
      imagen: "../../public/pets.webp"
    },
    {
      id: "4",
      nombre: "Nina",
      tipo: "Gato",
      raza: "Persa",
      edad: "6 meses",
      descripcion: "Nina es una gatita muy juguetona y sociable. Le encanta la compañía.",
      estado: "Disponible",
      imagen: "../../public/pets2.webp"
    },
    {
      id: "5",
      nombre: "Max",
      tipo: "Perro",
      raza: "Golden Retriever",
      edad: "4 años",
      descripcion: "Max es un perro muy noble y entrenado. Excelente con familias.",
      estado: "Adoptado",
      imagen: "../../public/pets2.webp"
    },
    {
      id: "6",
      nombre: "Lucy",
      tipo: "Gato",
      raza: "Mestizo",
      edad: "2 años",
      descripcion: "Lucy es una gata muy independiente pero cariñosa. Esterilizada.",
      estado: "Disponible",
      imagen: "../../public/pets2.webp"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row w-full bg-gray-100 p-4 md:p-6 mt-20 gap-6">
        {/* Filtros */}
        <div className="w-full flex md:items-start md:w-1/4 justify-center items-center">
          <FiltersSidebar />
        </div>

        {/* Contenido principal */}
        <main className="w-full md:w-3/4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-left md:text-left">
            Mascotas
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mascotasEjemplo.map((mascota) => (
              <CatalogCards
                key={mascota.id}
                {...mascota}
              />
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Catalogo;
