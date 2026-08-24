import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('bb_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401 && !isRefreshing) {
        // Don't clear localStorage for auth endpoints (login/register) —
        // let the UI handle errors (e.g., show toast with invalid credentials)
        const requestUrl = error.config?.url ?? '';
        const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
        // Don't clear localStorage for mock tokens (dev quick-login feature)
        const isMockToken = (localStorage.getItem('bb_token') ?? '').startsWith('mock-jwt-token-');

        if (!isAuthEndpoint && !isMockToken) {
          isRefreshing = true;
          localStorage.removeItem('bb_token');
          localStorage.removeItem('bb_user');
          if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/auth')) {
            window.location.href = '/';
          }
          isRefreshing = false;
        }
      }

      if (status === 429) {
        const retryAfter = error.response.headers?.['retry-after'];
        const seconds = retryAfter ? parseInt(retryAfter, 10) : 60;
        console.warn(`Rate limited. Try again in ${seconds}s.`);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
