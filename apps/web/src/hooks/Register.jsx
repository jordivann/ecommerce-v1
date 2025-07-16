// web/src/hooks/Register.jsx
import { useState } from 'react';
import { registerUser } from '../lib/apiClient';

export default function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    console.log({ name, email, password });

    e.preventDefault();
    const result = await registerUser({ name, email, password });
    if (result.token) {
      localStorage.setItem('token', result.token);


      onRegister?.(result.user); 
    } else {
      alert(result.error || 'Error al registrarse');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Registrarse</button>
    </form>
  );
}
