import { useQuery } from '@tanstack/react-query';
import { obtenerDashboardGlobal } from '@/api/reportes.api';

export function useDashboardGlobal() {
  return useQuery({ queryKey: ['dashboard-global'], queryFn: obtenerDashboardGlobal });
}
