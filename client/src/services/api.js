import axios from 'axios';
import * as localStore from './localStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const API = axios.create({
  baseURL: BASE_URL,
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
  (response) => {
    // If server returned HTML (e.g. Netlify fallback), treat as missing endpoint
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!DOCTYPE html>') || response.data.includes('<html'))
    ) {
      const err = new Error('Static HTML response received instead of JSON');
      err.isHtmlFallback = true;
      return Promise.reject(err);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected route, clean token
      if (
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login'
      ) {
        localStorage.removeItem('saibaba_admin_token');
        localStorage.removeItem('saibaba_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper to execute with fallback when backend is unreachable or not hosted
const callWithFallback = async (networkFn, fallbackFn) => {
  try {
    const res = await networkFn();
    return res;
  } catch (err) {
    // If backend returns a structured application/json error (e.g., 400 Bad Request, 401 Unauthorized with API message)
    if (err.response?.data && typeof err.response.data === 'object' && err.response.data.message) {
      throw err;
    }
    // Otherwise (network error, static HTML, 404 on static hosting), use localStore fallback
    return fallbackFn();
  }
};

// Auth Endpoints
export const authAPI = {
  login: (credentials) =>
    callWithFallback(
      () => API.post('/auth/login', credentials),
      () => localStore.localAuthLogin(credentials)
    ),
  getMe: () =>
    callWithFallback(
      () => API.get('/auth/me'),
      () => localStore.localAuthGetMe()
    ),
};

// Vehicle Endpoints
export const vehicleAPI = {
  getAll: (params) =>
    callWithFallback(
      () => API.get('/vehicles', { params }),
      () => localStore.localGetVehicles(params)
    ),
  getFeatured: (limit = 6) =>
    callWithFallback(
      () => API.get('/vehicles/featured', { params: { limit } }),
      () => localStore.localGetFeatured(limit)
    ),
  getFilters: (type = 'all') =>
    callWithFallback(
      () => API.get('/vehicles/filters', { params: { type } }),
      () => localStore.localGetFilters(type)
    ),
  getById: (id) =>
    callWithFallback(
      () => API.get(`/vehicles/${id}`),
      () => localStore.localGetVehicleById(id)
    ),
  create: (vehicleData) =>
    callWithFallback(
      () => API.post('/vehicles', vehicleData),
      () => localStore.localCreateVehicle(vehicleData)
    ),
  update: (id, vehicleData) =>
    callWithFallback(
      () => API.put(`/vehicles/${id}`, vehicleData),
      () => localStore.localUpdateVehicle(id, vehicleData)
    ),
  delete: (id) =>
    callWithFallback(
      () => API.delete(`/vehicles/${id}`),
      () => localStore.localDeleteVehicle(id)
    ),
  updateStatus: (id, status) =>
    callWithFallback(
      () => API.patch(`/vehicles/${id}/status`, { status }),
      () => localStore.localUpdateStatus(id, status)
    ),
  toggleFeatured: (id) =>
    callWithFallback(
      () => API.patch(`/vehicles/${id}/featured`),
      () => localStore.localToggleFeatured(id)
    ),
};

// Enquiry Endpoints
export const enquiryAPI = {
  create: (data) =>
    callWithFallback(
      () => API.post('/enquiries', data),
      () => localStore.localCreateEnquiry(data)
    ),
  getAll: (params) =>
    callWithFallback(
      () => API.get('/enquiries', { params }),
      () => localStore.localGetEnquiries(params)
    ),
  updateStatus: (id, status) =>
    callWithFallback(
      () => API.patch(`/enquiries/${id}/status`, { status }),
      () => localStore.localUpdateEnquiryStatus(id, status)
    ),
  delete: (id) =>
    callWithFallback(
      () => API.delete(`/enquiries/${id}`),
      () => localStore.localDeleteEnquiry(id)
    ),
};

// Sell Request Endpoints
export const sellRequestAPI = {
  create: (data) =>
    callWithFallback(
      () => API.post('/sell-requests', data),
      () => localStore.localCreateSellRequest(data)
    ),
  getAll: (params) =>
    callWithFallback(
      () => API.get('/sell-requests', { params }),
      () => localStore.localGetSellRequests(params)
    ),
  updateStatus: (id, status) =>
    callWithFallback(
      () => API.patch(`/sell-requests/${id}/status`, { status }),
      () => localStore.localUpdateSellRequestStatus(id, status)
    ),
  delete: (id) =>
    callWithFallback(
      () => API.delete(`/sell-requests/${id}`),
      () => localStore.localDeleteSellRequest(id)
    ),
};

// Stats Endpoints
export const statsAPI = {
  getStats: () =>
    callWithFallback(
      () => API.get('/stats'),
      () => localStore.localGetStats()
    ),
};

// Upload Endpoints
export const uploadAPI = {
  uploadImages: async (formData) => {
    try {
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res;
    } catch {
      // Offline / Netlify static fallback:
      // Convert uploaded image files into optimized, compressed Base64 data URLs
      // so they can be saved directly in localStorage and never expire.
      const files = formData.getAll ? formData.getAll('images') : [];

      const compressImageToBase64 = (file) => {
        return new Promise((resolve) => {
          if (!(file instanceof File)) {
            resolve(
              typeof file === 'string'
                ? file
                : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
            );
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1200;
              const MAX_HEIGHT = 900;
              let { width, height } = img;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height = Math.round((height * MAX_WIDTH) / width);
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width = Math.round((width * MAX_HEIGHT) / height);
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              // Compress to JPEG with 0.8 quality
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
              resolve(compressedDataUrl);
            };
            img.onerror = () => {
              resolve(e.target.result);
            };
            img.src = e.target.result;
          };
          reader.onerror = () => {
            resolve('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');
          };
          reader.readAsDataURL(file);
        });
      };

      const imageUrls = await Promise.all(Array.from(files).map(compressImageToBase64));

      return {
        data: {
          success: true,
          count: imageUrls.length,
          urls: imageUrls,
          primaryUrl: imageUrls[0] || '',
        },
      };
    }
  },
};

export default API;
