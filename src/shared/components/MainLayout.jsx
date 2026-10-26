import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { formatRol, initials } from '@/shared/utils/format';
import logoImg from '../../assets/logo-login.png';

const icon = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const GridIcon = () => (
  <svg {...icon} aria-hidden="true">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);
const UsersIcon = () => (
  <svg {...icon} aria-hidden="true">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6M18 14c2 .5 3 2.2 3 5" />
  </svg>
);
const PitchIcon = () => (
  <svg {...icon} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M12 5v14" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
);
const CalendarIcon = () => (
  <svg {...icon} aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
const LogoutIcon = () => (
  <svg {...icon} aria-hidden="true">
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10" />
  </svg>
);

export default function MainLayout() {
  const { usuario, rol, isSuper, logout } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
      <span className="brand">
        <span className="brand-mark" aria-hidden="true">
          <img 
            src={logoImg} 
            alt="AbanPlay Logo" 
            style={{ width: '37px', height: '37px', objectFit: 'contain' }} 
          />
        </span>
        AbanPlay
      </span>

        <nav className="nav" aria-label="Principal">
          {isSuper && (
            <NavLink to="/dashboard">
              <GridIcon /> Resumen
            </NavLink>
          )}
          {isSuper && (
            <NavLink to="/usuarios">
              <UsersIcon /> Usuarios
            </NavLink>
          )}
          <NavLink to="/complejos">
            <PitchIcon /> Complejos
          </NavLink> 
        </nav>

        <div className="sidebar-user">
          <span className="avatar">{initials(usuario?.nombre)}</span>
          <div className="meta">
            <strong>{usuario?.nombre ?? 'Usuario'}</strong>
            <span>{formatRol(rol)}</span>
          </div>
          <button className="icon-btn" onClick={logout} aria-label="Cerrar sesión" title="Cerrar sesión">
            <LogoutIcon />
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
