import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Error al mostrar la página:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="auth-panel" style={{ minHeight: '100vh' }}>
        <div className="auth-card">
          <h2>Algo falló al mostrar la página</h2>
          <p className="lead">Abre la consola del navegador (F12) para ver el detalle.</p>
          <p className="form-error" style={{ marginBottom: 20, wordBreak: 'break-word' }}>
            {String(this.state.error?.message ?? this.state.error)}
          </p>
          <button className="btn" onClick={() => window.location.assign('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }
}
