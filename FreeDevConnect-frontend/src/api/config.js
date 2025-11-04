import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8889/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('🌐 Appel API:', config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('✅ Réponse API:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('❌ Erreur API:', error.response?.status, error.config?.url);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  signup: (userData) => api.post('/auth/signup', userData),
  signin: (credentials) => api.post('/auth/signin', credentials)
};

const projectsService = {
  getAll: (filters = {}) => api.get('/projects', { params: filters }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`)
};

const applicationsService = {
  getByProject: (projectId) => api.get(`/projects/${projectId}/applications`),
  getByFreelancer: () => api.get('/applications/freelancer'),
  create: (applicationData) => api.post('/applications', applicationData),
  update: (id, applicationData) => api.put(`/applications/${id}`, applicationData),
  delete: (id) => api.delete(`/applications/${id}`)
};

const usersService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getFreelancerById: (id) => api.get(`/users/${id}`),
  getClientById: (id) => api.get(`/users/${id}`),
  getAll: (filters = {}) => api.get('/users', { params: filters })
};

export { api, authService, projectsService, applicationsService, usersService };
export default api;
