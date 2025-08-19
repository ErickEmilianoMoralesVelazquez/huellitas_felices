import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Heart, Eye } from 'lucide-react';
import { getMyAdoptions } from '../lib/api';
import { toast } from 'react-hot-toast';

const MyAdoptions = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAdoptions();
  }, []);

  const fetchMyAdoptions = async () => {
    try {
      setLoading(true);
      const response = await getMyAdoptions();
      setAdoptions(response || []);
    } catch (error) {
      console.error('Error fetching adoptions:', error);
      toast.error('Error al cargar tus adopciones');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'COMPLETADO':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Heart className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'En revisión';
      case 'COMPLETADO':
        return 'Completada';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETADO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mis Solicitudes de Adopción
        </h1>
        <p className="text-gray-600">
          Aquí puedes ver el estado de todas tus solicitudes de adopción.
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
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes solicitudes de adopción
          </h3>
          <p className="text-gray-600 mb-6">
            ¡Explora nuestro catálogo y encuentra tu compañero perfecto!
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/catalogo'}
            className="inline-flex items-center px-6 py-3 bg-[#ff6900] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            Ver Catálogo
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {adoptions.map((adoption) => (
            <motion.div
              key={adoption.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ffd6a7] to-[#ff6900] rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🐾</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {adoption.pet?.nombre || 'Mascota'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Solicitud enviada el {new Date(adoption.fechaSolicitud).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(adoption.estado)}
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(adoption.estado)}`}>
                    {getStatusText(adoption.estado)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Motivo de adopción:
                </h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {adoption.motivoAdopcion}
                </p>
              </div>

              {adoption.estado === 'COMPLETADO' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="text-sm text-green-700 font-medium">
                      ¡Felicidades! Tu solicitud ha sido aprobada. {adoption.pet?.nombre} ya tiene un hogar contigo.
                    </p>
                  </div>
                </motion.div>
              )}

              {adoption.estado === 'PENDIENTE' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm text-yellow-700">
                      Tu solicitud está siendo revisada. Te contactaremos pronto con más información.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAdoptions;