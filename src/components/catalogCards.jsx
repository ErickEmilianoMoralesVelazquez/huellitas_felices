// src/components/catalogCards.jsx
import { Button } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createAdoption, isAuthenticated } from "../lib/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CatalogCards = ({
  id,
  nombre,
  raza,
  categoria,
  color,
  peso,
  estatura,
  descripcion,
  estado,
  img,
  fetchPets,
}) => {
  const navigate = useNavigate();
  const [isAdopting, setIsAdopting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [motivoAdopcion, setMotivoAdopcion] = useState("");

  // Determinar si el usuario puede adoptar (por estado de la mascota)
  const canAdopt = estado === "DISPONIBLE";

  const handleAdopt = () => {
    if (!canAdopt) return;

    // ✅ Validar sesión ANTES de abrir el modal
    if (!isAuthenticated()) {
      toast.error(
        "Debes iniciar sesión o crear una cuenta para adoptar una mascota."
      );
      navigate("/login");
      return;
    }

    setShowModal(true);
  };

  const handleSubmitAdoption = async () => {
    if (!motivoAdopcion.trim()) {
      toast.error("Por favor, escribe un motivo para la adopción");
      return;
    }

    // ✅ Revalidar sesión por si el token expiró
    if (!isAuthenticated()) {
      toast.error(
        "Tu sesión ha expirado. Inicia sesión para enviar la solicitud."
      );
      navigate("/login");
      return;
    }

    setIsAdopting(true);
    try {
      await createAdoption({
        petId: id,
        motivoAdopcion: motivoAdopcion.trim(),
      });

      toast.success("¡Solicitud de adopción enviada correctamente!");
      setShowModal(false);
      setMotivoAdopcion("");

      if (typeof fetchPets === "function") {
        await fetchPets(); // Actualizar la lista
      }
    } catch (error) {
      console.error("Error creating adoption:", error);

      // Mensajes claros cuando no hay cuenta o sesión inválida
      if (error?.status === 400 || error?.status === 403 || error?.authError) {
        toast.error(
          "Necesitas una cuenta para adoptar una mascota. Inicia sesión primero."
        );
        navigate("/login");
        return;
      }

      toast.error(error?.message || "Error al enviar la solicitud.");
    } finally {
      setIsAdopting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMotivoAdopcion("");
  };

  // Cerrar modal con Escape y bloquear scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showModal) handleCloseModal();
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const getStatusColor = () => {
    switch (estado) {
      case "DISPONIBLE":
        return "bg-green-500";
      case "EN_PROCESO_ADOPCION":
      case "PENDIENTE":
        return "bg-yellow-500";
      case "ADOPTADO":
        return "bg-gray-500";
      default:
        return "bg-[#ff6900]";
    }
  };

  const getStatusText = () => {
    switch (estado) {
      case "DISPONIBLE":
        return "Disponible";
      case "EN_PROCESO_ADOPCION":
      case "PENDIENTE":
        return "En proceso";
      case "ADOPTADO":
        return "Adoptado";
      default:
        return estado || "Estado";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {/* Imagen */}
      <div className="relative h-64 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={nombre}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#ffd6a7] to-[#ff6900] flex items-center justify-center">
            <span className="text-6xl">🐾</span>
          </div>
        )}

        {/* Estado badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{nombre}</h3>
          <span className="text-sm font-medium text-[#ff6900] bg-orange-100 px-2 py-1 rounded">
            {categoria?.nombre || "Mascota"}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2">{raza}</p>
        <p className="text-sm text-gray-500 mb-2">Color: {color || "N/D"}</p>
        <p className="text-sm text-gray-500 mb-4">
          {peso ?? "N/D"} kg •{" "}
          {typeof estatura === "number" ? `${estatura} m` : "N/D"} de altura
        </p>

        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{descripcion}</p>

        {/* Botón de adoptar */}
        {canAdopt ? (
          <Button
            onClick={handleAdopt}
            disabled={isAdopting}
            className="w-full py-2 bg-[#ff6900] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50"
          >
            {isAdopting ? "Enviando..." : "Solicitar Adopción"}
          </Button>
        ) : (
          <Button
            disabled
            className="w-full py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
          >
            {estado === "ADOPTADO" ? "Ya Adoptado" : "En Proceso"}
          </Button>
        )}
      </div>

      {/* Modal de adopción */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ffd6a7] to-[#ff6900] rounded-full flex items-center justify-center">
                <span className="text-2xl">🐾</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Adoptar a {nombre}
                </h3>
                <p className="text-sm text-gray-600">{raza}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Por qué quieres adoptar a {nombre}?
              </label>
              <textarea
                value={motivoAdopcion}
                onChange={(e) => setMotivoAdopcion(e.target.value)}
                placeholder="Cuéntanos tu motivo para adoptar a esta mascota..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6900] focus:border-transparent resize-none"
                rows="4"
                maxLength="500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {motivoAdopcion.length}/500 caracteres
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitAdoption}
                disabled={isAdopting || !motivoAdopcion.trim()}
                className="flex-1 px-4 py-2 bg-[#ff6900] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdopting ? "Enviando..." : "Enviar Solicitud"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CatalogCards;
