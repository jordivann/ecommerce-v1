// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../lib/apiClient';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useAuth(); // ✅ usando el context
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await loginUser(credentials);
      if (data?.token && data?.user) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        alert('Credenciales inválidas');
      }
    } catch (err) {
      alert('Error al iniciar sesión');
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={e => setCredentials({ ...credentials, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
        required
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
