// apps/web/src/pages/Home.jsx
import { useEffect, useMemo, useState } from 'react';
import { getPublicProducts, getPublicCategories } from '../lib/apiClient';
import { useCart } from '../context/cartContext';
import './styles/Home.css';

// Normaliza cualquier valor a string en minúsculas
const toText = (v) => {
  if (Array.isArray(v)) return v.join(' ').toLowerCase();
  if (v === null || v === undefined) return '';
  return String(v).toLowerCase();
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros / UI
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyStock, setOnlyStock] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [visibility, setVisibility] = useState('Todos');

  // Paginado
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6; // 👈 6 cards por página

  // Carrito
  const { addToCart } = useCart();

  // Carga inicial
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [prods, cats] = await Promise.all([
          getPublicProducts(),
          getPublicCategories(),
        ]);
        if (!isMounted) return;
        setProducts(prods || []);
        setCategories([{ id: 0, name: 'Todas' }, ...(cats || [])]);
      } catch (err) {
        console.error('Error cargando datos:', err);
        if (isMounted) setError('No se pudieron cargar los datos.');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Filtrado seguro (coincidencia de texto + otros filtros)
  const filtered = useMemo(() => {
    let list = products;

    const q = toText(searchQuery).trim();
    if (q) {
      list = list.filter((p) => {
        const name = toText(p.name);
        const brand = toText(p.brand);
        const tags = toText(p.tags);
        return name.includes(q) || brand.includes(q) || tags.includes(q);
      });
    }

    if (selectedCategory && selectedCategory !== 'Todas') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!Number.isNaN(min)) list = list.filter((p) => Number(p.price) >= min);
    if (!Number.isNaN(max)) list = list.filter((p) => Number(p.price) <= max);

    if (onlyStock) list = list.filter((p) => Number(p.stock) > 0);
    if (onlyDiscount) list = list.filter((p) => Number(p.discount) > 0);

    if (visibility === 'Visibles') list = list.filter((p) => p.visible !== false);
    if (visibility === 'Ocultos') list = list.filter((p) => p.visible === false);

    return list;
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice, onlyStock, onlyDiscount, visibility]);

  // ---- Paginación robusta (chunking + rebalanceo si última página tenía 1 ítem) ----
  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < filtered.length; i += perPage) {
      chunks.push(filtered.slice(i, i + perPage));
    }
    if (chunks.length > 1 && chunks[chunks.length - 1].length === 1) {
      const prev = chunks[chunks.length - 2];
      const last = chunks[chunks.length - 1];
      const moved = prev.pop();
      if (moved) last.unshift(moved);
    }
    return chunks;
  }, [filtered, perPage]);

  const pageCount = Math.max(1, pages.length || 1);
  const page = Math.min(currentPage, pageCount);
  const pageSlice = pages[page - 1] || [];

  // Reset de página cuando cambian filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, minPrice, maxPrice, onlyStock, onlyDiscount, visibility]);

  const handleAddToCart = (p) => {
    if (Number(p.stock) <= 0) return;
    if (typeof addToCart === 'function') addToCart(p.id, 1, p);
  };

  const onSubmitSearch = (e) => {
    e.preventDefault(); // no navegamos ni usamos ?q
    setCurrentPage(1);
  };

  if (error) return <main className="container page"><p>{error}</p></main>;

  return (
    <main className="container page">
      {/* ÚNICA barra de búsqueda arriba de la grilla */}
      <div className="content-header">
        <h1>Todos los productos</h1>

        <form className="searchbar" onSubmit={onSubmitSearch} role="search" aria-label="Buscar productos">
          <input
            className="searchbar-input"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Botón estilo FANCY */}
          <button type="submit" className="fancy">
            <span className="top-key"></span>
            <span className="text">Buscar</span>
            <span className="bottom-key-1"></span>
            <span className="bottom-key-2"></span>
          </button>
        </form>
      </div>

      <div className="layout">
        {/* FILTROS (acordeón) */}
        <aside className="sidebar">
          <h3 style={{ marginTop: 0 }}>Filtros</h3>

          <details className="acc" open>
            <summary>Categorías</summary>
            <ul className="category-list">
              {categories.map((cat) => {
                const name = cat.name ?? 'Todas';
                const active = selectedCategory === name;
                return (
                  <li
                    key={cat.id ?? name}
                    className={active ? 'active' : ''}
                    onClick={() => setSelectedCategory(name)}
                  >
                    {name}
                  </li>
                );
              })}
            </ul>
          </details>

          <details className="acc">
            <summary>Rango de precio</summary>
            <div className="price-range">
              <input
                type="number"
                placeholder="Mín"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Máx"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </details>

          <details className="acc">
            <summary>Disponibilidad</summary>
            <div className="filter-block" style={{ marginBottom: 0 }}>
              <label>
                <input
                  type="checkbox"
                  checked={onlyStock}
                  onChange={(e) => setOnlyStock(e.target.checked)}
                />{' '}
                Solo con stock
              </label>
            </div>
            <div className="filter-block" style={{ marginBottom: 0 }}>
              <label>
                <input
                  type="checkbox"
                  checked={onlyDiscount}
                  onChange={(e) => setOnlyDiscount(e.target.checked)}
                />{' '}
                Solo con descuentos
              </label>
            </div>
          </details>

          <details className="acc">
            <summary>Visibilidad</summary>
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option>Todos</option>
              <option>Visibles</option>
              <option>Ocultos</option>
            </select>
          </details>
        </aside>

        {/* GRID */}
        <section>
          {loading ? (
            <div className="product-grid">
              {Array.from({ length: perPage }).map((_, i) => (
                <div key={i} className="product-card skeleton" />
              ))}
            </div>
          ) : (
            <>
              <div className="product-grid">
                {pageSlice.map((p) => (
                  <article key={p.id} className="product-card">
                    <div className="product-image-container">
                      {Number(p.discount) > 0 && (
                        <span className="discount-badge">-{p.discount}%</span>
                      )}
                      <img src={p.imageUrl} alt={p.name} loading="lazy" />
                      {Number(p.stock) > 0 ? (
                        Number(p.stock) <= 3 && (
                          <span className="stock-badge">¡Últimas {p.stock}!</span>
                        )
                      ) : (
                        <span className="stock-badge" style={{ background: 'var(--color-muted)' }}>
                          Sin stock
                        </span>
                      )}
                    </div>

                    <div className="info">
                      <h2 title={p.name}>{p.name}</h2>

                      <div className="product-rating">
                        <div className="stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`star ${i < Math.round(p.rating || 0) ? 'filled' : ''}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="rating-text">({p.reviewCount || 0})</span>
                      </div>

                      <div className="price-section">
                        {Number(p.discount) > 0 && (
                          <span className="original-price">
                            ${Number(p.originalPrice).toLocaleString('es-AR')}
                          </span>
                        )}
                        <p className="current-price">
                          ${Number(p.price).toLocaleString('es-AR')}
                        </p>
                      </div>

                      <button
                        className="add-to-cart-btn"
                        disabled={Number(p.stock) <= 0}
                        onClick={() => handleAddToCart(p)}
                      >
                        Agregar
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Paginado */}
              <div className="pagination">
                <button
                  className="btn"
                  disabled={page <= 1}
                  onClick={() => setCurrentPage((n) => Math.max(1, n - 1))}
                >
                  « Anterior
                </button>
                {Array.from({ length: pageCount }).map((_, i) => {
                  const n = i + 1;
                  return (
                    <button
                      key={n}
                      className={`btn ${n === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(n)}
                    >
                      {n}
                    </button>
                  );
                })}
                <button
                  className="btn"
                  disabled={page >= pageCount}
                  onClick={() => setCurrentPage((n) => Math.min(pageCount, n + 1))}
                >
                  Siguiente »
                </button>
              </div>

              {/* Espacio y footer con copyright */}
              <div className="footer-gap" aria-hidden="true"></div>
              <footer className="home-footer">
                <small>© {new Date().getFullYear()} Fuego-Eterno. Todos los derechos reservados.</small>
              </footer>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
