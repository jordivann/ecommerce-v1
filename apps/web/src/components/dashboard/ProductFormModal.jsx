import './styles/ProductFormModal.css';

export default function ProductFormModal({
  show,
  onClose,
  onCreate,
  newProduct,
  setNewProduct,
  categories
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Crear nuevo producto</h3>

        <label>Nombre</label>
        <input
          type="text"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
        />

        <label>Descripción</label>
        <input
          type="text"
          value={newProduct.description || ''}
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
        />

        <label>Precio</label>
        <input
          type="number"
          value={newProduct.price}
          min="0"
          step="0.01"
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
        />

        <label>Stock</label>
        <input
          type="number"
          value={newProduct.stock}
          min="0"
          onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
        />

        <label>Categoría</label>
        <select
          value={newProduct.category_id}
          onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
        >
          <option value="">Sin categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <div className="modal-buttons">
          <button onClick={onCreate}>Crear</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
