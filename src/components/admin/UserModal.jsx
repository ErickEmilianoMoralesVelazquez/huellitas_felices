import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { usersAPI } from '../../services/api';

const UserModal = ({ isOpen, onClose, onSuccess, user, mode, roles }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'EMPLEADO',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        nombre: user.nombre || '',
        correo: user.correo || '',
        password: '',
        rol: user.rol?.nombre || 'EMPLEADO',
      });
    } else {
      setFormData({
        nombre: '',
        correo: '',
        password: '',
        rol: 'EMPLEADO',
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

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

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
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
      const submitData = { ...formData };
      if (mode === 'edit' && !submitData.password) {
        delete submitData.password;
      }

      if (mode === 'create') {
        await usersAPI.create(submitData);
      } else {
        await usersAPI.update(user.id, submitData);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
      if (error.response?.status === 400) {
        setErrors({ submit: 'Ya existe un usuario con este correo electrónico' });
      } else {
        setErrors({ submit: 'Error al guardar usuario. Inténtalo de nuevo.' });
      }
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
              <DialogPanel className="mx-auto max-w-md w-full bg-white rounded-lg shadow-xl">
                <div className="flex items-center justify-between p-6 border-b">
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    {mode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
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
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo
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
                        placeholder="Juan Pérez"
                      />
                      {errors.nombre && (
                        <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent ${
                          errors.correo ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="juan@ejemplo.com"
                      />
                      {errors.correo && (
                        <p className="mt-1 text-xs text-red-600">{errors.correo}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña {mode === 'edit' && '(dejar vacío para mantener actual)'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent ${
                            errors.password ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Mínimo 8 caracteres"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                      </label>
                      <select
                        id="rol"
                        name="rol"
                        value={formData.rol}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
                      >
                        {roles.filter(role => role.nombre !== 'ADOPTADOR').map(role => (
                          <option key={role.id} value={role.nombre}>
                            {role.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
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
                        mode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'
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

export default UserModal;