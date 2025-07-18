import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../lib/apiClient';
import { useAuth } from '../auth/AuthContext';
import './styles/Profile.css';

export default function Profile() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

useEffect(() => {
  if (!token) return;
  console.log('📡 Llamando a getUserProfile...');
  getUserProfile(token)
    .then(data => {
      console.log('✅ Perfil recibido:', data);

      // Rellenar valores null con string vacío para evitar errores
      const safeData = {
        ...data,
        phone: data.phone || '',
        document_number: data.document_number || '',
        address: data.address || '',
        city: data.city || '',
        postal_code: data.postal_code || '',
        country: data.country || ''
      };

      setProfile(safeData);
      setForm(safeData);
    })
    .catch(err => {
      console.error('❌ Error al obtener perfil:', err);
      setError(err.message);
    })
    .finally(() => setLoading(false));
}, [token]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const result = await updateUserProfile(form, token);
      setProfile(result.user);
      setMessage('Perfil actualizado con éxito');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando perfil…</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  return (
    <div className="profile-container">
      <h1>Mi Perfil</h1>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="field-group">
          <label>Nombre</label>
          <input type="text" value={form.name} name="name" disabled />
        </div>

        <div className="field-group">
          <label>Email</label>
          <input type="email" value={form.email} name="email" disabled />
        </div>

        <div className="field-group">
          <label>Teléfono</label>
          <input type="text" name="phone" value={form.phone || ''} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label>Documento</label>
          <input type="text" name="document_number" value={form.document_number || ''} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label>Dirección</label>
          <input type="text" name="address" value={form.address || ''} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label>Ciudad</label>
          <input type="text" name="city" value={form.city || ''} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label>Código postal</label>
          <input type="text" name="postal_code" value={form.postal_code || ''} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label>País</label>
          <input type="text" name="country" value={form.country || ''} onChange={handleChange} />
        </div>

        <button type="submit">Guardar cambios</button>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
}
