import React, { useState } from 'react';
import './styles/ProductFormModal.css'

const initialState = {
  name: '',
  description: '',
  original_price: '',
  price: '',
  discount_expiration: '',
  stock: 0,
  category_id: '',
  image_url: '',
  brand: '',
  tags: '',
  unit: '',
  visible: true,
  weight_grams: '',
  dimensions: '',
  organic: false,
  senasa: false,
  rendimiento: '',
};

const ProductFormModal = ({ show, onClose, categories, onCreateProduct }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, original_price, price, stock } = form;

    if (!name || !original_price || isNaN(original_price)) {
      return setError('Nombre y precio original son obligatorios y deben ser válidos');
    }

    if (price && isNaN(price)) {
      return setError('El precio debe ser un número');
    }

    if (stock < 0) {
      return setError('El stock no puede ser negativo');
    }

    const data = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      original_price: parseFloat(form.original_price),
      price: form.price ? parseFloat(form.price) : undefined,
      stock: parseInt(form.stock, 10),
      rendimiento: form.rendimiento ? parseFloat(form.rendimiento) : null,
      weight_grams: form.weight_grams ? parseInt(form.weight_grams, 10) : null,
    };

    setError(null);
    onCreateProduct(data);
    setForm(initialState);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>Crear nuevo producto</h2>

        {error && <div className="error">{error}</div>}

        <form className="product-create-form" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" required />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" />
          <input name="original_price" value={form.original_price} onChange={handleChange} placeholder="Precio original" type="number" required />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Precio con descuento (opcional)" type="number" />
          <input name="discount_expiration" value={form.discount_expiration} onChange={handleChange} placeholder="Fecha fin de descuento" type="date" />
          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" />
          <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="URL de imagen" />
          <input name="brand" value={form.brand} onChange={handleChange} placeholder="Marca" />
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="Etiquetas (separadas por coma)" />
          <input name="unit" value={form.unit} onChange={handleChange} placeholder="Unidad (ej. unidad, caja, litro...)" />

          <select name="category_id" value={form.category_id} onChange={handleChange} required>
            <option value="">Seleccionar categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input name="weight_grams" value={form.weight_grams} onChange={handleChange} placeholder="Peso (g)" type="number" />
          <input name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="Dimensiones (ej. 10x20x5cm)" />
          <input name="rendimiento" value={form.rendimiento} onChange={handleChange} placeholder="Rendimiento (número)" type="number" />

          <label>
            <input type="checkbox" name="organic" checked={form.organic} onChange={handleChange} /> Orgánico
          </label>
          <label>
            <input type="checkbox" name="senasa" checked={form.senasa} onChange={handleChange} /> SENASA
          </label>
          <label>
            <input type="checkbox" name="visible" checked={form.visible} onChange={handleChange} /> Visible
          </label>

          <button type="submit">Crear producto</button>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
