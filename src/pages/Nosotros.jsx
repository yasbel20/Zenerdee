import React from 'react';
import { Link } from 'react-router-dom';
import './Nosotros.css';

function Nosotros() {
  const valores = [
    {
      icon: '✦',
      title: 'Autenticidad',
      desc: 'Cada colección nace de una visión real. No seguimos el mercado — lo cuestionamos, lo reinterpretamos y lo transformamos en algo propio.'
    },
    {
      icon: '◈',
      title: 'Calidad Premium',
      desc: 'Desde el tejido hasta la última costura, cada detalle está trabajado con materiales seleccionados y procesos artesanales de alto estándar.'
    },
    {
      icon: '◉',
      title: 'Diseño Atemporal',
      desc: 'Creamos piezas que no caducan. La tendencia es efímera; el estilo permanece. Diseñamos para personas que piensan a largo plazo.'
    },
    {
      icon: '▲',
      title: 'Sostenibilidad',
      desc: 'Producimos con conciencia. Nuestras colecciones son limitadas para reducir el desperdicio y apostar por un modelo de moda más responsable.'
    },
    {
      icon: '◆',
      title: 'Comunidad',
      desc: 'ZANERDEE es más que una marca — es una comunidad de personas que comparten una visión del mundo: expresiva, libre y sin complejos.'
    },
    {
      icon: '⬡',
      title: 'Innovación',
      desc: 'Experimentamos constantemente con nuevas siluetas, texturas y paletas. La creatividad no se detiene; evoluciona con cada temporada.'
    }
  ];

  const moodImages = [
    {
      src: './public/images/imagen31.jpg',
      label: 'SS 2025',
      large: true
    },
    {
      src: './public/images/imagen34.jpg',
      label: 'Lookbook'
    },
    {
      src: './public/images/imagen33.jpg',
      label: 'Editorial'
    },
    {
      src: './public/images/imagen35.jpg',
      label: 'AW 2025',
      large: true
    },
    {
      src: './public/images/imagen32.jpg',
      label: 'Studio'
    }
  ];

  return (
    <div className="nosotros-page">

      {/* ── HERO ──────────────────────────────── */}
      <section className="nosotros-hero">
        <div className="nosotros-hero-bg" />
        <div className="nosotros-hero-content">
          <span className="nosotros-hero-tag">Nuestra Historia</span>
          <h1>
            <em>somos</em>
            ZANERDEE
          </h1>
          <p>
            Una marca nacida de la convicción de que la moda es el lenguaje más honesto de la identidad.
            No vestimos cuerpos — vestimos personalidades.
          </p>
          <Link to="/productos" className="nosotros-hero-btn">Explorar Colección</Link>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────── */}
      <div className="nosotros-stats">
        <div className="stat-item">
          <span className="stat-number">2019</span>
          <span className="stat-label">Fundación</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">500+</span>
          <span className="stat-label">Productos</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">12K</span>
          <span className="stat-label">Clientes</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">8</span>
          <span className="stat-label">Colecciones</span>
        </div>
      </div>

      {/* ── HISTORIA ──────────────────────────── */}
      <section className="nosotros-historia">
        <div className="historia-img">
          <img
            src="./public/images/imagen32.jpg"
            alt="Historia ZANERDEE"
          />
          <div className="historia-img-overlay" />
        </div>
        <div className="historia-text">
          <span className="section-tag">Origen</span>
          <h2>Más que una marca,<br />somos un movimiento</h2>
          <p>
            ZANERDEE nació de una visión: la moda como forma de expresión individual.
            No seguimos tendencias, las creamos. Cada colección es una declaración
            de autenticidad y calidad premium.
          </p>
          <p>
            Desde nuestras telas cuidadosamente seleccionadas hasta cada costura,
            nos aseguramos de que cada prenda sea un reflejo de tu personalidad
            y nuestro compromiso con la excelencia.
          </p>
          <p>
            Empezamos como un proyecto independiente y hoy vestimos a miles de
            personas que comparten nuestra filosofía: el estilo no es lo que llevas,
            es cómo lo llevas.
          </p>
          <Link to="/productos" className="btn-dark">Ver la Colección</Link>
        </div>
      </section>

      {/* ── TICKER ────────────────────────────── */}
      <div className="nosotros-ticker">
        <div className="nosotros-ticker-track">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="nosotros-ticker-item">
              ZANERDEE FASHION <span className="tick-star">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── VALORES ───────────────────────────── */}
      <section className="nosotros-valores">
        <div className="section-header">
          <h2>NUESTROS VALORES</h2>
          <p>
            Todo lo que hacemos está guiado por principios que no negociamos.
            Estos son los pilares que construyen ZANERDEE cada día.
          </p>
        </div>
        <div className="valores-grid">
          {valores.map((v, i) => (
            <div key={i} className="valor-card">
              <span className="valor-icon">{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MOODBOARD ─────────────────────────── */}
      <div className="nosotros-moodboard">
        {moodImages.map((item, i) => (
          <div key={i} className={`mood-item ${item.large ? 'mood-item--large' : ''}`}>
            <img src={item.src} alt={item.label} />
            <div className="mood-overlay">
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── MANIFIESTO ────────────────────────── */}
      <section className="nosotros-manifiesto">
        <h2>
          "La moda que vale no es la que grita — es la que <strong>susurra quién eres</strong>{' '}
          sin que tengas que decir una sola palabra."
        </h2>
        <span className="manifiesto-firma">— ZANERDEE FASHION, 2019</span>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="nosotros-cta">
        <h2>ÚNETE AL MOVIMIENTO</h2>
        <p>
          Descubre una colección diseñada para quienes no siguen el camino —
          lo crean. Tu estilo, tus reglas.
        </p>
        <div className="cta-btns">
          <Link to="/productos" className="btn-dark-cta">Ver Colección</Link>
          <Link to="/featured" className="btn-outline-cta">Más Vendidos</Link>
        </div>
      </section>

    </div>
  );
}

export default Nosotros;
