import PageHead from '@/shared/components/PageHead';
import { useDashboardGlobal } from './useDashboard';
import { formatMoney, formatRol } from '@/shared/utils/format';

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboardGlobal();

  const porRol = Array.isArray(data?.usuariosPorRol) ? data.usuariosPorRol : [];
  const maxRol = Math.max(1, ...porRol.map((r) => Number(r.total) || 0));

  const tiles = data
    ? [
        { label: 'Ingresos totales', value: formatMoney(data.ingresosTotales), primary: true },
        { label: 'Usuarios', value: data.usuarios },
        { label: 'Complejos', value: data.complejos },
        { label: 'Canchas', value: data.canchas },
      ]
    : [];

  return (
    <>
      <PageHead title="Resumen general" description="Cifras globales de la plataforma." />

      {isError ? (
        <section className="panel state">
          <h3>No se pudo cargar el resumen</h3>
          <p>{error.message}</p>
          <button className="btn btn--ghost" onClick={() => refetch()}>
            Reintentar
          </button>
        </section>
      ) : (
        <>
          <dl className="stats">
            {isLoading
              ? Array.from({ length: 5 }, (_, i) => (
                  <div className="stat" key={i}>
                    <span className="skeleton" style={{ width: '50%' }} />
                    <span className="skeleton" style={{ width: '35%', height: 30, marginTop: 12 }} />
                  </div>
                ))
              : tiles.map((t) => (
                  <div className={`stat ${t.primary ? 'stat--primary' : ''}`} key={t.label}>
                    <dt>{t.label}</dt>
                    <dd>{t.value ?? '—'}</dd>
                  </div>
                ))}
          </dl>

          <section className="panel">
            <h2 className="panel-title">Usuarios por rol</h2>
            <div className="bars">
              {isLoading && <span className="skeleton" style={{ width: '70%' }} />}
              {!isLoading && porRol.length === 0 && <p className="muted">Todavía no hay usuarios registrados.</p>}
              {porRol.map((r) => (
                <div className="bar-row" key={r.rol}>
                  <span>{formatRol(r.rol)}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${((Number(r.total) || 0) / maxRol) * 100}%` }} />
                  </div>
                  <strong>{r.total}</strong>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
