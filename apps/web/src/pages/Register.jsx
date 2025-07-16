// web/src/pages/Register.jsx

import RegisterForm from '../hooks/Register';

export default function Register() {
  return (
    <div>
      <h1>Registrate</h1>
      <RegisterForm onRegister={user => console.log('Registrado:', user) } />
    </div>
  );
}
