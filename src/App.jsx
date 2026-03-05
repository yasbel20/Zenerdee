import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Cart from './components/Cart';
import CookiesBanner from './components/CookiesBanner';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import FeaturedProducts from './pages/FeaturedProducts';
import Nosotros from './pages/Nosotros';
import Login from './pages/Login';

import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import ProductEdit from './pages/ProductEdit';
import Checkout from './pages/Checkout';
import AdminOrders from './pages/AdminOrders';
import Pedidos from './pages/Pedidos';
import AdminCarts from './pages/AdminCarts';

import './styles/App.css';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Cart />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/featured" element={<FeaturedProducts />} />
          <Route path="/checkout" element={<Checkout />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/pedidos" element={<UserProtectedRoute><Pedidos /></UserProtectedRoute>} />
        <Route path="/login"    element={<Login />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
      <CookiesBanner />
    </>
  );
}

function AdminLayout() {
  return (
    <>
      <Navbar />
      <Routes>
          <Route path="/"                     element={<Navigate to="/productos" replace />} />
          <Route path="/admin"                element={<Navigate to="/productos" replace />} />
        <Route path="/productos"            element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/productos/nuevo"      element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
        <Route path="/productos/editar/:id" element={<ProtectedRoute><ProductEdit /></ProtectedRoute>} />
          <Route path="/admin/carts"          element={<ProtectedRoute><AdminCarts /></ProtectedRoute>} />
          <Route path="/pedidos"              element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/carts"          element={<ProtectedRoute><AdminCarts /></ProtectedRoute>} />
        <Route path="*"                     element={<Navigate to="/productos" replace />} />
      </Routes>
    </>
  );
}

function AppContent() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminLayout /> : <PublicLayout />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <main className="AppMain">
              <AppContent />
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;