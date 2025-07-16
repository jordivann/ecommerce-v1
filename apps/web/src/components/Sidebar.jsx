import React from 'react';

const Sidebar = ({ searchQuery, onSearch }) => (
  <div>
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
    {/* Aquí podrías añadir sliders, checkboxes, rangos de precio, etc. */}
  </div>
);

export default Sidebar;