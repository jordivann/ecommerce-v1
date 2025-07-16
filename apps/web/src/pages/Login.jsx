// web/src/pages/Login.jsx
import LoginForm from '../hooks/Login';

export default function Login() {
  return (
    <div>
      <h1>Iniciar sesión</h1>
      <LoginForm onLogin={user => console.log('Sesión iniciada', user)} />
    </div>
  );
}
