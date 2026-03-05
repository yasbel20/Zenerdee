import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService, BASE_URL } from '../services/api';
import './ProductForm.css';

function ProductForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'ropa',
    imagen: '',
    imageFile: null,
    stock: ''
  });

  const categorias = [
    'CAMISETAS',
    'CAMISAS',
    'PANTALONES',
    'SUDADERAS',
    'CHAQUETAS',
    'ACCESORIOS'
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setFormData({ ...formData, imageFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let payload = { ...formData };
      // If there's an image file, upload it first
      if (formData.imageFile) {
        const fd = new FormData();
        fd.append('image', formData.imageFile);
        const res = await fetch(`${BASE_URL}/upload_image.php`, {
          method: 'POST',
          credentials: 'include',
          body: fd
        });
        const json = await res.json();
        if (json.path) payload.imagen = json.path;
      }

      // Remove imageFile before sending JSON
      delete payload.imageFile;
      await productoService.create(payload);
      navigate('/productos');
    } catch (err) {
      const msg = err && err.message ? err.message : 'Error al crear el producto';
      setError(msg);
      console.error('Create product error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h1>CREAR NUEVO PRODUCTO</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Nombre del producto *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Camiseta Oversize Black"
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            placeholder="Describe el producto..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Precio ($) *</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Categoría *</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Adjuntar imagen</label>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
          />
          {formData.imagen && !formData.imageFile && (
            <div className="current-image">Imagen actual: {formData.imagen}</div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/productos')} className="btn-cancel">
            CANCELAR
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'CREANDO...' : 'CREAR PRODUCTO'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;