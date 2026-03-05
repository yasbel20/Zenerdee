import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productoService } from '../services/api';
import { FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import './ProductList.css';

function ProductList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await productoService.getAll();
      setProductos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productoService.delete(id);
        setProductos(productos.filter(p => p.id !== id));
      } catch (err) {
        setError('Error al eliminar el producto');
      }
    }
  };

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return (
    <div className="loading-container">
      <FaSpinner className="spinner" />
      <p>Cargando productos...</p>
    </div>
  );

  return (
    <div className="product-list">
      <div className="list-header">
        <h1>COLECCIÓN HOMBRE</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="search-input"
          />
          <Link to="/productos/nuevo" className="btn-primary">
            + NUEVO PRODUCTO
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="products-grid">
        {productosFiltrados.length === 0 ? (
          <p className="no-products">No hay productos disponibles</p>
        ) : (
          productosFiltrados.map(producto => (
            <div key={producto.id} className="product-card">
              <img src={producto.imagen} alt={producto.nombre} />
              <div className="product-info">
                <h3>{producto.nombre}</h3>
                <p className="categoria">{producto.categoria}</p>
                <p className="precio">${producto.precio}</p>
                <div className="product-actions">
                  <Link to={`/productos/editar/${producto.id}`} className="btn-edit">
                    <FaEdit /> Editar
                  </Link>
                  <button onClick={() => handleDelete(producto.id)} className="btn-delete">
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;