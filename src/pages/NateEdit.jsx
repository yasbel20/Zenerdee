import React from 'react';
import ProductCard from '../components/ProductCard';
import './NateEdit.css';

function NateEdit() {
  // Datos de los productos
  const products = [
    {
      id: 1,
      name: "Vivo Holiday 55 Short Sleeve Shirt",
      designer: "Nate Robinson",
      price: 45.00,
      style: "Casual",
      fit: "Slim fit",
      material: "Cotton",
      size: "S/M",
      image: "https://images.pexels.com/photos/769749/pexels-photo-769749.jpeg"
    },
    {
      id: 2,
      name: "Beige T-shirt Short Tee",
      designer: "Nate Robinson",
      price: 25.00,
      style: "Casual",
      fit: "Slim fit",
      material: "Cotton",
      size: "M",
      image: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg"
    },
    {
      id: 3,
      name: "Black Pencil Skirt",
      designer: "Nate Robinson",
      price: 35.00,
      style: "Casual",
      fit: "Slim fit",
      material: "Cotton",
      size: "L",
      image: "https://images.pexels.com/photos/6310929/pexels-photo-6310929.jpeg"
    },
    {
      id: 4,
      name: "Blue Fitted Shorts",
      designer: "Nate Robinson",
      price: 40.00,
      style: "Casual",
      fit: "Slim fit",
      material: "Cotton",
      size: "XL",
      image: "https://images.pexels.com/photos/5255524/pexels-photo-5255524.jpeg"
    },
    {
      id: 5,
      name: "Brown Crew Neck Sweater",
      designer: "Nate Robinson",
      price: 50.00,
      style: "Casual",
      fit: "Slim fit",
      material: "Cotton",
      size: "XXL",
      image: "https://images.pexels.com/photos/6205116/pexels-photo-6205116.jpeg"
    }
  ];

  return (
    <div className="nate-edit-page">
      {/* Hero section de Nate */}
      <div className="nate-hero">
        <div className="nate-hero-content">
          <h1>Nate Robinson</h1>
          <p className="nate-designer">Designed by the photographer</p>
          <h2 className="nate-shop-title">SHOP NATE'S EDIT</h2>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="nate-products-container">
        <div className="nate-products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Sección de información adicional */}
      <div className="nate-info-section">
        <div className="nate-info-content">
          <h3>About Nate's Edit</h3>
          <p>
            Cada pieza de la colección Nate's Edit está cuidadosamente seleccionada por 
            el fotógrafo Nate Robinson, combinando estilo casual con detalles únicos 
            que reflejan su visión artística.
          </p>
          <div className="nate-features">
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Edición Limitada</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Diseño Exclusivo</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Calidad Premium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NateEdit;