// web/src/Layout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login'); // Redirecciona correctamente
  }

  return (
    <div>
      <nav>
        <Link to="/">Inicio</Link> |{' '}
        {user?.role === 'admin' && <Link to="/dashboard">Dashboard</Link>} |{' '}
        {!user && <Link to="/login">Login</Link>} |{' '}
        {!user && <Link to="/register">Register</Link>} |{' '}
        {user && <button onClick={handleLogout}>Cerrar sesión</button>}
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}
