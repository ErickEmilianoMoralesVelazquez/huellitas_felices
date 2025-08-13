import React, { useMemo, useState } from "react";
import {
  User,
  Heart,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  PawPrint,
  Clock,
  CheckCircle2,
  Sparkles,
  LogOut,
} from "lucide-react";

/* ------- Helpers y datos demo (sin backend) ------- */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

const SAMPLE_USER = {
  id: "u1",
  name: "Erick Velázquez",
  email: "erick@example.com",
  phone: "+52 55 1234 5678",
  address: "Av. Siempre Viva 742, CDMX",
};

const SAMPLE_PETS = [
  {
    id: "p2",
    image:
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1200&auto=format&fit=crop",
    name: "Milo",
    breed: "Siames",
    category: "Gato",
    color: "Crema",
    weight: 4.2,
    height: 0.25,
    description: "Tranquilo, perfecto para departamento.",
    intakeDate: "2025-06-10",
    status: "En proceso de adopción",
    adopterId: "u1",
    processStartedAt: "2025-08-10",
  },
  {
    id: "p2",
    image:
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1200&auto=format&fit=crop",
    name: "Milo",
    breed: "Siames",
    category: "Gato",
    color: "Crema",
    weight: 4.2,
    height: 0.25,
    description: "Tranquilo, perfecto para departamento.",
    intakeDate: "2025-06-10",
    status: "En proceso de adopción",
    adopterId: "u1",
    processStartedAt: "2025-08-10",
  },
  {
    id: "p2",
    image:
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1200&auto=format&fit=crop",
    name: "Milo",
    breed: "Siames",
    category: "Gato",
    color: "Crema",
    weight: 4.2,
    height: 0.25,
    description: "Tranquilo, perfecto para departamento.",
    intakeDate: "2025-06-10",
    status: "En proceso de adopción",
    adopterId: "u1",
    processStartedAt: "2025-08-10",
  },
  {
    id: "p2",
    image:
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1200&auto=format&fit=crop",
    name: "Milo",
    breed: "Siames",
    category: "Gato",
    color: "Crema",
    weight: 4.2,
    height: 0.25,
    description: "Tranquilo, perfecto para departamento.",
    intakeDate: "2025-06-10",
    status: "En proceso de adopción",
    adopterId: "u1",
    processStartedAt: "2025-08-10",
  },
  {
    id: "p3",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop",
    name: "Kiwi",
    breed: "Cotorra",
    category: "Pájaro",
    color: "Verde",
    weight: 0.3,
    height: 0.12,
    description: "Canta por las mañanas y es muy curioso.",
    intakeDate: "2025-05-15",
    status: "Adoptado",
    adopterId: "u1",
    adoptionDate: "2025-07-20",
  },
];

