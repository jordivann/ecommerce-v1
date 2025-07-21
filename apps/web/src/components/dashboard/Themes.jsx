import { useEffect, useState } from 'react';
import { getThemes, activateTheme, getActiveTheme} from '../../lib/apiClient';
import Loader from '../Loader';
import './styles/Themes.css';

export default function WishlistAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState(null);

    const token = localStorage.getItem('token');


    const loadThemes = () => {
        if (!token) return;
        setLoading(true);
        getThemes(token)
            .then(setData)
            .catch(err => console.error('❌ Error al cargar themes:', err))
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        loadThemes();
    }, []);


    function applyThemeVariables(vars) {
    const root = document.documentElement;
    for (const [key, val] of Object.entries(vars)) {
        root.style.setProperty(key, val);
    }
    }

    const handleActivate = async (id) => {
    if (!token) return;
    setActivatingId(id);
    try {
        await activateTheme(id, token);
        const updatedTheme = await getActiveTheme();
        applyThemeVariables(updatedTheme);
        loadThemes();
    } catch (err) {
        console.error('❌ Error al activar theme:', err);
    } finally {
        setActivatingId(null);
    }
    };


  if (loading) return <Loader />;

  if (data.length === 0) {
    return <p className="wishlist-empty">Aún no hay themes en la base de datos.</p>;
  }

  return (
    <div className="wishlist-analytics">
      <h2>Themes disponibles</h2>

      <ul className="theme-list">
        {data.map(theme => (
          <li key={theme.id} className={`theme-item ${theme.activo ? 'activo' : ''}`}>
            <strong>{theme.nombre}</strong>
            {theme.activo && <span className="badge-activo">Activo</span>}
            <button
              onClick={() => handleActivate(theme.id)}
              disabled={theme.activo || activatingId === theme.id}
            >
              {theme.activo ? 'Activo' : (activatingId === theme.id ? 'Activando...' : 'Activar')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
