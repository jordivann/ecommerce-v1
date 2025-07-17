import React from 'react';

export default function Sidebar({
  searchQuery,
  onSearch,
  categories = [],
  selectedCategory,
  onSelectCategory
}) {
  return (
    <div className="sidebar-panel">
      <h3>Filtros</h3>
      <div>
        <label htmlFor="sidebar-search">Buscar por nombre:</label>
        <input
          id="sidebar-search"
          type="text"
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          placeholder="Nombre del producto"
        />
      </div>

      <h3>Categorías</h3>
      <ul className="category-list">
        <li
          className={!selectedCategory ? 'active' : ''}
          onClick={() => onSelectCategory(null)}
        >
          Todas
        </li>
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={selectedCategory === cat.name ? 'active' : ''}
            onClick={() => onSelectCategory(cat.name)}
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
