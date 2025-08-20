// src/components/Cart.jsx
import { useCart } from '../context/cartContext';
import './styles/Cart.css';

export default function Cart() {
  const {
    cart,
    loading,
    updateCart,
    removeFromCart,
    clearCart,
    errors,
  } = useCart();

  if (loading) return <div className="cart">Cargando carrito...</div>;

  if (cart.length === 0)
    return (
      <div className="cart">
        <h2>Tu carrito está vacío</h2>
      </div>
    );

  return (
    <div className="cart">
      <h2>Mi Carrito</h2>

      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            <img src={item.image_url} alt={item.name} className="cart-img" />

            <div className="cart-info">
              <h3>{item.name}</h3>
              <p>Precio: ${item.price}</p>
              <p>Total: ${item.price * item.quantity}</p>
            </div>

            <div className="cart-qty-controls">
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

            <button
              className="cart-btn remove"
              onClick={() => removeFromCart(item.id)}
            >
              🗑
            </button>
            {errors[item.id] && (<span className="cart-error">{errors[item.id]}</span>)}
          </li>
        

        ))}
      </ul>

      <button className="cart-clear-btn" onClick={clearCart}>
        Vaciar carrito
      </button>
    </div>
  );
}
