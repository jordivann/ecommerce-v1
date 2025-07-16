const API_URL = import.meta.env.VITE_API_URL;

/**
 * Envia peticiones GET a la API y devuelve JSON.
 * @param {string} endpoint => '/products', '/orders', etc.
 */
export async function get(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

/* Si más adelante querés POST, PUT, etc.:
export async function post(endpoint, body) { ... }
*/
