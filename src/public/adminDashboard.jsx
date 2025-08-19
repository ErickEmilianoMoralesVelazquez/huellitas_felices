import React, { useMemo, useState, useEffect } from "react";
import {
  UserPlus,
  Users,
  Calendar,
  Crown,
  Shield,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Plus,
  Tag,
  Sparkles,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { 
  getAllUsers, 
  createUser,
  deleteUser, 
  getAllCategories, 
  createCategory,
  deleteCategory,
  isAuthenticated,
  getCurrentUser
} from "../lib/api";

/* ========= Datos de ejemplo ========= */
const SAMPLE_USERS = [
  { id: "u0", name: "Sofía Márquez", email: "sofia@huellitas.com", phone: "+52 55 1000 2000", address: "CDMX", role: "superadmin" },
  { id: "u1", name: "Juan Pérez", email: "juan@huellitas.com", phone: "+52 55 1111 2222", address: "Guadalajara", role: "empleado" },
  { id: "u2", name: "Ana López", email: "ana@huellitas.com", phone: "+52 55 3333 4444", address: "Monterrey", role: "adoptador" },
];

const INITIAL_CATEGORIES = [
  { id: "1", name: "Perro", emoji: "🐕", description: "Caninos de todas las razas y tamaños", isActive: true, createdDate: "2024-01-01" },
  { id: "2", name: "Gato", emoji: "🐱", description: "Felinos domésticos de diferentes razas", isActive: true, createdDate: "2024-01-01" },
  { id: "3", name: "Hámster", emoji: "🐹", description: "Pequeños roedores ideales como mascotas", isActive: true, createdDate: "2024-01-01" },
  { id: "4", name: "Pájaro", emoji: "🐦", description: "Aves domésticas de diferentes especies", isActive: true, createdDate: "2024-01-01" },
  { id: "5", name: "Conejo", emoji: "🐰", description: "Conejos domésticos de diferentes razas", isActive: true, createdDate: "2024-01-01" },
];

/* ========= Helpers ========= */
const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

const getRoleColor = (role) => {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "empleado":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "adoptador":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const RoleIcon = ({ role, className = "h-3 w-3 mr-1" }) => {
  if (role === "admin") return <Crown className={className} />;
  if (role === "empleado") return <UserCheck className={className} />;
  if (role === "adoptador") return <Users className={className} />;
  return <Users className={className} />;
};

/* ========= Componente ========= */
export default function DashboardAdmin() {
  const [tab, setTab] = useState("employees");

  // Estados para datos
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Estados para carga y errores
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "empleado", // Por defecto empleado
  });
  const [isSubmittingEmployee, setIsSubmittingEmployee] = useState(false);
  const [lastRegisteredEmployee, setLastRegisteredEmployee] = useState(null);

  const [newCategory, setNewCategory] = useState({ name: "", emoji: "", description: "" });
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [lastRegisteredCategory, setLastRegisteredCategory] = useState(null);

  // Estado para el usuario actual
  const [currentUser, setCurrentUser] = useState({ id: "admin-demo", name: "Cargando...", role: "admin" });

  // Función helper para obtener el rol de un usuario
  const getUserRole = (user) => {
    // Si el rol es un objeto con id y nombre
    if (user?.rol && typeof user.rol === 'object' && user.rol.id) {
      switch (user.rol.id) {
        case 1: return "admin";
        case 2: return "adoptador";
        case 3: return "empleado";
        default: return "adoptador";
      }
    }
    // Fallback para estructura antigua
    return user?.rol || user?.role || "adoptador";
  };

  const employees = useMemo(() => {
    const filtered = users.filter((u) => {
      const role = getUserRole(u);
      return role === "empleado" || role === "admin";
    });
    console.log("Usuarios totales:", users.map(u => ({ 
      id: u.id, 
      nombre: u.nombre || u.name, 
      rol: getUserRole(u),
      rolOriginal: u.rol 
    })));
    console.log("Empleados filtrados:", filtered.map(u => ({ 
      id: u.id, 
      nombre: u.nombre || u.name, 
      rol: getUserRole(u),
      rolOriginal: u.rol 
    })));
    return filtered;
  }, [users]);
  
  const adopters = useMemo(() => {
    const filtered = users.filter((u) => {
      const role = getUserRole(u);
      return role === "adoptador";
    });
    console.log("Adoptadores filtrados:", filtered.map(u => ({ 
      id: u.id, 
      nombre: u.nombre || u.name, 
      rol: getUserRole(u),
      rolOriginal: u.rol 
    })));
    return filtered;
  }, [users]);
  
  const totalCategories = useMemo(() => categories.length, [categories]);



  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Verificar autenticación
        if (!isAuthenticated()) {
          setError("No estás autenticado. Redirigiendo al login...");
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        // Cargar usuario actual, usuarios y categorías en paralelo
        const [currentUserData, usersData, categoriesData] = await Promise.all([
          getCurrentUser(),
          getAllUsers(),
          getAllCategories()
        ]);

        console.log("Usuario actual:", currentUserData);
        console.log("Usuarios cargados (estructura completa):", usersData);
        console.log("Categorías cargadas:", categoriesData);
        
        // Log detallado de la estructura de roles
        if (usersData && Array.isArray(usersData)) {
          console.log("Estructura de roles de usuarios:");
          usersData.forEach((user, index) => {
            console.log(`Usuario ${index + 1}:`, {
              id: user.id,
              nombre: user.nombre,
              rol: user.rol,
              tipoRol: typeof user.rol,
              esObjeto: user.rol && typeof user.rol === 'object'
            });
          });
        }

        setCurrentUser(currentUserData || { id: "admin-demo", name: "Admin", role: "admin" });
        setUsers(usersData || []);
        setCategories(categoriesData || []);
        
      } catch (err) {
        console.error("Error al cargar datos:", err);
        let errorMessage = "Error al cargar los datos.";
        
        if (err.authError) {
          errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage = "No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.";
        } else if (err.status === 404) {
          errorMessage = "Endpoint no encontrado. Verifica que la API esté disponible.";
        } else if (err.status === 500) {
          errorMessage = "Error interno del servidor. Contacta al administrador.";
        } else {
          errorMessage = `${err.message}. Verifica la conexión al servidor.`;
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Función para recargar datos
  const reloadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [currentUserData, usersData, categoriesData] = await Promise.all([
        getCurrentUser(),
        getAllUsers(),
        getAllCategories()
      ]);

      setCurrentUser(currentUserData || { id: "admin-demo", name: "Admin", role: "admin" });
      setUsers(usersData || []);
      setCategories(categoriesData || []);
      
    } catch (err) {
      console.error("Error al recargar datos:", err);
      setError("Error al recargar los datos. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  async function handleSubmitEmployee(e) {
    e.preventDefault();
    setIsSubmittingEmployee(true);
    setError(null);
    
    try {
      // Validar datos requeridos
      if (!newEmployee.name || !newEmployee.email || !newEmployee.password || !newEmployee.phone) {
        setError("Nombre, email, contraseña y teléfono son obligatorios.");
        return;
      }

      // Validar longitud de contraseña
      if (newEmployee.password.length < 10) {
        setError("La contraseña debe tener al menos 10 caracteres.");
        return;
      }

      // Preparar payload para la API
      const userPayload = {
        nombre: newEmployee.name.trim(),
        correo: newEmployee.email.trim(),
        password: newEmployee.password,
        telefono: newEmployee.phone.trim(),
        direccion: newEmployee.address.trim() || "",
        rol: newEmployee.role
      };

      console.log("Registrando empleado:", userPayload);

      const newUser = await createUser(userPayload);
      
      console.log("Empleado registrado exitosamente:", newUser);
      console.log("Tipo de respuesta:", typeof newUser);
      console.log("Estructura de respuesta:", JSON.stringify(newUser, null, 2));
      
      // Verificar que newUser sea válido
      if (!newUser || typeof newUser !== 'object') {
        throw new Error("Respuesta inválida del servidor al crear empleado");
      }
      
      // Actualizar la lista de usuarios
      setUsers(prev => {
        console.log("Lista anterior de usuarios:", prev);
        const updatedList = [newUser, ...prev];
        console.log("Lista actualizada de usuarios:", updatedList);
        return updatedList;
      });
      // Asegurar que lastRegisteredEmployee tenga los campos correctos
      const employeeForDisplay = {
        id: newUser.id || newUser.userId || Date.now(),
        nombre: newUser.nombre || newUser.name || newEmployee.name || "Empleado",
        correo: newUser.correo || newUser.email || newEmployee.email || "",
        telefono: newUser.telefono || newUser.phone || newEmployee.phone || "",
        direccion: newUser.direccion || newUser.address || newEmployee.address || "",
        rol: newUser.rol || newUser.role || newEmployee.role || "empleado"
      };
      
      console.log("Empleado para mostrar:", employeeForDisplay);
      
      // Validar que el objeto sea válido antes de establecerlo
      if (employeeForDisplay && typeof employeeForDisplay === 'object' && employeeForDisplay !== null) {
        // Asegurar que todas las propiedades sean strings
        const safeEmployee = {
          id: employeeForDisplay.id || Date.now(),
          nombre: String(employeeForDisplay.nombre || employeeForDisplay.name || newEmployee.name || "Empleado"),
          correo: String(employeeForDisplay.correo || employeeForDisplay.email || newEmployee.email || ""),
          telefono: String(employeeForDisplay.telefono || employeeForDisplay.phone || newEmployee.phone || ""),
          direccion: String(employeeForDisplay.direccion || employeeForDisplay.address || newEmployee.address || ""),
          rol: String(employeeForDisplay.rol || employeeForDisplay.role || newEmployee.role || "empleado")
        };
        console.log("Empleado seguro para mostrar:", safeEmployee);
        setLastRegisteredEmployee(safeEmployee);
      } else {
        console.error("Objeto de empleado inválido:", employeeForDisplay);
        setLastRegisteredEmployee({
          id: Date.now(),
          nombre: String(newEmployee.name || "Empleado"),
          rol: String(newEmployee.role || "empleado")
        });
      }
      setNewEmployee({ name: "", email: "", password: "", phone: "", address: "", role: "empleado" });
      setSuccessMessage("Empleado registrado exitosamente");
      
      // Recargar datos para asegurar que los contadores estén actualizados
      setTimeout(() => {
        reloadData();
      }, 1000);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error("Error al registrar empleado:", err);
      let errorMessage = "Error al registrar el empleado.";
      
      if (err.authError) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (err.status === 400) {
        errorMessage = "Datos inválidos. Verifica que todos los campos estén correctos.";
      } else if (err.status === 500) {
        errorMessage = "Error interno del servidor. Contacta al administrador.";
      } else {
        errorMessage = `${err.message}. Verifica la conexión al servidor.`;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmittingEmployee(false);
    }
  }

  async function handleSubmitCategory(e) {
    e.preventDefault();
    setIsSubmittingCategory(true);
    setError(null);
    
    try {
      // Validar datos requeridos
      if (!newCategory.name || !newCategory.emoji) {
        setError("Nombre y emoji son obligatorios.");
        return;
      }

      // Preparar payload para la API - concatenar emoji al nombre
      const categoryPayload = {
        nombre: `${newCategory.emoji.trim()} ${newCategory.name.trim()}`,
        descripcion: newCategory.description.trim() || "",
        activo: true
      };

      console.log("Creando categoría:", categoryPayload);

      const newCat = await createCategory(categoryPayload);
      
      console.log("Categoría creada exitosamente:", newCat);
      
      // Actualizar la lista de categorías
      setCategories(prev => [newCat, ...prev]);
      setLastRegisteredCategory(newCat);
      setNewCategory({ name: "", emoji: "", description: "" });
      setSuccessMessage("Categoría creada exitosamente");
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error("Error al crear categoría:", err);
      let errorMessage = "Error al crear la categoría.";
      
      if (err.authError) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (err.status === 400) {
        errorMessage = "Datos inválidos. Verifica que todos los campos estén correctos.";
      } else if (err.status === 500) {
        errorMessage = "Error interno del servidor. Contacta al administrador.";
      } else {
        errorMessage = `${err.message}. Verifica la conexión al servidor.`;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmittingCategory(false);
    }
  }

  async function handleDeleteCategory(categoryId) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      return;
    }
    
    try {
      setError(null);
      console.log("Eliminando categoría con ID:", categoryId);
      
      await deleteCategory(categoryId);
      
      console.log("Categoría eliminada exitosamente");
      
      // Actualizar la lista de categorías
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      setSuccessMessage("Categoría eliminada exitosamente");
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      let errorMessage = "Error al eliminar la categoría.";
      
      if (err.authError) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (err.status === 404) {
        errorMessage = "Categoría no encontrada.";
      } else if (err.status === 500) {
        errorMessage = "Error interno del servidor. Contacta al administrador.";
      } else {
        errorMessage = `${err.message}. Verifica la conexión al servidor.`;
      }
      
      setError(errorMessage);
    }
  }



  async function handleDeleteUser(id) {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      return;
    }
    
    try {
      setError(null);
      console.log("Eliminando usuario con ID:", id);
      
      await deleteUser(id);
      
      console.log("Usuario eliminado exitosamente");
      
      // Actualizar la lista de usuarios
      setUsers(prev => {
        const updatedUsers = prev.filter(u => u.id !== id);
        console.log("Usuario eliminado, lista actualizada:", updatedUsers);
        return updatedUsers;
      });
      setSuccessMessage("Usuario eliminado exitosamente");
      
      // Recargar datos para asegurar que los contadores estén actualizados
      setTimeout(() => {
        reloadData();
      }, 1000);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      let errorMessage = "Error al eliminar el usuario.";
      
      if (err.authError) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (err.status === 404) {
        errorMessage = "Usuario no encontrado.";
      } else if (err.status === 500) {
        errorMessage = "Error interno del servidor. Contacta al administrador.";
      } else {
        errorMessage = `${err.message}. Verifica la conexión al servidor.`;
      }
      
      setError(errorMessage);
    }
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Mensajes de error y éxito */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={reloadData}
                  className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                >
                  Reintentar
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Estado de carga */}
        {isLoading && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 rounded-lg bg-white px-6 py-4 shadow-lg">
              <Clock className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg font-medium text-gray-700">Cargando datos...</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="relative mb-6 inline-block">
            <div className="relative inline-flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg">
              <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 text-2xl font-bold text-white">
                {getInitials(currentUser.nombre || currentUser.name)}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-500">
              <Crown className="h-4 w-4 text-white" />
            </div>
          </div>

          <h1 className="mb-2 text-4xl font-bold text-gray-900">{currentUser.nombre || currentUser.name}</h1>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
              <Crown className="mr-1 h-3 w-3" />
              Superadministrador
            </span>
            <span className="inline-flex items-center rounded-full border border-pink-200 bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800">
              <Shield className="mr-1 h-3 w-3" />
              Control Total
            </span>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-blue-600">{employees.length}</div>
              <div className="text-sm font-medium text-blue-700">Empleados</div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-green-600">{adopters.length}</div>
              <div className="text-sm font-medium text-green-700">Adoptadores</div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-purple-600">{totalCategories}</div>
              <div className="text-sm font-medium text-purple-700">Total Categorías</div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-pink-600">{users.length}</div>
              <div className="text-sm font-medium text-pink-700">Total Usuarios</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 grid w-full grid-cols-3 rounded-xl bg-white p-1 text-sm shadow-sm">
          <button
            type="button"
            onClick={() => setTab("employees")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors ${
              tab === "employees" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Empleados</span>
            <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 text-xs font-medium text-blue-700">
              {employees.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("users")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors ${
              tab === "users" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Todos los Usuarios</span>
            <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 text-xs font-medium text-green-700">
              {users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("categories")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors ${
              tab === "categories" ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Categorías</span>
            <span className="ml-2 inline-flex items-center rounded-full bg-purple-100 px-2 text-xs font-medium text-purple-700">
              {categories.length}
            </span>
          </button>
        </div>

        {/* === Empleados === */}
        {tab === "employees" && (
          <div className="space-y-6">
            {lastRegisteredEmployee && typeof lastRegisteredEmployee === 'object' && lastRegisteredEmployee !== null && (
              <div className="rounded-2xl border-0 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <CheckCircle2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-bold text-blue-900">¡Empleado registrado exitosamente!</h3>
                    </div>
                    <button
                      onClick={() => setLastRegisteredEmployee(null)}
                      className="text-lg leading-none text-blue-600 hover:text-blue-700"
                      aria-label="Cerrar"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-white shadow-lg">
              <div className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Registrar Nuevo Empleado</h2>
                    <p className="text-gray-600">Agrega un nuevo miembro al equipo</p>
                  </div>
                </div>

                <form onSubmit={handleSubmitEmployee} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="emp-name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Users className="h-4 w-4 text-gray-500" />
                        Nombre completo *
                      </label>
                      <input
                        id="emp-name"
                        required
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        placeholder="Ej: Juan Pérez García"
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="emp-email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Mail className="h-4 w-4 text-gray-500" />
                        Correo electrónico *
                      </label>
                      <input
                        id="emp-email"
                        type="email"
                        required
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        placeholder="juan.perez@huellitas.com"
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="emp-password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Shield className="h-4 w-4 text-gray-500" />
                        Contraseña *
                      </label>
                      <input
                        id="emp-password"
                        type="password"
                        required
                        value={newEmployee.password}
                        onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                        placeholder="Mínimo 10 caracteres"
                        minLength={10}
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="emp-phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Phone className="h-4 w-4 text-gray-500" />
                        Teléfono *
                      </label>
                      <input
                        id="emp-phone"
                        type="tel"
                        required
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                        placeholder="+52 55 1234 5678"
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="emp-role" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <UserCheck className="h-4 w-4 text-gray-500" />
                        Rol *
                      </label>
                      <select
                        id="emp-role"
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      >
                        <option value="empleado">👤 Empleado</option>
                        <option value="admin">👑 Administrador</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="emp-address" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      Dirección (opcional)
                    </label>
                    <textarea
                      id="emp-address"
                      rows={3}
                      value={newEmployee.address}
                      onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                      placeholder="Dirección completa del empleado..."
                      className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                    <h3 className="mb-3 flex items-center font-semibold text-blue-900">
                      <Calendar className="mr-2 h-4 w-4" />
                      Información del Sistema
                    </h3>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div>
                        <span className="font-medium text-blue-700">Fecha de registro:</span>
                        <span className="ml-2 text-blue-900">{new Date().toLocaleDateString("es-MX")} (Hoy)</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-700">Estado:</span>
                        <span className="ml-2 inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Activo
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingEmployee}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50"
                  >
                    {isSubmittingEmployee ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Registrar Empleado
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* === Usuarios === */}
        {tab === "users" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white shadow-lg">
              <div className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                    <p className="text-gray-600">Supervisa todos los usuarios del sistema</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 font-semibold">Usuario</th>
                        <th className="px-4 py-3 font-semibold">Rol</th>
                        <th className="px-4 py-3 font-semibold">Contacto</th>
                        <th className="px-4 py-3 font-semibold">Dirección</th>
                        <th className="px-4 py-3 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className=" hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                                {getInitials(user.nombre || user.name)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{user.nombre || user.name}</div>
                                <div className="text-gray-500">{user.correo || user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getRoleColor(getUserRole(user))}`}>
                              <RoleIcon role={getUserRole(user)} />
                              {getUserRole(user) === "admin" ? "Administrador" : getUserRole(user) === "empleado" ? "Empleado" : "Adoptador"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div>{user.telefono || user.phone}</div>
                          </td>
                          <td className="max-w-xs truncate px-4 py-3 text-sm">{user.direccion || user.address}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                                <Edit className="h-3 w-3" />
                                Editar
                              </button>
                              {getUserRole(user) !== "admin" && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Eliminar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {users.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                      <AlertCircle className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-800">Sin usuarios</h3>
                    <p className="text-gray-600">Registra empleados desde la pestaña “Empleados”.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === Categorías === */}
        {tab === "categories" && (
          <div className="space-y-6">
            {lastRegisteredCategory && (
              <div className="rounded-2xl border-0 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <CheckCircle2 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-bold text-purple-900">¡Categoría creada exitosamente!</h3>
                      <p className="text-purple-700">
                        <strong>
                          {lastRegisteredCategory.emoji} {lastRegisteredCategory.nombre || lastRegisteredCategory.name}
                        </strong>{" "}
                        ha sido agregada al sistema
                      </p>
                    </div>
                    <button
                      onClick={() => setLastRegisteredCategory(null)}
                      className="text-lg leading-none text-purple-600 hover:text-purple-700"
                      aria-label="Cerrar"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Form nueva categoría */}
              <div className="rounded-2xl bg-white shadow-lg">
                <div className="p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Plus className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Nueva Categoría</h2>
                      <p className="text-gray-600">Agrega una nueva categoría de mascota</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitCategory} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="cat-name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Tag className="h-4 w-4 text-gray-500" />
                        Nombre de la categoría *
                      </label>
                      <input
                        id="cat-name"
                        required
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        placeholder="Ej: Reptil, Pez, etc."
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="cat-emoji" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Sparkles className="h-4 w-4 text-gray-500" />
                        Emoji *
                      </label>
                      <input
                        id="cat-emoji"
                        required
                        value={newCategory.emoji}
                        onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                        placeholder="🐢"
                        maxLength={2}
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="cat-description" className="text-sm font-medium text-gray-700">
                        Descripción
                      </label>
                      <textarea
                        id="cat-description"
                        rows={3}
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        placeholder="Descripción de la categoría..."
                        className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingCategory}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-purple-600 hover:to-pink-700 disabled:opacity-50"
                    >
                      {isSubmittingCategory ? (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Crear Categoría
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Lista categorías */}
              <div className="rounded-2xl bg-white shadow-lg">
                <div className="p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Tag className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Categorías Existentes</h2>
                      <p className="text-gray-600">Gestiona las categorías del sistema</p>
                    </div>
                  </div>

                  <div className="max-h-96 space-y-3 overflow-y-auto">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{category.nombre || category.name}</h3>
                              <p className="text-sm text-gray-600">{category.descripcion || category.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {categories.length === 0 && (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                        <AlertCircle className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-800">Sin categorías</h3>
                      <p className="text-gray-600">Crea tu primera categoría con el formulario.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
