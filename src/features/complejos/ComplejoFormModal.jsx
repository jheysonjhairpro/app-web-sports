import { useEffect, useMemo, useState } from 'react';
import Modal from '@/shared/components/Modal';
import { useToast } from '@/shared/components/ToastProvider';
import { useActualizarComplejo, useCrearComplejo } from './useComplejos';

const CAMPOS = ['nombre', 'descripcion', 'direccion', 'ciudad', 'telefono', 'latitud', 'longitud', 'numeroYape'];
const MAX_MB = 5;

const textOf = (v) => (v != null ? String(v) : '');

// Iconos estilizados
const BuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/>
    <path d="M12 10h.01"/><path d="M12 14h.01"/>
    <path d="M16 10h.01"/><path d="M16 14h.01"/>
    <path d="M8 10h.01"/><path d="M8 14h.01"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const QrCodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="5" height="5" x="3" y="3" rx="1"/>
    <rect width="5" height="5" x="16" y="3" rx="1"/>
    <rect width="5" height="5" x="3" y="16" rx="1"/>
    <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
    <path d="M21 21v.01"/>
    <path d="M12 7v3a2 2 0 0 1-2 2H7"/>
    <path d="M3 12h.01"/>
    <path d="M12 3h.01"/>
    <path d="M12 16v.01"/>
    <path d="M16 12h1"/>
    <path d="M21 12v.01"/>
    <path d="M12 21v-1"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

