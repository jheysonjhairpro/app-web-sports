import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import { useToast } from '@/shared/components/ToastProvider';
import { useActualizarUsuario } from './useUsuarios';

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export default function EditarUsuarioModal({ usuario, onClose }) {
  const toast = useToast();
  const actualizar = useActualizarUsuario();
  
  const [form, setForm] = useState({
    nombre: usuario?.nombre || '',
    telefono: usuario?.telefono || '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
    if (apiError) setApiError(null);
  };

  const validar = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{9}$/;

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es obligatorio.';
    } else if (form.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (form.telefono.trim() && !phoneRegex.test(form.telefono.trim())) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos numéricos.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validar()) return;

    actualizar.mutate(
      {
        id: usuario.id,
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(`Usuario ${form.nombre} actualizado correctamente`);
          onClose();
        },
        onError: (err) => {
          setApiError(err.message || 'Error al actualizar la información.');
        },
      }
    );
  };

  return (
    <Modal title={`Editar: ${usuario?.nombre}`} onClose={onClose}>
      <div className="eum-wrapper">
        <style>{`
          .eum-wrapper, .eum-wrapper * {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
          }

          .eum-form {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }

          .eum-field {
            display: flex;
            flex-direction: column;
            gap: 0.45rem;
          }

          .eum-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: #334155;
          }

          .eum-input-wrap {
            position: relative;
            display: flex;
            align-items: center;
          }

          .eum-icon {
            position: absolute;
            left: 14px;
            color: #94a3b8;
            pointer-events: none;
            transition: color 0.2s ease;
          }

          .eum-input {
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

          .eum-input:focus {
            background-color: #ffffff !important;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
          }

          .eum-input-wrap:focus-within .eum-icon {
            color: #10b981;
          }

          .eum-input-error {
            border-color: #ef4444 !important;
          }

          .eum-error-text {
            font-size: 0.775rem;
            color: #dc2626;
            font-weight: 500;
          }

          .eum-readonly-info {
            background-color: #f1f5f9;
            padding: 0.75rem 1rem;
            border-radius: 10px;
            font-size: 0.85rem;
            color: #64748b;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .eum-readonly-info span {
            color: #0f172a;
            font-weight: 600;
          }

          .eum-actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 0.75rem;
          }

          .eum-btn-cancel {
            height: 44px;
            padding: 0 1.25rem;
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 600;
            font-size: 0.9rem;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .eum-btn-cancel:hover {
            background-color: #e2e8f0;
            color: #0f172a;
          }

          .eum-btn-submit {
            height: 44px;
            padding: 0 1.5rem;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            font-weight: 700;
            font-size: 0.9rem;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .eum-btn-submit:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
            filter: brightness(1.05);
          }

          .eum-btn-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            box-shadow: none;
          }

          .eum-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: eum-spin 0.6s linear infinite;
          }

          @keyframes eum-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        <form className="eum-form" onSubmit={onSubmit} noValidate>
          {/* Info estática del usuario */}
          <div className="eum-readonly-info">
            Correo de acceso: <span>{usuario?.correo}</span>
          </div>

          {/* Nombre completo */}
          <div className="eum-field">
            <label htmlFor="edit-nombre" className="eum-label">Nombre completo</label>
            <div className="eum-input-wrap">
              <span className="eum-icon"><UserIcon /></span>
              <input
                id="edit-nombre"
                className={`eum-input ${errors.nombre ? 'eum-input-error' : ''}`}
                value={form.nombre}
                onChange={set('nombre')}
                required
              />
            </div>
            {errors.nombre && <span className="eum-error-text">{errors.nombre}</span>}
          </div>

          {/* Teléfono */}
          <div className="eum-field">
            <label htmlFor="edit-telefono" className="eum-label">Teléfono</label>
            <div className="eum-input-wrap">
              <span className="eum-icon"><PhoneIcon /></span>
              <input
                id="edit-telefono"
                className={`eum-input ${errors.telefono ? 'eum-input-error' : ''}`}
                type="tel"
                placeholder="987654321"
                value={form.telefono}
                onChange={set('telefono')}
              />
            </div>
            {errors.telefono && <span className="eum-error-text">{errors.telefono}</span>}
          </div>

          {apiError && (
            <div style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 500 }}>
              {apiError}
            </div>
          )}

          {/* Botones */}
          <div className="eum-actions">
            <button type="button" className="eum-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="eum-btn-submit" disabled={actualizar.isPending}>
              {actualizar.isPending ? <div className="eum-spinner" /> : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}