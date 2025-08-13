import React, { useMemo, useState } from "react";
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

const SAMPLE_USERS = [
  { id: "u1", name: "Ana Pérez" },
  { id: "u2", name: "Carlos Ruiz" },
];

const SAMPLE_PETS = [
  {
    id: "p1",
    name: "Firu",
    breed: "Labrador",
    category: "Perro",
    color: "Marrón",
    weight: 24.5,
    height: 0.55,
    description: "Juguetón, sociable y muy amigable con niños.",
    status: "Disponible",
    image: "/pets.webp",
    admissionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "p2",
    name: "Michi",
    breed: "Siamés",
    category: "Gato",
    color: "Crema y chocolate",
    weight: 4.2,
    height: 0.28,
    description: "Tranquilo y curioso. Le gusta tomar el sol.",
    status: "En proceso de adopción",
    adopterId: "u1",
    image: "/pets2.webp",
    admissionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: "p3",
    name: "Luna",
    breed: "Mini Lop",
    category: "Conejo",
    color: "Gris perla",
    weight: 2.1,
    height: 0.18,
    description: "Muy tierna y tranquila. Ideal para interiores.",
    status: "Adoptado",
    adopterId: "u2",
    image: "/pets3.webp",
    admissionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
];

export default function EmployeeDashboard({
  pets = [],
  users = [],
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

  const safeUser = currentUser ?? { id: "demo-employee", name: "Empleado Demo", role: "employee" };

  const [localPets, setLocalPets] = useState(pets.length > 0 ? pets : SAMPLE_PETS);
  const localUsers = users.length > 0 ? users : SAMPLE_USERS;

  const availablePets = useMemo(() => localPets.filter((p) => p.status === "Disponible"), [localPets]);
  const inProcessPets = useMemo(() => localPets.filter((p) => p.status === "En proceso de adopción"), [localPets]);
  const adoptedPets = useMemo(() => localPets.filter((p) => p.status === "Adoptado"), [localPets]);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");

  const getStatusColor = (status) => {
    switch (status) {
      case "Disponible":
        return "bg-green-100 text-green-800 border-green-200";
      case "En proceso de adopción":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Adoptado":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAdopterName = (adopterId) => {
    if (!adopterId) return "-";
    const adopter = localUsers.find((u) => u.id === adopterId);
    return adopter?.name || "Usuario no encontrado";
    };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800)); // pequeño delay visual

      const petData = {
        name: newPet.name,
        breed: newPet.breed,
        category: newPet.category,
        color: newPet.color,
        weight: parseFloat(newPet.weight),
        height: parseFloat(newPet.height),
        description: newPet.description,
        status: "Disponible",
        image:
          newPet.image ||
          `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(newPet.name || "Mascota")}`,
      };

      if (onAddPet) {
        const registeredPet = onAddPet(petData);
        setLastRegistered(registeredPet || null);
      } else {
        const newPetObj = {
          id: `p-${Date.now()}`,
          admissionDate: new Date().toISOString(),
          ...petData,
        };
        setLocalPets((prev) => [newPetObj, ...prev]);
        setLastRegistered(newPetObj);
      }

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
    } catch (err) {
      console.error("Error al registrar mascota:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCompleteAdoption(pet) {
    if (pet.adopterId && onCompleteAdoption) {
      onCompleteAdoption(pet.id, pet.adopterId);
      return;
    }
    // Fallback demo: marcar como adoptado
    setLocalPets((prev) =>
      prev.map((p) =>
        p.id === pet.id ? { ...p, status: "Adoptado" } : p
      )
    );
  }

  function handleEditPet(petId) {
    if (onUpdatePet) {
      onUpdatePet(petId, {});
      return;
    }
    // Fallback demo: alterna estado entre Disponible y En proceso de adopción
    setLocalPets((prev) =>
      prev.map((p) => {
        if (p.id !== petId) return p;
        const nextStatus = p.status === "Disponible" ? "En proceso de adopción" : "Disponible";
        return { ...p, status: nextStatus };
      })
    );
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

          <h1 className="text-4xl font-bold text-gray-900 mb-2">{safeUser.name}</h1>
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 border-blue-200">
              <Award className="h-3 w-3 mr-1" />
              {safeUser.role === "superadmin" ? "Superadministrador" : "Empleado"}
            </span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 border-green-200">
              <PawPrint className="h-3 w-3 mr-1" />
              Centro de Adopción
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">{availablePets.length}</div>
              <div className="text-sm text-green-700 font-medium">Disponibles</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{inProcessPets.length}</div>
              <div className="text-sm text-yellow-700 font-medium">En Proceso</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">{adoptedPets.length}</div>
              <div className="text-sm text-purple-700 font-medium">Adoptados</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{localPets.length}</div>
              <div className="text-sm text-blue-700 font-medium">Total Registrados</div>
            </div>
          </div>
        </div>

        {/* Tabs (Tailwind simple) */}
        <div className="w-full">
          <div className="grid w-full grid-cols-2 mb-8 rounded-xl  bg-white p-1 text-sm shadow-sm">
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                tab === "register" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Registrar Mascota</span>
            </button>

            <button
              type="button"
              onClick={() => setTab("manage")}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                tab === "manage" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
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
                        <h3 className="text-lg font-bold text-green-900 mb-1">¡Mascota registrada exitosamente!</h3>
                        <p className="text-green-700">
                          <strong>{lastRegistered.name}</strong> ha sido registrada con fecha{" "}
                          <strong>{new Date(lastRegistered.admissionDate).toLocaleDateString("es-MX")}</strong>
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
                      <h2 className="text-2xl font-bold text-gray-900">Registrar Nueva Mascota</h2>
                      <p className="text-gray-600">Completa la información del nuevo animalito</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Nombre */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <PawPrint className="h-4 w-4 text-gray-500" />
                          Nombre de la mascota *
                        </label>
                        <input
                          id="name"
                          required
                          value={newPet.name}
                          onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                          placeholder="Ej: Buddy, Luna, Max..."
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        />
                      </div>

                      {/* Raza */}
                      <div className="space-y-2">
                        <label htmlFor="breed" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Award className="h-4 w-4 text-gray-500" />
                          Raza *
                        </label>
                        <input
                          id="breed"
                          required
                          value={newPet.breed}
                          onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                          placeholder="Ej: Labrador, Siamés, Mestizo..."
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        />
                      </div>

                      {/* Categoría */}
                      <div className="space-y-2">
                        <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Heart className="h-4 w-4 text-gray-500" />
                          Categoría *
                        </label>
                        <select
                          id="category"
                          value={newPet.category}
                          onChange={(e) => setNewPet({ ...newPet, category: e.target.value })}
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
                        <label htmlFor="color" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Palette className="h-4 w-4 text-gray-500" />
                          Color *
                        </label>
                        <input
                          id="color"
                          required
                          value={newPet.color}
                          onChange={(e) => setNewPet({ ...newPet, color: e.target.value })}
                          placeholder="Ej: Marrón y blanco, Negro, Gris..."
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        />
                      </div>

                      {/* Peso */}
                      <div className="space-y-2">
                        <label htmlFor="weight" className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
                          onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })}
                          placeholder="Ej: 15.5"
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        />
                      </div>

                      {/* Estatura */}
                      <div className="space-y-2">
                        <label htmlFor="height" className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
                          onChange={(e) => setNewPet({ ...newPet, height: e.target.value })}
                          placeholder="Ej: 0.45"
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        />
                      </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                      <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <FileText className="h-4 w-4 text-gray-500" />
                        Descripción de la mascota *
                      </label>
                      <textarea
                        id="description"
                        required
                        rows={4}
                        value={newPet.description}
                        onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
                        placeholder="Describe la personalidad, comportamiento y características especiales de la mascota..."
                        className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    {/* URL de imagen (opcional) */}
                    <div className="space-y-2">
                      <label htmlFor="image" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Sparkles className="h-4 w-4 text-gray-500" />
                        URL de imagen (opcional)
                      </label>
                      <input
                        id="image"
                        type="url"
                        value={newPet.image}
                        onChange={(e) => setNewPet({ ...newPet, image: e.target.value })}
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
                          <span className="font-medium text-blue-700">Fecha de ingreso:</span>
                          <span className="ml-2 text-blue-900">
                            {new Date().toLocaleDateString("es-MX")} (Hoy)
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700">Estado inicial:</span>
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
                        <h2 className="text-2xl font-bold text-gray-900">Mascotas Registradas</h2>
                        <p className="text-gray-600">Gestiona y supervisa todas las mascotas del centro</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-4 py-3 font-semibold">Mascota</th>
                          <th className="px-4 py-3 font-semibold">Raza</th>
                          <th className="px-4 py-3 font-semibold">Categoría</th>
                          <th className="px-4 py-3 font-semibold">Estado</th>
                          <th className="px-4 py-3 font-semibold">Adoptador</th>
                          <th className="px-4 py-3 font-semibold">Fecha Ingreso</th>
                          <th className="px-4 py-3 font-semibold">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {localPets.map((pet) => (
                          <tr key={pet.id} className=" hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={pet.image || "/placeholder.svg"}
                                  alt={pet.name}
                                  className="hidden md:block h-10 w-10 rounded-full object-cover"
                                />
                                <div>
                                  <div className="font-semibold text-gray-900">{pet.name}</div>
                                  <div className="text-gray-500">
                                    {pet.weight} kg • {pet.height} m
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-medium">{pet.breed}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-gray-50">
                                {pet.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(pet.status)}`}>
                                {pet.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">{getAdopterName(pet.adopterId)}</td>
                            <td className="px-4 py-3">
                              {pet.admissionDate
                                ? new Date(pet.admissionDate).toLocaleDateString("es-MX")
                                : "-"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {pet.status === "En proceso de adopción" && (
                                  <button
                                    onClick={() => handleCompleteAdoption(pet)}
                                    className="inline-flex items-center gap-1 rounded-md bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                    Completar
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEditPet(pet.id)}
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
                  </div>

                  {localPets.length === 0 && (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                        <PawPrint className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-800">No hay mascotas registradas</h3>
                      <p className="text-gray-600">Comienza registrando la primera mascota del centro</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
