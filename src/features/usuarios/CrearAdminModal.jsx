import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import { useToast } from '@/shared/components/ToastProvider';
import { useCrearAdministrador } from './useUsuarios';

// Iconos estilizados
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default function CrearAdminModal({ onClose }) {
  const toast = useToast();
  const crear = useCrearAdministrador();
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
    if (apiError) setApiError(null);
  };

  const validarFormulario = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9}$/;

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es obligatorio.';
    } else if (form.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (!form.correo.trim()) {
      newErrors.correo = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(form.correo.trim())) {
      newErrors.correo = 'Ingresa un correo electrónico válido.';
    }

    if (form.telefono.trim() && !phoneRegex.test(form.telefono.trim())) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos numéricos.';
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validarFormulario()) return;

    crear.mutate(
      {
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim() || undefined,
        password: form.password,
      },
      {
        onSuccess: () => {
          toast.success('Administrador creado exitosamente');
          onClose();
        },
        onError: (err) => setApiError(err.message || 'Ocurrió un error al crear la cuenta.'),
      }
    );
  };

  return (
    <Modal title="Nuevo administrador" onClose={onClose}>
      <div className="cam-wrapper">
        <style>{`
          .cam-wrapper, .cam-wrapper * {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
          }

          .cam-wrapper {
            padding: 0.25rem 0.25rem 0 0.25rem;
          }

          .cam-form {
            display: flex;
            flex-direction: column;
            gap: 1.15rem;
          }

          .cam-field {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
          }

          .cam-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: #334155;
          }

          .cam-input-wrap {
            position: relative;
            display: flex;
            align-items: center;
          }

          .cam-icon {
            position: absolute;
            left: 14px;
            color: #94a3b8;
            pointer-events: none;
            transition: color 0.2s ease;
          }

          .cam-input {
            width: 100%;
            height: 46px;
            padding: 0 1rem 0 2.75rem;
            background-color: #f8fafc !important;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            font-size: 0.925rem;
            color: #0f172a !important;
            outline: none;
            transition: all 0.2s ease;
          }

          .cam-input:focus {
            background-color: #ffffff !important;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
          }

          .cam-input-wrap:focus-within .cam-icon {
            color: #10b981;
          }

          .cam-input-error {
            border-color: #ef4444 !important;
          }

          .cam-input-error:focus {
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
          }

          .cam-error-text {
            font-size: 0.775rem;
            color: #dc2626;
            font-weight: 500;
          }

          .cam-btn-toggle {
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

          .cam-btn-toggle:hover {
            color: #0f172a;
            background-color: #f1f5f9;
          }

          .cam-api-error {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 0.75rem 1rem;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 500;
          }

          /* Botones alineados sin cortes de línea */
          .cam-actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1rem;
            padding-top: 0.5rem;
          }

          .cam-btn-cancel {
            height: 44px;
            padding: 0 1.25rem;
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 600;
            font-size: 0.9rem;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .cam-btn-cancel:hover {
            background-color: #e2e8f0;
            color: #0f172a;
          }

          .cam-btn-submit {
            height: 44px;
            padding: 0 1.35rem;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            font-weight: 700;
            font-size: 0.9rem;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .cam-btn-submit:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
            filter: brightness(1.05);
          }

          .cam-btn-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            box-shadow: none;
          }

          .cam-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: cam-spin 0.6s linear infinite;
          }

          @keyframes cam-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        <form className="cam-form" onSubmit={onSubmit} noValidate>
          {/* Nombre completo */}
          <div className="cam-field">
            <label htmlFor="adm-nombre" className="cam-label">Nombre completo</label>
            <div className="cam-input-wrap">
              <span className="cam-icon"><UserIcon /></span>
              <input
                id="adm-nombre"
                className={`cam-input ${errors.nombre ? 'cam-input-error' : ''}`}
                placeholder="Ej. Carlos Mendoza"
                value={form.nombre}
                onChange={set('nombre')}
                required
              />
            </div>
            {errors.nombre && <span className="cam-error-text">{errors.nombre}</span>}
          </div>

          {/* Correo */}
          <div className="cam-field">
            <label htmlFor="adm-correo" className="cam-label">Correo electrónico</label>
            <div className="cam-input-wrap">
              <span className="cam-icon"><MailIcon /></span>
              <input
                id="adm-correo"
                className={`cam-input ${errors.correo ? 'cam-input-error' : ''}`}
                type="email"
                placeholder="carlos@empresa.com"
                value={form.correo}
                onChange={set('correo')}
                required
              />
            </div>
            {errors.correo && <span className="cam-error-text">{errors.correo}</span>}
          </div>

          {/* Teléfono */}
          <div className="cam-field">
            <label htmlFor="adm-telefono" className="cam-label">Teléfono (Opcional)</label>
            <div className="cam-input-wrap">
              <span className="cam-icon"><PhoneIcon /></span>
              <input
                id="adm-telefono"
                className={`cam-input ${errors.telefono ? 'cam-input-error' : ''}`}
                type="tel"
                placeholder="987654321"
                value={form.telefono}
                onChange={set('telefono')}
              />
            </div>
            {errors.telefono && <span className="cam-error-text">{errors.telefono}</span>}
          </div>

          {/* Contraseña */}
          <div className="cam-field">
            <label htmlFor="adm-password" className="cam-label">Contraseña de acceso</label>
            <div className="cam-input-wrap">
              <span className="cam-icon"><LockIcon /></span>
              <input
                id="adm-password"
                className={`cam-input ${errors.password ? 'cam-input-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                required
              />
              <button
                type="button"
                className="cam-btn-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.password && <span className="cam-error-text">{errors.password}</span>}
          </div>

          {/* Error de la API */}
          {apiError && (
            <div className="cam-api-error" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <span>{apiError}</span>
            </div>
          )}

          {/* Acciones del Modal */}
          <div className="cam-actions">
            <button type="button" className="cam-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="cam-btn-submit" disabled={crear.isPending}>
              {crear.isPending ? <div className="cam-spinner" /> : 'Crear administrador'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}