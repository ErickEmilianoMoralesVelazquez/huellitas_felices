import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  HeartIcon, 
  PlusIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { petsAPI, usersAPI } from '../../services/api';

const AdminDashboard = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    pendingAdoptions: 0,
    completedAdoptions: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin()) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const petsResponse = await petsAPI.getAll();
      const pets = petsResponse.data;
      
      const stats = {
        totalPets: pets.length,
        availablePets: pets.filter(p => p.estado === 'DISPONIBLE').length,
        pendingAdoptions: pets.filter(p => p.estado === 'EN_PROCESO_ADOPCION').length,
        completedAdoptions: pets.filter(p => p.estado === 'ADOPTADO').length,
      };

      if (isSuperAdmin()) {
        const usersResponse = await usersAPI.getAll();
        stats.totalUsers = usersResponse.data.length;
      }

      setStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: IconComponent, color = 'bg-[#ff6900]' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-lg`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    </motion.div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Bienvenido, {user?.nombre}. Gestiona las mascotas y adopciones de Huellitas Felices.
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
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total de Mascotas"
                value={stats.totalPets}
                icon={HeartIcon}
              />
              <StatCard
                title="Mascotas Disponibles"
                value={stats.availablePets}
                icon={CheckCircleIcon}
                color="bg-green-500"
              />
              <StatCard
                title="Adopciones Pendientes"
                value={stats.pendingAdoptions}
                icon={ClockIcon}
                color="bg-yellow-500"
              />
              <StatCard
                title="Adopciones Completadas"
                value={stats.completedAdoptions}
                icon={CheckCircleIcon}
                color="bg-blue-500"
              />
              {isSuperAdmin() && (
                <StatCard
                  title="Total de Usuarios"
                  value={stats.totalUsers}
                  icon={UsersIcon}
                  color="bg-purple-500"
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Acciones Rápidas
                  </h2>
                </div>
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/admin/pets'}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#ff6900] text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Registrar Nueva Mascota
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/admin/pets'}
                    className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <HeartIcon className="h-5 w-5" />
                    Gestionar Mascotas
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/admin/adoptions'}
                    className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Ver Solicitudes de Adopción
                  </motion.button>
                  {isSuperAdmin() && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.href = '/admin/users'}
                      className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <UsersIcon className="h-5 w-5" />
                      Gestionar Usuarios
                    </motion.button>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Resumen del Sistema
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Mascotas registradas este mes</span>
                    <span className="font-semibold text-gray-900">--</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Adopciones exitosas este mes</span>
                    <span className="font-semibold text-gray-900">--</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Usuarios registrados</span>
                    <span className="font-semibold text-gray-900">{stats.totalUsers || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Estado del sistema</span>
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Operativo
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;