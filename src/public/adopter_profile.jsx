import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { getCurrentUser, getMyAdoptions, logout } from "../lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

/* ------- Helpers ------- */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function AdopterProfile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [adoptions, setAdoptions] = useState([]);
  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Obtener datos del usuario actual
      const userResponse = await getCurrentUser();
      setCurrentUser(userResponse);

      // Obtener adopciones del usuario
      const adoptionsResponse = await getMyAdoptions();
      setAdoptions(adoptionsResponse || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error al cargar la información del perfil");

      // Si hay error de autenticación, redirigir al login
      if (error.authError) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- LISTAS DERIVADAS ---
  // IMPORTANTE: el back marca la mascota como ADOPTADO aunque la adopción siga SOLICITADA.
  // Para "mascotas ya adoptadas" nos guiamos por el estado del PET, NO por el de la adopción.
  const adoptedPets = useMemo(
    () => adoptions.filter((a) => a?.pet?.estado === "ADOPTADO"),
    [adoptions]
  );

  const inProcessPets = useMemo(
    () =>
      adoptions.filter(
        (a) =>
          a?.pet?.estado !== "ADOPTADO" &&
          (a?.estado === "SOLICITADA" || a?.estado === "PENDIENTE")
      ),
    [adoptions]
  );

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#ff6900] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar el perfil
          </h3>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-[#ff6900] text-white rounded-lg hover:bg-orange-600"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Header con botón de logout */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>

        {/* HERO con fondo degradado + avatar sobrepuesto */}
        <div className="relative mb-16">
          <div className="h-36 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-lg sm:h-40 md:h-44" />
          <div className="absolute -bottom-10 left-6 flex items-end gap-4 sm:left-8">
            {/* Avatar */}
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-xl sm:h-28 sm:w-28">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                {getInitials(currentUser.nombre)}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-green-500">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Nombre + badges */}
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-white mb-5 sm:text-3xl">
                {currentUser.nombre}
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
              {adoptions.length}
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
            {adoptions.length > 0 && (
              <span className="ml-1 inline-flex min-w-6 items-center justify-center rounded-full bg-purple-100 px-2 text-xs font-medium text-purple-700">
                {adoptions.length}
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
                        {currentUser.correo}
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
                        {currentUser.telefono}
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
                        {currentUser.direccion}
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
            {adoptions.length === 0 ? (
              <div className="rounded-2xl border-0 bg-white shadow-lg">
                <div className="p-12 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                    <Heart className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-800">
                    Aún no tienes adopciones
                  </h3>
                  <p className="mx-auto max-w-md text-gray-600 mb-6">
                    ¡Es hora de encontrar tu compañero perfecto! Explora el
                    catálogo y encuentra la mascota ideal para ti.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/catalogo")}
                    className="inline-flex items-center px-6 py-3 bg-[#ff6900] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Explorar Catálogo
                  </motion.button>
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
                        {inProcessPets.map((adoption) => (
                          <div
                            key={adoption.id}
                            className="snap-start w-80 md:w-96 shrink-0"
                          >
                            <div className="overflow-hidden rounded-2xl border-0 bg-white shadow-lg transition hover:shadow-xl">
                              <div className="relative">
                                <div className="h-48 w-full bg-gradient-to-br from-[#ffd6a7] to-[#ff6900] flex items-center justify-center">
                                  <span className="text-6xl">🐾</span>
                                </div>
                                <div className="absolute top-4 right-4">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-medium text-white shadow">
                                    <Clock className="h-3 w-3" />
                                    {adoption.estado === "SOLICITADA"
                                      ? "Solicitada"
                                      : "En proceso"}
                                  </span>
                                </div>
                                <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 backdrop-blur">
                                  <span className="text-sm font-medium text-gray-800">
                                    {adoption.pet?.categoria?.nombre ||
                                      "Mascota"}
                                  </span>
                                </div>
                              </div>
                              <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                      {adoption.pet?.nombre ||
                                        "Nombre no disponible"}
                                    </h3>
                                    <p className="text-gray-600">
                                      {adoption.pet?.raza ||
                                        "Raza no disponible"}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      Peso
                                    </p>
                                    <p className="font-semibold">
                                      {adoption.pet?.peso ?? "N/A"} kg
                                    </p>
                                  </div>
                                </div>
                                <p className="mb-4 text-sm text-gray-700">
                                  {adoption.motivoAdopcion}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center text-yellow-700">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    {/* fecha de solicitud */}
                                    {adoption.fechaSolicitud
                                      ? new Date(
                                          adoption.fechaSolicitud
                                        ).toLocaleDateString("es-ES")
                                      : "N/A"}
                                  </div>
                                  <span className="font-medium text-yellow-700">
                                    {adoption.estado === "SOLICITADA"
                                      ? "Solicitud enviada"
                                      : "Esperando confirmación"}
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

                {/* Completadas → filtra por estado del PET */}
                {adoptedPets.length > 0 && (
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Mascotas adoptadas
                      </h2>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {adoptedPets.length}
                      </span>
                    </div>

                    {/* SCROLLER */}
                    <div className="overflow-x-auto">
                      <div className="flex gap-6 snap-x snap-mandatory">
                        {adoptedPets.map((adoption) => (
                          <div
                            key={adoption.id}
                            className="snap-start w-80 md:w-96 shrink-0"
                          >
                            <div className="overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transition hover:shadow-xl">
                              <div className="relative">
                                <div className="h-48 w-full bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center">
                                  <span className="text-6xl">🐾</span>
                                </div>
                                <div className="absolute top-4 right-4">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white shadow">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Adoptado
                                  </span>
                                </div>
                                <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 backdrop-blur">
                                  <span className="text-sm font-medium text-gray-800">
                                    {adoption.pet?.categoria?.nombre ||
                                      "Mascota"}
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
                                      {adoption.pet?.nombre ||
                                        "Nombre no disponible"}
                                    </h3>
                                    <p className="text-gray-600">
                                      {adoption.pet?.raza ||
                                        "Raza no disponible"}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      Peso
                                    </p>
                                    <p className="font-semibold">
                                      {adoption.pet?.peso ?? "N/A"} kg
                                    </p>
                                  </div>
                                </div>
                                <p className="mb-4 text-sm text-gray-700">
                                  {adoption.motivoAdopcion}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-green-700">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    <span>
                                      Adoptado el{" "}
                                      {(() => {
                                        const f =
                                          adoption?.pet?.fechaAdopcion ||
                                          adoption?.fechaCompletada ||
                                          adoption?.fechaSolicitud;
                                        return f
                                          ? new Date(f).toLocaleDateString(
                                              "es-ES"
                                            )
                                          : "N/A";
                                      })()}
                                    </span>
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
