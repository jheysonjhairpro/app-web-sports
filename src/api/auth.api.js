import { http } from './httpClient';

// POST {{baseUrl}}/auth/login
// body:      { correo, password }
// respuesta: { accessToken, refreshToken, usuario: { id, rolId, nombre, correo, telefono, fotoUrl, activo, rol, ... } }
export async function login({ correo, password }) {
  const { data } = await http.post('/auth/login', { correo, password });
  return data;
}
