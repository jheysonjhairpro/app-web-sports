import { useEffect, useMemo, useState } from 'react';
import Modal from '@/shared/components/Modal';
import { useToast } from '@/shared/components/ToastProvider';
import { useActualizarComplejo, useCrearComplejo } from './useComplejos';

const CAMPOS = ['nombre', 'descripcion', 'direccion', 'ciudad', 'telefono', 'latitud', 'longitud'];
const MAX_MB = 5; // SUPUESTO: tamaño máximo de la foto

const textOf = (v) => (v != null ? String(v) : '');

export default function ComplejoFormModal({ complejo, onClose }) {
  const isEdit = Boolean(complejo);
  const toast = useToast();
  const crear = useCrearComplejo();
  const actualizar = useActualizarComplejo();
  const pending = crear.isPending || actualizar.isPending;

  const [form, setForm] = useState(() => Object.fromEntries(CAMPOS.map((k) => [k, textOf(complejo?.[k])])));
  const [destacado, setDestacado] = useState(false);
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState(null);

  const preview = useMemo(() => (foto ? URL.createObjectURL(foto) : complejo?.fotoUrl ?? null), [foto, complejo]);
  useEffect(
    () => () => {
      if (foto && preview) URL.revokeObjectURL(preview);
    },
    [foto, preview]
  );

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!form.nombre.trim()) return setError('El nombre es obligatorio');
    if (foto) {
      if (!foto.type.startsWith('image/')) return setError('La foto debe ser una imagen (JPG, PNG o WebP)');
      if (foto.size > MAX_MB * 1024 * 1024) return setError(`La foto supera ${MAX_MB} MB`);
    }

    const opciones = {
      onSuccess: () => {
        toast.success(isEdit ? 'Complejo actualizado' : 'Complejo creado');
        onClose();
      },
      onError: (err) => setError(err.message),
    };

    if (isEdit) {
      // PATCH parcial: solo se envían los campos que cambiaron.
      const values = {};
      CAMPOS.forEach((k) => {
        const next = form[k].trim();
        if (next !== '' && next !== textOf(complejo[k])) values[k] = next;
      });
      if (foto) values.foto = foto;
      if (Object.keys(values).length === 0) return setError('No hay cambios para guardar');
      actualizar.mutate({ id: complejo.id, values }, opciones);
    } else {
      const values = Object.fromEntries(CAMPOS.map((k) => [k, form[k].trim()]));
      crear.mutate({ ...values, destacado: String(destacado), foto }, opciones);
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
        <div className="grid-2">
          <div className="field">
            <label htmlFor="cx-lat">Latitud</label>
            <input id="cx-lat" className="input" inputMode="decimal" placeholder="-13.6339" value={form.latitud} onChange={set('latitud')} />
          </div>
          <div className="field">
            <label htmlFor="cx-lng">Longitud</label>
            <input id="cx-lng" className="input" inputMode="decimal" placeholder="-72.8814" value={form.longitud} onChange={set('longitud')} />
          </div>
        </div>

        <div className="field">
          <span className="field-label">Foto</span>
          {preview && <img className="photo-preview" src={preview} alt="Vista previa del complejo" />}
          <label className={`dropzone ${foto ? 'has-file' : ''}`}>
            <input className="sr-only" type="file" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
            <strong>{foto ? foto.name : isEdit ? 'Cambiar la foto' : 'Elegir una foto'}</strong>
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
