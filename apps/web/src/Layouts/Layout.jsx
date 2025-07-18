import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../auth/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hideNavbarOnRoutes = ['/login', '/register'];
  const shouldHideNavbar = hideNavbarOnRoutes.includes(location.pathname);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div>
      {!shouldHideNavbar && (
        <>
          <Navbar user={user} handleLogout={handleLogout} />
          <hr />
        </>
      )}

      <Outlet />
    </div>
  );
}
