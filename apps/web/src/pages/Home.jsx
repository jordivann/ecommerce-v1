import { useEffect, useState } from 'react';
import { getPublicProducts, getPublicCategories } from '../lib/apiClient';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import Logo from '../components/Logo';
import './styles/Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  const perPage = 8;

  useEffect(() => {
    
    async function loadData() {
      try {
        const [prods, cats] = await Promise.all([
          getPublicProducts(),
          getPublicCategories()
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Error cargando productos/categorías:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Cargando…</p>;
  if (error) return <p style={{ padding: 20 }}>Error: {error.message}</p>;

  const filtered = products.filter(p => {
  const matchesName = p.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory
    ? p.category?.toLowerCase() === selectedCategory.toLowerCase()
    : true;
  return matchesName && matchesCategory;
});

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  return (
    <>
      <header className="topbar">
        <Logo />
        <SearchBar value={searchQuery} onSearch={setSearchQuery} />
      </header>

      <div className="container layout">
        <aside className="sidebar">
          <Sidebar
            categories={categories}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </aside>

        <main>
          <h2 style={{ marginBottom: '1rem' }}>
            {selectedCategory ? `Categoría: ${selectedCategory}` : 'Todos los productos'}
          </h2>
          <div className="product-grid">
            {pageItems.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </>
  );
}
