import React, { useState, useEffect } from 'react';
import { productoService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductPicker from '../components/ProductPicker';
import { FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import './FeaturedProducts.css';

const categoryTranslations = {
  'Todos': 'All',
  'CAMISETAS': 'T-Shirts',
  'CAMISAS': 'Shirts',
  'SUDADERAS': 'Sweatshirts',
  'PANTALONES': 'Pants',
  'CHAQUETAS': 'Jackets',
  'ACCESORIOS': 'Accessories',
  'SETS': 'Sets',
};

function FeaturedProducts() {
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [categories, setCategories]       = useState([]);
  const [pickerProduct, setPickerProduct] = useState(null);  // producto abierto en picker

  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productoService.getAll();
      setProducts(data);
      const cats = ['Todos', ...new Set(data.map(p => p.categoria))];
      setCategories(cats);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.categoria === selectedCategory);

  const getCategoryCount = (cat) =>
    cat === 'Todos' ? products.length : products.filter(p => p.categoria === cat).length;

  // Click en "Añadir" — primero verifica login
  const handleAddClick = (product) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setPickerProduct(product);
  };

  // Cuando el picker confirma talla + color
  const handlePickerAdd = (productWithOptions) => {
    addItem(productWithOptions, isLoggedIn);
    setPickerProduct(null);
  };

  if (loading) {
    return (
      <div className="featured-loading">
        <div className="spinner" />
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="featured-products-page">

      {/* Picker de talla/color */}
      {pickerProduct && (
        <ProductPicker
          product={pickerProduct}
          onClose={() => setPickerProduct(null)}
          onAdd={handlePickerAdd}
        />
      )}

      {/* Hero */}
      <div className="featured-hero">
        <h1>Explora Nuestra Colección de Productos Más Vendidos</h1>
      </div>

      <div className="featured-container">

        {/* Sidebar categorías */}
        <div className="categories-sidebar">
          <h2>Todas las Colecciones</h2>
          <ul className="category-list">
            {categories.map(cat => (
              <li
                key={cat}
                className={selectedCategory === cat ? 'active' : ''}
                onClick={() => setSelectedCategory(cat)}
              >
                {categoryTranslations[cat] || cat} ({getCategoryCount(cat)})
              </li>
            ))}
          </ul>
        </div>

        {/* Grid productos */}
        <div className="products-grid-featured">
          {filteredProducts.map(product => (
            <div key={product.id} className="featured-product-card">
              <div className="product-image-wrapper">
                <img
                  src={product.imagen || 'https://images.pexels.com/photos/769749/pexels-photo-769749.jpeg'}
                  alt={product.nombre}
                />
                {product.stock < 10 && (
                  <span className="stock-badge">¡Últimas unidades!</span>
                )}
              </div>

              <div className="product-info-featured">
                <h3>{product.nombre}</h3>
                <p className="product-desc">{product.descripcion ? product.descripcion.slice(0,120) + (product.descripcion.length>120 ? '...' : '') : ''}</p>
                <p className="product-category-featured">
                  {categoryTranslations[product.categoria] || product.categoria}
                  {' '}({product.stock} disponibles)
                </p>
                <div className="product-price-featured">
                  <span className="current-price">€{Number(product.precio).toFixed(2)}</span>
                  {product.old_price && (
                    <span className="old-price">€{Number(product.old_price).toFixed(2)}</span>
                  )}
                </div>
                <button
                  className="view-product-btn"
                  onClick={() => handleAddClick(product)}
                >
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experiencia del cliente */}
      <div className="customer-experience">
        <h2>Ofrecemos Experiencias Excepcionales al Cliente</h2>
        <p className="experience-subtitle">
          Desde el momento en que navegas hasta el día que llega tu pedido,
          nos aseguramos de que cada paso sea perfecto.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FaTruck /></div>
            <h3>Envío Rápido</h3>
            <p>Recibe tus favoritos rápidamente, sin importar dónde te encuentres.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaShieldAlt /></div>
            <h3>Calidad Premium</h3>
            <p>Cada pieza está hecha con cuidado, elaborada con materiales duraderos.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaUndo /></div>
            <h3>Devoluciones Fáciles</h3>
            <p>¿No es el ajuste perfecto? Nuestro proceso de devolución es simple.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProducts;