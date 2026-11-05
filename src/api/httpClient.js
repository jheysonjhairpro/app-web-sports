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
  async (error) => {
    const originalRequest = error.config;
    const apiError = normalizeApiError(error);

    // Si el error es 401 y no se ha intentado refrescar esta petición
    if (apiError.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefresh();

        // Si no hay refresh token guardado, borramos todo y notificamos
        if (!refreshToken) {
          tokenStorage.clear();
          window.dispatchEvent(new Event('auth:expired'));
          return Promise.reject(apiError);
        }

        // Petición directa al backend para obtener nuevo token
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        // Guardamos el nuevo accessToken (y nuevo refreshToken si la API devuelve uno nuevo)
        tokenStorage.setSession({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || refreshToken,
        });

        // Actualizamos el header de la petición que había fallado y la reintentamos
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return http(originalRequest);
      } catch (refreshError) {
        // Si el refreshToken también expiró o falló la renovación
        tokenStorage.clear();
        window.dispatchEvent(new Event('auth:expired'));
        return Promise.reject(normalizeApiError(refreshError));
      }
    }

    return Promise.reject(apiError);
  }
);