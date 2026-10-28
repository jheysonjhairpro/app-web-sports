import { useEffect, useMemo, useState } from 'react';
import Modal from '@/shared/components/Modal';
import { useToast } from '@/shared/components/ToastProvider';
import { useActualizarComplejo, useCrearComplejo } from './useComplejos';

// Incluimos 'numeroYape' dentro de los campos
const CAMPOS = ['nombre', 'descripcion', 'direccion', 'ciudad', 'telefono', 'latitud', 'longitud', 'numeroYape'];
const MAX_MB = 5;

const textOf = (v) => (v != null ? String(v) : '');

export default function ComplejoFormModal({ complejo, onClose }) {
  const isEdit = Boolean(complejo);
  const toast = useToast();
  const crear = useCrearComplejo();
  const actualizar = useActualizarComplejo();
  const pending = crear.isPending || actualizar.isPending;

  const [form, setForm] = useState(() => Object.fromEntries(CAMPOS.map((k) => [k, textOf(complejo?.[k])])));
  const [destacado, setDestacado] = useState(false);
  
  // Estados para ambas imágenes
  const [foto, setFoto] = useState(null);
  const [qrYape, setQrYape] = useState(null);

  const [error, setError] = useState(null);

  // Vistas previas para la foto principal y el QR de Yape
  const preview = useMemo(() => (foto ? URL.createObjectURL(foto) : complejo?.fotoUrl ?? null), [foto, complejo]);
  const previewQr = useMemo(() => (qrYape ? URL.createObjectURL(qrYape) : complejo?.qrYapeUrl ?? null), [qrYape, complejo]);

  useEffect(
    () => () => {
      if (foto && preview) URL.revokeObjectURL(preview);
      if (qrYape && previewQr) URL.revokeObjectURL(previewQr);
    },
    [foto, preview, qrYape, previewQr]
  );

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!form.nombre.trim()) return setError('El nombre es obligatorio');

    // Validaciones de archivos de imagen
    if (foto) {
      if (!foto.type.startsWith('image/')) return setError('La foto principal debe ser una imagen (JPG, PNG o WebP)');
      if (foto.size > MAX_MB * 1024 * 1024) return setError(`La foto principal supera ${MAX_MB} MB`);
    }

    if (qrYape) {
      if (!qrYape.type.startsWith('image/')) return setError('El QR de Yape debe ser una imagen (JPG, PNG o WebP)');
      if (qrYape.size > MAX_MB * 1024 * 1024) return setError(`El QR de Yape supera ${MAX_MB} MB`);
    }

    // Limpieza de campos vacíos para evitar enviar strings vacíos "" a campos numéricos
    const values = {};
    CAMPOS.forEach((k) => {
      const val = form[k].trim();
      if (val !== '') {
        values[k] = val;
      }
    });

    // Convertir explícitamente latitud y longitud a número si se ingresaron
    if (values.latitud) values.latitud = Number(values.latitud);
    if (values.longitud) values.longitud = Number(values.longitud);

    const opciones = {
      onSuccess: () => {
        toast.success(isEdit ? 'Complejo actualizado' : 'Complejo creado');
        onClose();
      },
      onError: (err) => {
        // Muestra el mensaje detallado si la API responde con array de errores de validación
        const msg = Array.isArray(err?.response?.data?.message)
          ? err.response.data.message.join(', ')
          : err.message;
        setError(msg);
      },
    };

    if (isEdit) {
      // En edición, solo dejamos los campos que cambiaron con respecto al complejo original
      const editValues = {};
      Object.keys(values).forEach((k) => {
        if (values[k] !== textOf(complejo[k])) editValues[k] = values[k];
      });

      if (foto) editValues.foto = foto;
      if (qrYape) editValues.qrYape = qrYape;

      if (Object.keys(editValues).length === 0) return setError('No hay cambios para guardar');
      actualizar.mutate({ id: complejo.id, values: editValues }, opciones);
    } else {
      // En creación enviamos todos los valores válidos
      if (foto) values.foto = foto;
      if (qrYape) values.qrYape = qrYape;

      crear.mutate({ ...values, destacado: String(destacado) }, opciones);
    }
  };

  return (
    <Modal title={isEdit ? 'Editar complejo' : 'Nuevo complejo'} onClose={onClose} wide>
      <form className="form-stack" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="cx-nombre">Nombre</label>
          <input id="cx-nombre" className="input" value={form.nombre} onChange={set('nombre')} required />
        </div>
        <div className="field">
          <label htmlFor="cx-desc">Descripción</label>
          <textarea id="cx-desc" className="input" value={form.descripcion} onChange={set('descripcion')} />
        </div>
        <div className="field">
          <label htmlFor="cx-dir">Dirección</label>
          <input id="cx-dir" className="input" value={form.direccion} onChange={set('direccion')} />
        </div>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="cx-ciudad">Ciudad</label>
            <input id="cx-ciudad" className="input" value={form.ciudad} onChange={set('ciudad')} />
          </div>
          <div className="field">
            <label htmlFor="cx-tel">Teléfono</label>
            <input id="cx-tel" className="input" type="tel" value={form.telefono} onChange={set('telefono')} />
          </div>
        </div>

        {/* --- CAMPO DE NÚMERO YAPE --- */}
        <div className="grid-2">
          <div className="field">
            <label htmlFor="cx-yape-num">Número de Yape</label>
            <input
              id="cx-yape-num"
              className="input"
              type="tel"
              placeholder="989898989"
              value={form.numeroYape}
              onChange={set('numeroYape')}
            />
          </div>
          <div className="field">
            <label htmlFor="cx-lat">Latitud</label>
            <input id="cx-lat" className="input" inputMode="decimal" placeholder="-13.6339" value={form.latitud} onChange={set('latitud')} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="cx-lng">Longitud</label>
          <input id="cx-lng" className="input" inputMode="decimal" placeholder="-72.8814" value={form.longitud} onChange={set('longitud')} />
        </div>

        {/* --- SUBIDA DE FOTO PRINCIPAL --- */}
        <div className="field">
          <span className="field-label">Foto principal del complejo</span>
          {preview && <img className="photo-preview" src={preview} alt="Vista previa del complejo" />}
          <label className={`dropzone ${foto ? 'has-file' : ''}`}>
            <input className="sr-only" type="file" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
            <strong>{foto ? foto.name : isEdit ? 'Cambiar la foto principal' : 'Elegir una foto principal'}</strong>
            <small>JPG, PNG o WebP · hasta {MAX_MB} MB</small>
          </label>
        </div>

        {/* --- SUBIDA DE QR DE YAPE --- */}
        <div className="field">
          <span className="field-label">QR de Yape</span>
          {previewQr && <img className="photo-preview" src={previewQr} alt="Vista previa del QR de Yape" />}
          <label className={`dropzone ${qrYape ? 'has-file' : ''}`}>
            <input className="sr-only" type="file" accept="image/*" onChange={(e) => setQrYape(e.target.files?.[0] ?? null)} />
            <strong>{qrYape ? qrYape.name : isEdit ? 'Cambiar la imagen del QR' : 'Subir imagen del QR de Yape'}</strong>
            <small>JPG, PNG o WebP · hasta {MAX_MB} MB</small>
          </label>
        </div>

        {!isEdit && (
          <label className="checkbox-row">
            <input type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} />
            Mostrar como complejo destacado
          </label>
        )}

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn" disabled={pending}>
            {pending ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear complejo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}