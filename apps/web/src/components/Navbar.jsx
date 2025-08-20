// apps/web/src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../context/cartContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  // Hook del carrito (siempre, sin condicionales)
  const { items = [] } = useCart();
  const cartItemsCount = items.reduce((acc, it) => acc + (it.quantity ?? 1), 0);

  // Efecto para aplicar fondo/blur al hacer scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`neo-nav ${scrolled ? 'scrolled' : ''}`}>
      {/* Versión sin barra de búsqueda en el navbar */}
      <div className="neo-wrap no-search">
        <Link to="/" className="brand" aria-label="Inicio">
          <span className="brand-atom">Fe</span>
          <span className="brand-name">— Fuego-Eterno</span>
        </Link>

        <div className="neo-actions">
          <Link to="/cart" className="pill" aria-label={`Carrito (${cartItemsCount} productos)`}>
            Carrito {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && <Link to="/dashboard" className="ghost">Admin</Link>}
              <Link to="/profile" className="ghost">Perfil</Link>
              <button type="button" className="ghost" onClick={logout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="ghost">Iniciar Sesión</Link>
              <Link to="/register" className="pill">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
