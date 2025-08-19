import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { petsAPI, categoriesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PetModal from './PetModal';

const PetManagement = () => {
  const [pets, setPets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [filters, setFilters] = useState({
    categoria: '',
    estado: '',
  });
  
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin()) {
      fetchPets();
      fetchCategories();
    }
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

  const handleCreatePet = () => {
    setSelectedPet(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPet(null);
  };

  const handleModalSuccess = () => {
    fetchPets();
    handleModalClose();
  };

  const filteredPets = pets.filter(pet =>
    pet.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.raza.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos para acceder a esta área</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Mascotas
              </h1>
              <p className="text-gray-600">
                Administra el catálogo de mascotas disponibles para adopción
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreatePet}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-[#ff6900] text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Registrar Mascota
            </motion.button>
          </div>
        </motion.div>

        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar mascotas por nombre, raza o descripción..."
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
                <option value="">Todos los estados</option>
                <option value="DISPONIBLE">Disponibles</option>
                <option value="EN_PROCESO_ADOPCION">En proceso</option>
                <option value="ADOPTADO">Adoptados</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredPets.map((pet) => (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    <div className="w-full h-48 bg-gradient-to-br from-[#ffd6a7] to-[#ff6900] flex items-center justify-center">
                      <span className="text-6xl">🐾</span>
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
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEditPet(pet)}
                      className="w-full py-2 bg-[#ff6900] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Editar
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredPets.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron mascotas
            </h3>
            <p className="text-gray-600">
              Intenta modificar tus filtros de búsqueda o registra una nueva mascota
            </p>
          </motion.div>
        )}
      </div>

      <PetModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        pet={selectedPet}
        mode={modalMode}
        categories={categories}
      />
    </div>
  );
};

export default PetManagement;