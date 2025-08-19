import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Eye, User, Phone, MapPin, Calendar } from 'lucide-react';
import { getAllAdoptions, completeAdoption } from '../../lib/api';
import { toast } from 'react-hot-toast';

const AdoptionsManagement = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      const response = await getAllAdoptions();
      setAdoptions(response || []);
    } catch (error) {
      console.error('Error fetching adoptions:', error);
      toast.error('Error al cargar las adopciones');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAdoption = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres completar esta adopción?')) {
      try {
        await completeAdoption(id);
        toast.success('Adopción completada exitosamente');
        fetchAdoptions(); // Recargar la lista
      } catch (error) {
        console.error('Error completing adoption:', error);
        toast.error('Error al completar la adopción');
      }
    }
  };

  const handleViewDetails = (adoption) => {
    setSelectedAdoption(adoption);
    setShowDetailsModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'COMPLETADO':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETADO':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'COMPLETADO':
        return 'Completado';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestión de Adopciones
        </h1>
        <p className="text-gray-600">
          Administra y supervisa todas las solicitudes de adopción
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-[#ff6900] border-t-transparent rounded-full"
          />
        </div>
      ) : adoptions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay solicitudes de adopción
          </h3>
          <p className="text-gray-600">
            Cuando se registren solicitudes aparecerán aquí
          </p>
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mascota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adoptador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Solicitud
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adoptions.map((adoption) => (
                  <motion.tr
                    key={adoption.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#ffd6a7] to-[#ff6900] flex items-center justify-center">
                            <span className="text-sm">🐾</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {adoption.pet?.nombre || 'Mascota'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {adoption.pet?.raza || 'Sin raza'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {adoption.adopter?.nombre || 'Adoptador'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {adoption.adopter?.correo || 'Sin email'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(adoption.fechaSolicitud).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(adoption.estado)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(adoption.estado)}`}>
                          {getStatusText(adoption.estado)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewDetails(adoption)}
                          className="text-[#ff6900] hover:text-orange-600 p-1"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </motion.button>
                        {adoption.estado === 'PENDIENTE' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCompleteAdoption(adoption.id)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Completar adopción"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {showDetailsModal && selectedAdoption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles de la Adopción
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-500 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Información de la mascota */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  🐾 Información de la Mascota
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nombre:</span>
                    <span className="ml-2 text-gray-900">{selectedAdoption.pet?.nombre || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Raza:</span>
                    <span className="ml-2 text-gray-900">{selectedAdoption.pet?.raza || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Categoría:</span>
                    <span className="ml-2 text-gray-900">{selectedAdoption.pet?.categoria?.nombre || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Color:</span>
                    <span className="ml-2 text-gray-900">{selectedAdoption.pet?.color || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Información del adoptador */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Adoptador
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nombre:</span>
                    <span className="ml-2 text-gray-900">{selectedAdoption.adopter?.nombre || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{selectedAdoption.adopter?.correo || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Teléfono:</span>
                    <span className="ml-2 text-gray-900">{selectedAdoption.adopter?.telefono || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Dirección:</span>
                    <span className="ml-2 text-gray-900">{selectedAdoption.adopter?.direccion || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Información de la adopción */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Información de la Adopción
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Fecha de solicitud:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(selectedAdoption.fechaSolicitud).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estado:</span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedAdoption.estado)}`}>
                      {getStatusText(selectedAdoption.estado)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Motivo de adopción:</span>
                    <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                      <p className="text-gray-900">{selectedAdoption.motivoAdopcion}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              {selectedAdoption.estado === 'PENDIENTE' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      handleCompleteAdoption(selectedAdoption.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Completar Adopción
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdoptionsManagement;