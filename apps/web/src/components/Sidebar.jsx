import React from 'react';
export default function Sidebar({
  searchQuery,
  onSearch,
  categories = [],
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onlyInStock,
  onToggleInStock,
  onlyDiscounts,
  onToggleWithDiscounts,
  selectedVisibility,
  onVisibilityChange,
  brands = [],
  selectedBrand,
  onBrandSelect,
  onlyOrganic,
  onToggleOrganic,
  onlySenasa,
  onToggleSenasa,
  isBlocked
}) {
  return (
    <div className="sidebar-panel">
      <h2>🔍 Filtros</h2>

      {/* Categorías */}
      <div className="filter-block">
        <label>Categorías:</label>
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

      {/* Rango de precio */}
      <div className="filter-block">
        <label>Rango de precio:</label>
        <div className="price-range">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="Mín"
            disabled={isBlocked}
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Máx"
            disabled={isBlocked}
          />
        </div>
        {isBlocked && (
          <div className="blocked-message">
            🛑 Filtros bloqueados temporalmente por actividad excesiva.
          </div>
        )}
      </div>

      {/* Stock */}
      <div className="filter-block">
        <label>
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={onToggleInStock}
          />
          Solo con stock
        </label>
      </div>

      {/* Descuentos */}
      <div className="filter-block">
        <label>
          <input
            type="checkbox"
            checked={onlyDiscounts}
            onChange={onToggleWithDiscounts}
          />
          Solo con descuentos activos
        </label>
      </div>

      {/* Visibilidad */}
      <div className="filter-block">
        <label>Visibilidad:</label>
        <select
          value={selectedVisibility}
          onChange={(e) => onVisibilityChange(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="visible">Solo visibles</option>
          <option value="hidden">Solo ocultos</option>
        </select>
      </div>

      {/* Marca */}
      <div className="filter-block">
        <label>Marca:</label>
        <select
          value={selectedBrand}
          onChange={(e) => onBrandSelect(e.target.value)}
        >
          <option value="">Todas</option>
          {brands.map((brand, i) => (
            <option key={i} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Orgánico */}
      <div className="filter-block">
        <label>
          <input
            type="checkbox"
            checked={onlyOrganic}
            onChange={onToggleOrganic}
          />
          Solo orgánicos
        </label>
      </div>

      {/* SENASA */}
      <div className="filter-block">
        <label>
          <input
            type="checkbox"
            checked={onlySenasa}
            onChange={onToggleSenasa}
          />
          Solo productos con SENASA
        </label>
      </div>
    </div>
  );
}
