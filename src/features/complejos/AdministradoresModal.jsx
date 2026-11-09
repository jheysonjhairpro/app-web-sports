import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import { useToast } from '@/shared/components/ToastProvider';
import { useUsuarios } from '@/features/usuarios/useUsuarios';
import { extractList } from '@/shared/utils/extractList';
import { initials } from '@/shared/utils/format';
import { useAdministradoresComplejo, useAsignarAdministrador, useQuitarAdministrador } from './useComplejos';

const ShieldCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const UserPlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="17" y1="11" x2="23" y2="11"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

export default function AdministradoresModal({ complejo, onClose }) {
  const toast = useToast();
  const lista = useAdministradoresComplejo(complejo.id);
  const candidatos = useUsuarios({ page: 1, limit: 100, rol: 'administrador' });
  const asignar = useAsignarAdministrador();
  const quitar = useQuitarAdministrador();
  const [seleccion, setSeleccion] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const asignados = extractList(lista.data).map((it) => it.usuario ?? it);
  const idsAsignados = new Set(asignados.map((u) => u.id));
  const disponibles = extractList(candidatos.data).filter((u) => !idsAsignados.has(u.id) && u.activo !== false);

  const onAsignar = () => {
    if (!seleccion) return;
    asignar.mutate(
      { complejoId: complejo.id, usuarioId: Number(seleccion) },
      {
        onSuccess: () => {
          toast.success('Administrador asignado con éxito');
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
      <div className="adm-modal-wrapper">
        <style>{`
          .adm-modal-wrapper, .adm-modal-wrapper * {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
          }

          .adm-modal-wrapper {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .adm-section-title {
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
          }

          /* LISTA DE ADMINISTRADORES ASIGNADOS */
          .adm-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            list-style: none;
          }

          .adm-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 0.85rem 1rem;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            transition: all 0.2s ease;
          }

          .adm-item:hover {
            border-color: #cbd5e1;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          }

          .adm-user-info {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            flex: 1;
            min-width: 0;
          }

          .adm-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: linear-gradient(135deg, #06110d 0%, #0d281e 100%);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #10b981;
            font-weight: 800;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
            text-transform: uppercase;
          }

          .adm-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .adm-details {
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .adm-name {
            font-weight: 700;
            font-size: 0.925rem;
            color: #0f172a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .adm-email {
            font-size: 0.8rem;
            color: #64748b;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          /* BOTONES DE ACCIÓN */
          .adm-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .adm-btn-ghost {
            height: 36px;
            padding: 0 0.85rem;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            color: #475569;
            font-weight: 600;
            font-size: 0.825rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.35rem;
            transition: all 0.2s ease;
          }

          .adm-btn-ghost:hover {
            background-color: #fef2f2;
            color: #dc2626;
            border-color: #fecaca;
          }

          .adm-btn-danger {
            height: 36px;
            padding: 0 0.85rem;
            background-color: #ef4444;
            border: none;
            border-radius: 8px;
            color: #ffffff;
            font-weight: 700;
            font-size: 0.825rem;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
            transition: all 0.2s ease;
          }

          .adm-btn-danger:hover:not(:disabled) {
            background-color: #dc2626;
          }

          .adm-btn-cancel {
            height: 36px;
            padding: 0 0.85rem;
            background-color: #f1f5f9;
            border: none;
            border-radius: 8px;
            color: #64748b;
            font-weight: 600;
            font-size: 0.825rem;
            cursor: pointer;
          }

          /* BLOQUE PARA ASIGNAR NUEVO ADMIN */
          .adm-assign-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
          }

          .adm-assign-row {
            display: flex;
            gap: 0.75rem;
            align-items: center;
          }

          @media (max-width: 520px) {
            .adm-assign-row {
              flex-direction: column;
            }
          }

          .adm-select {
            flex: 1;
            height: 44px;
            padding: 0 2.5rem 0 1rem;
            background-color: #ffffff;
            border: 1.5px solid #e2e8f0;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 600;
            color: #334155;
            outline: none;
            cursor: pointer;
            transition: all 0.2s ease;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%64748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
          }

          .adm-select:focus {
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
          }

          .adm-btn-submit {
            height: 44px;
            padding: 0 1.25rem;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            font-weight: 700;
            font-size: 0.875rem;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
            transition: all 0.2s ease;
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
          }

          .adm-btn-submit:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
          }

          .adm-btn-submit:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            box-shadow: none;
          }

          /* ESTADO VACÍO / SKELETON */
          .adm-empty-box {
            padding: 2.5rem 1rem;
            text-align: center;
            background: #ffffff;
            border: 1px dashed #cbd5e1;
            border-radius: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.4rem;
          }

          .adm-empty-box h3 {
            font-size: 1rem;
            font-weight: 700;
            color: #0f172a;
          }

          .adm-empty-box p {
            font-size: 0.85rem;
            color: #64748b;
          }

          .adm-skeleton-row {
            height: 56px;
            border-radius: 12px;
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: adm-shimmer 1.5s infinite;
          }

          @keyframes adm-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>

        {/* LISTADO DE ASIGNADOS */}
        <div>
          <span className="adm-section-title">
            <ShieldCheckIcon /> Administradores Encargados ({asignados.length})
          </span>

          {lista.isLoading ? (
            <div className="adm-skeleton-row" />
          ) : lista.isError ? (
            <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{lista.error.message}</p>
          ) : asignados.length === 0 ? (
            <div className="adm-empty-box">
              <h3>Sin administradores asignados</h3>
              <p>Este complejo actualmente no tiene personal asignado para su gestión.</p>
            </div>
          ) : (
            <ul className="adm-list">
              {asignados.map((u) => (
                <li className="adm-item" key={u.id}>
                  <div className="adm-user-info">
                    <span className="adm-avatar">
                      {u.fotoUrl ? <img src={u.fotoUrl} alt={u.nombre} /> : initials(u.nombre)}
                    </span>
                    <div className="adm-details">
                      <span className="adm-name">{u.nombre}</span>
                      <span className="adm-email">{u.correo}</span>
                    </div>
                  </div>

                  <div className="adm-actions">
                    {confirmId === u.id ? (
                      <>
                        <button
                          className="adm-btn-danger"
                          disabled={quitar.isPending}
                          onClick={() => onQuitar(u)}
                        >
                          {quitar.isPending ? 'Quitando…' : 'Sí, quitar'}
                        </button>
                        <button className="adm-btn-cancel" onClick={() => setConfirmId(null)}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        className="adm-btn-ghost"
                        onClick={() => setConfirmId(u.id)}
                        title="Desvincular del complejo"
                      >
                        <TrashIcon /> Quitar
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* SECCIÓN ASIGNAR ADMINISTRADOR */}
        <div className="adm-assign-card">
          <span className="adm-section-title" style={{ margin: 0 }}>
            <UserPlusIcon /> Asignar Nuevo Administrador
          </span>

          {disponibles.length === 0 && !candidatos.isLoading ? (
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              No hay más administradores disponibles en el sistema. Puedes crear nuevas cuentas desde el módulo de <strong>Usuarios</strong>.
            </p>
          ) : (
            <div className="adm-assign-row">
              <select
                className="adm-select"
                aria-label="Administrador a asignar"
                value={seleccion}
                onChange={(e) => setSeleccion(e.target.value)}
              >
                <option value="">Selecciona un usuario administrador...</option>
                {disponibles.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} — ({u.correo})
                  </option>
                ))}
              </select>

              <button
                className="adm-btn-submit"
                disabled={!seleccion || asignar.isPending}
                onClick={onAsignar}
              >
                {asignar.isPending ? 'Asignando…' : 'Asignar a complejo'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}