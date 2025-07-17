// web/src/pages/Register.jsx
import { useState } from 'react';
import { registerUser } from '../lib/apiClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // ✅ usar AuthContext
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await registerUser({ name, email, password });

    if (result.token && result.user) {
      login(result.token, result.user); // ✅ guardar token + usuario
      navigate('/dashboard'); // o donde quieras redirigir
    } else {
      alert(result.error || 'Error al registrarse');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrarse</button>
    </form>
  );
}
