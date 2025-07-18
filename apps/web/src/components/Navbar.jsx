import { Link } from 'react-router-dom';
import { useState } from 'react';
import './styles/Navbar.css'

export default function Navbar({ user, handleLogout, cartItemsCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Electrónicos', href: '/categoria/electronicos' },
    { name: 'Ropa', href: '/categoria/ropa' },
    { name: 'Hogar', href: '/categoria/hogar' },
    { name: 'Deportes', href: '/categoria/deportes' },
    { name: 'Belleza', href: '/categoria/belleza' },
    { name: 'Libros', href: '/categoria/libros' }
  ];



  return (
    <nav className="navbar">
      {/* Top bar */}
      <div className="navbar-top">
        <div className="container">
          <div className="top-bar">
            <div className="top-left">
              <span>Envío gratis en compras superiores a $50.000</span>
            </div>
            <div className="top-right">
              <Link to="/ayuda">Ayuda</Link>
              <Link to="/seguimiento">Seguir pedido</Link>
              {user?.role === 'admin' && (
                <Link to="/dashboard">Dashboard</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="navbar-main">
        <div className="container">
          <div className="navbar-content">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <svg viewBox="0 0 40 40" className="logo-icon">
                <circle cx="20" cy="20" r="18" fill="currentColor"/>
                <path d="M12 20l6 6 12-12" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
              <span>TiendaPro</span>
            </Link>


            {/* Right side actions */}
            <div className="navbar-actions">
              {/* Wishlist */}
              <Link to="/favoritos" className="nav-action">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="nav-label">Favoritos</span>
              </Link>

              {/* Cart */}
              <Link to="/carrito" className="nav-action cart-action">
                <div className="cart-icon-container">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19a1 1 0 102 0 1 1 0 00-2 0zm10 0a1 1 0 102 0 1 1 0 00-2 0z" />
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="cart-badge">{cartItemsCount}</span>
                  )}
                </div>
                <span className="nav-label">Carrito</span>
              </Link>

              {/* User menu */}
              <div className="user-menu">
                {user ? (
                  <div className="user-dropdown">
                    <button className="user-button">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="nav-label">{user.name || 'Usuario'}</span>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 12l-4-4h8l-4 4z"/>
                      </svg>
                    </button>
                    <div className="dropdown-menu">
                      <Link to="/perfil" className="dropdown-item">Mi Perfil</Link>
                      <Link to="/pedidos" className="dropdown-item">Mis Pedidos</Link>
                      <Link to="/configuracion" className="dropdown-item">Configuración</Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item logout">
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="auth-buttons">
                    <Link to="/login" className="btn-secondary">Iniciar Sesión</Link>
                    <Link to="/register" className="btn-primary">Registrarse</Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button 
                className="mobile-menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">

            <div className="mobile-actions">
              <Link to="/favoritos" onClick={() => setIsMenuOpen(false)}>Favoritos</Link>
              <Link to="/carrito" onClick={() => setIsMenuOpen(false)}>Carrito</Link>
              {user ? (
                <>
                  <Link to="/perfil" onClick={() => setIsMenuOpen(false)}>Mi Perfil</Link>
                  <Link to="/pedidos" onClick={() => setIsMenuOpen(false)}>Mis Pedidos</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>Registrarse</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}