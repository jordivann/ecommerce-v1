import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Sidebar from './components/Sidebar';
import SearchBar from '../components/SearchBar';
import Logo from '../components/Logo';

export default function Home() {
  const { data: products = [], loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  if (loading) return <p style={{ padding: 20 }}>Cargando…</p>;
  if (error) return <p style={{ padding: 20 }}>Error: {error.message}</p>;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />
        </aside>

        <main>
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
