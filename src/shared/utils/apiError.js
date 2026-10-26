export function normalizeApiError(error) {
  if (error.response) {
    const data = error.response.data || {};
    const raw = data.message ?? data.error;
    const message = Array.isArray(raw) ? raw.join('. ') : typeof raw === 'string' ? raw : null;
    return {
      status: error.response.status,
      code: data.code || null,
      message: message || 'Ocurrió un error en el servidor',
      details: data.details || null,
    };
  }
  if (error.code === 'ECONNABORTED') {
    return { status: 0, code: 'TIMEOUT', message: 'La solicitud tardó demasiado', details: null };
  }
  return { status: 0, code: 'NETWORK', message: 'No hay conexión con el servidor', details: null };
}
