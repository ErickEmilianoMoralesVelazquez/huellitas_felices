import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { adoptionsAPI } from '../../services/api';

const AdoptionModal = ({ isOpen, onClose, pet }) => {
  const [motivoAdopcion, setMotivoAdopcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adoptionsAPI.create({
        petId: pet.id,
        motivoAdopcion,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMotivoAdopcion('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating adoption request:', error);
      alert('Error al enviar la solicitud. Inténtalo de nuevo.');
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
                    Solicitar Adopción
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 text-center"
                  >
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      ¡Solicitud enviada!
                    </h3>
                    <p className="text-gray-600">
                      Tu solicitud de adopción para {pet?.nombre} ha sido enviada correctamente. 
                      Nos pondremos en contacto contigo pronto.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#ffd6a7] to-[#ff6900] rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🐾</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{pet?.nombre}</h3>
                          <p className="text-sm text-gray-600">{pet?.raza} • {pet?.categoria.nombre}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="motivoAdopcion" className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Por qué quieres adoptar a {pet?.nombre}?
                      </label>
                      <textarea
                        id="motivoAdopcion"
                        value={motivoAdopcion}
                        onChange={(e) => setMotivoAdopcion(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
                        placeholder="Cuéntanos sobre tu experiencia con mascotas, tu hogar, y por qué crees que serías un buen adoptador para esta mascota..."
                      />
                    </div>

                    <div className="flex gap-3">
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
                          'Enviar Solicitud'
                        )}
                      </motion.button>
                    </div>
                  </form>
                )}
              </DialogPanel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AdoptionModal;