export default function ComplejoFormModal({ complejo, onClose }) {
  const isEdit = Boolean(complejo);
  const toast = useToast();
  const crear = useCrearComplejo();
  const actualizar = useActualizarComplejo();
  const pending = crear.isPending || actualizar.isPending;

  const [form, setForm] = useState(() => Object.fromEntries(CAMPOS.map((k) => [k, textOf(complejo?.[k])])));
  const [destacado, setDestacado] = useState(Boolean(complejo?.destacado));
  
  const [foto, setFoto] = useState(null);
  const [qrYape, setQrYape] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const preview = useMemo(() => (foto ? URL.createObjectURL(foto) : complejo?.fotoUrl ?? null), [foto, complejo]);
  const previewQr = useMemo(() => (qrYape ? URL.createObjectURL(qrYape) : complejo?.qrYapeUrl ?? null), [qrYape, complejo]);

  useEffect(() => {
    return () => {
      if (foto && preview) URL.revokeObjectURL(preview);
      if (qrYape && previewQr) URL.revokeObjectURL(previewQr);
    };
  }, [foto, preview, qrYape, previewQr]);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: null }));
    if (apiError) setApiError(null);
  };

  const validarFormulario = () => {
    const errs = {};
    const phoneRegex = /^[0-9]{9}$/;
    const coordRegex = /^-?\d+(\.\d+)?$/;

    if (!form.nombre.trim()) {
      errs.nombre = 'El nombre del complejo es obligatorio.';
    } else if (form.nombre.trim().length < 3) {
      errs.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (form.telefono.trim() && !phoneRegex.test(form.telefono.trim())) {
      errs.telefono = 'El teléfono debe tener 9 dígitos numéricos.';
    }

    if (form.numeroYape.trim() && !phoneRegex.test(form.numeroYape.trim())) {
      errs.numeroYape = 'El número de Yape debe tener 9 dígitos numéricos.';
    }

    if (form.latitud.trim() && !coordRegex.test(form.latitud.trim())) {
      errs.latitud = 'Ingresa una latitud válida (ej: -13.6339).';
    }

    if (form.longitud.trim() && !coordRegex.test(form.longitud.trim())) {
      errs.longitud = 'Ingresa una longitud válida (ej: -72.8814).';
    }

    if (foto) {
      if (!foto.type.startsWith('image/')) errs.foto = 'Selecciona una imagen válida (JPG, PNG o WebP).';
      if (foto.size > MAX_MB * 1024 * 1024) errs.foto = `La imagen supera los ${MAX_MB} MB permitidos.`;
    }

    if (qrYape) {
      if (!qrYape.type.startsWith('image/')) errs.qrYape = 'El QR debe ser una imagen válida.';
      if (qrYape.size > MAX_MB * 1024 * 1024) errs.qrYape = `El QR supera los ${MAX_MB} MB permitidos.`;
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validarFormulario()) return;

    const values = {};
    CAMPOS.forEach((k) => {
      const val = form[k].trim();
      if (val !== '') {
        values[k] = val;
      }
    });

    if (values.latitud) values.latitud = Number(values.latitud);
    if (values.longitud) values.longitud = Number(values.longitud);

    const opciones = {
      onSuccess: () => {
        toast.success(isEdit ? 'Complejo actualizado con éxito' : 'Complejo creado con éxito');
        onClose();
      },
      onError: (err) => {
        const msg = Array.isArray(err?.response?.data?.message)
          ? err.response.data.message.join(', ')
          : err.message || 'Error al guardar los datos del complejo.';
        setApiError(msg);
      },
    };

    if (isEdit) {
      const editValues = {};
      Object.keys(values).forEach((k) => {
        if (values[k] !== textOf(complejo[k])) editValues[k] = values[k];
      });

      if (foto) editValues.foto = foto;
      if (qrYape) editValues.qrYape = qrYape;

      if (Object.keys(editValues).length === 0) {
        return setApiError('No has realizado ningún cambio para guardar.');
      }
      actualizar.mutate({ id: complejo.id, values: editValues }, opciones);
    } else {
      if (foto) values.foto = foto;
      if (qrYape) values.qrYape = qrYape;

      crear.mutate({ ...values, destacado: String(destacado) }, opciones);
    }
  };

  return (
    <Modal title={isEdit ? 'Editar complejo' : 'Nuevo complejo deportivo'} onClose={onClose} wide>
      <div className="cfm-wrapper">
        <style>{`
          .cfm-wrapper, .cfm-wrapper * {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Inter, sans-serif;
            -webkit-font-smoothing: antialiased;
          }

          .cfm-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .cfm-section-title {
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #10b981;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .cfm-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }

          @media (max-width: 640px) {
            .cfm-grid-2 {
              grid-template-columns: 1fr;
            }
          }

          .cfm-field {
            display: flex;
            flex-direction: column;
            gap: 0.45rem;
          }

          .cfm-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: #334155;
          }

          .cfm-input-wrap {
            position: relative;
            display: flex;
            align-items: center;
          }

          .cfm-icon {
            position: absolute;
            left: 14px;
            color: #94a3b8;
            pointer-events: none;
            transition: color 0.2s ease;
          }

          .cfm-input {
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

          .cfm-textarea {
            width: 100%;
            min-height: 85px;
            padding: 0.75rem 1rem;
            background-color: #f8fafc !important;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            font-size: 0.925rem;
            color: #0f172a !important;
            outline: none;
            resize: vertical;
            transition: all 0.2s ease;
          }

          .cfm-input:focus, .cfm-textarea:focus {
            background-color: #ffffff !important;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
          }

          .cfm-input-wrap:focus-within .cfm-icon {
            color: #10b981;
          }

          .cfm-input-error, .cfm-textarea-error {
            border-color: #ef4444 !important;
          }

          .cfm-error-text {
            font-size: 0.775rem;
            color: #dc2626;
            font-weight: 500;
          }

          /* DROPZONE DE IMÁGENES */
          .cfm-upload-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }

          @media (max-width: 640px) {
            .cfm-upload-grid {
              grid-template-columns: 1fr;
            }
          }

          .cfm-dropzone {
            border: 2px dashed #cbd5e1;
            border-radius: 14px;
            padding: 1rem;
            background-color: #f8fafc;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
          }

          .cfm-dropzone:hover {
            border-color: #10b981;
            background-color: #ecfdf5;
          }

          .cfm-dropzone.has-file {
            border-color: #10b981;
            background-color: #f0fdf4;
          }

          .cfm-preview-box {
            position: relative;
            width: 100%;
            height: 120px;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 0.5rem;
            border: 1px solid #e2e8f0;
          }

          .cfm-preview-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          /* CHECKBOX DESTACADO */
          .cfm-checkbox-row {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            font-size: 0.9rem;
            font-weight: 600;
            color: #334155;
            cursor: pointer;
            user-select: none;
            margin-top: 0.25rem;
          }

          .cfm-checkbox {
            width: 18px;
            height: 18px;
            accent-color: #10b981;
            cursor: pointer;
          }

          .cfm-api-error {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 0.85rem 1rem;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 500;
          }

          /* ACCIONES */
          .cfm-actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.75rem;
            padding-top: 1rem;
            border-top: 1px solid #f1f5f9;
          }

          .cfm-btn-cancel {
            height: 46px;
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

          .cfm-btn-cancel:hover {
            background-color: #e2e8f0;
            color: #0f172a;
          }

          .cfm-btn-submit {
            height: 46px;
            padding: 0 1.6rem;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            font-weight: 700;
            font-size: 0.9rem;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .cfm-btn-submit:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
            filter: brightness(1.05);
          }

          .cfm-btn-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            box-shadow: none;
          }

          .cfm-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: cfm-spin 0.6s linear infinite;
          }

          @keyframes cfm-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        <form className="cfm-form" onSubmit={onSubmit} noValidate>
          {/* INFORMACIÓN PRINCIPAL */}
          <div>
            <span className="cfm-section-title"><BuildingIcon /> Información General</span>
            <div className="cfm-field" style={{ marginBottom: '1rem' }}>
              <label htmlFor="cx-nombre" className="cfm-label">Nombre del complejo *</label>
              <div className="cfm-input-wrap">
                <span className="cfm-icon"><BuildingIcon /></span>
                <input
                  id="cx-nombre"
                  className={`cfm-input ${fieldErrors.nombre ? 'cfm-input-error' : ''}`}
                  placeholder="Ej. Club Deportivo El Golazo"
                  value={form.nombre}
                  onChange={set('nombre')}
                  required
                />
              </div>
              {fieldErrors.nombre && <span className="cfm-error-text">{fieldErrors.nombre}</span>}
            </div>

            <div className="cfm-field">
              <label htmlFor="cx-desc" className="cfm-label">Descripción</label>
              <textarea
                id="cx-desc"
                className={`cfm-textarea ${fieldErrors.descripcion ? 'cfm-textarea-error' : ''}`}
                placeholder="Breve presentación de las instalaciones, vestuarios, estacionamiento..."
                value={form.descripcion}
                onChange={set('descripcion')}
              />
            </div>
          </div>

          {/* UBICACIÓN Y CONTACTO */}
          <div>
            <span className="cfm-section-title"><MapPinIcon /> Ubicación y Contacto</span>
            <div className="cfm-field" style={{ marginBottom: '1rem' }}>
              <label htmlFor="cx-dir" className="cfm-label">Dirección exacta</label>
              <div className="cfm-input-wrap">
                <span className="cfm-icon"><MapPinIcon /></span>
                <input
                  id="cx-dir"
                  className="cfm-input"
                  placeholder="Av. Centenario 450"
                  value={form.direccion}
                  onChange={set('direccion')}
                />
              </div>
            </div>

            <div className="cfm-grid-2">
              <div className="cfm-field">
                <label htmlFor="cx-ciudad" className="cfm-label">Ciudad</label>
                <div className="cfm-input-wrap">
                  <span className="cfm-icon"><MapPinIcon /></span>
                  <input
                    id="cx-ciudad"
                    className="cfm-input"
                    placeholder="Abancay"
                    value={form.ciudad}
                    onChange={set('ciudad')}
                  />
                </div>
              </div>

              <div className="cfm-field">
                <label htmlFor="cx-tel" className="cfm-label">Teléfono de contacto</label>
                <div className="cfm-input-wrap">
                  <span className="cfm-icon"><PhoneIcon /></span>
                  <input
                    id="cx-tel"
                    className={`cfm-input ${fieldErrors.telefono ? 'cfm-input-error' : ''}`}
                    type="tel"
                    placeholder="987654321"
                    value={form.telefono}
                    onChange={set('telefono')}
                  />
                </div>
                {fieldErrors.telefono && <span className="cfm-error-text">{fieldErrors.telefono}</span>}
              </div>
            </div>
          </div>

          {/* PAGO POR YAPE */}
          <div>
            <span className="cfm-section-title"><QrCodeIcon /> Información de Pago (Yape)</span>
            <div className="cfm-grid-2">
              <div className="cfm-field">
                <label htmlFor="cx-yape-num" className="cfm-label">Número Yape titular</label>
                <div className="cfm-input-wrap">
                  <span className="cfm-icon"><PhoneIcon /></span>
                  <input
                    id="cx-yape-num"
                    className={`cfm-input ${fieldErrors.numeroYape ? 'cfm-input-error' : ''}`}
                    type="tel"
                    placeholder="989898989"
                    value={form.numeroYape}
                    onChange={set('numeroYape')}
                  />
                </div>
                {fieldErrors.numeroYape && <span className="cfm-error-text">{fieldErrors.numeroYape}</span>}
              </div>

              <div className="cfm-field">
                <label htmlFor="cx-lat" className="cfm-label">Latitud</label>
                <input
                  id="cx-lat"
                  className={`cfm-input ${fieldErrors.latitud ? 'cfm-input-error' : ''}`}
                  style={{ paddingLeft: '1rem' }}
                  inputMode="decimal"
                  placeholder="-13.6339"
                  value={form.latitud}
                  onChange={set('latitud')}
                />
                {fieldErrors.latitud && <span className="cfm-error-text">{fieldErrors.latitud}</span>}
              </div>
            </div>

            <div className="cfm-field" style={{ marginTop: '1rem' }}>
              <label htmlFor="cx-lng" className="cfm-label">Longitud</label>
              <input
                id="cx-lng"
                className={`cfm-input ${fieldErrors.longitud ? 'cfm-input-error' : ''}`}
                style={{ paddingLeft: '1rem' }}
                inputMode="decimal"
                placeholder="-72.8814"
                value={form.longitud}
                onChange={set('longitud')}
              />
              {fieldErrors.longitud && <span className="cfm-error-text">{fieldErrors.longitud}</span>}
            </div>
          </div>

          {/* SUBIDA DE MULTIMEDIA */}
          <div>
            <span className="cfm-section-title"><ImageIcon /> Archivos Multimedia</span>
            <div className="cfm-upload-grid">
              {/* Foto Principal */}
              <div className="cfm-field">
                <span className="cfm-label">Foto principal</span>
                {preview && (
                  <div className="cfm-preview-box">
                    <img src={preview} alt="Vista previa del complejo" />
                  </div>
                )}
                <label className={`cfm-dropzone ${foto ? 'has-file' : ''}`}>
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                  />
                  <ImageIcon />
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>
                    {foto ? foto.name : isEdit ? 'Cambiar foto' : 'Subir foto'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    JPG, PNG o WebP (Máx {MAX_MB}MB)
                  </span>
                </label>
                {fieldErrors.foto && <span className="cfm-error-text">{fieldErrors.foto}</span>}
              </div>

              {/* QR de Yape */}
              <div className="cfm-field">
                <span className="cfm-label">Imagen QR Yape</span>
                {previewQr && (
                  <div className="cfm-preview-box">
                    <img src={previewQr} alt="Vista previa del QR" />
                  </div>
                )}
                <label className={`cfm-dropzone ${qrYape ? 'has-file' : ''}`}>
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setQrYape(e.target.files?.[0] ?? null)}
                  />
                  <QrCodeIcon />
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>
                    {qrYape ? qrYape.name : isEdit ? 'Cambiar QR' : 'Subir QR'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    JPG, PNG o WebP (Máx {MAX_MB}MB)
                  </span>
                </label>
                {fieldErrors.qrYape && <span className="cfm-error-text">{fieldErrors.qrYape}</span>}
              </div>
            </div>
          </div>

          {!isEdit && (
            <label className="cfm-checkbox-row">
              <input
                type="checkbox"
                className="cfm-checkbox"
                checked={destacado}
                onChange={(e) => setDestacado(e.target.checked)}
              />
              Mostrar como complejo destacado en la app
            </label>
          )}

          {apiError && (
            <div className="cfm-api-error" role="alert">
              {apiError}
            </div>
          )}

          {/* ACCIONES */}
          <div className="cfm-actions">
            <button type="button" className="cfm-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="cfm-btn-submit" disabled={pending}>
              {pending ? <div className="cfm-spinner" /> : isEdit ? 'Guardar cambios' : 'Crear complejo'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}