// web/src/Layout.jsx
import Navbar from '../components/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
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
      <Navbar user={user} handleLogout={handleLogout} />

      <hr />
      <Outlet />
    </div>
  );
}
