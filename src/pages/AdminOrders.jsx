import React, { useEffect, useState } from 'react';
import { BASE_URL, usuarioService } from '../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [devAttempted, setDevAttempted] = useState(false);
  const [error, setError] = useState(null);

  // loadOrders(silent=false): silent poll won't toggle loading/error UI
  const loadOrders = async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await fetch(`${BASE_URL}/pedidos.php?admin=1`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const newData = data || [];
        // only update if different to avoid flicker
        if (JSON.stringify(newData) !== JSON.stringify(orders)) setOrders(newData);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        if (!silent) setOrders([]);
      }
    } catch (e) {
      const msg = e.message || 'Error al cargar pedidos';
      if (!silent) setError(msg);
      const isLocal = window && window.location && window.location.hostname === 'localhost';
      if (!silent && isLocal && !devAttempted) {
        setDevAttempted(true);
        try {
          await usuarioService.devAutoLogin('admin@zanerdee.com');
          setTimeout(() => loadOrders(true), 400);
        } catch (dl) {
          if (!silent) setError(msg + ' | Dev auto-login failed: ' + (dl.message || dl));
        }
      }
      if (!silent) setOrders([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // initial visible load
    loadOrders(false);
    // silent polling
    const id = setInterval(() => loadOrders(true), 5000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Cargando pedidos...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h2 style={{ margin: 0 }}>Pedidos</h2>
        <button onClick={() => loadOrders(false)} style={{ padding: '6px 10px' }}>Actualizar</button>
        {lastUpdated && <small style={{ color: '#666' }}>Última: {lastUpdated}</small>}
      </div>
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
      {orders.length === 0 ? (
        <p>No hay pedidos.</p>
      ) : (
        orders.map(o => (
          <div key={o.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
            <div><strong>Pedido #{o.id}</strong> - Usuario: {o.usuario_id} - Total: €{o.total} - Fecha: {o.created_at}</div>
            {o.direccion && <div><strong>Dirección:</strong> {o.direccion}</div>}
            <ul>
              {o.items && o.items.map((it, i) => (
                <li key={i}>{it.nombre} — €{it.precio} x {it.cantidad}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