export default function AdopterProfile() {
  const [currentUser] = useState(SAMPLE_USER);
  const [pets] = useState(SAMPLE_PETS);
  const [tab, setTab] = useState("profile");

  const userPets = useMemo(
    () => pets.filter((p) => p.adopterId === currentUser.id),
    [pets, currentUser.id]
  );
  const adoptedPets = useMemo(
    () => userPets.filter((p) => p.status === "Adoptado"),
    [userPets]
  );
  const inProcessPets = useMemo(
    () => userPets.filter((p) => p.status === "En proceso de adopción"),
    [userPets]
  );

  function handleLogout() {
    // Aquí haces tu lógica real de logout (limpiar storage, navegar, etc.)
    alert("Sesión cerrada (demo).");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* HERO con fondo degradado + avatar sobrepuesto */}
        <div className="relative mb-16">
          <div className="h-36 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-lg sm:h-40 md:h-44" />
          <div className="absolute -bottom-10 left-6 flex items-end gap-4 sm:left-8">
            {/* Avatar */}
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-xl sm:h-28 sm:w-28">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                {getInitials(currentUser.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-green-500">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Nombre + badges */}
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-white mb-5 sm:text-3xl">
                {currentUser.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  <Award className="h-3 w-3" />
                  Adoptador verificado
                </span>
                {adoptedPets.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    <Sparkles className="h-3 w-3" />
                    {adoptedPets.length} adopción
                    {adoptedPets.length > 1 ? "es" : ""} exitosa
                    {adoptedPets.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {userPets.length}
            </div>
            <div className="text-sm font-medium text-blue-700">
              Total de adopciones
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-5 text-center">
            <div className="text-3xl font-bold text-green-600">
              {adoptedPets.length}
            </div>
            <div className="text-sm font-medium text-green-700">
              Completadas
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-5 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {inProcessPets.length}
            </div>
            <div className="text-sm font-medium text-purple-700">
              En proceso
            </div>
          </div>
        </section>

        {/* Tabs simples (Tailwind) */}
        <div className="mb-8 grid grid-cols-2 rounded-xl bg-white p-1 shadow-sm">
          <button
            onClick={() => setTab("profile")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
              tab === "profile"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <User className="h-4 w-4" />
            Mi información
          </button>
          <button
            onClick={() => setTab("adoptions")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
              tab === "adoptions"
                ? "bg-purple-50 text-purple-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Heart className="h-4 w-4" />
            Mis adopciones
            {userPets.length > 0 && (
              <span className="ml-1 inline-flex min-w-6 items-center justify-center rounded-full bg-purple-100 px-2 text-xs font-medium text-purple-700">
                {userPets.length}
              </span>
            )}
          </button>
        </div>

        {/* Contenido: Perfil */}
        {tab === "profile" && (
          <section className="space-y-6">
            <div className="rounded-2xl border-0 bg-white shadow-lg">
              <div className="p-8">
                <h2 className="mb-6 flex items-center text-2xl font-bold text-gray-900">
                  <User className="mr-2 h-6 w-6 text-blue-600" />
                  Información de contacto
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex items-center gap-4 rounded-xl bg-blue-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium text-blue-600">
                        Correo electrónico
                      </p>
                      <p className="font-semibold text-gray-900">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl bg-green-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium text-green-600">
                        Teléfono
                      </p>
                      <p className="font-semibold text-gray-900">
                        {currentUser.phone}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex items-start gap-4 rounded-xl bg-orange-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium text-orange-600">
                        Dirección
                      </p>
                      <p className="font-semibold text-gray-900">
                        {currentUser.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjetas informativas */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
                <div className="p-6 text-center">
                  <Award className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                  <h3 className="mb-2 text-lg font-bold text-blue-900">
                    Adoptador verificado
                  </h3>
                  <p className="text-sm text-blue-700">
                    Tu perfil ha sido verificado y estás listo para adoptar
                    mascotas.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
                <div className="p-6 text-center">
                  <PawPrint className="mx-auto mb-4 h-12 w-12 text-purple-600" />
                  <h3 className="mb-2 text-lg font-bold text-purple-900">
                    Miembro desde
                  </h3>
                  <p className="text-sm text-purple-700">
                    Enero 2024 • Adoptador activo
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contenido: Adopciones */}
        {tab === "adoptions" && (
          <section className="space-y-8">
            {userPets.length === 0 ? (
              <div className="rounded-2xl border-0 bg-white shadow-lg">
                <div className="p-12 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                    <Heart className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-800">
                    Aún no tienes adopciones
                  </h3>
                  <p className="mx-auto max-w-md text-gray-600">
                    ¡Es hora de encontrar tu compañero perfecto! Explora el
                    catálogo y encuentra la mascota ideal para ti.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* En proceso */}
                {inProcessPets.length > 0 && (
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Adopciones en proceso
                      </h2>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        {inProcessPets.length}
                      </span>
                    </div>

                    {/* SCROLLER */}
                    <div className="overflow-x-auto">
                      <div className="flex gap-6 snap-x snap-mandatory">
                        {inProcessPets.map((pet) => (
                          <div
                            key={pet.id}
                            className="snap-start w-80 md:w-96 shrink-0"
                          >
                            <div className="overflow-hidden rounded-2xl border-0 bg-white shadow-lg transition hover:shadow-xl">
                              <div className="relative">
                                <img
                                  src={pet.image || "/placeholder.svg"}
                                  alt={pet.name}
                                  className="h-48 w-full object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-medium text-white shadow">
                                    <Clock className="h-3 w-3" />
                                    En proceso
                                  </span>
                                </div>
                                <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 backdrop-blur">
                                  <span className="text-sm font-medium text-gray-800">
                                    {pet.category}
                                  </span>
                                </div>
                              </div>
                              <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                      {pet.name}
                                    </h3>
                                    <p className="text-gray-600">{pet.breed}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      Peso
                                    </p>
                                    <p className="font-semibold">
                                      {pet.weight} kg
                                    </p>
                                  </div>
                                </div>
                                <p className="mb-4 text-sm text-gray-700">
                                  {pet.description}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center text-yellow-700">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    Proceso iniciado
                                  </div>
                                  <span className="font-medium text-yellow-700">
                                    Esperando confirmación
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Completadas */}
                {adoptedPets.length > 0 && (
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Adopciones completadas
                      </h2>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {adoptedPets.length}
                      </span>
                    </div>

                    {/* SCROLLER */}
                    <div className="overflow-x-auto">
                      <div className="flex gap-6 snap-x snap-mandatory">
                        {adoptedPets.map((pet) => (
                          <div
                            key={pet.id}
                            className="snap-start w-80 md:w-96 shrink-0"
                          >
                            <div className="overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transition hover:shadow-xl">
                              <div className="relative">
                                <img
                                  src={pet.image || "/placeholder.svg"}
                                  alt={pet.name}
                                  className="h-48 w-full object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white shadow">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Adoptado
                                  </span>
                                </div>
                                <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 backdrop-blur">
                                  <span className="text-sm font-medium text-gray-800">
                                    {pet.category}
                                  </span>
                                </div>
                                <div className="absolute top-4 left-4">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                                    <Heart className="h-4 w-4 fill-current text-white" />
                                  </div>
                                </div>
                              </div>
                              <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                      {pet.name}
                                    </h3>
                                    <p className="text-gray-600">{pet.breed}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      Peso
                                    </p>
                                    <p className="font-semibold">
                                      {pet.weight} kg
                                    </p>
                                  </div>
                                </div>
                                <p className="mb-4 text-sm text-gray-700">
                                  {pet.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-green-700">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    {pet.adoptionDate && (
                                      <span>
                                        Adoptado el{" "}
                                        {new Date(
                                          pet.adoptionDate
                                        ).toLocaleDateString("es-MX")}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Sparkles className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                      ¡Familia feliz!
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
