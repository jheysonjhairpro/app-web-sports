export function rolName(rol) {
  if (!rol) return '';
  if (typeof rol === 'string') return rol;
  return String(rol.nombre ?? rol.name ?? rol.slug ?? '');
}

export function formatRol(rol) {
  const text = rolName(rol).replace(/_/g, ' ').trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '—';
}

export function initials(nombre) {
  return String(nombre ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatMoney(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return '—';
  return `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


