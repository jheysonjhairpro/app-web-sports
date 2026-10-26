import { http } from './httpClient';
import { cleanParams } from '@/shared/utils/cleanParams';

// Arma un FormData con los campos que tengan valor (los vacíos no se envían,
// igual que los checkbox desmarcados en Postman). `foto` se adjunta como archivo.
function toFormData(values) {
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined) return;
    form.append(key, value);
  });
  return form;
}

// GET {{baseUrl}}/complejos?page=1&limit=20&destacado=true&q=&lat=&lng=
// Respuesta: [ { id, nombre, descripcion, direccion, ciudad, latitud, longitud, telefono, fotoUrl,
//                destacado, activo, createdAt, updatedAt, canchasActivas, precioDesde, distanciaKm } ]
export async function listarComplejos({ page = 1, limit = 20, destacado, q, lat, lng } = {}) {
  const { data } = await http.get('/complejos', {
    params: cleanParams({ page, limit, destacado: destacado ? true : undefined, q, lat, lng }),
  });
  return data;
}

// POST {{baseUrl}}/complejos   [Super] form-data: nombre, descripcion, direccion, ciudad,
// latitud, longitud, telefono, destacado, foto (archivo)
export async function crearComplejo(values) {
  const { data } = await http.post('/complejos', toFormData(values));
  return data;
}

// PATCH {{baseUrl}}/complejos/:id   form-data parcial: nombre, telefono, foto, ...
export async function actualizarComplejo(id, values) {
  const { data } = await http.patch(`/complejos/${id}`, toFormData(values));
  return data;
}

// PATCH {{baseUrl}}/complejos/:id   [Super] Marcar como destacado — form-data: destacado=true|false
export async function marcarDestacado(id, destacado) {
  const { data } = await http.patch(`/complejos/${id}`, toFormData({ destacado: String(destacado) }));
  return data;
}

// GET {{baseUrl}}/complejos/:id/administradores   [Super]
export async function listarAdministradoresComplejo(id) {
  const { data } = await http.get(`/complejos/${id}/administradores`);
  return data;
}

// POST {{baseUrl}}/complejos/:id/administradores   [Super]
// SUPUESTO: body JSON { usuarioId }. Si tu Postman usa otro nombre de campo, cámbialo aquí.
export async function asignarAdministradorComplejo(id, usuarioId) {
  const { data } = await http.post(`/complejos/${id}/administradores`, { usuarioId });
  return data;
}

// DELETE {{baseUrl}}/complejos/:id/administradores/:usuarioId   [Super]
export async function quitarAdministradorComplejo(id, usuarioId) {
  const { data } = await http.delete(`/complejos/${id}/administradores/${usuarioId}`);
  return data;
}
