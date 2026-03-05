import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

function Cart() {
  const { items, removeItem, updateQty, total, count, cartOpen, setCartOpen } = useCart();

  const close = () => setCartOpen(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Bloquear el scroll del body cuando el drawer esté abierto (mejora UX)
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prev || '';
    }
    return () => { document.body.style.overflow = prev || ''; };
  }, [cartOpen]);

  return (
    <>
      {/* Overlay oscuro */}
      <div
        className={`cart-overlay ${cartOpen ? 'open' : ''}`}
        onClick={close}
      />

      {/* Drawer lateral */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>

        {/* Header */}
        <div className="cart-header">
          <h2>Tu Carrito</h2>
          {count > 0 && (
            <span className="cart-count-badge">{count} {count === 1 ? 'item' : 'items'}</span>
          )}
          <button className="cart-close" onClick={close} aria-label="Cerrar carrito">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <FaShoppingBag className="cart-empty-icon" />
              <p>Tu carrito está vacío</p>
              <Link to="/featured" className="cart-empty-link" onClick={close}>
                Ver Productos
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.imagen || 'https://images.pexels.com/photos/769749/pexels-photo-769749.jpeg'}
                  alt={item.nombre || item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <div>
                    <p className="cart-item-name">{item.nombre || item.name}</p>
                    <p className="cart-item-cat">{item.categoria || item.category}</p>
                  </div>
                  <div className="cart-item-bottom">
                    <span className="cart-item-price">
                      €{((item.precio || item.price) * item.qty).toFixed(2)}
                    </span>
                    <div className="cart-item-controls">
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span className="qty-value">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      <button className="cart-item-remove" onClick={() => removeItem(item.id)} aria-label="Eliminar">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — solo si hay items */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span className="cart-subtotal-price">€{total.toFixed(2)}</span>
            </div>
            <p className="cart-shipping-note">Envío gratuito en pedidos +€50</p>
            <button className="cart-checkout-btn" onClick={() => {
              setCartOpen(false);
              if (!isLoggedIn) navigate('/login');
              else navigate('/checkout');
            }}>
              Finalizar Compra
            </button>
            <button className="cart-continue-btn" onClick={close}>
              Seguir Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
