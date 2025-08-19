import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (correo, password) => api.post('/auth/login', { correo, password }),
  registerAdopter: (userData) => api.post('/auth/register/adopter', userData),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (userData) => api.post('/users', userData),
  update: (userId, userData) => api.put(`/users/${userId}`, userData),
  delete: (userId) => api.delete(`/users/${userId}`),
};

export const petsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return api.get(`/pets?${params.toString()}`);
  },
  getById: (id) => api.get(`/pets/${id}`),
  create: (petData) => api.post('/pets', petData),
  update: (id, updateData) => api.put(`/pets/${id}`, updateData),
};

export const adoptionsAPI = {
  create: (adoptionData) => api.post('/adoptions', adoptionData),
  complete: (id) => api.put(`/adoptions/${id}/complete`),
  getByUser: (userId) => api.get(`/adoptions/${userId}`),
  getMyAdoptions: () => api.get('/adoptions/my-adoptions'),
};

export const adoptersAPI = {
  getAll: () => api.get('/adopters'),
  getByEmail: (correo) => api.get(`/adopters/by-email/${correo}`),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (categoryData) => api.post('/categories', categoryData),
};

export const rolesAPI = {
  getAll: () => api.get('/roles'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (roleData) => api.post('/roles', roleData),
  update: (id, roleData) => api.put(`/roles/${id}`, roleData),
  delete: (id) => api.delete(`/roles/${id}`),
};

export default api;