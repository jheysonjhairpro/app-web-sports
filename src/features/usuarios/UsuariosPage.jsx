import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import PageHead from '@/shared/components/PageHead';
import { useToast } from '@/shared/components/ToastProvider';
import { extractList, extractTotal } from '@/shared/utils/extractList';
import { formatDate, formatRol, initials, rolName } from '@/shared/utils/format';
import CrearAdminModal from './CrearAdminModal';
import EditarUsuarioModal from './EditarUsuarioModal';
import { useCambiarEstadoUsuario, useUsuarios } from './useUsuarios';

const ROLES = ['super_admin', 'administrador', 'usuario'];
const COLUMNS = 6; // Incrementamos a 6 columnas

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const UserPlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="17" y1="11" x2="23" y2="11"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

function SkeletonRows() {
  return Array.from({ length: 5 }, (_, i) => (
    <tr key={i} className="usr-skeleton-row">
      <td colSpan={COLUMNS}>
        <div className="usr-skeleton-cell">
          <span className="usr-skeleton usr-skeleton-avatar" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="usr-skeleton" style={{ width: `${45 + ((i * 17) % 30)}%`, height: 16 }} />
            <span className="usr-skeleton" style={{ width: `${30 + ((i * 11) % 25)}%`, height: 12 }} />
          </div>
        </div>
      </td>
    </tr>
  ));
}

