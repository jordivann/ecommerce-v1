import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const páginas = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹ Anterior
      </button>

      {páginas.map(n => (
        <button
          key={n}
          className={n === currentPage ? 'active' : ''}
          onClick={() => onPageChange(n)}
        >
          {n}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente ›
      </button>
    </div>
  );
};

export default Pagination;