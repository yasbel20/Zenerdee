// ============================================================
// src/services/api.js
// Base URL apunta al backend PHP en XAMPP
// ============================================================

export const BASE_URL = 'http://localhost/react/backend/api';

// ── Helper ────────────────────────────────────────────────
async function request(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'include',          // envía cookies de sesión PHP
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const contentType = res.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    // Intentar parsear texto como JSON por si el servidor devolvió JSON sin header
    try { data = JSON.parse(text); } catch (e) { data = text; }
  }

  if (!res.ok) {
    const message = (data && data.error) ? data.error : (typeof data === 'string' ? data : 'Error en la petición');
    throw new Error(message);
  }
  return data;
}

// ── Productos ─────────────────────────────────────────────
export const productoService = {
  getAll: () =>
    request(`${BASE_URL}/productos.php`),

  getById: (id) =>
    request(`${BASE_URL}/productos.php?id=${id}`),

  create: (data) =>
    request(`${BASE_URL}/productos.php`, { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`${BASE_URL}/productos.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`${BASE_URL}/productos.php?id=${id}`, { method: 'DELETE' }),
};

// ── Usuarios (clientes) ───────────────────────────────────
export const usuarioService = {
  // Comprueba si hay sesión activa (se llama al cargar la app)
  checkSession: () =>
    request(`${BASE_URL}/usuarios.php?action=check`),

  register: (nombre, email, password) =>
    request(`${BASE_URL}/usuarios.php?action=register`, {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password }),
    }),

  login: (email, password) =>
    request(`${BASE_URL}/usuarios.php?action=login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request(`${BASE_URL}/usuarios.php?action=logout`, { method: 'POST' }),
  // Dev helper: create server-side admin session for local testing
  devAutoLogin: (email = 'admin@example.com', token = 'dev_auto_login_token_please_change') =>
    request(`${BASE_URL}/dev_auto_login.php?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`),
};

// ── Pedidos ───────────────────────────────────────────────
export const pedidoService = {
  crear: (items, total, direccion = null) =>
    request(`${BASE_URL}/pedidos.php`, {
      method: 'POST',
      body: JSON.stringify({ items, total, direccion }),
    }),

  historial: () =>
    request(`${BASE_URL}/pedidos.php`),
};