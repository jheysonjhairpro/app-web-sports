import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { cambiarEstadoUsuario, crearUsuarioAdministrador, listarUsuarios } from '@/api/usuarios.api';

export function useUsuarios(filters) {
  return useQuery({
    queryKey: ['usuarios', filters],
    queryFn: () => listarUsuarios(filters),
    placeholderData: keepPreviousData,
  });
}

export function useCrearAdministrador() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: crearUsuarioAdministrador,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}

export function useCambiarEstadoUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, activo }) => cambiarEstadoUsuario(id, activo),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}
