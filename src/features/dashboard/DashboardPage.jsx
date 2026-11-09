import PageHead from '@/shared/components/PageHead';
import { useDashboardGlobal } from './useDashboard';
import { formatMoney, formatRol } from '@/shared/utils/format';

// Iconos SVG para las tarjetas KPI
const MoneyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const PitchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2.5"/>
    <line x1="12" y1="5" x2="12" y2="19"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const FieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 12h18"/>
    <path d="M12 3v18"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboardGlobal();

  const porRol = Array.isArray(data?.usuariosPorRol) ? data.usuariosPorRol : [];
  const maxRol = Math.max(1, ...porRol.map((r) => Number(r.total) || 0));

  const tiles = data
    ? [
        { label: 'Ingresos totales', value: formatMoney(data.ingresosTotales), primary: true, icon: <MoneyIcon /> },
        { label: 'Usuarios registrados', value: data.usuarios, icon: <UsersIcon /> },
        { label: 'Complejos deportivos', value: data.complejos, icon: <PitchIcon /> },
        { label: 'Canchas activas', value: data.canchas, icon: <FieldIcon /> },
      ]
    : [];

  return (
    <div className="db-wrapper">
      <style>{`
        .db-wrapper, .db-wrapper * {
          box-sizing: border-box !important;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Inter, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .db-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* --- GRILLA DE STATS (KPI CARDS) --- */
        .db-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          width: 100%;
        }

        .db-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .db-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }

        .db-card-primary {
          background: linear-gradient(135deg, #06110d 0%, #0d281e 100%);
          border-color: rgba(16, 185, 129, 0.3);
          box-shadow: 0 8px 20px rgba(6, 17, 13, 0.2);
        }

        .db-card-primary:hover {
          border-color: #10b981;
          box-shadow: 0 12px 28px rgba(16, 185, 129, 0.25);
        }

        .db-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .db-card-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
        }

        .db-card-primary .db-card-label {
          color: #94a3b8;
        }

        .db-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .db-card-primary .db-icon-box {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.25);
        }

        .db-card-val {
          font-size: 2.1rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.8px;
          line-height: 1;
        }

        .db-card-primary .db-card-val {
          color: #ffffff;
          background: linear-gradient(135deg, #ffffff 0%, #a7f3d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* --- SECCIÓN PANEL (ROLES) --- */
        .db-panel {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          width: 100%;
        }

        .db-panel-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1.75rem;
          letter-spacing: -0.3px;
        }

        .db-bars-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .db-bar-row {
          display: grid;
          grid-template-columns: 140px 1fr 60px;
          align-items: center;
          gap: 1rem;
        }

        .db-role-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
        }

        .db-bar-track {
          height: 10px;
          background: #f1f5f9;
          border-radius: 99px;
          overflow: hidden;
          position: relative;
        }

        .db-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          border-radius: 99px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .db-role-count {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
          text-align: right;
        }

        .db-empty-state {
          color: #94a3b8;
          font-size: 0.925rem;
          text-align: center;
          padding: 2rem 0;
        }

        /* --- ESTADO DE ERROR --- */
        .db-error-panel {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #fecaca;
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.05);
        }

        .db-error-icon {
          width: 54px;
          height: 54px;
          background: #fef2f2;
          color: #ef4444;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .db-error-panel h3 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
        }

        .db-error-panel p {
          color: #64748b;
          font-size: 0.95rem;
          max-width: 400px;
        }

        .db-btn-retry {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          height: 44px;
          padding: 0 1.25rem;
          background: #0f172a;
          color: #ffffff;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .db-btn-retry:hover {
          background: #1e293b;
          transform: translateY(-1px);
        }

        /* --- SKELETON ANIMADO --- */
        .db-skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: db-shimmer 1.5s infinite;
          border-radius: 8px;
          display: inline-block;
        }

        @keyframes db-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 640px) {
          .db-bar-row {
            grid-template-columns: 100px 1fr 40px;
          }
        }
      `}</style>

      {/* Solo PageHead renderiza el título superior */}
      <PageHead title="Resumen general" description="Cifras globales de la plataforma." />

      {isError ? (
        <section className="db-error-panel">
          <div className="db-error-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          </div>
          <h3>No se pudo cargar el resumen</h3>
          <p>{error?.message || 'Ocurrió un error inesperado al consultar los datos globales.'}</p>
          <button className="db-btn-retry" onClick={() => refetch()}>
            <RefreshIcon /> Reintentar
          </button>
        </section>
      ) : (
        <>
          {/* Grilla de Tarjetas KPI a ancho completo */}
          <div className="db-stats-grid">
            {isLoading
              ? Array.from({ length: 4 }, (_, i) => (
                  <div className="db-card" key={i}>
                    <div className="db-card-top">
                      <span className="db-skeleton" style={{ width: '60%', height: 16 }} />
                      <span className="db-skeleton" style={{ width: 42, height: 42, borderRadius: 12 }} />
                    </div>
                    <span className="db-skeleton" style={{ width: '45%', height: 36, marginTop: 12 }} />
                  </div>
                ))
              : tiles.map((t) => (
                  <div className={`db-card ${t.primary ? 'db-card-primary' : ''}`} key={t.label}>
                    <div className="db-card-top">
                      <span className="db-card-label">{t.label}</span>
                      <div className="db-icon-box">{t.icon}</div>
                    </div>
                    <div className="db-card-val">{t.value ?? '—'}</div>
                  </div>
                ))}
          </div>

          {/* Gráfico de Barras por Rol a ancho completo */}
          <section className="db-panel">
            <h2 className="db-panel-title">Distribución de usuarios por rol</h2>
            <div className="db-bars-stack">
              {isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <span className="db-skeleton" style={{ width: '100%', height: 20 }} />
                  <span className="db-skeleton" style={{ width: '80%', height: 20 }} />
                  <span className="db-skeleton" style={{ width: '60%', height: 20 }} />
                </div>
              )}

              {!isLoading && porRol.length === 0 && (
                <p className="db-empty-state">Todavía no hay usuarios registrados en el sistema.</p>
              )}

              {!isLoading &&
                porRol.map((r) => {
                  const percentage = ((Number(r.total) || 0) / maxRol) * 100;
                  return (
                    <div className="db-bar-row" key={r.rol}>
                      <span className="db-role-name">{formatRol(r.rol)}</span>
                      <div className="db-bar-track">
                        <div
                          className="db-bar-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <strong className="db-role-count">{r.total}</strong>
                    </div>
                  );
                })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}