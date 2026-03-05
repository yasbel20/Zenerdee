import React, { useEffect, useState } from 'react';
import { BASE_URL, usuarioService } from '../services/api';

export default function AdminCarts() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [devAttempted, setDevAttempted] = useState(false);
  const [error, setError] = useState(null);

  const loadCarts = async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await fetch(`${BASE_URL}/admin_user_carts.php`, { credentials: 'include' });
      if (!res.ok) throw new Error('No autorizado o error');
      const data = await res.json();
      const newData = data || [];
      if (JSON.stringify(newData) !== JSON.stringify(carts)) setCarts(newData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      const msg = e.message || 'Error al cargar carritos';
      if (!silent) setError(msg);
      const isLocal = window && window.location && window.location.hostname === 'localhost';
      if (!silent && isLocal && !devAttempted) {
        setDevAttempted(true);
        try {
          await usuarioService.devAutoLogin('admin@zanerdee.com');
          setTimeout(() => loadCarts(true), 400);
        } catch (dl) {
          if (!silent) setError(msg + ' | Dev auto-login failed: ' + (dl.message || dl));
        }
      }
      if (!silent) setCarts([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadCarts(false);
    const id = setInterval(() => loadCarts(true), 5000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Cargando carritos...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h2 style={{ margin: 0 }}>Carritos de usuarios</h2>
        <button onClick={() => loadCarts(false)} style={{ padding: '6px 10px' }}>Actualizar</button>
        {lastUpdated && <small style={{ color: '#666' }}>Última: {lastUpdated}</small>}
      </div>
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
      {carts.length === 0 ? <p>No hay carritos guardados.</p> : (
        carts.map((c) => (
          <div key={c.user_id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
            <div><strong>Usuario:</strong> {c.nombre || c.email} (ID {c.user_id})</div>
            <div style={{ marginTop: 8 }}>
              <strong>Contenido:</strong>
              <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{JSON.stringify(c.data, null, 2)}</pre>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
