import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { productoService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductPicker from '../components/ProductPicker';
import './Home.css';

// Traducción de categorías de la API al español del filtro
const CATEGORY_MAP = {
  'CAMISETAS': 'Camisetas',
  'CAMISAS':   'Camisetas',
  'SUDADERAS': 'Sudaderas',
  'PANTALONES':'Pantalones',
  'CHAQUETAS': 'Chaquetas',
  'ACCESORIOS':'Accesorios',
  'SETS':      'Accesorios',
};

const TABS = ['Todos', 'Camisetas', 'Sudaderas', 'Pantalones', 'Chaquetas', 'Accesorios'];

function Home() {
  const videoRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [pickerProduct, setPickerProduct] = useState(null);
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productoService.getAll();
      setAllProducts(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Filtrar por categoría activa
  const filteredProducts = activeCategory === 'Todos'
    ? allProducts
    : allProducts.filter(p => CATEGORY_MAP[p.categoria] === activeCategory);

  // Mostrar máximo 4 en el home
  const showcaseProducts = filteredProducts.slice(0, 4);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setPickerProduct(product);
  };

  const handlePickerAdd = (p) => {
    addItem(p, isLoggedIn);
    setPickerProduct(null);
  };

  return (
    <div className="home">
      {pickerProduct && (
        <ProductPicker
          product={pickerProduct}
          onClose={() => setPickerProduct(null)}
          onAdd={handlePickerAdd}
        />
      )}

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero-section">
        <video ref={videoRef} className="hero-video" autoPlay loop muted playsInline>
          <source src="/videos/hero-men.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay">
          <div className="hero-text-block">
            <h1 className="hero-title">ZANERDEE</h1>
            <h2 className="hero-subtitle">FASHION</h2>
            <p className="hero-desc">
              Discover a fashion experience that not only frames your unique personality, but embraces it.
              We're crafted to develop your confidence, celebrate your individuality, and empower you to stand out effortlessly in any setting.
            </p>
            <div className="hero-btns">
              <Link to="/featured" className="btn-dark">Buy Product</Link>
              <Link to="/featured" className="btn-outline-white">Explore Product</Link>
            </div>
          </div>
          <div className="hero-model-img">
            <img src="./public/images/imagen2.jpg" alt="ZANERDEE Fashion" />
          </div>
        </div>
      </section>

      {/* ── TICKER MARQUEE ───────────────────────────── */}
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="ticker-item">
              ZANERDEE FASHION <span className="ticker-star">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED COLLECTIONS ─────────────────────── */}
      <section className="collections-section">
        <div className="collections-grid">
          <div className="collections-left">
            <div className="col-card col-card--tall">
              <img src="./public/images/imagen1.jpg" alt="Colección Mujer" />
              <div className="col-card-overlay">
                <Link to="/featured" className="btn-explore">Explore Now</Link>
              </div>
            </div>
            <div className="col-card col-card--tall">
              <img src="./public/images/imagen3.jpg" alt="Colección Hombre" />
              <div className="col-card-overlay">
                <Link to="/featured" className="btn-explore">Explore Now</Link>
              </div>
            </div>
          </div>

          <div className="collections-right">
            <div className="collections-right-header">
              <h2>Nuestra<br />Colección</h2>
              <p>Visita el mundo de ZANERDEE, donde cada colección cuenta una historia. Desde piezas atemporales hasta looks de vanguardia.</p>
            </div>

            <div className="col-card col-card--wide">
              <img src="./public/images/imagen5.jpg" alt="Colección Mujer" />
              <div className="col-card-info">
                <span>Colección Mujer</span>
                <h3>Stylish Winter T-Shirt for Woman</h3>
                <Link to="/featured" className="btn-check">Check Now</Link>
              </div>
            </div>

            <div className="col-card col-card--wide">
              <img src="./public/images/imagen7.jpg" alt="Colección Hombre" />
              <div className="col-card-info">
                <span>Colección Hombre</span>
                <h3>Stylish Winter Shirt for Man</h3>
                <Link to="/featured" className="btn-check">Check Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR COLLECTION / PRODUCT GRID ────────────── */}
      <section className="our-collection-section">
        <div className="our-collection-inner">
          <div className="our-collection-header">
            <h2>NUESTRA COLECCIÓN</h2>
            <p>Visita el mundo de ZANERDEE, donde cada colección cuenta una historia. Desde piezas atemporales hasta looks de vanguardia que te hacen sentir y verte bien.</p>
          </div>

          {/* Tabs de categoría */}
          <div className="category-tabs">
            {TABS.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de productos */}
          {loadingProducts ? (
            <div className="home-products-loading">
              <div className="spinner-sm" />
            </div>
          ) : showcaseProducts.length === 0 ? (
            <p className="home-no-products">No hay productos en esta categoría.</p>
          ) : (
            <div className="products-showcase">
              {showcaseProducts.map(p => (
                <div key={p.id} className="showcase-card">
                  <div className="showcase-img">
                    <img
                      src={p.imagen || 'https://images.pexels.com/photos/769749/pexels-photo-769749.jpeg'}
                      alt={p.nombre}
                    />
                    </div>
                    <div className="showcase-info">
                    <p className="showcase-name">{p.nombre}</p>
                    <p className="showcase-price">€{p.precio}</p>
                      <div className="showcase-actions">
                        <button
                          className="btn-cart"
                          onClick={() => handleAddToCart(p)}
                        >
                          Comprar
                        </button>
                        <Link to="/featured" className="btn-buy">Ver más</Link>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ver todos */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/featured" className="btn-dark">Ver Toda la Colección</Link>
          </div>
        </div>
      </section>

      {/* ── BANNER ROPA Y CALZADO ─────────────────────── */}
      <section className="banner-section">
        <div className="banner-content">
          <h2>ROPA Y CALZADO<br />DE COLECCIÓN</h2>
        </div>
        <div className="banner-img">
          <img src="./public/images/imagen8.jpg" alt="Ropa y calzado" />
        </div>
      </section>

      {/* ── COLECCIÓN PRINCIPAL ───────────────────────── */}
      <section className="main-collection-section">
        <div className="main-col-left">
          <img src="./public/images/imagen9.jpg" alt="Colección Principal" />
          <div className="main-col-badge">
            <h3>COLECCIÓN<br />DE ROPA</h3>
          </div>
        </div>
        <div className="main-col-right">
          <div className="main-col-info">
            <span className="main-col-tag">Nueva Temporada</span>
            <h2>Estilo que define quién eres</h2>
            <p>
              En ZANERDEE, no solo vendemos ropa — creamos identidades. Cada pieza está diseñada para que te sientas auténtico, poderoso y siempre a la moda.
            </p>
            <Link to="/featured" className="btn-dark">Explorar Colección</Link>
          </div>
          <div className="main-col-grid">
            <div className="mini-card"><img src="./public/images/imagen10.jpg" alt="producto" /></div>
            <div className="mini-card"><img src="./public/images/imagen11.jpg" alt="producto" /></div>
            <div className="mini-card"><img src="./public/images/imagen12.jpg" alt="producto" /></div>
          </div>
        </div>
      </section>

      {/* ── NOSOTROS ──────────────────────────────────── */}
      <section className="about-section">
        <div className="about-inner">
          <div className="about-text">
            <span className="about-tag">Sobre Nosotros</span>
            <h2>Más que una marca, somos un movimiento</h2>
            <p>
              ZANERDEE nació de una visión: la moda como forma de expresión individual. No seguimos tendencias, las creamos. Cada colección es una declaración de autenticidad y calidad premium.
            </p>
            <p>
              Desde nuestras telas cuidadosamente seleccionadas hasta cada costura, nos aseguramos de que cada prenda sea un reflejo de tu personalidad y nuestro compromiso con la excelencia.
            </p>
            <Link to="/nosotros" className="btn-dark">Conoce Más</Link>
          </div>
          <div className="about-images">
            <div className="about-img-main">
              <img src="./public/images/imagen13.jpg" alt="Nosotros" />
            </div>
            <div className="about-img-secondary">
              <img src="./public/images/imagen14.jpg" alt="Equipo" />
              <div className="about-stat">
                <span className="stat-num">500+</span>
                <span className="stat-label">Productos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ──────────────────────────────── */}
      <section className="features-bar">
        <div className="feature-item">
          <span className="feat-icon">🚚</span>
          <div><h4>Envío Gratis</h4><p>En pedidos +€50</p></div>
        </div>
        <div className="feature-item">
          <span className="feat-icon">🔒</span>
          <div><h4>Pago Seguro</h4><p>100% protegido</p></div>
        </div>
        <div className="feature-item">
          <span className="feat-icon">↩️</span>
          <div><h4>Devoluciones</h4><p>30 días sin preguntas</p></div>
        </div>
        <div className="feature-item">
          <span className="feat-icon">💬</span>
          <div><h4>Soporte 24/7</h4><p>Siempre disponibles</p></div>
        </div>
      </section>

      {/* ── INSTAGRAM / GALERÍA ───────────────────────── */}
      <section className="gallery-section">
        <h2 className="gallery-title">@ZANERDEE</h2>
        <p className="gallery-sub">Síguenos para más inspiración</p>
        <div className="gallery-grid">
          {[
            './public/images/imagen15.jpg',
            './public/images/imagen17.jpg',
            './public/images/imagen16.jpg',
            './public/images/imagen18.jpg',
            './public/images/imagen19.jpg',
            './public/images/imagen20.jpg',
          ].map((src, i) => (
            <div key={i} className="gallery-item">
              <img src={src} alt={`gallery-${i}`} />
              <div className="gallery-item-overlay"><span>+</span></div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;