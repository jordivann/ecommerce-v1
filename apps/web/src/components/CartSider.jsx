import { useCart } from '../context/cartContext';
import './styles/CartSider.css';

export default function CartSidebar({ isOpen, onClose }) {
  const {
    cart,
    updateCart,
    removeFromCart,
    errors,
  } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>Carrito de compras</h2>

      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} className="cart-img" />
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateCart(item.id, item.quantity - 1)
                          : removeFromCart(item.id)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateCart(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <p className="item-price">Total: ${item.price * item.quantity}</p>
                  {errors[item.id] && (
                    <span className="cart-error">{errors[item.id]}</span>
                  )}
                </div>
                <button className="delete-btn" onClick={() => removeFromCart(item.id)}>🗑</button>
              </li>
            ))}
          </ul>

          <div className="summary">
            <p>Subtotal: <strong>${subtotal.toLocaleString('es-AR')}</strong></p>
            <p className="installments">
              3 cuotas sin interés de ${Math.floor(subtotal / 3).toLocaleString('es-AR')}
            </p>
            <button className="checkout">FINALIZAR COMPRA</button>
          </div>
        </>
      )}
    </div>
  );
}
