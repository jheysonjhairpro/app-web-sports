import { useEffect } from 'react';

export default function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="ab-modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        .ab-modal-backdrop, .ab-modal-backdrop * {
          box-sizing: border-box !important;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Inter, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .ab-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(6, 17, 13, 0.72);
          backdrop-filter: blur(1px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
          animation: ab-modal-fade-in 0.2s ease-out;
        }

        .ab-modal-card {
          width: 100%;
          max-width: 480px;
          max-height: 85vh; /* 👈 Limita el alto máximo */
          background: #ffffff;
          border-radius: 24px;
          padding: 1.75rem 2rem 2rem 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
          animation: ab-modal-scale-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .ab-modal-card.ab-modal--wide {
          max-width: 680px;
        }

        /* Header Fijo */
        .ab-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0; /* No se reduce con el contenido */
        }

        .ab-modal-head h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.4px;
        }

        .ab-modal-close-btn {
          background: #f1f5f9;
          border: none;
          color: #64748b;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .ab-modal-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        /* Área de contenido con Scroll interno elegante */
        .ab-modal-body {
          width: 100%;
          overflow-y: auto; /* 👈 Activa el scroll vertical en el contenido */
          padding-top: 1.25rem;
          padding-right: 0.35rem; /* Espacio para el scrollbar */
          flex: 1;
        }

        /* Personalización de scrollbar suave */
        .ab-modal-body::-webkit-scrollbar {
          width: 6px;
        }
        .ab-modal-body::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .ab-modal-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .ab-modal-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @keyframes ab-modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes ab-modal-scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 540px) {
          .ab-modal-card {
            padding: 1.25rem;
            border-radius: 18px;
            max-height: 90vh;
          }
        }
      `}</style>

      <div
        className={`ab-modal-card ${wide ? 'ab-modal--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="ab-modal-head">
          <h2>{title}</h2>
          <button
            className="ab-modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className="ab-modal-body">{children}</div>
      </div>
    </div>
  );
}