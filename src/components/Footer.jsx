import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaTwitter, FaYoutube, FaPinterest } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer">

      {/* ── NEWSLETTER BAND ─────────────────────── */}
      <div className="footer-newsletter">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <span className="newsletter-eyebrow">ÚNETE A LA FAMILIA</span>
            <h3>Sé el primero en conocer<br />los nuevos lanzamientos</h3>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              {subscribed ? '✓ ¡Suscrito!' : 'SUSCRIBIRSE'}
            </button>
          </form>
        </div>
      </div>

      {/* ── MAIN FOOTER BODY ────────────────────── */}
      <div className="footer-body">
        <div className="footer-inner">

          {/* Brand col */}
          <div className="footer-brand">
            <h2 className="footer-logo">ZANERDEE</h2>
            <p className="footer-tagline">
              Moda que define quién eres. Cada pieza cuenta tu historia.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://tiktok.com"    target="_blank" rel="noreferrer" aria-label="TikTok"><FaTiktok /></a>
              <a href="https://twitter.com"   target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://youtube.com"   target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest"><FaPinterest /></a>
            </div>
          </div>

          {/* Shop links */}
          <div className="footer-col">
            <h4>Tienda</h4>
            <ul>
              <li><Link to="/productos">Todos los productos</Link></li>
              <li><Link to="/productos?categoria=CAMISETAS">Camisetas</Link></li>
              <li><Link to="/productos?categoria=SUDADERAS">Sudaderas</Link></li>
              <li><Link to="/productos?categoria=PANTALONES">Pantalones</Link></li>
              <li><Link to="/productos?categoria=CHAQUETAS">Chaquetas</Link></li>
              <li><Link to="/productos?categoria=ACCESORIOS">Accesorios</Link></li>
            </ul>
          </div>

          {/* Info links */}
          <div className="footer-col">
            <h4>Información</h4>
            <ul>
              <li><Link to="/nosotros">Sobre Nosotros</Link></li>
              <li><Link to="/nate-edit">Nate's Edit</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/colaboraciones">Colaboraciones</Link></li>
            </ul>
          </div>

          {/* Help links */}
          <div className="footer-col">
            <h4>Ayuda</h4>
            <ul>
              <li><Link to="/envios">Envíos y Entregas</Link></li>
              <li><Link to="/devoluciones">Devoluciones</Link></li>
              <li><Link to="/tallas">Guía de Tallas</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacidad">Política de Privacidad</Link></li>
              <li><Link to="/terminos">Términos y Condiciones</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── MARQUEE LOGO BAND ───────────────────── */}
      <div className="footer-marquee">
        <div className="marquee-track">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="marquee-item">
              ZANERDEE <span className="marquee-dot">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────── */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>© {new Date().getFullYear()} ZANERDEE. Todos los derechos reservados.</p>
          <div className="payment-icons">
            <span className="pay-badge">VISA</span>
            <span className="pay-badge">MC</span>
            <span className="pay-badge">PAYPAL</span>
            <span className="pay-badge">AMEX</span>
            <span className="pay-badge">KLARNA</span>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
