import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logoImg from '../../assets/logo-login.png';

function PitchLines() {
  return (
    <svg className="ab-pitch-svg" viewBox="0 0 600 800" fill="none" aria-hidden="true">
      {/* Campo exterior */}
      <rect x="40" y="40" width="520" height="720" rx="24" stroke="url(#pitch-grad)" strokeWidth="2.5" strokeDasharray="8 8" opacity="0.6" />
      
      {/* Línea media y círculo central */}
      <line x1="40" y1="400" x2="560" y2="400" stroke="url(#pitch-grad)" strokeWidth="2" opacity="0.5" />
      <circle cx="300" cy="400" r="90" stroke="url(#pitch-grad)" strokeWidth="2" opacity="0.5" />
      <circle cx="300" cy="400" r="6" fill="#10b981" />

      {/* Áreas superior e inferior */}
      <rect x="150" y="40" width="300" height="130" stroke="url(#pitch-grad)" strokeWidth="2" opacity="0.4" />
      <rect x="220" y="40" width="160" height="46" stroke="url(#pitch-grad)" strokeWidth="2" opacity="0.4" />
      <rect x="150" y="630" width="300" height="130" stroke="url(#pitch-grad)" strokeWidth="2" opacity="0.4" />
      <rect x="220" y="724" width="160" height="46" stroke="url(#pitch-grad)" strokeWidth="2" opacity="0.4" />
      
      {/* Semicírculos de área */}
      <path d="M 235 170 A 65 65 0 0 0 365 170" stroke="url(#pitch-grad)" strokeWidth="2" opacity="0.4" />
      <path d="M 235 630 A 65 65 0 0 1 365 630" stroke="url(#pitch-grad)" strokeWidth="2" opacity="0.4" />

      <defs>
        <linearGradient id="pitch-grad" x1="0" y1="0" x2="600" y2="800" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#059669" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BrandMark() {
  return (
    <div className="ab-brand-mark">
      <img src={logoImg} alt="AbanPlay Logo" />
    </div>
  );
}

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ correo: form.correo.trim(), password: form.password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ab-root">
      <style>{`
        /* Reset aislado */
        .ab-root, .ab-root * {
          box-sizing: border-box !important;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Inter, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .ab-root {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          background-color: #ffffff;
          overflow-x: hidden;
        }

        /* --- SECCIÓN IZQUIERDA: HERO SPORT SaaS --- */
        .ab-hero {
          flex: 1.15;
          position: relative;
          background: #06110d;
          background-image: 
            radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.25) 0%, transparent 45%),
            radial-gradient(circle at 85% 85%, rgba(5, 150, 105, 0.15) 0%, transparent 50%);
          padding: 4rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Destellos decorativos traseros */
        .ab-hero-glow {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 380px;
          height: 380px;
          background: #10b981;
          filter: blur(150px);
          opacity: 0.12;
          pointer-events: none;
          border-radius: 50%;
        }

        .ab-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          z-index: 5;
        }

        .ab-brand-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .ab-brand-mark img {
          width: 26px;
          height: 26px;
          object-fit: contain;
        }

        .ab-brand-name {
          color: #ffffff;
          font-size: 1.45rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .ab-pitch-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-4deg);
          width: 70%;
          max-width: 420px;
          pointer-events: none;
          z-index: 2;
        }

        .ab-pitch-svg {
          width: 100%;
          height: auto;
        }

        .ab-hero-footer {
          z-index: 5;
          max-width: 500px;
        }

        .ab-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 99px;
          color: #34d399;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }

        .ab-hero-badge-dot {
          width: 6px;
          height: 6px;
          background-color: #34d399;
          border-radius: 50%;
          box-shadow: 0 0 8px #34d399;
        }

        .ab-hero-footer h1 {
          font-size: 2.85rem;
          font-weight: 800;
          line-height: 1.12;
          color: #ffffff;
          margin-bottom: 1rem;
          letter-spacing: -0.8px;
        }

        .ab-hero-footer h1 span {
          background: linear-gradient(135deg, #10b981 0%, #a7f3d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ab-hero-footer p {
          color: #94a3b8;
          font-size: 1.05rem;
          line-height: 1.6;
          font-weight: 400;
        }

        /* --- SECCIÓN DERECHA: FORMULARIO PREMIUM --- */
        .ab-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background-color: #ffffff;
        }

        .ab-card {
          width: 100%;
          max-width: 410px;
        }

        .ab-card-header {
          margin-bottom: 2.25rem;
        }

        .ab-card-header h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.6px;
          margin-bottom: 0.5rem;
        }

        .ab-lead {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .ab-form-stack {
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
        }

        .ab-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .ab-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }

        .ab-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .ab-input-icon {
          position: absolute;
          left: 14px;
          width: 18px;
          height: 18px;
          color: #94a3b8;
          pointer-events: none;
          transition: color 0.2s ease;
        }

        .ab-input {
          width: 100%;
          height: 50px;
          padding: 0 1rem 0 2.75rem;
          background-color: #f8fafc !important;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          color: #0f172a !important;
          outline: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ab-input::placeholder {
          color: #94a3b8;
        }

        .ab-input:focus {
          background-color: #ffffff !important;
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
        }

        .ab-input-wrap:focus-within .ab-input-icon {
          color: #10b981;
        }

        .ab-input-pass {
          padding-right: 3rem;
        }

        /* Evitar fondo amarillo en autocompletado */
        .ab-input:-webkit-autofill,
        .ab-input:-webkit-autofill:hover, 
        .ab-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #0f172a !important;
          -webkit-box-shadow: 0 0 0px 1000px #f8fafc inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .ab-btn-toggle {
          position: absolute;
          right: 0.75rem;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .ab-btn-toggle:hover {
          color: #0f172a;
          background-color: #f1f5f9;
        }

        .ab-form-error {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.85rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .ab-btn {
          height: 50px;
          width: 100%;
          margin-top: 0.5rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ab-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
          filter: brightness(1.05);
        }

        .ab-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .ab-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          box-shadow: none;
          filter: grayscale(0.2);
        }

        .ab-spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: ab-spin 0.6s linear infinite;
        }

        @keyframes ab-spin {
          to { transform: rotate(360deg); }
        }

        /* Responsivo */
        @media (max-width: 960px) {
          .ab-hero {
            display: none;
          }
          .ab-panel {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      {/* IZQUIERDA - HERO */}
      <section className="ab-hero">
        <div className="ab-hero-glow"></div>

        <div className="ab-brand">
          <BrandMark />
          <span className="ab-brand-name">AbanPlay</span>
        </div>

        <div className="ab-pitch-wrapper">
          <PitchLines />
        </div>

        <div className="ab-hero-footer">
          <div className="ab-hero-badge">
            <span className="ab-hero-badge-dot"></span>
            Plataforma de Gestión
          </div>
          <h1>
            Cada reserva, <br />
            <span>con su pago al día.</span>
          </h1>
          <p>
            Controla usuarios, disponibilidad de canchas y validación de vouchers desde un único panel intuitivo.
          </p>
        </div>
      </section>

      {/* DERECHA - FORMULARIO */}
      <section className="ab-panel">
        <div className="ab-card">
          <div className="ab-card-header">
            <h2>Iniciar sesión</h2>
            <p className="ab-lead">Accede con tus credenciales de administrador.</p>
          </div>

          <form className="ab-form-stack" onSubmit={onSubmit} noValidate>
            <div className="ab-field">
              <label htmlFor="correo" className="ab-label">Correo electrónico</label>
              <div className="ab-input-wrap">
                <input
                  id="correo"
                  className="ab-input"
                  type="email"
                  autoComplete="username"
                  placeholder="nombre@empresa.com"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  required
                />
                <svg className="ab-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
            </div>

            <div className="ab-field">
              <label htmlFor="password" className="ab-label">Contraseña</label>
              <div className="ab-input-wrap">
                <input
                  id="password"
                  className="ab-input ab-input-pass"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <svg className="ab-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                
                <button
                  type="button"
                  className="ab-btn-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="ab-form-error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="ab-btn"
              disabled={loading || !form.correo || !form.password}
            >
              {loading ? <div className="ab-spinner"></div> : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}