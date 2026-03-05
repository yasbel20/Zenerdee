import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './UserAuthModal.css';

/**
 * Modal de login / registro para clientes.
 * Props:
 *   onClose()          → cierra el modal
 *   onSuccess(user)    → llamado tras login/registro exitoso
 *   initialTab         → 'login' | 'register'  (default 'login')
 */
function UserAuthModal({ onClose, onSuccess, initialTab = 'login' }) {
  const { loginUser, registerUser } = useAuth();
  const [tab, setTab]         = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Campos login
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Campos registro
  const [regData, setRegData] = useState({ nombre: '', email: '', password: '', confirm: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginUser(loginData.email, loginData.password);
      onSuccess?.(user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regData.password !== regData.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const user = await registerUser(regData.nombre, regData.email, regData.password);
      onSuccess?.(user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => { setTab(t); setError(''); };

  return (
    <div className="uauth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="uauth-card">

        {/* Header */}
        <div className="uauth-header">
          <h2>ZANERDEE</h2>
          <p>{tab === 'login' ? 'Accede a tu cuenta' : 'Crea tu cuenta'}</p>
          <button className="uauth-close" onClick={onClose} aria-label="Cerrar">
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="uauth-tabs">
          <button className={`uauth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
            Iniciar Sesión
          </button>
          <button className={`uauth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>
            Crear Cuenta
          </button>
        </div>

        {/* ── LOGIN ─────────────────────────────── */}
        {tab === 'login' && (
          <form className="uauth-form" onSubmit={handleLogin}>
            {error && <div className="uauth-error">{error}</div>}

            <div className="uauth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={loginData.email}
                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div className="uauth-field">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="uauth-btn" disabled={loading}>
              {loading ? 'Verificando...' : 'ENTRAR'}
            </button>

            <p className="uauth-switch">
              ¿No tienes cuenta?{' '}
              <button type="button" onClick={() => switchTab('register')}>Regístrate gratis</button>
            </p>
          </form>
        )}

        {/* ── REGISTRO ──────────────────────────── */}
        {tab === 'register' && (
          <form className="uauth-form" onSubmit={handleRegister}>
            {error && <div className="uauth-error">{error}</div>}

            <div className="uauth-field">
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={regData.nombre}
                onChange={e => setRegData({ ...regData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="uauth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={regData.email}
                onChange={e => setRegData({ ...regData, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div className="uauth-field">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={regData.password}
                onChange={e => setRegData({ ...regData, password: e.target.value })}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="uauth-field">
              <label>Repetir Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={regData.confirm}
                onChange={e => setRegData({ ...regData, confirm: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="uauth-btn" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'CREAR CUENTA'}
            </button>

            <p className="uauth-switch">
              ¿Ya tienes cuenta?{' '}
              <button type="button" onClick={() => switchTab('login')}>Inicia sesión</button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}

export default UserAuthModal;
