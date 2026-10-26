import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import { useToast } from '@/shared/components/ToastProvider';
import { useUsuarios } from '@/features/usuarios/useUsuarios';
import { extractList } from '@/shared/utils/extractList';
import { initials } from '@/shared/utils/format';
import { useAdministradoresComplejo, useAsignarAdministrador, useQuitarAdministrador } from './useComplejos';

export default function AdministradoresModal({ complejo, onClose }) {
  const toast = useToast();
  const lista = useAdministradoresComplejo(complejo.id);
  const candidatos = useUsuarios({ page: 1, limit: 100, rol: 'administrador' });
  const asignar = useAsignarAdministrador();
  const quitar = useQuitarAdministrador();
  const [seleccion, setSeleccion] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  // Cada elemento puede ser el usuario o una fila { usuario: {...} }.
  const asignados = extractList(lista.data).map((it) => it.usuario ?? it);
  const idsAsignados = new Set(asignados.map((u) => u.id));
  const disponibles = extractList(candidatos.data).filter((u) => !idsAsignados.has(u.id) && u.activo !== false);

  const onAsignar = () => {
    if (!seleccion) return;
    asignar.mutate(
      { complejoId: complejo.id, usuarioId: Number(seleccion) },
      {
        onSuccess: () => {
          toast.success('Administrador asignado');
          setSeleccion('');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const onQuitar = (u) => {
    quitar.mutate(
      { complejoId: complejo.id, usuarioId: u.id },
      {
        onSuccess: () => {
          toast.success(`${u.nombre} ya no administra este complejo`);
          setConfirmId(null);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <Modal title={`Administradores · ${complejo.nombre}`} onClose={onClose} wide>
      {lista.isLoading && <span className="skeleton" style={{ width: '60%' }} />}
      {lista.isError && <p className="form-error">{lista.error.message}</p>}

      {!lista.isLoading && !lista.isError && asignados.length === 0 && (
        <div className="state" style={{ padding: '24px 0' }}>
          <h3>Sin administradores</h3>
          <p>Asigna a alguien para que gestione este complejo.</p>
        </div>
      )}

      {asignados.length > 0 && (
        <ul className="list">
          {asignados.map((u) => (
            <li key={u.id}>
              <span className="avatar">{u.fotoUrl ? <img src={u.fotoUrl} alt="" /> : initials(u.nombre)}</span>
              <div className="grow">
                <strong>{u.nombre}</strong>
                <span>{u.correo}</span>
              </div>
              {confirmId === u.id ? (
                <>
                  <button className="btn btn--danger btn--sm" disabled={quitar.isPending} onClick={() => onQuitar(u)}>
                    Sí, quitar
                  </button>
                  <button className="btn btn--ghost btn--sm" onClick={() => setConfirmId(null)}>
                    Cancelar
                  </button>
                </>
              ) : (
                <button className="btn btn--ghost btn--sm" onClick={() => setConfirmId(u.id)}>
                  Quitar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="section-label">Asignar administrador</p>
      {disponibles.length === 0 && !candidatos.isLoading ? (
        <p className="muted">No hay más administradores disponibles. Crea uno desde la sección Usuarios.</p>
      ) : (
        <div className="assign-row">
          <select className="select" aria-label="Administrador a asignar" value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
            <option value="">Elige un administrador</option>
            {disponibles.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} — {u.correo}
              </option>
            ))}
          </select>
          <button className="btn" disabled={!seleccion || asignar.isPending} onClick={onAsignar}>
            {asignar.isPending ? 'Asignando…' : 'Asignar'}
          </button>
        </div>
      )}
    </Modal>
  );
}
