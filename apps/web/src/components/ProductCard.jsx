import React from 'react';

const ProductCard = ({ product }) => (
  <div className="product-card">
    <img src={product.imageUrl} alt={product.name} />
    <div className="info">
      <h2>{product.name}</h2>
      <p>{`$${product.price}`}</p>
      <button>Agregar al carrito</button>
    </div>
  </div>
);

export default ProductCard;