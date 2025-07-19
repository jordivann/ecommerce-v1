// import './styles/ProductTable.css';

// export default function ProductTable({
//   products,
//   categories,
//   editingProductId,
//   editingProduct,
//   onEdit,
//   onCancelEdit,
//   onChangeEdit,
//   onUpdateProduct,
//   onDeleteProduct
// }) {
//   const handleSave = () => {
//     // Validación básica
//     const { name, price, stock } = editingProduct;

//     if (!name || !price || !stock) {
//       alert('Por favor completá nombre, precio y stock antes de guardar.');
//       return;
//     }

//     onUpdateProduct(editingProductId, editingProduct);
//   };

//   return (
//     <div className="product-table">
//       <h2>Productos</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Nombre</th>
//             <th>Descripción</th>
//             <th>Precio</th>
//             <th>Stock</th>
//             <th>Categoría</th>
//             <th>Imagen</th>
//             <th>Creado</th>
//             <th>Acciones</th>
//             <th>Precio original</th>
//             <th>Descuento %</th>
//             <th>Marca</th>
//             <th>Etiquetas</th>
//             <th>Unidad</th>
//             <th>Visible</th>

//           </tr>
//         </thead>
//         <tbody>
//           {products.filter(Boolean).map(p => (
//             <tr key={p.id}>
//               {editingProductId === p.id ? (
//                 <>
//                   <td>
//                     <input
//                       value={editingProduct.name}
//                       onChange={e => onChangeEdit({ ...editingProduct, name: e.target.value })}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       value={editingProduct.description || ''}
//                       onChange={e => onChangeEdit({ ...editingProduct, description: e.target.value })}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="number"
//                       min="0"
//                       value={editingProduct.price}
//                       onChange={e => onChangeEdit({ ...editingProduct, price: e.target.value })}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="number"
//                       min="0"
//                       value={editingProduct.stock}
//                       onChange={e => onChangeEdit({ ...editingProduct, stock: e.target.value })}
//                     />
//                   </td>
//                   <td>
//                     <select
//                       value={editingProduct.category_id || ''}
//                       onChange={e => onChangeEdit({ ...editingProduct, category_id: e.target.value })}
//                     >
//                       <option value="">Sin categoría</option>
//                       {categories.map(cat => (
//                         <option key={cat.id} value={cat.id}>{cat.name}</option>
//                       ))}
//                     </select>
//                   </td>
//                   <td>
//                     <input
//                       type="number"
//                       min="0"
//                       value={editingProduct.original_price || ''}
//                       onChange={e => onChangeEdit({ ...editingProduct, original_price: e.target.value })}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={editingProduct.discount_percentage || ''}
//                       onChange={e => onChangeEdit({ ...editingProduct, discount_percentage: e.target.value })}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       value={editingProduct.brand || ''}
//                       onChange={e => onChangeEdit({ ...editingProduct, brand: e.target.value })}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       value={editingProduct.tags?.join(', ') || ''}
//                       onChange={e => onChangeEdit({ ...editingProduct, tags: e.target.value.split(',').map(tag => tag.trim()) })}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       value={editingProduct.unit || ''}
//                       onChange={e => onChangeEdit({ ...editingProduct, unit: e.target.value })}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="checkbox"
//                       checked={editingProduct.visible}
//                       onChange={e => onChangeEdit({ ...editingProduct, visible: e.target.checked })}
//                     />
//                   </td>

//                   <td colSpan="2">{new Date(p.created_at).toLocaleDateString()}</td>
//                   <td>
//                     <button onClick={handleSave}>💾 Guardar</button>
//                     <button onClick={onCancelEdit}>❌ Cancelar</button>
//                   </td>
//                 </>
//               ) : (
//                 <>
//                   <td>{p.name}</td>
//                   <td>{p.description || 'Sin descripción'}</td>
//                   <td>${p.price}</td>
//                   <td>{p.stock}</td>
//                   <td>
//                     {
//                       categories.find(c => c.id === p.category_id)?.name || 'Sin categoría'
//                     }
//                   </td>

//                   <td><img
//                     src={p.image_url || '/img/default-product.png'}
//                     alt={p.name}
//                     width="50"
//                   /></td>
//                   <td>${p.original_price || '-'}</td>
//                   <td>{p.discount_percentage ? `${p.discount_percentage}%` : '-'}</td>
//                   <td>{p.brand || '-'}</td>
//                   <td>{Array.isArray(p.tags) ? p.tags.join(', ') : '-'}</td>
//                   <td>{p.unit || '-'}</td>
//                   <td>{p.visible ? '✔️' : '❌'}</td>

//                   <td>{new Date(p.created_at).toLocaleDateString()}</td>
//                   <td>
//                     <button onClick={() => onEdit(p.id, p)}>✏️ Editar</button>
//                     <button onClick={() => onDeleteProduct(p.id)}>🗑️ Eliminar</button>
//                   </td>
//                 </>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import React from 'react';
import ProductCardAdmin from './ProductCardAdmin';
import './styles/ProductTable.css'; // podés dejar o limpiar esto si ya no usás tabla

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
  return (
    <div className="product-card-grid">
      {products.filter(Boolean).map(product => (
        <ProductCardAdmin
          key={product.id}
          product={{
            ...product,
            category: categories.find(c => c.id === product.category_id)?.name
          }}
          onEdit={onEdit}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
}
