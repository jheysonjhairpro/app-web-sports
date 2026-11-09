import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import PageHead from '@/shared/components/PageHead';
import { useToast } from '@/shared/components/ToastProvider';
import { extractList } from '@/shared/utils/extractList';
import { formatMoney } from '@/shared/utils/format';
import AdministradoresModal from './AdministradoresModal';
import ComplejoFormModal from './ComplejoFormModal';
import { useComplejos, useMarcarDestacado } from './useComplejos';

// Iconos estilizados
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const PitchPlaceholderIcon = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2.5"/>
    <line x1="12" y1="5" x2="12" y2="19"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default function ComplejosPage() {
  const { isSuper, rol } = useAuth();
  const canEdit = isSuper || rol === 'administrador';
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ page: 1, limit: 12, destacado: false, q: '' });
  const [modal, setModal] = useState(null);
  const { data, isLoading, isError, error, refetch, isFetching } = useComplejos(filters);
  const destacar = useMarcarDestacado();

  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, q: search.trim(), page: 1 })), 350);
    return () => clearTimeout(t);
  }, [search]);

  const complejos = extractList(data);
  const hayMas = complejos.length >= filters.limit;

  const toggleDestacado = (c) => {
    destacar.mutate(
      { id: c.id, destacado: !c.destacado },
      {
        onSuccess: () => toast.success(c.destacado ? 'Se quitó de destacados' : 'Marcado como destacado'),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <div className="cmp-wrapper">
      <style>{`
        .cmp-wrapper, .cmp-wrapper * {
          box-sizing: border-box !important;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Inter, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .cmp-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* HEADER Y BOTÓN PRINCIPAL */
        .cmp-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cmp-btn-primary {
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

        .cmp-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
          filter: brightness(1.05);
        }

        /* FILTROS Y BÚSQUEDA */
        .cmp-toolbar {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }

        .cmp-search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 260px;
          max-width: 420px;
        }

        .cmp-search-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          pointer-events: none;
        }

        .cmp-input {
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

        .cmp-input::placeholder {
          color: #94a3b8;
        }

        .cmp-input:focus {
          background-color: #ffffff;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
        }

        /* FILTER TOGGLE CHECKBOX */
        .cmp-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          user-select: none;
        }

        .cmp-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #10b981;
          cursor: pointer;
          border-radius: 4px;
        }

        /* GRILLA DE TARJETAS */
        .cmp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          width: 100%;
          transition: opacity 0.2s ease;
        }

        .cmp-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cmp-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }

        /* MEDIA / FOTO DEL COMPLEJO */
        .cmp-media {
          position: relative;
          width: 100%;
          height: 170px;
          background: linear-gradient(135deg, #06110d 0%, #0d281e 100%);
          overflow: hidden;
        }

        .cmp-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .cmp-card:hover .cmp-media img {
          transform: scale(1.04);
        }

        .cmp-media-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* BADGES FLOTANTES SOBRE IMAGEN */
        .cmp-badge-star {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(16, 185, 129, 0.9);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 0.35rem 0.75rem;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .cmp-badge-off {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(239, 68, 68, 0.9);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 0.3rem 0.65rem;
          border-radius: 99px;
          font-size: 0.725rem;
          font-weight: 700;
        }

        /* CONTENIDO DE LA TARJETA */
        .cmp-body {
          padding: 1.25rem 1.25rem 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          flex: 1;
        }

        .cmp-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }

        .cmp-location {
          font-size: 0.85rem;
          font-weight: 500;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .cmp-desc {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-top: 0.2rem;
        }

        /* METADATOS (CANCHAS Y PRECIOS) */
        .cmp-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: 0.75rem;
          padding-top: 0.85rem;
          border-top: 1px solid #f1f5f9;
        }

        .cmp-meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .cmp-meta-label {
          font-size: 0.725rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: #94a3b8;
        }

        .cmp-meta-val {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
        }

        /* ACCIONES INFERIORES */
        .cmp-actions {
          padding: 0.85rem 1.25rem 1.25rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          border-top: 1px solid #f8fafc;
        }

        .cmp-btn-action {
          flex: 1;
          height: 38px;
          padding: 0 0.75rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          color: #334155;
          font-weight: 600;
          font-size: 0.825rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
        }

        .cmp-btn-action:hover:not(:disabled) {
          background-color: #ffffff;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .cmp-btn-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cmp-btn-star-toggle {
          background-color: #fffbeb;
          border-color: #fde68a;
          color: #d97706;
        }

        .cmp-btn-star-toggle:hover:not(:disabled) {
          background-color: #fef3c7;
          border-color: #fcd34d;
          color: #b45309;
        }

        /* ESTADOS SKELETON / VACÍO */
        .cmp-skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: cmp-shimmer 1.5s infinite;
          border-radius: 6px;
        }

        @keyframes cmp-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .cmp-empty-panel {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .cmp-empty-panel h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        .cmp-empty-panel p {
          color: #64748b;
          font-size: 0.925rem;
        }

        /* PAGINACIÓN */
        .cmp-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .cmp-pager {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>

      {/* Header superior con botón */}
      <div className="cmp-top-bar">
        <PageHead title="Complejos" description="Sedes deportivas registradas y sus canchas." />
        {isSuper && (
          <button className="cmp-btn-primary" onClick={() => setModal({ type: 'form' })}>
            <PlusIcon /> Nuevo complejo
          </button>
        )}
      </div>

      {/* Toolbar con buscador y checkbox */}
      <section className="cmp-toolbar">
        <div className="cmp-search-box">
          <span className="cmp-search-icon"><SearchIcon /></span>
          <input
            className="cmp-input"
            type="search"
            placeholder="Buscar por nombre o dirección..."
            aria-label="Buscar complejos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <label className="cmp-checkbox-label">
          <input
            className="cmp-checkbox"
            type="checkbox"
            checked={filters.destacado}
            onChange={(e) => setFilters((f) => ({ ...f, destacado: e.target.checked, page: 1 }))}
          />
          Solo destacados
        </label>
      </section>

      {/* Renderizado de Cards / Estados */}
      {isError ? (
        <section className="cmp-empty-panel">
          <h3>No se pudo cargar la lista de complejos</h3>
          <p>{error?.message || 'Error de conexión con el servidor.'}</p>
          <button className="cmp-btn-action" style={{ width: 'auto' }} onClick={() => refetch()}>
            Reintentar
          </button>
        </section>
      ) : isLoading ? (
        <div className="cmp-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div className="cmp-card" key={i}>
              <div className="cmp-media cmp-skeleton" />
              <div className="cmp-body">
                <span className="cmp-skeleton" style={{ width: '70%', height: 20 }} />
                <span className="cmp-skeleton" style={{ width: '50%', height: 14 }} />
                <span className="cmp-skeleton" style={{ width: '90%', height: 14, marginTop: 8 }} />
              </div>
            </div>
          ))}
        </div>
      ) : complejos.length === 0 ? (
        <section className="cmp-empty-panel">
          <h3>Sin complejos registrados</h3>
          <p>No se encontraron resultados con los filtros aplicados.</p>
        </section>
      ) : (
        <div className="cmp-grid" style={{ opacity: isFetching ? 0.65 : 1 }}>
          {complejos.map((c) => (
            <article className="cmp-card" key={c.id}>
              {/* Media o Imagen */}
              <div className="cmp-media">
                {c.fotoUrl ? (
                  <img src={c.fotoUrl} alt={`Foto de ${c.nombre}`} loading="lazy" />
                ) : (
                  <div className="cmp-media-fallback">
                    <PitchPlaceholderIcon />
                  </div>
                )}

                {c.destacado && (
                  <span className="cmp-badge-star">
                    <StarIcon filled /> Destacado
                  </span>
                )}

                {!c.activo && (
                  <span className="cmp-badge-off">Inactivo</span>
                )}
              </div>

              {/* Información principal */}
              <div className="cmp-body">
                <h3 className="cmp-title">{c.nombre}</h3>
                <p className="cmp-location">
                  📍 {[c.direccion, c.ciudad].filter(Boolean).join(', ') || 'Sin dirección registrada'}
                </p>
                {c.descripcion && <p className="cmp-desc">{c.descripcion}</p>}

                {/* Metadatos (Canchas / Precio) */}
                <div className="cmp-meta-grid">
                  <div className="cmp-meta-item">
                    <span className="cmp-meta-label">Canchas activas</span>
                    <span className="cmp-meta-val">{c.canchasActivas ?? 0}</span>
                  </div>
                  <div className="cmp-meta-item">
                    <span className="cmp-meta-label">Precio desde</span>
                    <span className="cmp-meta-val">
                      {c.precioDesde != null ? formatMoney(c.precioDesde) : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              {canEdit && (
                <div className="cmp-actions">
                  <button
                    className="cmp-btn-action"
                    onClick={() => setModal({ type: 'form', complejo: c })}
                  >
                    <EditIcon /> Editar
                  </button>

                  {isSuper && (
                    <>
                      <button
                        className="cmp-btn-action"
                        onClick={() => setModal({ type: 'admins', complejo: c })}
                      >
                        <UsersIcon /> Admins
                      </button>

                      <button
                        className={`cmp-btn-action ${c.destacado ? 'cmp-btn-star-toggle' : ''}`}
                        disabled={destacar.isPending && destacar.variables?.id === c.id}
                        onClick={() => toggleDestacado(c)}
                        title={c.destacado ? 'Quitar de destacados' : 'Marcar como destacado'}
                      >
                        <StarIcon filled={c.destacado} />
                        {c.destacado ? 'Quitar' : 'Destacar'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Paginador */}
      {!isError && !isLoading && complejos.length > 0 && (
        <div className="cmp-foot">
          <span>Página {filters.page}</span>
          <div className="cmp-pager">
            <button
              className="cmp-btn-action"
              style={{ width: 'auto' }}
              disabled={filters.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            >
              Anterior
            </button>
            <button
              className="cmp-btn-action"
              style={{ width: 'auto' }}
              disabled={!hayMas}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modales */}
      {modal?.type === 'form' && (
        <ComplejoFormModal complejo={modal.complejo} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'admins' && (
        <AdministradoresModal complejo={modal.complejo} onClose={() => setModal(null)} />
      )}
    </div>
  );
}