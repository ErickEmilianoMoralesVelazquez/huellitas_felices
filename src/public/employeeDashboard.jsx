import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Settings,
  Calendar,
  Award,
  PawPrint,
  CheckCircle2,
  Clock,
  Heart,
  Weight,
  Ruler,
  Palette,
  FileText,
  Save,
  Eye,
  Edit,
  Sparkles,
} from "lucide-react";
import {
  getAllPets,
  createPet,
  updatePetStatus,
  getAllAdopters,
  isAuthenticated,
} from "../lib/api";

const SAMPLE_USERS = [
  { id: "u1", name: "Ana Pérez" },
  { id: "u2", name: "Carlos Ruiz" },
];

export default function EmployeeDashboard({
  currentUser,
  onAddPet,
  onUpdatePet,
  onCompleteAdoption,
}) {
  const [tab, setTab] = useState("register");
  const [newPet, setNewPet] = useState({
    name: "",
    breed: "",
    category: "Perro",
    color: "",
    weight: "",
    height: "",
    description: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastRegistered, setLastRegistered] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPetDetailsModal, setShowPetDetailsModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [adopters, setAdopters] = useState([]);
  const [selectedAdopterId, setSelectedAdopterId] = useState("");

  const safeUser = currentUser ?? {
    id: "demo-employee",
    name: "Empleado Demo",
    role: "employee",
  };

  const [localPets, setLocalPets] = useState([]);

  // Cargar mascotas y adoptadores del backend
  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar autenticación
        if (!isAuthenticated()) {
          setError("No estás autenticado. Redirigiendo al login...");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
          return;
        }

        setIsLoading(true);
        setError(null);

        // Cargar mascotas y adoptadores en paralelo
        console.log("Cargando datos desde:", import.meta.env.VITE_SERVER_IP);
        const [petsData, adoptersData] = await Promise.all([
          getAllPets(),
          getAllAdopters(),
        ]);

        console.log("Mascotas recibidas:", petsData);
        console.log("Adoptadores recibidos:", adoptersData);

        setLocalPets(petsData || []);
        setAdopters(adoptersData || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        console.error("Detalles del error:", err.details);

        let errorMessage = "Error al cargar los datos.";
        if (err.authError) {
          errorMessage =
            "Sesión expirada. Por favor, inicia sesión nuevamente.";
          // Redirigir al login después de un momento
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage =
            "No se pudo conectar al servidor. Verifica que el backend esté ejecutándose en http://localhost:8080";
        } else if (err.status === 404) {
          errorMessage =
            "Endpoint no encontrado. Verifica que la API esté disponible.";
        } else if (err.status === 500) {
          errorMessage =
            "Error interno del servidor. Contacta al administrador.";
        } else {
          errorMessage = `${err.message}. Verifica la conexión al servidor.`;
        }

        setError(errorMessage);
        setLocalPets([]);
        setAdopters([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const availablePets = useMemo(
    () => localPets.filter((p) => p.estado === "DISPONIBLE"),
    [localPets]
  );
  const inProcessPets = useMemo(
    () => localPets.filter((p) => p.estado === "EN_PROCESO_ADOPCION"),
    [localPets]
  );
  const adoptedPets = useMemo(
    () => localPets.filter((p) => p.estado === "ADOPTADO"),
    [localPets]
  );

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");

  const getStatusColor = (status) => {
    switch (status) {
      case "DISPONIBLE":
        return "bg-green-100 text-green-800 border-green-200";
      case "EN_PROCESO_ADOPCION":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ADOPTADO":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAdopterName = (adoptador) => {
    if (!adoptador) return "-";
    return adoptador.user?.nombre || "Usuario no encontrado";
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Iniciando registro de mascota...");
      console.log("Datos del formulario:", newPet);

      // Validar datos requeridos
      if (
        !newPet.name ||
        !newPet.breed ||
        !newPet.color ||
        !newPet.weight ||
        !newPet.height ||
        !newPet.description
      ) {
        setError("Todos los campos son obligatorios excepto la URL de imagen.");
        return;
      }

      // Validar que peso y estatura sean números válidos
      const peso = parseFloat(newPet.weight);
      const estatura = parseFloat(newPet.height);

      if (isNaN(peso) || peso <= 0) {
        setError("El peso debe ser un número mayor a 0.");
        return;
      }

      if (isNaN(estatura) || estatura <= 0) {
        setError("La estatura debe ser un número mayor a 0.");
        return;
      }

      // Mapear categoría a categoriaId
      const getCategoriaId = (category) => {
        const categorias = {
          Perro: 1,
          Gato: 2,
          Hámster: 3,
          Pájaro: 4,
          Conejo: 5,
          Otro: 6,
        };
        return categorias[category] || 1;
      };

      const petData = {
        nombre: newPet.name.trim(),
        raza: newPet.breed.trim(),
        categoriaId: getCategoriaId(newPet.category),
        color: newPet.color.trim(),
        peso: peso,
        estatura: estatura,
        descripcion: newPet.description.trim(),
      };

      console.log("Datos a enviar al API:", petData);

      // Validar que categoriaId sea válido
      if (
        !petData.categoriaId ||
        petData.categoriaId < 1 ||
        petData.categoriaId > 6
      ) {
        setError("Categoría inválida. Selecciona una categoría válida.");
        return;
      }

      if (onAddPet) {
        const registeredPet = onAddPet(petData);
        setLastRegistered(registeredPet || null);
      } else {
        // Usar la API del backend
        console.log("Llamando a createPet...");
        const registeredPet = await createPet(petData);
        console.log("Respuesta del API:", registeredPet);

        if (registeredPet) {
          setLastRegistered(registeredPet);

          // Recargar la lista de mascotas
          console.log("Recargando lista de mascotas...");
          const updatedPets = await getAllPets();
          setLocalPets(updatedPets || []);
        } else {
          throw new Error(
            "No se recibió respuesta del servidor al registrar la mascota."
          );
        }
      }

      // Limpiar formulario
      setNewPet({
        name: "",
        breed: "",
        category: "Perro",
        color: "",
        weight: "",
        height: "",
        description: "",
        image: "",
      });

      // Mostrar mensaje de éxito
      setSuccessMessage("Mascota registrada exitosamente");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error al registrar mascota:", err);
      console.error("Detalles del error:", err.details);

      let errorMessage = "Error al registrar la mascota.";
      if (err.authError) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
        // Redirigir al login después de un momento
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage =
          "No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.";
      } else if (err.status === 400) {
        errorMessage =
          "Datos inválidos. Verifica que todos los campos estén correctos.";
      } else if (err.status === 500) {
        errorMessage = "Error interno del servidor. Contacta al administrador.";
      } else {
        errorMessage = `${err.message}. Intenta de nuevo.`;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCompleteAdoption(pet) {
    try {
      if (pet.adoptador && onCompleteAdoption) {
        onCompleteAdoption(pet.id, pet.adoptador.id);
        return;
      }

      console.log("Completando adopción para mascota:", pet);

      // Simplemente cambiar el estado de la mascota a ADOPTADO
      await updatePetStatus(pet.id, pet.adoptador?.id || null, "ADOPTADO");

      console.log("Adopción completada exitosamente");

      // Recargar la lista de mascotas
      const updatedPets = await getAllPets();
      setLocalPets(updatedPets || []);

      // Mostrar mensaje de éxito
      setError(null);
      setSuccessMessage("Adopción completada exitosamente");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error al completar adopción:", err);
      console.error("Detalles del error:", err.details);

      let errorMessage = "Error al completar la adopción.";
      if (err.authError) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        errorMessage = `${err.message}. Intenta de nuevo.`;
      }
      setError(errorMessage);
    }
  }

  function handleEditPet(petId) {
    // Obtener la mascota actual
    const currentPet = localPets.find((p) => p.id === petId);
    if (!currentPet) {
      console.error("Mascota no encontrada con ID:", petId);
      setError("Mascota no encontrada.");
      return;
    }

    // Configurar el modal
    setSelectedPet(currentPet);
    setNewStatus(currentPet.estado);
    setSelectedAdopterId(currentPet.adoptador?.id?.toString() || "");
    setShowEditModal(true);
  }

  function handleShowPetDetails(pet) {
    setSelectedPet(pet);
    setShowPetDetailsModal(true);
  }

  async function handleUpdatePetStatus() {
    if (!selectedPet || !newStatus) {
      setError("Selecciona un estado válido.");
      return;
    }

    // Validar que el estado sea diferente al actual
    if (newStatus === selectedPet.estado) {
      setError("El nuevo estado debe ser diferente al actual.");
      return;
    }

    try {
      if (onUpdatePet) {
        onUpdatePet(selectedPet.id, {});
        return;
      }

      console.log(
        "Actualizando mascota:",
        selectedPet.nombre,
        "a estado:",
        newStatus
      );
      console.log("Mascota seleccionada:", selectedPet);

      // Validar que el petId sea un número válido
      const petId = parseInt(selectedPet.id);
      if (isNaN(petId)) {
        setError("ID de mascota inválido.");
        return;
      }

      // Usar la API del backend con la estructura exacta requerida
      const updateData = {
        petId: petId,
        adoptadorId: selectedAdopterId ? parseInt(selectedAdopterId) : 0,
        nuevoEstado: newStatus,
      };

      console.log("Datos de actualización enviados al API:", updateData);
      console.log("URL del endpoint:", `/pets/${selectedPet.id}`);

      await updatePetStatus(selectedPet.id, selectedAdopterId, newStatus);

      console.log("Mascota actualizada exitosamente");

      // Recargar la lista de mascotas
      const updatedPets = await getAllPets();
      setLocalPets(updatedPets || []);

      // Cerrar modal y mostrar mensaje de éxito
      setShowEditModal(false);
      setSelectedPet(null);
      setNewStatus("");
      setSelectedAdopterId("");
      setError(null);
      setSuccessMessage("Estado de mascota actualizado exitosamente");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error al actualizar mascota:", err);
      console.error("Detalles del error:", err.details);
      console.error("Status del error:", err.status);

      let errorMessage = "Error al actualizar la mascota.";
      if (err.authError) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (err.status === 400) {
        errorMessage = "Datos inválidos. Verifica la información enviada.";
      } else if (err.status === 404) {
        errorMessage = "Mascota no encontrada en el servidor.";
      } else if (err.status === 500) {
        errorMessage = "Error interno del servidor. Contacta al administrador.";
      } else {
        errorMessage = `${err.message}. Intenta de nuevo.`;
      }
      setError(errorMessage);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header con avatar y badges */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="relative inline-flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200 border-4 border-white shadow-lg">
              <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-white bg-gradient-to-br from-green-500 to-blue-600">
                {getInitials(safeUser.name)}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 border-2 border-white">
              <Settings className="h-4 w-4 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {safeUser.name}
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 border-blue-200">
              <Award className="h-3 w-3 mr-1" />
              {safeUser.role === "superadmin"
                ? "Superadministrador"
                : "Empleado"}
            </span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 border-green-200">
              <PawPrint className="h-3 w-3 mr-1" />
              Centro de Adopción
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {isLoading ? "..." : availablePets.length}
              </div>
              <div className="text-sm text-green-700 font-medium">
                Disponibles
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {isLoading ? "..." : inProcessPets.length}
              </div>
              <div className="text-sm text-yellow-700 font-medium">
                En Proceso
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {isLoading ? "..." : adoptedPets.length}
              </div>
              <div className="text-sm text-purple-700 font-medium">
                Adoptados
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {isLoading ? "..." : localPets.length}
              </div>
              <div className="text-sm text-blue-700 font-medium">
                Total Registrados
              </div>
            </div>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-6 rounded-2xl border-0 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-green-700 text-sm">{successMessage}</p>
                  </div>
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="text-green-700 hover:text-green-800 text-lg leading-none"
                    aria-label="Cerrar notificación"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 rounded-2xl border-0 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                    <span className="text-red-600 text-sm">⚠</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setError(null);
                        // Recargar mascotas
                        const loadPets = async () => {
                          try {
                            setIsLoading(true);
                            setError(null);
                            const petsData = await getAllPets();
                            setLocalPets(petsData || []);
                          } catch (err) {
                            console.error("Error al recargar mascotas:", err);
                            setError(
                              "Error al recargar las mascotas. Intenta de nuevo."
                            );
                          } finally {
                            setIsLoading(false);
                          }
                        };
                        loadPets();
                      }}
                      className="text-red-700 hover:text-red-800 text-sm font-medium"
                    >
                      Reintentar
                    </button>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-700 hover:text-red-800 text-lg leading-none"
                      aria-label="Cerrar notificación"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs (Tailwind simple) */}
        <div className="w-full">
          <div className="grid w-full grid-cols-2 mb-8 rounded-xl  bg-white p-1 text-sm shadow-sm">
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                tab === "register"
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Registrar Mascota</span>
            </button>

            <button
              type="button"
              onClick={() => setTab("manage")}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                tab === "manage"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Gestionar Mascotas</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 text-xs font-medium text-blue-700">
                {localPets.length}
              </span>
            </button>
          </div>

          {/* Register Tab */}
          {tab === "register" && (
            <div className="space-y-6">
              {/* Alert éxito */}
              {lastRegistered && (
                <div className="rounded-2xl border-0 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-green-900 mb-1">
                          ¡Mascota registrada exitosamente!
                        </h3>
                        <p className="text-green-700">
                          <strong>{lastRegistered.nombre}</strong> ha sido
                          registrada con fecha{" "}
                          <strong>
                            {new Date(
                              lastRegistered.fechaIngreso
                            ).toLocaleDateString("es-MX")}
                          </strong>
                        </p>
                      </div>
                      <button
                        onClick={() => setLastRegistered(null)}
                        className="text-green-700 hover:text-green-800 text-lg leading-none"
                        aria-label="Cerrar notificación"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario */}
              <div className="rounded-2xl border-0 bg-white shadow-lg">
                <div className="p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <PlusCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Registrar Nueva Mascota
                      </h2>
                      <p className="text-gray-600">
                        Completa la información del nuevo animalito
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Nombre */}
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                          <PawPrint className="h-4 w-4 text-gray-500" />
                          Nombre de la mascota *
                        </label>
                        <input
                          id="name"
                          required
                          value={newPet.name}
                          onChange={(e) =>
                            setNewPet({ ...newPet, name: e.target.value })
                          }
                          placeholder="Ej: Buddy, Luna, Max..."
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        />
                      </div>

                      {/* Raza */}
                      <div className="space-y-2">
                        <label
                          htmlFor="breed"
                          className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                          <Award className="h-4 w-4 text-gray-500" />
                          Raza *
                        </label>
                        <input
                          id="breed"
                          required
                          value={newPet.breed}
                          onChange={(e) =>
                            setNewPet({ ...newPet, breed: e.target.value })
                          }
                          placeholder="Ej: Labrador, Siamés, Mestizo..."
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        />
                      </div>

                      {/* Categoría */}
                      <div className="space-y-2">
                        <label
                          htmlFor="category"
                          className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                          <Heart className="h-4 w-4 text-gray-500" />
                          Categoría *
                        </label>
                        <select
                          id="category"
                          value={newPet.category}
                          onChange={(e) =>
                            setNewPet({ ...newPet, category: e.target.value })
                          }
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        >
                          <option value="Perro">🐕 Perro</option>
                          <option value="Gato">🐱 Gato</option>
                          <option value="Hámster">🐹 Hámster</option>
                          <option value="Pájaro">🐦 Pájaro</option>
                          <option value="Conejo">🐰 Conejo</option>
                          <option value="Otro">🐾 Otro</option>
                        </select>
                      </div>

                      {/* Color */}
                      <div className="space-y-2">
                        <label
                          htmlFor="color"
                          className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                          <Palette className="h-4 w-4 text-gray-500" />
                          Color *
                        </label>
                        <input
                          id="color"
                          required
                          value={newPet.color}
                          onChange={(e) =>
                            setNewPet({ ...newPet, color: e.target.value })
                          }
                          placeholder="Ej: Marrón y blanco, Negro, Gris..."
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        />
                      </div>

                      {/* Peso */}
                      <div className="space-y-2">
                        <label
                          htmlFor="weight"
                          className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                          <Weight className="h-4 w-4 text-gray-500" />
                          Peso (kg) *
                        </label>
                        <input
                          id="weight"
                          type="number"
                          step="0.1"
                          min="0.1"
                          required
                          value={newPet.weight}
                          onChange={(e) =>
                            setNewPet({ ...newPet, weight: e.target.value })
                          }
                          placeholder="Ej: 15.5"
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        />
                      </div>

                      {/* Estatura */}
                      <div className="space-y-2">
                        <label
                          htmlFor="height"
                          className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                          <Ruler className="h-4 w-4 text-gray-500" />
                          Estatura (m) *
                        </label>
                        <input
                          id="height"
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          value={newPet.height}
                          onChange={(e) =>
                            setNewPet({ ...newPet, height: e.target.value })
                          }
                          placeholder="Ej: 0.45"
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        />
                      </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                      <label
                        htmlFor="description"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                      >
                        <FileText className="h-4 w-4 text-gray-500" />
                        Descripción de la mascota *
                      </label>
                      <textarea
                        id="description"
                        required
                        rows={4}
                        value={newPet.description}
                        onChange={(e) =>
                          setNewPet({ ...newPet, description: e.target.value })
                        }
                        placeholder="Describe la personalidad, comportamiento y características especiales de la mascota..."
                        className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    {/* URL de imagen (opcional) */}
                    <div className="space-y-2">
                      <label
                        htmlFor="image"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                      >
                        <Sparkles className="h-4 w-4 text-gray-500" />
                        URL de imagen (opcional)
                      </label>
                      <input
                        id="image"
                        type="url"
                        value={newPet.image}
                        onChange={(e) =>
                          setNewPet({ ...newPet, image: e.target.value })
                        }
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    {/* Info automática */}
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                      <h3 className="mb-3 flex items-center font-semibold text-blue-900">
                        <Calendar className="mr-2 h-4 w-4" />
                        Información Automática
                      </h3>
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div>
                          <span className="font-medium text-blue-700">
                            Fecha de ingreso:
                          </span>
                          <span className="ml-2 text-blue-900">
                            {new Date().toLocaleDateString("es-MX")} (Hoy)
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700">
                            Estado inicial:
                          </span>
                          <span className="ml-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 border-green-200">
                            Disponible
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-50 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          Registrando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Registrar Mascota
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Manage Tab */}
          {tab === "manage" && (
            <div className="space-y-6">
              <div className="rounded-2xl border-0 bg-white shadow-lg">
                <div className="p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Eye className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Mascotas Registradas
                        </h2>
                        <p className="text-gray-600">
                          Gestiona y supervisa todas las mascotas del centro
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {isLoading ? (
                      <div className="py-12 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                          <Clock className="h-12 w-12 text-gray-400 animate-spin" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-gray-800">
                          Cargando mascotas...
                        </h3>
                        <p className="text-gray-600">
                          Espera un momento mientras obtenemos la información
                        </p>
                      </div>
                    ) : (
                      <>
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-gray-50 text-left">
                              <th className="px-4 py-3 font-semibold">
                                Mascota
                              </th>
                              <th className="px-4 py-3 font-semibold">Raza</th>
                              <th className="px-4 py-3 font-semibold">
                                Categoría
                              </th>
                              <th className="px-4 py-3 font-semibold">
                                Estado
                              </th>
                              <th className="px-4 py-3 font-semibold">
                                Adoptador
                              </th>
                              <th className="px-4 py-3 font-semibold">
                                Fecha Ingreso
                              </th>
                              <th className="px-4 py-3 font-semibold">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {localPets.map((pet) => (
                              <tr
                                key={pet.id}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => handleShowPetDetails(pet)}
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={pet.image || "/placeholder.svg"}
                                      alt={pet.nombre}
                                      className="hidden md:block h-10 w-10 rounded-full object-cover"
                                    />
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        {pet.nombre}
                                      </div>
                                      <div className="text-gray-500">
                                        {pet.peso} kg • {pet.estatura} m
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-medium">
                                  {pet.raza}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-gray-50">
                                    {pet.categoria?.nombre || "Sin categoría"}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                      pet.estado
                                    )}`}
                                  >
                                    {pet.estado}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  {getAdopterName(pet.adoptador)}
                                </td>
                                <td className="px-4 py-3">
                                  {pet.fechaIngreso
                                    ? new Date(
                                        pet.fechaIngreso
                                      ).toLocaleDateString("es-MX")
                                    : "-"}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    {pet.estado === "EN_PROCESO_ADOPCION" && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCompleteAdoption(pet);
                                        }}
                                        className="inline-flex items-center gap-1 rounded-md bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
                                      >
                                        <CheckCircle2 className="h-3 w-3" />
                                        Completar
                                      </button>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditPet(pet.id);
                                      }}
                                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                      <Edit className="h-3 w-3" />
                                      Editar
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {localPets.length === 0 && !isLoading && (
                          <div className="py-12 text-center">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                              <PawPrint className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">
                              No hay mascotas registradas
                            </h3>
                            <p className="text-gray-600">
                              Comienza registrando la primera mascota del centro
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edición */}
      <AnimatePresence>
        {showEditModal && selectedPet && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-200"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Editar Estado de Mascota
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPet(null);
                    setNewStatus("");
                    setSelectedAdopterId("");
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={selectedPet.image || "/placeholder.svg"}
                    alt={selectedPet.nombre}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {selectedPet.nombre}
                    </h4>
                    <p className="text-sm text-gray-500">{selectedPet.raza}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado Actual
                  </label>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(
                      selectedPet.estado
                    )}`}
                  >
                    {selectedPet.estado}
                  </span>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="newStatus"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nuevo Estado
                  </label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="">Selecciona un estado</option>
                    <option value="DISPONIBLE">DISPONIBLE</option>
                    <option value="EN_PROCESO_ADOPCION">EN PROCESO</option>
                    <option value="ADOPTADO">ADOPTADO</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="adopter"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Adoptador (opcional)
                  </label>
                  <select
                    id="adopter"
                    value={selectedAdopterId}
                    onChange={(e) => setSelectedAdopterId(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="">Sin adoptador</option>
                    {adopters.map((adopter) => (
                      <option key={adopter.id} value={adopter.id}>
                        {adopter.user?.nombre || `Adoptador ${adopter.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPet(null);
                    setNewStatus("");
                    setSelectedAdopterId("");
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    console.log("Botón Actualizar Estado clickeado");
                    console.log("selectedPet:", selectedPet);
                    console.log("newStatus:", newStatus);
                    handleUpdatePetStatus();
                  }}
                  disabled={!newStatus || newStatus === selectedPet.estado}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Actualizar Estado
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Detalles de Mascota */}
      <AnimatePresence>
        {showPetDetailsModal && selectedPet && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-gray-200"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Detalles de la Mascota
                </h3>
                <button
                  onClick={() => {
                    setShowPetDetailsModal(false);
                    setSelectedPet(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Imagen y información básica */}
                <div>
                  <div className="mb-6">
                    <img
                      src={selectedPet.image || "/placeholder.svg"}
                      alt={selectedPet.nombre}
                      className="w-full h-64 object-cover rounded-xl shadow-lg"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedPet.nombre}
                      </h4>
                      <p className="text-lg text-gray-600">
                        {selectedPet.raza}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(
                          selectedPet.estado
                        )}`}
                      >
                        {selectedPet.estado}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información detallada */}
                <div className="space-y-6">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">
                      Información General
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categoría:</span>
                        <span className="font-medium">
                          {selectedPet.categoria?.nombre || "Sin categoría"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium">{selectedPet.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Peso:</span>
                        <span className="font-medium">
                          {selectedPet.peso} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estatura:</span>
                        <span className="font-medium">
                          {selectedPet.estatura} m
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha de ingreso:</span>
                        <span className="font-medium">
                          {selectedPet.fechaIngreso
                            ? new Date(
                                selectedPet.fechaIngreso
                              ).toLocaleDateString("es-MX")
                            : "No disponible"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">
                      Descripción
                    </h5>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedPet.descripcion ||
                        "No hay descripción disponible."}
                    </p>
                  </div>

                  {selectedPet.adoptador && (
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">
                        Información del Adoptador
                      </h5>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nombre:</span>
                            <span className="font-medium">
                              {selectedPet.adoptador.user?.nombre ||
                                "No disponible"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Teléfono:</span>
                            <span className="font-medium">
                              {selectedPet.adoptador.telefono ||
                                "No disponible"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dirección:</span>
                            <span className="font-medium">
                              {selectedPet.adoptador.direccion ||
                                "No disponible"}
                            </span>
                          </div>
                          {selectedPet.fechaAdopcion && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Fecha de adopción:
                              </span>
                              <span className="font-medium">
                                {new Date(
                                  selectedPet.fechaAdopcion
                                ).toLocaleDateString("es-MX")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    setShowPetDetailsModal(false);
                    setSelectedPet(null);
                  }}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
