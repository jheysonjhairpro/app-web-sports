
const KEYS = ['data', 'items', 'usuarios', 'results', 'rows', 'records'];

export function extractList(payload, depth = 0) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object' || depth > 2) return [];

  for (const key of KEYS) {
    if (key in payload) {
      const found = extractList(payload[key], depth + 1);
      if (found.length || Array.isArray(payload[key])) return found;
    }
  }
  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

export function extractTotal(payload) {
  const candidates = [
    payload?.total,
    payload?.meta?.total,
    payload?.pagination?.total,
    payload?.data?.total,
    payload?.data?.meta?.total,
  ];
  const n = candidates.find((v) => typeof v === 'number');
  return n ?? null;
}
