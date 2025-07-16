// web/src/hooks/Login.jsx
import { useState } from 'react';
import { loginUser } from '../lib/apiClient';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await loginUser({ email, password });
    if (result.token) {
      localStorage.setItem('token', result.token);
      onLogin(result.user);
    } else {
      alert(result.error || 'Error al iniciar sesión');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
