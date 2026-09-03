import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('saibaba_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected route, clean token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('saibaba_admin_token');
        localStorage.removeItem('saibaba_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me'),
};

// Vehicle Endpoints
export const vehicleAPI = {
  getAll: (params) => API.get('/vehicles', { params }),
  getFeatured: (limit = 6) => API.get('/vehicles/featured', { params: { limit } }),
  getFilters: (type = 'all') => API.get('/vehicles/filters', { params: { type } }),
  getById: (id) => API.get(`/vehicles/${id}`),
  create: (vehicleData) => API.post('/vehicles', vehicleData),
  update: (id, vehicleData) => API.put(`/vehicles/${id}`, vehicleData),
  delete: (id) => API.delete(`/vehicles/${id}`),
  updateStatus: (id, status) => API.patch(`/vehicles/${id}/status`, { status }),
  toggleFeatured: (id) => API.patch(`/vehicles/${id}/featured`),
};

// Enquiry Endpoints
export const enquiryAPI = {
  create: (data) => API.post('/enquiries', data),
  getAll: (params) => API.get('/enquiries', { params }),
  updateStatus: (id, status) => API.patch(`/enquiries/${id}/status`, { status }),
  delete: (id) => API.delete(`/enquiries/${id}`),
};

// Sell Request Endpoints
export const sellRequestAPI = {
  create: (data) => API.post('/sell-requests', data),
  getAll: (params) => API.get('/sell-requests', { params }),
  updateStatus: (id, status) => API.patch(`/sell-requests/${id}/status`, { status }),
  delete: (id) => API.delete(`/sell-requests/${id}`),
};

// Stats Endpoints
export const statsAPI = {
  getStats: () => API.get('/stats'),
};

// Upload Endpoints
export const uploadAPI = {
  uploadImages: (formData) =>
    API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default API;
