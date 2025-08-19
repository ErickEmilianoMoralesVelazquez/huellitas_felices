// src/lib/api.js
const BASE_URL = import.meta.env.VITE_SERVER_IP?.replace(/\/+$/, "") || "http://localhost:8080";

console.log("BASE_URL configurada:", BASE_URL);

// Funciones para manejar cookies
function setCookie(name, value, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Función para obtener el token de autenticación
function getAuthToken() {
  return getCookie('authToken');
}

async function api(path, { method = "GET", body, headers } = {}) {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  console.log(`API Call: ${method} ${url}`);
  
  // Obtener el token de autenticación
  const token = getAuthToken();
  
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...(headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`Response status: ${res.status}`);
    
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json().catch(() => ({})) : await res.text();

    console.log(`Response data:`, data);

    if (!res.ok) {
      // Manejo especial para errores de autenticación
      if (res.status === 403) {
        // Token inválido o expirado, eliminar de cookies
        deleteCookie('authToken');
        console.log("Token inválido, eliminado de cookies");
        
        const err = new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        err.status = 403;
        err.authError = true;
        throw err;
      }
      
      // intenta leer mensaje/errores de validación
      const serverMsg =
        (isJson && (data?.message || data?.error || data?.mensaje)) ||
        (typeof data === "string" && data) ||
        res.statusText;

      const err = new Error(serverMsg || `Error ${res.status}`);
      err.status = res.status;
      err.details = isJson ? (data?.errors || data?.detalle || data) : undefined;
      throw err;
    }
    return isJson ? data : { raw: data };
  } catch (error) {
    console.error(`API Error for ${method} ${url}:`, error);
    throw error;
  }
}

export const registerAdopter = (payload) =>
  api("/auth/register/adopter", { method: "POST", body: payload });

export const login = async (payload) => {
  const response = await api("/auth/login", { method: "POST", body: payload });
  
  // Guardar el token en las cookies
  if (response.token) {
    setCookie('authToken', response.token, 7); // Guardar por 7 días
    console.log("Token guardado en cookies");
  }
  
  return response;
};

export const logout = () => {
  deleteCookie('authToken');
  console.log("Token eliminado de cookies");
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Función para obtener el perfil del usuario actual
export const getCurrentUser = () => api("/auth/profile");

// Funciones para mascotas
export const getAllPets = () => api("/pets");

export const getPetById = (id) => api(`/pets/${id}`);

export const createPet = (payload) =>
  api("/pets", { method: "POST", body: payload });

export const updatePet = (id, payload) => {
  console.log(`updatePet llamado con ID: ${id}`);
  console.log(`updatePet payload:`, payload);
  return api(`/pets/${id}`, { method: "PUT", body: payload });
};

// Función específica para actualizar el estado de una mascota
export const updatePetStatus = (petId, adoptadorId, nuevoEstado) => {
  console.log(`updatePetStatus llamado con:`, { petId, adoptadorId, nuevoEstado });
  
  const payload = {
    petId: parseInt(petId),
    adoptadorId: adoptadorId ? parseInt(adoptadorId) : null,
    nuevoEstado: nuevoEstado
  };
  
  console.log(`updatePetStatus payload:`, payload);
  return api(`/pets/${petId}`, { method: "PUT", body: payload });
};

// Funciones para adoptadores
export const getAllAdopters = () => api("/adopters");

// Funciones para adopciones
export const createAdoption = (payload) =>
  api("/adoptions", { method: "POST", body: payload });

export const getMyAdoptions = () => api("/adoptions/my-adoptions");

export const getAllAdoptions = () => api("/adoptions");

export const completeAdoption = (id) => 
  api(`/adoptions/${id}/complete`, { method: "PUT" });

// Función específica para completar adopción desde el dashboard de empleados
export const completeAdoptionFromDashboard = (adoptionId) => {
  console.log(`completeAdoptionFromDashboard llamado con ID:`, adoptionId);
  return api(`/adoptions/${adoptionId}/complete`, { method: "PUT" });
};

// Funciones para usuarios (solo superadmin)
export const getAllUsers = () => api("/users");

export const createUser = (payload) =>
  api("/users", { method: "POST", body: payload });

export const updateUser = (userId, payload) =>
  api(`/users/${userId}`, { method: "PUT", body: payload });

export const deleteUser = (userId) =>
  api(`/users/${userId}`, { method: "DELETE" });

// Funciones para categorías
export const getAllCategories = () => api("/categories");

export const createCategory = (payload) =>
  api("/categories", { method: "POST", body: payload });

// Funciones para roles
export const getAllRoles = () => api("/roles");

export const createRole = (payload) =>
  api("/roles", { method: "POST", body: payload });

export const updateRole = (id, payload) =>
  api(`/roles/${id}`, { method: "PUT", body: payload });

export const deleteRole = (id) =>
  api(`/roles/${id}`, { method: "DELETE" });
