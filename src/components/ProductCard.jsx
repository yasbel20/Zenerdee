import React, { useState } from 'react';
import { FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import './ProductCard.css';

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    alert(`Añadido al carrito: ${product.name} - Cantidad: ${quantity}`);
  };

  return (
    <div className="product-card-nate">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} />
        <div className="product-overlay">
          <button className="overlay-btn"><FaEye /></button>
          <button className="overlay-btn"><FaHeart /></button>
        </div>
        <span className="product-category">{product.style}</span>
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-designer">Designed by {product.designer}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        
        <div className="product-specs">
          <div className="spec-item">
            <span className="spec-label">Style:</span>
            <span className="spec-value">{product.style}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Fit:</span>
            <span className="spec-value">{product.fit}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Material:</span>
            <span className="spec-value">{product.material}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Size:</span>
            <span className="spec-value">{product.size}</span>
          </div>
        </div>

        <div className="product-actions-nate">
          <div className="quantity-selector">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="quantity-btn"
            >-</button>
            <span className="quantity">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="quantity-btn"
            >+</button>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <FaShoppingCart /> AÑADIR
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;