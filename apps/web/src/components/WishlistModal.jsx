import { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '../lib/apiClient';
import './styles/WishlistModal.css'

export default function WishlistModal({ open, onClose }) {
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    let ignore = false;

    if (open) {
      getWishlist().then(data => {
        if (!ignore) setWishlist(data);
      });
    }

    return () => {
      ignore = true;
    };
  }, [open]);


  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    setWishlist(wishlist.filter(p => p.id !== productId));
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="wishlist-modal">
        <h2 className="wishlist-title">Mi Wishlist</h2>
        <ul className="wishlist-list">
          {wishlist.map(product => (
            <li key={product.id} className="wishlist-item">
              <img src={product.image_url} alt={product.name} className="wishlist-image" />
              <span className="wishlist-name">{product.name}</span>
              <button className="wishlist-remove-btn" onClick={() => handleRemove(product.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
        <button className="wishlist-close-btn" onClick={onClose}>Cerrar</button>
      </div>
    </div>

  );
}
