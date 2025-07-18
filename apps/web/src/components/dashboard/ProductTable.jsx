import './styles/ProductTable.css';

export default function ProductTable({
  products,
  categories,
  editingProductId,
  editingProduct,
  onEdit,
  onCancelEdit,
  onChangeEdit,
  onUpdateProduct,
  onDeleteProduct
}) {
  const handleSave = () => {
    // Validación básica
    const { name, price, stock } = editingProduct;

    if (!name || !price || !stock) {
      alert('Por favor completá nombre, precio y stock antes de guardar.');
      return;
    }

    onUpdateProduct(editingProductId, editingProduct);
  };

  return (
    <div className="product-table">
      <h2>Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Imagen</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.filter(Boolean).map(p => (
            <tr key={p.id}>
              {editingProductId === p.id ? (
                <>
                  <td>
                    <input
                      value={editingProduct.name}
                      onChange={e => onChangeEdit({ ...editingProduct, name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      value={editingProduct.description || ''}
                      onChange={e => onChangeEdit({ ...editingProduct, description: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.price}
                      onChange={e => onChangeEdit({ ...editingProduct, price: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.stock}
                      onChange={e => onChangeEdit({ ...editingProduct, stock: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      value={editingProduct.category_id || ''}
                      onChange={e => onChangeEdit({ ...editingProduct, category_id: e.target.value })}
                    >
                      <option value="">Sin categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </td>
                  <td colSpan="2">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={handleSave}>💾 Guardar</button>
                    <button onClick={onCancelEdit}>❌ Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.name}</td>
                  <td>{p.description || 'Sin descripción'}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    {
                      categories.find(c => c.id === p.category_id)?.name || 'Sin categoría'
                    }
                  </td>

                  <td><img
                    src={p.image_url || '/img/default-product.png'}
                    alt={p.name}
                    width="50"
                  /></td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => onEdit(p.id, p)}>✏️ Editar</button>
                    <button onClick={() => onDeleteProduct(p.id)}>🗑️ Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
