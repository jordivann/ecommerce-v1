// web/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';

import { getAdminUsers, getAdminProducts, updateUserRole, getAdminCategories,updateProduct } from '../lib/apiClient';

export default function Dashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category_id: '' });
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);





  useEffect(() => {
    const token = localStorage.getItem('token');

    getAdminUsers(token).then(setUsers);
    getAdminProducts(token).then(setProducts);
    getAdminCategories(token).then(setCategories); 
  }, []);
  


  async function handleRoleChange(id, role) {
    const token = localStorage.getItem('token');
    const updated = await updateUserRole(id, role, token);
    if (updated?.user) {
      setUsers(prev =>
        prev.map(u => (u.id === id ? updated.user : u))
      );
    }
  }

  async function handleDeleteProduct(id) {
  const token = localStorage.getItem('token');
  await deleteProduct(id, token);
  setProducts(prev => prev.filter(p => p.id !== id));
}

async function handleUpdateProduct(id, updated) {
  const token = localStorage.getItem('token');
  const result = await updateProduct(id, updated, token);

  const updatedList = await getAdminProducts(token);
  setProducts(updatedList);

  setEditingProductId(null);
  setEditingProduct(null);
}

async function handleCreateProduct() {
  const token = localStorage.getItem('token');
  const created = await createProduct(newProduct, token);
  if (created.product) {
    setProducts(prev => [...prev, created.product]);
    setShowModal(false);
    setNewProduct({ name: '', price: '', stock: '', category_id: '' });
  }
}
async function handleCategoryChange(productId, newCategoryId) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/products/${productId}/category`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category_id: newCategoryId }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Error al actualizar categoría');

    // Actualizar el producto en el estado local
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, category: data.category_name, category_id: newCategoryId } : p))
    );
  } catch (error) {
    console.error('❌ Error en handleCategoryChange:', error);
    alert(error.message);
  }
}


  return (
    <div>
      <h1>Panel de Administración</h1>

      <h2>Usuarios</h2>
      <table border="1">
        <thead>
          <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Acción</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={e => handleRoleChange(u.id, e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Productos</h2>
<button onClick={() => setShowModal(true)}>➕ Nuevo Producto</button>
<table border="1">
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
                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
            </td>
            <td>
              <input
                type="number"
                value={editingProduct.price}
                onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
              />
            </td>
            <td>
              <input
                type="number"
                value={editingProduct.stock}
                onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })}
              />
            </td>
            <td>
              <select
                value={editingProduct.category_id || ''}
                onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
              >
                <option value="">Sin categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </td>
            <td>{new Date(p.created_at).toLocaleDateString()}</td>
            <td>
              <button onClick={() => handleUpdateProduct(editingProductId, editingProduct)}>Guardar</button>
              <button onClick={() => { setEditingProductId(null); setEditingProduct(null); }}>Cancelar</button>
            </td>
          </>
        ) : (
          <>
            <td>{p.name}</td>
            <td>{p.description}</td>
            <td>${p.price}</td>
            <td>{p.stock}</td>
            <td>{p.category || 'Sin categoría'}</td>
            <td><img src={p.image_url} alt={p.name} width="50" /></td>
            <td>{new Date(p.created_at).toLocaleDateString()}</td>
            <td>
              <button onClick={() => {
                setEditingProductId(p.id);
                setEditingProduct({ ...p }); 
              }}>
                Editar
              </button>
              <button onClick={() => handleDeleteProduct(p.id)}>Eliminar</button>
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
