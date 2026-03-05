import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { pedidoService } from '../services/api';
import './Checkout.css';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [direccion, setDireccion] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [cp, setCp] = useState('');
  const [pais, setPais] = useState('España');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const direccionFull = `${direccion} ${cp} ${ciudad} ${pais}`.trim();
      const res = await pedidoService.crear(items, total, direccionFull);
      setSuccess(res);
      clearCart();
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setSuccess({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) return (
    <div className="checkout-empty">
      <h2>Tu carrito está vacío</h2>
      <p>Añade productos antes de finalizar la compra.</p>
    </div>
  );

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Finalizar compra</h2>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Datos de envío</h3>

          <label>Nombre completo</label>
          <input required value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" />

          <label>Teléfono</label>
          <input required value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+34 600 000 000" />

          <label>Dirección</label>
          <textarea required value={direccion} onChange={e => setDireccion(e.target.value)} rows={3} />

          <div className="checkout-row">
            <div>
              <label>Ciudad</label>
              <input value={ciudad} onChange={e => setCiudad(e.target.value)} />
            </div>
            <div>
              <label>Código postal</label>
              <input value={cp} onChange={e => setCp(e.target.value)} />
            </div>
          </div>

          <label>País</label>
          <input value={pais} onChange={e => setPais(e.target.value)} />

          <div className="checkout-actions">
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Procesando...' : 'Pagar ahora'}</button>
            <div className="checkout-subtotal">Subtotal: <strong>€{total.toFixed(2)}</strong></div>
          </div>

          {success && (
            <div className={`checkout-result ${success.error ? 'error' : 'ok'}`}>
              {success.error ? success.error : 'Compra realizada correctamente. Gracias.'}
            </div>
          )}
        </form>

        <aside className="checkout-summary">
          <h3>Resumen del pedido</h3>
          <ul className="order-items">
              {items.map((it, idx) => {
                const qty = Number(it.qty ?? it.quantity ?? 1) || 1;
                const unitPrice = Number(it.precio ?? it.price ?? it.unitPrice ?? 0) || 0;
                return (
                  <li key={idx} className="order-item">
                    {it.imagen && <img src={it.imagen} alt={it.nombre} />}
                    <div className="item-info">
                      <div className="item-name">{it.nombre}</div>
                      <div className="item-qty">x{qty}</div>
                    </div>
                    <div className="item-price">€{unitPrice.toFixed(2)}</div>
                  </li>
                );
              })}
          </ul>
          <div className="summary-total">Total: <strong>€{total.toFixed(2)}</strong></div>
        </aside>
      </div>
    </div>
  );
}
