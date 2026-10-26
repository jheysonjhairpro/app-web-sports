import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  actualizarComplejo,
  asignarAdministradorComplejo,
  crearComplejo,
  listarAdministradoresComplejo,
  listarComplejos,
  marcarDestacado,
  quitarAdministradorComplejo,
} from '@/api/complejos.api';

export function useComplejos(filters) {
  return useQuery({
    queryKey: ['complejos', filters],
    queryFn: () => listarComplejos(filters),
    placeholderData: keepPreviousData,
  });
}

function useInvalidating(mutationFn, keys = [['complejos']]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => keys.forEach((queryKey) => qc.invalidateQueries({ queryKey })),
  });
}

export const useCrearComplejo = () => useInvalidating(crearComplejo);
export const useActualizarComplejo = () => useInvalidating(({ id, values }) => actualizarComplejo(id, values));
export const useMarcarDestacado = () => useInvalidating(({ id, destacado }) => marcarDestacado(id, destacado));

export function useAdministradoresComplejo(complejoId) {
  return useQuery({
    queryKey: ['complejo-admins', complejoId],
    queryFn: () => listarAdministradoresComplejo(complejoId),
    enabled: Boolean(complejoId),
  });
}

export const useAsignarAdministrador = () =>
  useInvalidating(({ complejoId, usuarioId }) => asignarAdministradorComplejo(complejoId, usuarioId), [['complejo-admins']]);

export const useQuitarAdministrador = () =>
  useInvalidating(({ complejoId, usuarioId }) => quitarAdministradorComplejo(complejoId, usuarioId), [['complejo-admins']]);
