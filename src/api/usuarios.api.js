import { http } from './httpClient';
import { cleanParams } from '@/shared/utils/cleanParams';

// GET {{baseUrl}}/usuarios?page=1&limit=20&rol=administrador&q=texto
// Respuesta: { items: [ { id, nombre, correo, telefono, fotoUrl, activo, createdAt, rol: { nombre } } ], ... }
export async function listarUsuarios({ page = 1, limit = 20, rol, q } = {}) {
  const { data } = await http.get('/usuarios', { params: cleanParams({ page, limit, rol, q }) });
  return data;
}

// POST {{baseUrl}}/usuarios   [Super] Crear usuario administrador
// body: { nombre, correo, telefono, password, rol: "administrador" }
export async function crearUsuarioAdministrador({ nombre, correo, telefono, password }) {
  const { data } = await http.post('/usuarios', { nombre, correo, telefono, password, rol: 'administrador' });
  return data;
}

// PATCH {{baseUrl}}/usuarios/:id   [Super] Activar / desactivar usuario
// body: { activo: false }
export async function cambiarEstadoUsuario(id, activo) {
  const { data } = await http.patch(`/usuarios/${id}`, { activo });
  return data;
}
