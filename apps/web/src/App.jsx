import { useProducts } from './hooks/useProducts';

export default function App() {
  const { data: products, loading, error } = useProducts();

  if (loading) return <p>Cargando…</p>;
  if (error)   return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Productos.</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <strong>{p.name}</strong> – ${p.price}
            <br />
            <img src={p.imageUrl} alt={p.name} width={120} />
          </li>
        ))}
      </ul>
    </div>
  );
}
