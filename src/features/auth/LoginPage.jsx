import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logoImg from '../../assets/logo-login.png';

function PitchLines() {
  return (
    <svg className="pitch" viewBox="0 0 600 800" aria-hidden="true">
      <rect x="40" y="40" width="520" height="720" />
      <line x1="40" y1="400" x2="560" y2="400" />
      <circle cx="300" cy="400" r="84" />
      <rect x="165" y="40" width="270" height="120" />
      <rect x="230" y="40" width="140" height="46" />
      <rect x="165" y="640" width="270" height="120" />
      <rect x="230" y="714" width="140" height="46" />
      <path d="M 240 160 A 66 66 0 0 0 360 160" />
      <path d="M 240 640 A 66 66 0 0 1 360 640" />
    </svg>
  );
}

function BrandMark() {
  return (
<span className="brand-mark" aria-hidden="true">
  <img 
    src={logoImg} 
    alt="Logo" 
    style={{ width: '35px', height: '35px', objectFit: 'contain' }} 
  />
</span>
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <section className="auth-hero">
        <span className="brand">
          <BrandMark /> AbanPlay
        </span>
        <PitchLines />
        <div>
          <h1>Cada reserva, con su pago al día.</h1>
          <p>Gestiona usuarios, reservas y vouchers desde un solo panel.</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h2>Iniciar sesión</h2>
          <p className="lead">Ingresa con tu correo y contraseña.</p>

          <form className="form-stack" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="correo">Correo</label>
              <input
                id="correo"
                className="input"
                type="email"
                autoComplete="username"
                placeholder="nombre@empresa.com"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrap">
                <input
                  id="password"
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button className="btn btn--block" disabled={loading || !form.correo || !form.password}>
              {loading ? 'Entrando…' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
