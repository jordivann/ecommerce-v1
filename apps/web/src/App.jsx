// web/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layouts/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './auth/AuthContext';
import Profile from './pages/Profile';
export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando sesión...</p>;


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/profile"
            element={
              user
                ? <Profile />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              user?.role === 'admin'
                ? <Dashboard />
                : <Navigate to="/" replace />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
