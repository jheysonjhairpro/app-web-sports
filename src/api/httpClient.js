import axios from 'axios';
import { tokenStorage } from '@/shared/utils/tokenStorage';
import { normalizeApiError } from '@/shared/utils/apiError';

// Un único cliente HTTP para toda la app.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
});

// Adjunta el token en cada request (equivale a la pestaña Authorization de Postman).
http.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normaliza errores y avisa a la app si la sesión expiró.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = normalizeApiError(error);
    if (apiError.status === 401) {
      tokenStorage.clear();
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(apiError);
  }
);
