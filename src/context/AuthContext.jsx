import React, { createContext, useContext, useState, useEffect } from 'react';
import { usuarioService } from '../services/api';

const AuthContext = createContext(null);

// Credenciales admin (solo frontend, no BD)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'zanerdee2024',
};

export function AuthProvider({ children }) {
  // ── Admin (login local) ────────────────────────────────
  const [isAdmin, setIsAdmin] = useState(false);

  // ── Usuario cliente (sesión PHP) ───────────────────────
  const [user, setUser]         = useState(null);   // { id, nombre, email }
  const [userLoading, setUserLoading] = useState(true);

  // Al montar: comprobar sesión PHP activa
  useEffect(() => {
    const savedAdmin = localStorage.getItem('zanerdee_admin');
    if (savedAdmin === 'true') setIsAdmin(true);

    usuarioService.checkSession()
      .then(data => {
        if (data.logged) {
          setUser(data);
          // If server reports admin role, set isAdmin accordingly
          if (data.role && data.role === 'admin') setIsAdmin(true);
        }
      })
      .catch(() => {})
      .finally(() => setUserLoading(false));
  }, []);

  // ── Admin login ────────────────────────────────────────
  const loginAdmin = (username, password) => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setIsAdmin(true);
      localStorage.setItem('zanerdee_admin', 'true');
      // If running on localhost, also establish a server-side PHP session
      try {
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          usuarioService.devAutoLogin('admin@zanerdee.com', 'dev_auto_login_token_please_change')
            .catch(() => {});
        }
      } catch (e) {}
      return { success: true };
    }
    return { success: false, error: 'Usuario o contraseña incorrectos' };
  };

  // Mantener compatibilidad con Login.jsx existente
  const login = loginAdmin;

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('zanerdee_admin');
  };

  // ── Usuario login / register ───────────────────────────
  const loginUser = async (email, password) => {
    const data = await usuarioService.login(email, password); // lanza si error
    setUser(data);
    if (data && data.role === 'admin') {
      setIsAdmin(true);
      localStorage.setItem('zanerdee_admin', 'true');
    }
    return data;
  };

  const registerUser = async (nombre, email, password) => {
    const data = await usuarioService.register(nombre, email, password);
    setUser(data);
    if (data && data.role === 'admin') {
      setIsAdmin(true);
      localStorage.setItem('zanerdee_admin', 'true');
    }
    return data;
  };

  const logoutUser = async () => {
    await usuarioService.logout().catch(() => {});
    setUser(null);
    // If logging out a server-side admin, clear admin flag
    setIsAdmin(false);
    localStorage.removeItem('zanerdee_admin');
  };

  return (
    <AuthContext.Provider value={{
      // Admin
      isAdmin,
      login,          // para Login.jsx (admin)
      loginAdmin,
      logoutAdmin,
      logout: logoutAdmin,

      // Cliente
      user,
      userLoading,
      isLoggedIn: !!user,
      loginUser,
      registerUser,
      logoutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}