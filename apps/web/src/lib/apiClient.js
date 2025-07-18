const API_URL = import.meta.env.VITE_API_URL;

/**
 * Envia peticiones GET a la API y devuelve JSON.
 * @param {string} endpoint => '/products', '/orders', etc.
 */
export async function get(endpoint, token) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// Registro de usuario
export async function registerUser({ name, email, password }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  console.log('🔍 Register response:', data);

  if (!res.ok) {
    return { error: data.error || 'Error desconocido' };
  }

  return data;
}

// Login de usuario
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.json();
}

// Perfil autenticado ESTA FUNCION VERIFICA LA SESIÓN
export async function getProfile(token) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Estas dos funciones extras traen TODA la info de user y deja actualizar. Para pantalla PROFILE.JSX 
// ✅ 1. Obtener perfil del usuario
export async function getUserProfile(token) {
  const res = await fetch(`${API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('No se pudo obtener el perfil del usuario');
  }

  return res.json();
}

// ✅ 2. Actualizar datos del perfil (dirección, etc)
export async function updateUserProfile(data, token) {
  const res = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error al actualizar el perfil');
  }

  return res.json();
}
//
// ===== ADMIN =====
//

// Obtener todos los usuarios (admin only)
export async function getAdminUsers(token) {
  return get('/dashboard/users', token);
}

// Obtener resumen de productos (admin only)
export async function getAdminProducts(token) {
  return get('/dashboard/products', token);
}

// Cambiar el rol de un usuario
export async function updateUserRole(userId, role, token) {
  const res = await fetch(`${API_URL}/dashboard/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  const data = await res.json();
  if (!res.ok) {
    return { error: data.error || 'Error al actualizar rol' };
  }

  return data;
}

export async function deleteProduct(id, token) {
  const res = await fetch(`${API_URL}/dashboard/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

export async function updateProduct(productId, data, token) {
  const res = await fetch(`${API_URL}/dashboard/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Error al actualizar producto');
  return result.product;
}


export async function createProduct(data, token) {
  const res = await fetch(`${API_URL}/dashboard/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function getAdminCategories(token) {
  const res = await fetch(`${API_URL}/dashboard/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getPublicProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
}

export async function getPublicCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Error al cargar categorías');
  return res.json();
}