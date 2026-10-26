import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import PageHead from '@/shared/components/PageHead';
import { useToast } from '@/shared/components/ToastProvider';
import { extractList } from '@/shared/utils/extractList';
import { formatMoney } from '@/shared/utils/format';
import AdministradoresModal from './AdministradoresModal';
import ComplejoFormModal from './ComplejoFormModal';
import { useComplejos, useMarcarDestacado } from './useComplejos';

export default function ComplejosPage() {
  const { isSuper, rol } = useAuth();
  const canEdit = isSuper || rol === 'administrador';
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ page: 1, limit: 12, destacado: false, q: '' });
  const [modal, setModal] = useState(null); // { type: 'form' | 'admins', complejo? }
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
    <>
      <PageHead title="Complejos" description="Sedes deportivas registradas y sus canchas.">
        {isSuper && (
          <button className="btn" onClick={() => setModal({ type: 'form' })}>
            Nuevo complejo
          </button>
        )}
      </PageHead>

      <section className="panel" style={{ marginBottom: 20 }}>
        <div className="toolbar" style={{ borderBottom: 'none', marginBottom: -4 }}>
          <div className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              className="input"
              type="search"
              placeholder="Buscar complejo"
              aria-label="Buscar complejos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={filters.destacado}
              onChange={(e) => setFilters((f) => ({ ...f, destacado: e.target.checked, page: 1 }))}
            />
            Solo destacados
          </label>
        </div>
      </section>

      {isError ? (
        <section className="panel state">
          <h3>No se pudo cargar los complejos</h3>
          <p>{error.message}</p>
          <button className="btn btn--ghost" onClick={() => refetch()}>
            Reintentar
          </button>
        </section>
      ) : isLoading ? (
        <div className="cards">
          {Array.from({ length: 6 }, (_, i) => (
            <div className="complejo" key={i}>
              <div className="complejo-media" />
              <div className="complejo-body">
                <span className="skeleton" style={{ width: '60%', height: 18 }} />
                <span className="skeleton" style={{ width: '80%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : complejos.length === 0 ? (
        <section className="panel state">
          <h3>Sin complejos</h3>
          <p>No hay resultados con estos filtros.</p>
        </section>
      ) : (
        <div className="cards" style={{ opacity: isFetching ? 0.65 : 1 }}>
          {complejos.map((c) => (
            <article className="complejo" key={c.id}>
              <div className="complejo-media">
                {c.fotoUrl ? <img src={c.fotoUrl} alt={`Foto de ${c.nombre}`} loading="lazy" /> : <div className="media-fallback" />}
                {c.destacado && <span className="badge badge--star">Destacado</span>}
              </div>
              <div className="complejo-body">
                <h3>{c.nombre}</h3>
                <p className="muted">{[c.direccion, c.ciudad].filter(Boolean).join(', ') || 'Sin dirección'}</p>
                {c.descripcion && <p className="desc">{c.descripcion}</p>}
                <dl className="complejo-meta">
                  <div>
                    <dt>Canchas activas</dt>
                    <dd>{c.canchasActivas ?? 0}</dd>
                  </div>
                  <div>
                    <dt>Desde</dt>
                    <dd>{c.precioDesde != null ? formatMoney(c.precioDesde) : '—'}</dd>
                  </div>
                  {!c.activo && (
                    <div>
                      <dt>Estado</dt>
                      <dd>Inactivo</dd>
                    </div>
                  )}
                </dl>
              </div>
              {canEdit && (
                <div className="complejo-actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => setModal({ type: 'form', complejo: c })}>
                    Editar
                  </button>
                  {isSuper && (
                    <>
                      <button className="btn btn--ghost btn--sm" onClick={() => setModal({ type: 'admins', complejo: c })}>
                        Administradores
                      </button>
                      <button
                        className="btn btn--ghost btn--sm"
                        disabled={destacar.isPending && destacar.variables?.id === c.id}
                        onClick={() => toggleDestacado(c)}
                      >
                        {c.destacado ? 'Quitar destacado' : 'Destacar'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {!isError && !isLoading && complejos.length > 0 && (
        <div className="table-foot" style={{ border: 'none', paddingInline: 0 }}>
          <span>Página {filters.page}</span>
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

      {modal?.type === 'form' && <ComplejoFormModal complejo={modal.complejo} onClose={() => setModal(null)} />}
      {modal?.type === 'admins' && <AdministradoresModal complejo={modal.complejo} onClose={() => setModal(null)} />}
    </>
  );
}
