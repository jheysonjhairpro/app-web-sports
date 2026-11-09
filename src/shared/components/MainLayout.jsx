import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { formatRol, initials } from '@/shared/utils/format';
import logoImg from '../../assets/logo-login.png';

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const GridIcon = () => (
  <svg {...iconProps} aria-hidden="true">
    <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
  </svg>
);

const UsersIcon = () => (
  <svg {...iconProps} aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PitchIcon = () => (
  <svg {...iconProps} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <line x1="12" y1="5" x2="12" y2="19" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LogoutIcon = () => (
  <svg {...iconProps} aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const WarningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function MainLayout() {
  const { usuario, rol, isSuper, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <div className="ml-shell">
      <style>{`
        /* Reset aislado para el layout */
        .ml-shell, .ml-shell * {
          box-sizing: border-box !important;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Inter, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

.ml-shell {
  display: flex;
  height: 100vh; /* 👈 Alto fijo a la ventana completa */
  width: 100vw;
  background-color: #f8fafc;
  overflow: hidden; /* 👈 Evita que el contenedor raíz haga scroll */
}

/* --- SIDEBAR BARRA LATERAL --- */
.ml-sidebar {
  width: 270px;
  min-width: 270px;
  height: 100vh; /* 👈 Cubre siempre el 100% vertical */
  background: #06110d;
  background-image: 
    radial-gradient(circle at 10% 10%, rgba(16, 185, 129, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 90% 90%, rgba(5, 150, 105, 0.12) 0%, transparent 45%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.75rem 1.25rem;
  position: relative; /* 👈 Cambiado de sticky a relative dentro del flex */
  z-index: 50;
  flex-shrink: 0;
}

/* --- ÁREA PRINCIPAL CON SCROLL INDEPENDIENTE --- */
.ml-main {
  flex: 1;
  min-width: 0;
  height: 100vh; /* 👈 Alto igual a la ventana */
  overflow-y: auto; /* 👈 El scroll ocurre ÚNICAMENTE dentro de las páginas */
  background-color: #f8fafc;
  padding: 2.5rem;
}

        .ml-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.5rem 0.5rem 1.75rem 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 1.5rem;
        }

        .ml-brand-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          backdrop-filter: blur(1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .ml-brand-mark img {
          width: 26px;
          height: 26px;
          object-fit: contain;
        }

        .ml-brand-text {
          color: #ffffff;
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .ml-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .ml-nav-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.8rem 1rem;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }

        .ml-nav-link svg {
          color: #64748b;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .ml-nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .ml-nav-link:hover svg {
          color: #10b981;
          transform: translateX(2px);
        }

        .ml-nav-link.active {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.1) 100%);
          border: 1px solid rgba(16, 185, 129, 0.35);
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.15);
        }

        .ml-nav-link.active svg {
          color: #34d399;
        }

        .ml-sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          margin-top: 1.5rem;
          backdrop-filter: blur(1px);
        }

        .ml-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);
          flex-shrink: 0;
          text-transform: uppercase;
        }

        .ml-user-meta {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .ml-user-name {
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ml-user-role {
          color: #34d399;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ml-logout-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .ml-logout-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .ml-main {
          flex: 1;
          min-width: 0;
          background-color: #f8fafc;
          padding: 2.5rem;
          min-height: 100vh;
        }

        /* --- MODAL CONFIRMACIÓN PREMIUM --- */
        .ml-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(6, 17, 13, 0.75);
          backdrop-filter: blur(1px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        .ml-modal-card {
          width: 90%;
          max-width: 400px;
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: scaleUp 0.2s ease-out;
        }

        .ml-modal-icon-bg {
          width: 52px;
          height: 52px;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .ml-modal-card h3 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .ml-modal-card p {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 1.75rem;
        }

        .ml-modal-actions {
          display: flex;
          gap: 0.75rem;
          width: 100%;
        }

        .ml-modal-btn {
          flex: 1;
          height: 46px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .ml-modal-btn-cancel {
          background: #f1f5f9;
          color: #475569;
        }

        .ml-modal-btn-cancel:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .ml-modal-btn-confirm {
          background: #ef4444;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
        }

        .ml-modal-btn-confirm:hover {
          background: #dc2626;
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
          transform: translateY(-1px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 768px) {
          .ml-shell {
            flex-direction: column;
          }
          .ml-sidebar {
            width: 100%;
            height: auto;
            min-height: 0;
            position: relative;
            padding: 1.25rem;
          }
          .ml-main {
            padding: 1.25rem;
          }
        }
      `}</style>

      {/* Sidebar Lateral */}
      <aside className="ml-sidebar">
        <div>
          <div className="ml-brand">
            <span className="ml-brand-mark" aria-hidden="true">
              <img src={logoImg} alt="AbanPlay Logo" />
            </span>
            <span className="ml-brand-text">AbanPlay</span>
          </div>

          <nav className="ml-nav" aria-label="Principal">
            {isSuper && (
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `ml-nav-link ${isActive ? 'active' : ''}`}
              >
                <GridIcon /> <span>Resumen</span>
              </NavLink>
            )}
            {isSuper && (
              <NavLink 
                to="/usuarios" 
                className={({ isActive }) => `ml-nav-link ${isActive ? 'active' : ''}`}
              >
                <UsersIcon /> <span>Usuarios</span>
              </NavLink>
            )}
            <NavLink 
              to="/complejos" 
              className={({ isActive }) => `ml-nav-link ${isActive ? 'active' : ''}`}
            >
              <PitchIcon /> <span>Complejos</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer del Usuario */}
        <div className="ml-sidebar-user">
          <span className="ml-avatar">{initials(usuario?.nombre)}</span>
          <div className="ml-user-meta">
            <strong className="ml-user-name">{usuario?.nombre ?? 'Usuario'}</strong>
            <span className="ml-user-role">{formatRol(rol)}</span>
          </div>
          <button 
            className="ml-logout-btn" 
            onClick={() => setShowLogoutModal(true)} 
            aria-label="Cerrar sesión" 
            title="Cerrar sesión"
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="ml-main">
        <Outlet />
      </main>

      {/* Modal Confirmar Cierre de Sesión */}
      {showLogoutModal && (
        <div className="ml-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="ml-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ml-modal-icon-bg">
              <WarningIcon />
            </div>
            <h3>¿Cerrar sesión?</h3>
            <p>¿Estás seguro de que deseas salir del panel de administración?</p>
            
            <div className="ml-modal-actions">
              <button 
                className="ml-modal-btn ml-modal-btn-cancel" 
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="ml-modal-btn ml-modal-btn-confirm" 
                onClick={handleConfirmLogout}
              >
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}