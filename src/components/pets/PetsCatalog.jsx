import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { petsAPI, categoriesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AdoptionModal from '../adoption/AdoptionModal';

const PetsCatalog = () => {
  const [pets, setPets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoria: '',
    estado: 'DISPONIBLE',
    raza: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  
  const { isAdopter } = useAuth();

  useEffect(() => {
    fetchPets();
    fetchCategories();
    loadFavorites();
  }, [filters]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await petsAPI.getAll(filters);
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const loadFavorites = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  };

  const toggleFavorite = (petId) => {
    const updatedFavorites = favorites.includes(petId)
      ? favorites.filter(id => id !== petId)
      : [...favorites, petId];
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleAdoptClick = (pet) => {
    if (!isAdopter()) {
      alert('Debes iniciar sesión como adoptador para solicitar una adopción');
      return;
    }
    setSelectedPet(pet);
    setShowAdoptionModal(true);
  };

  const filteredPets = pets.filter(pet =>
    pet.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.raza.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encuentra tu compañero perfecto
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestro catálogo de mascotas en busca de hogar y dale una segunda oportunidad a un amigo fiel
          </p>
        </motion.div>

        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, raza o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filters.categoria}
                onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                ))}
              </select>
              
              <select
                value={filters.estado}
                onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
              >
                <option value="DISPONIBLE">Disponibles</option>
                <option value="EN_PROCESO_ADOPCION">En proceso</option>
                <option value="ADOPTADO">Adoptados</option>
                <option value="">Todos los estados</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-[#ff6900] border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredPets.map((pet) => (
                <motion.div
                  key={pet.id}
                  variants={item}
                  layout
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    <div className="w-full h-48 bg-gradient-to-br from-[#ffd6a7] to-[#ff6900] flex items-center justify-center">
                      <span className="text-6xl">🐾</span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleFavorite(pet.id)}
                        className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                      >
                        {favorites.includes(pet.id) ? (
                          <HeartSolidIcon className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{pet.nombre}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pet.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-800' :
                        pet.estado === 'EN_PROCESO_ADOPCION' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {pet.estado === 'DISPONIBLE' ? 'Disponible' :
                         pet.estado === 'EN_PROCESO_ADOPCION' ? 'En proceso' : 'Adoptado'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{pet.raza} • {pet.categoria.nombre}</p>
                    <p className="text-sm text-gray-500 mb-2">Color: {pet.color}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {pet.peso} kg • {pet.estatura}m de altura
                    </p>
                    
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {pet.descripcion}
                    </p>
                    
                    {pet.estado === 'DISPONIBLE' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAdoptClick(pet)}
                        className="w-full py-2 bg-[#ff6900] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
                      >
                        Solicitar Adopción
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredPets.length === 0 && !loading && (
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
        )}
      </div>

      <AdoptionModal
        isOpen={showAdoptionModal}
        onClose={() => setShowAdoptionModal(false)}
        pet={selectedPet}
      />
    </div>
  );
};

export default PetsCatalog;