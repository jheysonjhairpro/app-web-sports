import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import PageHead from '@/shared/components/PageHead';
import { useToast } from '@/shared/components/ToastProvider';
import { extractList, extractTotal } from '@/shared/utils/extractList';
import { formatDate, formatRol, initials, rolName } from '@/shared/utils/format';
import CrearAdminModal from './CrearAdminModal';
import { useCambiarEstadoUsuario, useUsuarios } from './useUsuarios';

// Roles confirmados en el dashboard: usuario, administrador, super_admin.
const ROLES = ['super_admin', 'administrador', 'usuario'];
const COLUMNS = 5;

function SkeletonRows() {
  return Array.from({ length: 6 }, (_, i) => (
    <tr key={i}>
      <td colSpan={COLUMNS}>
        <span className="skeleton" style={{ width: `${55 + ((i * 13) % 35)}%` }} />
      </td>
    </tr>
  ));
}

export default function UsuariosPage() {
  const { usuario: yo, isSuper } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ page: 1, limit: 20, rol: '', q: '' });
  const [showCrear, setShowCrear] = useState(false);
  const { data, isLoading, isError, error, refetch, isFetching } = useUsuarios(filters);
  const cambiar = useCambiarEstadoUsuario();

  // Espera 350 ms después de escribir antes de consultar.
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, q: search.trim(), page: 1 })), 350);
    return () => clearTimeout(t);
  }, [search]);

  // La API responde { items: [...] }; extractList también acepta otras formas.
  const usuarios = extractList(data);
  const total = extractTotal(data);
  const hayMas = total != null ? filters.page * filters.limit < total : usuarios.length >= filters.limit;

  const toggleActivo = (u) => {
    const activo = !u.activo;
    cambiar.mutate(
      { id: u.id, activo },
      {
        onSuccess: () => toast.success(activo ? `${u.nombre} fue activado` : `${u.nombre} fue desactivado`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <>
      <PageHead title="Usuarios" description="Consulta las cuentas registradas y administra su acceso.">
        {isSuper && (
          <button className="btn" onClick={() => setShowCrear(true)}>
            Nuevo administrador
          </button>
        )}
      </PageHead>

      <section className="panel">
        <div className="toolbar">
          <div className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              className="input"
              type="search"
              placeholder="Buscar por nombre o correo"
              aria-label="Buscar usuarios"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="select"
            aria-label="Filtrar por rol"
            value={filters.rol}
            onChange={(e) => setFilters((f) => ({ ...f, rol: e.target.value, page: 1 }))}
          >
            <option value="">Todos los roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {formatRol(r)}
              </option>
            ))}
          </select>
        </div>

        {isError ? (
          <div className="state">
            <h3>No se pudo cargar la lista</h3>
            <p>{error.message}</p>
            <button className="btn btn--ghost" onClick={() => refetch()}>
              Reintentar
            </button>
          </div>
        ) : (
          <div className="table-wrap" style={{ opacity: isFetching && !isLoading ? 0.6 : 1 }}>
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Registro</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <SkeletonRows />
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS}>
                      <div className="state">
                        <h3>Sin resultados</h3>
                        <p>Prueba con otro nombre o quita el filtro de rol.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u, i) => {
                    const esYo = yo?.id === u.id;
                    const guardando = cambiar.isPending && cambiar.variables?.id === u.id;
                    return (
                      <tr key={u.id ?? i}>
                        <td>
                          <div className="cell-user">
                            <span className="avatar">{u.fotoUrl ? <img src={u.fotoUrl} alt="" /> : initials(u.nombre)}</span>
                            <div>
                              <strong>{String(u.nombre ?? '—')}</strong>
                              <span>{String(u.correo ?? '')}</span>
                            </div>
                          </div>
                        </td>
                        <td className="muted">{u.telefono ? String(u.telefono) : '—'}</td>
                        <td>
                          <span className={`badge badge--${rolName(u.rol)}`}>{formatRol(u.rol)}</span>
                        </td>
                        <td>
                          <div className="status-cell">
                            {isSuper && (
                              <button
                                type="button"
                                role="switch"
                                aria-checked={Boolean(u.activo)}
                                aria-label={`${u.activo ? 'Desactivar' : 'Activar'} a ${u.nombre}`}
                                className="switch"
                                disabled={esYo || guardando}
                                title={esYo ? 'No puedes desactivar tu propia cuenta' : undefined}
                                onClick={() => toggleActivo(u)}
                              />
                            )}
                            <span className={`badge ${u.activo ? 'badge--ok' : 'badge--off'}`}>
                              <span className="dot" />
                              {u.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </td>
                        <td className="muted">{formatDate(u.createdAt)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isError && !isLoading && (
          <div className="table-foot">
            <span>{total != null ? `${total} usuarios · ` : ''}Página {filters.page}</span>
            <div className="pager">
              <button className="btn btn--ghost btn--sm" disabled={filters.page <= 1} onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}>
                Anterior
              </button>
              <button className="btn btn--ghost btn--sm" disabled={!hayMas} onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}>
                Siguiente
              </button>
            </div>
          </div>
        )}
      </section>

      {showCrear && <CrearAdminModal onClose={() => setShowCrear(false)} />}
    </>
  );
}
