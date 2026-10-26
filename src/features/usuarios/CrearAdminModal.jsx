import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import { useToast } from '@/shared/components/ToastProvider';
import { useCrearAdministrador } from './useUsuarios';

export default function CrearAdminModal({ onClose }) {
  const toast = useToast();
  const crear = useCrearAdministrador();
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', password: '' });
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setError(null);
    crear.mutate(
      { ...form, nombre: form.nombre.trim(), correo: form.correo.trim(), telefono: form.telefono.trim() },
      {
        onSuccess: () => {
          toast.success('Administrador creado');
          onClose();
        },
        onError: (err) => setError(err.message),
      }
    );
  };

  return (
    <Modal title="Nuevo administrador" onClose={onClose}>
      <form className="form-stack" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="adm-nombre">Nombre completo</label>
          <input id="adm-nombre" className="input" value={form.nombre} onChange={set('nombre')} required />
        </div>
        <div className="field">
          <label htmlFor="adm-correo">Correo</label>
          <input id="adm-correo" className="input" type="email" value={form.correo} onChange={set('correo')} required />
        </div>
        <div className="field">
          <label htmlFor="adm-telefono">Teléfono</label>
          <input id="adm-telefono" className="input" type="tel" value={form.telefono} onChange={set('telefono')} />
        </div>
        <div className="field">
          <label htmlFor="adm-password">Contraseña</label>
          <input
            id="adm-password"
            className="input"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={set('password')}
            required
          />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn" disabled={crear.isPending}>
            {crear.isPending ? 'Creando…' : 'Crear administrador'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
