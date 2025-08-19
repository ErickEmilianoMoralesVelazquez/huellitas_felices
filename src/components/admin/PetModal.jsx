import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { petsAPI } from '../../services/api';

const PetModal = ({ isOpen, onClose, onSuccess, pet, mode, categories }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    raza: '',
    categoriaId: '',
    color: '',
    peso: '',
    estatura: '',
    descripcion: '',
    nuevoEstado: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (pet && mode === 'edit') {
      setFormData({
        nombre: pet.nombre || '',
        raza: pet.raza || '',
        categoriaId: pet.categoria?.id || '',
        color: pet.color || '',
        peso: pet.peso || '',
        estatura: pet.estatura || '',
        descripcion: pet.descripcion || '',
        nuevoEstado: pet.estado || '',
      });
    } else {
      setFormData({
        nombre: '',
        raza: '',
        categoriaId: categories.length > 0 ? categories[0].id : '',
        color: '',
        peso: '',
        estatura: '',
        descripcion: '',
        nuevoEstado: 'DISPONIBLE',
      });
    }
    setErrors({});
  }, [pet, mode, isOpen, categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.raza.trim()) {
      newErrors.raza = 'La raza es requerida';
    }

    if (!formData.categoriaId) {
      newErrors.categoriaId = 'La categoría es requerida';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'El color es requerido';
    }

    if (!formData.peso || parseFloat(formData.peso) <= 0) {
      newErrors.peso = 'El peso debe ser un número positivo';
    }

    if (!formData.estatura || parseFloat(formData.estatura) <= 0) {
      newErrors.estatura = 'La estatura debe ser un número positivo';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        peso: parseFloat(formData.peso),
        estatura: parseFloat(formData.estatura),
        categoriaId: parseInt(formData.categoriaId),
      };

      if (mode === 'create') {
        await petsAPI.create(submitData);
      } else {
        await petsAPI.update(pet.id, {
          petId: pet.id,
          nuevoEstado: formData.nuevoEstado,
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving pet:', error);
      setErrors({ submit: 'Error al guardar mascota. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogPanel className="mx-auto max-w-lg w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    {mode === 'create' ? 'Registrar Mascota' : 'Editar Mascota'}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  {errors.submit && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm"
                    >
                      {errors.submit}
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    {mode === 'create' ? (
                      <>
                        <div>
                          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                          </label>
                          <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent ${
                              errors.nombre ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Max, Luna, Buddy..."
                          />
                          {errors.nombre && (
                            <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="raza" className="block text-sm font-medium text-gray-700 mb-1">
                            Raza
                          </label>
                          <input
                            type="text"
                            id="raza"
                            name="raza"
                            value={formData.raza}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent ${
                              errors.raza ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Labrador, Siamés, Mestizo..."
                          />
                          {errors.raza && (
                            <p className="mt-1 text-xs text-red-600">{errors.raza}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría
                          </label>
                          <select
                            id="categoriaId"
                            name="categoriaId"
                            value={formData.categoriaId}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent ${
                              errors.categoriaId ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Selecciona una categoría</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                          </select>
                          {errors.categoriaId && (
                            <p className="mt-1 text-xs text-red-600">{errors.categoriaId}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                          </label>
                          <input
                            type="text"
                            id="color"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent ${
                              errors.color ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Dorado, Negro, Blanco..."
                          />
                          {errors.color && (
                            <p className="mt-1 text-xs text-red-600">{errors.color}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">
                              Peso (kg)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              id="peso"
                              name="peso"
                              value={formData.peso}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent ${
                                errors.peso ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="25.5"
                            />
                            {errors.peso && (
                              <p className="mt-1 text-xs text-red-600">{errors.peso}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="estatura" className="block text-sm font-medium text-gray-700 mb-1">
                              Estatura (m)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              id="estatura"
                              name="estatura"
                              value={formData.estatura}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent ${
                                errors.estatura ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="0.65"
                            />
                            {errors.estatura && (
                              <p className="mt-1 text-xs text-red-600">{errors.estatura}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                          </label>
                          <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent ${
                              errors.descripcion ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Describe la personalidad, comportamiento y características especiales de la mascota..."
                          />
                          {errors.descripcion && (
                            <p className="mt-1 text-xs text-red-600">{errors.descripcion}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div>
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold text-gray-900 mb-2">{pet?.nombre}</h3>
                          <p className="text-sm text-gray-600">{pet?.raza} • {pet?.categoria?.nombre}</p>
                        </div>

                        <label htmlFor="nuevoEstado" className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <select
                          id="nuevoEstado"
                          name="nuevoEstado"
                          value={formData.nuevoEstado}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
                        >
                          <option value="DISPONIBLE">Disponible</option>
                          <option value="EN_PROCESO_ADOPCION">En proceso de adopción</option>
                          <option value="ADOPTADO">Adoptado</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-[#ff6900] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"
                        />
                      ) : (
                        mode === 'create' ? 'Registrar Mascota' : 'Actualizar Estado'
                      )}
                    </motion.button>
                  </div>
                </form>
              </DialogPanel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default PetModal;