export default function UsuariosPage() {
  const { usuario: yo, isSuper } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ page: 1, limit: 20, rol: '', q: '' });
  
  // Modales
  const [showCrear, setShowCrear] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useUsuarios(filters);
  const cambiar = useCambiarEstadoUsuario();

  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, q: search.trim(), page: 1 })), 350);
    return () => clearTimeout(t);
  }, [search]);

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
    <div className="usr-wrapper">
      <style>{`
        .usr-wrapper, .usr-wrapper * {
          box-sizing: border-box !important;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Inter, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .usr-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .usr-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .usr-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          height: 46px;
          padding: 0 1.25rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.925rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
          transition: all 0.2s ease;
        }

        .usr-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
          filter: brightness(1.05);
        }

        .usr-panel {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }

        .usr-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          background-color: #ffffff;
          flex-wrap: wrap;
        }

        .usr-search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 260px;
          max-width: 400px;
        }

        .usr-search-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          pointer-events: none;
        }

        .usr-input {
          width: 100%;
          height: 44px;
          padding: 0 1rem 0 2.6rem;
          background-color: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }

        .usr-input::placeholder {
          color: #94a3b8;
        }

        .usr-input:focus {
          background-color: #ffffff;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
        }

        .usr-select {
          height: 44px;
          padding: 0 2.5rem 0 1rem;
          background-color: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%64748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
        }

        .usr-select:focus {
          border-color: #10b981;
          background-color: #ffffff;
        }

        .usr-table-wrap {
          width: 100%;
          overflow-x: auto;
          transition: opacity 0.2s ease;
        }

        .usr-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .usr-table th {
          background-color: #f8fafc;
          padding: 1rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }

        .usr-table td {
          padding: 1.1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.9rem;
          color: #334155;
          vertical-align: middle;
        }

        .usr-table tbody tr {
          transition: background-color 0.15s ease;
        }

        .usr-table tbody tr:hover {
          background-color: #f8fafc;
        }

        .usr-cell-user {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .usr-avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #06110d 0%, #0d281e 100%);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
          font-weight: 800;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          text-transform: uppercase;
        }

        .usr-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .usr-user-info {
          display: flex;
          flex-direction: column;
        }

        .usr-user-name {
          font-weight: 700;
          color: #0f172a;
          font-size: 0.925rem;
        }

        .usr-user-email {
          color: #64748b;
          font-size: 0.825rem;
        }

        .usr-muted {
          color: #64748b;
          font-weight: 500;
        }

        .usr-date-cell {
          display: flex;
          flex-direction: column;
          font-size: 0.825rem;
        }

        .usr-date-main {
          color: #334155;
          font-weight: 600;
        }

        .usr-date-sub {
          color: #94a3b8;
          font-size: 0.775rem;
        }

        .usr-badge-role {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.75rem;
          border-radius: 99px;
          font-size: 0.775rem;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .usr-badge-super_admin {
          background-color: rgba(139, 92, 246, 0.12);
          color: #7c3aed;
          border: 1px solid rgba(139, 92, 246, 0.25);
        }

        .usr-badge-administrador {
          background-color: rgba(59, 130, 246, 0.12);
          color: #2563eb;
          border: 1px solid rgba(59, 130, 246, 0.25);
        }

        .usr-badge-usuario {
          background-color: rgba(100, 116, 139, 0.12);
          color: #475569;
          border: 1px solid rgba(100, 116, 139, 0.25);
        }

        .usr-status-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .usr-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background-color: #cbd5e1;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 2px;
          flex-shrink: 0;
        }

        .usr-switch[aria-checked="true"] {
          background-color: #10b981;
        }

        .usr-switch:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .usr-switch-handle {
          display: block;
          width: 20px;
          height: 20px;
          background-color: #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .usr-switch[aria-checked="true"] .usr-switch-handle {
          transform: translateX(20px);
        }

        .usr-badge-status {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.65rem;
          border-radius: 99px;
          font-size: 0.775rem;
          font-weight: 600;
        }

        .usr-badge-ok {
          background-color: #ecfdf5;
          color: #047857;
        }

        .usr-badge-ok .usr-dot {
          width: 6px;
          height: 6px;
          background-color: #10b981;
          border-radius: 50%;
        }

        .usr-badge-off {
          background-color: #fef2f2;
          color: #b91c1c;
        }

        .usr-badge-off .usr-dot {
          width: 6px;
          height: 6px;
          background-color: #ef4444;
          border-radius: 50%;
        }

        /* Botón Editar */
        .usr-btn-action {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .usr-btn-action:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .usr-table-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-top: 1px solid #f1f5f9;
          background-color: #ffffff;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .usr-pager {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .usr-btn-ghost {
          height: 38px;
          padding: 0 1rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #334155;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .usr-btn-ghost:hover:not(:disabled) {
          background-color: #ffffff;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .usr-btn-ghost:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      {/* Bar superior */}
      <div className="usr-top-bar">
        <PageHead title="Usuarios" description="Consulta las cuentas registradas y administra su acceso." />
        {isSuper && (
          <button className="usr-btn-primary" onClick={() => setShowCrear(true)}>
            <UserPlusIcon /> Nuevo administrador
          </button>
        )}
      </div>

      <section className="usr-panel">
        <div className="usr-toolbar">
          <div className="usr-search-box">
            <span className="usr-search-icon"><SearchIcon /></span>
            <input
              className="usr-input"
              type="search"
              placeholder="Buscar por nombre o correo..."
              aria-label="Buscar usuarios"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="usr-select"
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

        {/* Tabla */}
        {isError ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#ef4444' }}>{error?.message || 'Error al obtener usuarios'}</p>
            <button className="usr-btn-ghost" onClick={() => refetch()} style={{ marginTop: '1rem' }}>
              Reintentar
            </button>
          </div>
        ) : (
          <div className="usr-table-wrap" style={{ opacity: isFetching && !isLoading ? 0.65 : 1 }}>
            <table className="usr-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fechas (Creación / Edición)</th>
                  <th style={{ textAlign: 'right' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <SkeletonRows />
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                      <p style={{ color: '#64748b' }}>No se encontraron usuarios.</p>
                    </td>
                  </tr>
                ) : (

                  usuarios.map((u, i) => {
                    const esYo = yo?.id === u.id;
                    const guardando = cambiar.isPending && cambiar.variables?.id === u.id;

                    // Extraer las fechas de la API (soporta snake_case de SQL y camelCase)
const fechaCreacion = u.createdAt || u.created_at;
const fechaEdicion = u.updatedAt || u.updated_at;

// Convertimos a milisegundos o ISO string para comparar con precisión
const fCreacionTime = fechaCreacion ? new Date(fechaCreacion).getTime() : 0;
const fEdicionTime = fechaEdicion ? new Date(fechaEdicion).getTime() : 0;

// Se considera editado si la fecha de edición es posterior a la de creación por al menos 1 segundo (1000 ms)
const fueEditado = Boolean(fEdicionTime && (fEdicionTime - fCreacionTime > 1000));
                    return (
                      <tr key={u.id ?? i}>
                        <td>
                          <div className="usr-cell-user">
                            <span className="usr-avatar">
                              {u.fotoUrl ? <img src={u.fotoUrl} alt={u.nombre} /> : initials(u.nombre)}
                            </span>
                            <div className="usr-user-info">
                              <strong className="usr-user-name">{String(u.nombre ?? '—')}</strong>
                              <span className="usr-user-email">{String(u.correo ?? '')}</span>
                            </div>
                          </div>
                        </td>
                        <td className="usr-muted">{u.telefono ? String(u.telefono) : '—'}</td>
                        <td>
                          <span className={`usr-badge-role usr-badge-${rolName(u.rol)}`}>
                            {formatRol(u.rol)}
                          </span>
                        </td>
                        <td>
                          <div className="usr-status-cell">
                            {isSuper && (
                              <button
                                type="button"
                                role="switch"
                                aria-checked={Boolean(u.activo)}
                                aria-label={`${u.activo ? 'Desactivar' : 'Activar'} a ${u.nombre}`}
                                className="usr-switch"
                                disabled={esYo || guardando}
                                title={esYo ? 'No puedes desactivar tu propia cuenta' : undefined}
                                onClick={() => toggleActivo(u)}
                              >
                                <span className="usr-switch-handle" />
                              </button>
                            )}
                            <span className={`usr-badge-status ${u.activo ? 'usr-badge-ok' : 'usr-badge-off'}`}>
                              <span className="usr-dot" />
                              {u.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="usr-date-cell">
                            <span className="usr-date-main">Creado: {formatDate(fechaCreacion)}</span>
                            {fueEditado && (
                              <span className="usr-date-sub">Editado: {formatDate(fechaEdicion)}</span>
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="usr-btn-action"
                            title="Editar usuario"
                            onClick={() => setUsuarioAEditar(u)}
                          >
                            <EditIcon />
                          </button>
                        </td>
                      </tr>
                    );
                  
                  }
                
                )
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {!isError && !isLoading && (
          <div className="usr-table-foot">
            <span>{total != null ? `${total} usuarios en total · ` : ''}Página {filters.page}</span>
            <div className="usr-pager">
              <button 
                className="usr-btn-ghost" 
                disabled={filters.page <= 1} 
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              >
                Anterior
              </button>
              <button 
                className="usr-btn-ghost" 
                disabled={!hayMas} 
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Modal Crear Administrador */}
      {showCrear && <CrearAdminModal onClose={() => setShowCrear(false)} />}

      {/* Modal Editar Usuario */}
      {usuarioAEditar && (
        <EditarUsuarioModal
          usuario={usuarioAEditar}
          onClose={() => setUsuarioAEditar(null)}
        />
      )}
    </div>
  );
}