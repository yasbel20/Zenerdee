import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaBoxOpen, FaPlusCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import UserAuthModal from './UserAuthModal';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authIntentPath, setAuthIntentPath] = useState(null);
  const { isAdmin, login, logout: logoutAdmin, user, isLoggedIn, logoutUser } = useAuth();
  const { count, setCartOpen } = useCart();
  const navigate = useNavigate();

  const close = () => setMenuOpen(false);

  const handleAdminLogout = () => { logoutAdmin(); setCartOpen(false); close(); navigate('/'); };
  const handleUserLogout  = () => { logoutUser(); setCartOpen(false); close(); };

  /* ── ADMIN navbar ──────────────────────────────── */
  if (isAdmin) {
    return (
      <nav className="navbar navbar--admin">
        <div className="nav-container">
          <Link to="/productos" className="nav-logo" onClick={close}>
            <h1>ZANERDEE</h1>
            <span className="admin-badge">ADMIN</span>
          </Link>
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </div>
          <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <li><Link to="/admin"           onClick={close}>PANEL</Link></li>
            <li><Link to="/productos"      onClick={close}><FaBoxOpen style={{marginRight:'0.4rem'}}/>PRODUCTOS</Link></li>
            <li><Link to="/pedidos"        onClick={close}>PEDIDOS</Link></li>
            <li><Link to="/admin/carts"    onClick={close}>CARROS</Link></li>
            <li><Link to="/productos/nuevo" onClick={close}><FaPlusCircle style={{marginRight:'0.4rem'}}/>NUEVO</Link></li>
            <li><button className="nav-logout-btn" onClick={handleAdminLogout}><FaSignOutAlt style={{marginRight:'0.4rem'}}/>CERRAR SESIÓN</button></li>
          </ul>
          <div className="nav-icons">
            <FaUser className="nav-icon nav-icon--active" title="Admin activo" />
          </div>
        </div>
      </nav>
    );
  }

  /* ── PUBLIC navbar ─────────────────────────────── */
  return (
    <>
      {showAuthModal && (
        <UserAuthModal
          onClose={() => { setShowAuthModal(false); setAuthIntentPath(null); }}
          onSuccess={(user) => {
            setShowAuthModal(false);
            if (authIntentPath) {
              navigate(authIntentPath);
              setAuthIntentPath(null);
            }
          }}
        />
      )}

      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo" onClick={close}>
            <h1>ZANERDEE</h1>
          </Link>

          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </div>

          <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <li><Link to="/"         onClick={close}>INICIO</Link></li>
            <li><Link to="/featured" onClick={close}>MÁS VENDIDOS</Link></li>
            <li><Link to="/nosotros" onClick={close}>NOSOTROS</Link></li>
            {isLoggedIn && (
              <li><Link to="/pedidos" onClick={close}>MIS PEDIDOS</Link></li>
            )}
          </ul>

          <div className="nav-icons">
            {/* Usuario logueado o botón login */}
            {isLoggedIn ? (
              <div className="nav-user-menu">
                <span className="nav-user-name">{user.nombre.split(' ')[0]}</span>
                <button className="nav-logout-user-btn" onClick={handleUserLogout} title="Cerrar sesión">
                  <FaSignOutAlt size={14} />
                </button>
              </div>
            ) : (
              <FaUser
                className="nav-icon"
                onClick={() => setShowAuthModal(true)}
                title="Iniciar sesión"
              />
            )}

            {/* Carrito */}
            <div className="cart-icon-wrapper" onClick={() => setCartOpen(true)}>
              <FaShoppingCart className="nav-icon" />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;