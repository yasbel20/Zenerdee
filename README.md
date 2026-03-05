# ZANERDEE — Tienda de Ropa Hombre

> Aplicación web fullstack para tienda de moda masculina. Frontend en React + Vite, backend en PHP con MySQL.

---

## 🛠 Tecnologías

### Frontend
| Tecnología | Versión |
|---|---|
| React | 19 |
| Vite | 7 |
| React Router DOM | 7 |
| Axios | 1.x |
| React Icons | 5.x |

### Backend
| Tecnología | Detalle |
|---|---|
| PHP | 8+ |
| MySQL | Vía XAMPP |
| PDO | Consultas seguras |
| Arquitectura | REST API |

---

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org) v18+
- [XAMPP](https://www.apachefriends.org) (PHP 8+ y MySQL)
- Git

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/zanerdee.git
cd zanerdee
```

### 2. Configurar el Backend

1. Copia la carpeta `zanerdee-backend` a `C:\xampp\htdocs\`
2. Abre XAMPP y enciende **Apache** y **MySQL**
3. Ve a `http://localhost/phpmyadmin`
4. Crea una base de datos llamada `zanerdee_db`
5. Importa el archivo `zanerdee_db.sql` incluido en el proyecto

### 3. Configurar el Frontend

```bash
cd zanerdee-frontend
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## 📁 Estructura del Proyecto


react/
│   App.css
│   App.jsx
│   index.css
│   main.jsx
│
├───assets
│       react.svg
│
├───components
│       Cart.css
│       Cart.jsx
│       CookiesBanner.css
│       CookiesBanner.jsx
│       Footer.css
│       Footer.jsx
│       Navbar.css
│       Navbar.jsx
│       ProductCard.css
│       ProductCard.jsx
│       ProductPicker.css
│       ProductPicker.jsx
│       ProtectedRoute.jsx
│       ScrollToTop.jsx
│       UserAuthModal.css
│       UserAuthModal.jsx
│       UserProtectedRoute.jsx
│
├───context
│       AuthContext.jsx
│       CartContext.jsx
│
├───hooks
├───pages
│       AdminCarts.jsx
│       AdminOrders.jsx
│       Checkout.css
│       Checkout.jsx
│       FeaturedProducts.css
│       FeaturedProducts.jsx
│       Home.css
│       Home.jsx
│       Login.css
│       Login.jsx
│       NateEdit.css
│       NateEdit.jsx
│       Nosotros.css
│       Nosotros.jsx
│       Pedidos.jsx
│       Privacy.jsx
│       ProductEdit.jsx
│       ProductForm.css
│       ProductForm.jsx
│       ProductList.css
│       ProductList.jsx
│
├───services
│       api.js
│
└───styles
        App.css
|Backend
├───api
│   │   admin_user_carts.php
│   │   carrito.php
│   │   cleanup_test_pedidos.php
│   │   config.php
│   │   dev_auto_login.php
│   │   list_users.php
│   │   pedidos.php
│   │   productos.php
│   │   promote_admin.php
│   │   reset_admin_password.php
│   │   upload_image.php
│   │   usuarios.php
│   │   
│   ├───config
│   │       database.php
│   │       
│   ├───controllers
│   ├───models
│   │       Pedido.php
│   │       Producto.php
│   │       Usuario.php
│   │
│   └───routes
└───database
        pedidos.sql
```

---

## 🔧 Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build para producción
npm run preview   # Vista previa del build
npm run lint      # Revisar errores de código
```

---

## ✨ Funcionalidades

- 🛍 Catálogo de productos con filtros
- 🔍 Búsqueda en tiempo real
- 🛒 Carrito de compras
- 👤 Registro e inicio de sesión
- 📦 Panel de administración (CRUD productos)
- 📱 Diseño responsive

---

## 👤 Autor

**ZANERDEE** — Proyecto académico de tienda de moda masculina.

---

## 📄 Licencia

Este proyecto es de uso privado/académico.
