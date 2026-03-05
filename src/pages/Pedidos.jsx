import React, { useEffect, useState } from 'react';
import { pedidoService } from '../services/api';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await pedidoService.historial();
        setPedidos(data || []);
      } catch (e) {
        setError(e.message || 'Error al cargar pedidos');
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Cargando tus pedidos...</div>;

  if (error) return <div style={{ padding: 20, color: 'crimson' }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Mis Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No has realizado pedidos todavía.</p>
      ) : (
        pedidos.map(p => (
          <div key={p.id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 12, borderRadius: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Pedido #{p.id}</strong>
                <div style={{ fontSize: 12, color: '#666' }}>Fecha: {p.created_at}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><strong>Total:</strong> €{p.total}</div>
                {p.estado && <div style={{ fontSize: 12 }}>{p.estado}</div>}
              </div>
            </div>

            {p.direccion && (
              <div style={{ marginTop: 8 }}><strong>Dirección:</strong> {p.direccion}</div>
            )}

            <ul style={{ marginTop: 8 }}>
              {p.items && p.items.map((it, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{it.nombre} x {it.cantidad}</span>
                    <span>€{it.precio}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
