import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const EcommercePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch products from backend
    axios.get('http://localhost:3001/products')
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    setMessage(`${product.name} added to cart!`);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>E-commerce Integration</h2>
      {selected ? (
        <div>
          <button onClick={() => setSelected(null)}>&larr; Back to Products</button>
          <h3>{selected.name}</h3>
          <img src={selected.image} alt={selected.name} style={{ maxWidth: 200 }} />
          <p>{selected.description}</p>
          <p><b>Price:</b> ${selected.price}</p>
          <button onClick={() => addToCart(selected)}>Add to Cart</button>
        </div>
      ) : (
        <div>
          <h3>Products</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {products.map(product => (
              <div key={product.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8, width: 180 }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: 150, maxHeight: 150 }} />
                <h4>{product.name}</h4>
                <p>${product.price}</p>
                <button onClick={() => setSelected(product)}>View Details</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: '2rem' }}>
        <h3>Cart ({cart.length})</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cart.map((item, idx) => (
            <li key={idx}>{item.name} - ${item.price}</li>
          ))}
        </ul>
        {cart.length > 0 && <button onClick={() => { setCart([]); setMessage('Order placed! (placeholder)'); }}>Checkout</button>}
        {message && <div style={{ color: 'green', marginTop: '1rem' }}>{message}</div>}
      </div>
    </div>
  );
};

export default EcommercePage; 