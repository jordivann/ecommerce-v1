import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  getAdminUsers,
  getAdminProducts,
  updateUserRole,
  getAdminCategories,
  updateProduct,
  createProduct,
  deleteProduct
} from '../lib/apiClient';
import './styles/Dashboard.css'

import UserTable from '../components/dashboard/UserTable';
import ProductTable from '../components/dashboard/ProductTable';
import ProductFormModal from '../components/dashboard/ProductFormModal';

export default function Dashboard() {
  const { user, token } = useAuth();

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '', price: '', stock: '', category_id: '', description: ''
  });

  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!token) return;
    getAdminUsers(token).then(setUsers);
    getAdminProducts(token).then(setProducts);
    getAdminCategories(token).then(setCategories);
  }, [token]);

  if (user?.role !== 'admin') {
    return <p>No autorizado</p>;
  }

  async function handleRoleChange(id, role) {
    const updated = await updateUserRole(id, role, token);
    if (updated?.user) {
      setUsers(prev => prev.map(u => (u.id === id ? updated.user : u)));
    }
  }

  async function handleDeleteProduct(id) {
    await deleteProduct(id, token);
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  async function handleUpdateProduct(id, updated) {
    await updateProduct(id, updated, token);
    const updatedList = await getAdminProducts(token);
    setProducts(updatedList);
    setEditingProductId(null);
    setEditingProduct(null);
  }

  async function handleCreateProduct() {
    const created = await createProduct(newProduct, token);
    if (created.product) {
      setProducts(prev => [...prev, created.product]);
      setShowModal(false);
      setNewProduct({ name: '', price: '', stock: '', category_id: '', description: '' });
    }
  }

  function handleEdit(id, product) {
    setEditingProductId(id);
    setEditingProduct({ ...product });
  }

  function handleCancelEdit() {
    setEditingProductId(null);
    setEditingProduct(null);
  }

  return (
    <div className="dashboard">
      <h1>Panel de Administración</h1>

      <UserTable users={users} onRoleChange={handleRoleChange} />

      <button onClick={() => setShowModal(true)}>➕ Nuevo Producto</button>

      <ProductTable
        products={products}
        categories={categories}
        editingProductId={editingProductId}
        editingProduct={editingProduct}
        onEdit={handleEdit}
        onCancelEdit={handleCancelEdit}
        onChangeEdit={setEditingProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
      />

      <ProductFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateProduct}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        categories={categories}
      />
    </div>
  );
}
