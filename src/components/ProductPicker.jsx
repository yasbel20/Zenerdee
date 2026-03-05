import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './ProductPicker.css';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function ProductPicker({ product, onClose, onAdd }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty]                   = useState(1);
  const [error, setError]               = useState('');

  const handleAdd = () => {
    if (!selectedSize) { setError('Selecciona una talla para continuar'); return; }
    onAdd({ ...product, size: selectedSize, qty });
  };

  const handleSize = (s) => { setSelectedSize(s); setError(''); };

  const precio = product.precio ?? product.price ?? 0;
  const nombre = product.nombre ?? product.name ?? '';
  const imagen = product.imagen ?? product.image
    ?? 'https://images.pexels.com/photos/769749/pexels-photo-769749.jpeg';

  return (
    <div
      className="pp-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pp-card">

        {/* ── Close ── */}
        <button className="pp-close" onClick={onClose} aria-label="Cerrar">
          <FaTimes />
        </button>

        {/* ── Product preview ── */}
        <div className="pp-preview">
          <img src={imagen} alt={nombre} className="pp-img" />
          <div className="pp-preview-info">
            <span className="pp-category">{product.categoria ?? product.category ?? ''}</span>
            <h3 className="pp-name">{nombre}</h3>
            <p className="pp-price">€{(precio * qty).toFixed(2)}</p>
          </div>
        </div>

        <div className="pp-divider" />

        {/* ── Size selector ── */}
        <div className="pp-section">
          <div className="pp-section-header">
            <span className="pp-label">TALLA</span>
            {selectedSize && <span className="pp-selected-size">{selectedSize}</span>}
          </div>
          <div className="pp-sizes">
            {SIZES.map(s => (
              <button
                key={s}
                className={`pp-size-btn ${selectedSize === s ? 'active' : ''}`}
                onClick={() => handleSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          {error && <p className="pp-error">{error}</p>}
        </div>

        <div className="pp-divider" />

        {/* ── Quantity ── */}
        <div className="pp-section">
          <span className="pp-label">CANTIDAD</span>
          <div className="pp-qty">
            <button
              className="pp-qty-btn"
              onClick={() => setQty(q => Math.max(1, q - 1))}
              disabled={qty <= 1}
            >−</button>
            <span className="pp-qty-value">{qty}</span>
            <button
              className="pp-qty-btn"
              onClick={() => setQty(q => Math.min(10, q + 1))}
              disabled={qty >= 10}
            >+</button>
          </div>
        </div>

        {/* ── CTA ── */}
        <button className="pp-add-btn" onClick={handleAdd}>
          AÑADIR AL CARRITO — €{(precio * qty).toFixed(2)}
        </button>

      </div>
    </div>
  );
}

export default ProductPicker;
