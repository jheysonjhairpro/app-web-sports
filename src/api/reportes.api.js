import { http } from './httpClient';

// GET {{baseUrl}}/reportes/global   [Super] Dashboard global
// Respuesta: { usuarios, usuariosPorRol: [{ rol, total }], complejos, canchas, ingresosTotales }
export async function obtenerDashboardGlobal() {
  const { data } = await http.get('/reportes/global');
  return data;
}
