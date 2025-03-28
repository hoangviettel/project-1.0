import axios from 'axios';
import Cookies from 'js-cookie';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
// Interceptor để thêm token và CSRF token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const csrfToken = localStorage.getItem('csrfToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (csrfToken && ['post', 'put', 'delete'].includes(config.method)) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
}, (error) => Promise.reject(error));
// Interceptor xử lý refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('refreshToken') || '';
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/refresh`, {}, { withCredentials: true });
          localStorage.setItem('accessToken', data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          if (refreshError.response?.status === 403) {
            alert('Session expired. Please log in again.');
          }
          localStorage.removeItem('accessToken');
          localStorage.removeItem('csrfToken');
          Cookies.remove('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        window.location.href = '/login';
      }
    }
    if (error.response?.status === 403) {
      console.error('Forbidden: Possible CSRF token mismatch');
    }
    return Promise.reject(error);
  }
);
export const fetchAllimport_invoices = async ({ limit = 10, page = 1 } = {}) => {
  const response = await api.get('/import_invoices', { params: { limit, page } });
  return response.data;
};
export const fetchimport_invoicesById = async (id) => {
  const response = await api.get(`/import_invoices/${id}`);
  return response.data;
};
export const createimport_invoices = async (import_invoices) => {
  const response = await api.post('/import_invoices', import_invoices);
  return response.data;
};
export const updateimport_invoices = async (id, import_invoices) => {
  const response = await api.put(`/import_invoices/${id}`, import_invoices);
  return response.data;
};
export const deleteimport_invoices = async (id) => {
  const response = await api.delete(`/import_invoices/${id}`);
  return response.data;
};
