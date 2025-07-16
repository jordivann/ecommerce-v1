// web/src/Layout.jsx
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  function handleLogout() {
    localStorage.removeItem('token');
    // Redirigir al login o al home
    window.location.href = '/login';
  }

  return (
    <div>
      <nav>
        <Link to="/">Inicio</Link> |{' '}
        <Link to="/dashboard">Dashboard</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/register">Register</Link> |{' '}
        <button onClick={handleLogout}>Cerrar sesión</button>

      </nav>
      <hr />
      <Outlet />
    </div>
  );
}
