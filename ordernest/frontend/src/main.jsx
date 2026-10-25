import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
function App() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({});
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`${API}/foods`).then(r => { if (!r.ok) throw new Error('Could not load menu'); return r.json(); }).then(setFoods).catch(e => setMessage(e.message + '. Start the backend first.')).finally(() => setLoading(false)); }, []);
  const total = useMemo(() => foods.reduce((sum, f) => sum + f.price * (cart[f.id] || 0), 0), [foods, cart]);
  const change = (id, amount) => setCart(prev => { const next = { ...prev, [id]: Math.max(0, (prev[id] || 0) + amount) }; if (!next[id]) delete next[id]; return next; });
  async function placeOrder() {
    if (!name.trim()) return setMessage('Enter your name before ordering.');
    const items = Object.entries(cart).map(([foodId, quantity]) => ({ foodId: Number(foodId), quantity }));
    if (!items.length) return setMessage('Add at least one food item.');
    try { const r = await fetch(`${API}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerName: name, items }) }); const data = await r.json(); if (!r.ok) throw new Error(data.message || 'Order failed'); setMessage(`Order #${data.id} placed! Total: ₹${data.total}`); setCart({}); }
    catch (e) { setMessage(`${e.message}. Check that the backend is running.`); }
  }
  return <main><header><div className="logo">🍽️ OrderNest</div><span>Good food. Easy ordering.</span></header><section className="hero"><p className="eyebrow">YOUR LOCAL FOOD ORDERING APP</p><h1>Cravings, <em>sorted.</em></h1><p>Choose your favourites and place an order in seconds.</p></section><section><h2>Today's menu</h2>{loading ? <p>Loading menu…</p> : <div className="menu">{foods.map(f => <article className="food" key={f.id}><div className="food-icon">{f.category === 'Pizza' ? '🍕' : f.category === 'Sides' ? '🍟' : f.category === 'Wraps' ? '🌯' : '🍔'}</div><div className="food-info"><h3>{f.name}</h3><p>{f.category}</p><strong>₹{f.price}</strong></div><div className="qty"><button onClick={() => change(f.id, -1)} aria-label={`Remove ${f.name}`}>−</button><b>{cart[f.id] || 0}</b><button onClick={() => change(f.id, 1)} aria-label={`Add ${f.name}`}>+</button></div></article>)}</div>}</section><section className="checkout"><div><h2>Your order</h2><p>{Object.values(cart).reduce((a,b)=>a+b,0)} item(s) selected</p></div><h2>₹{total}</h2><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" aria-label="Your name"/><button className="primary" onClick={placeOrder}>Place order</button>{message && <p className="message" role="status">{message}</p>}</section><footer>OrderNest · Full-stack demo project</footer></main>;
}

createRoot(document.getElementById('root')).render(<App />);