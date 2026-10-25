import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
function App() {
  const [businesses, setBusinesses] = useState([]);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ senderName: '', email: '', message: '' });
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  async function loadBusinesses() {
    setLoading(true);
    try { const params = new URLSearchParams(); if (query.trim()) params.set('q', query.trim()); if (city.trim()) params.set('city', city.trim()); const r = await fetch(`${API}/businesses?${params}`); if (!r.ok) throw new Error('Could not load businesses'); setBusinesses(await r.json()); }
    catch (e) { setNotice(`${e.message}. Start the backend first.`); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadBusinesses(); }, []);
  async function submit(e) {
    e.preventDefault(); if (!selected) return;
    try { const r = await fetch(`${API}/enquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessId: selected.id, ...form }) }); const data = await r.json(); if (!r.ok) throw new Error(data.message || 'Could not send enquiry'); setNotice(data.message); setForm({ senderName: '', email: '', message: '' }); setSelected(null); }
    catch (err) { setNotice(err.message); }
  }
  const icons = { Packaging: '📦', Technology: '💻', 'Food Supply': '🌾', Manufacturing: '🛠️' };
  return <main><header><a className="brand" href="#top"><span className="brand-mark">Z</span> zitu</a><a className="nav-link" href="#businesses">Explore businesses ↗</a></header><section className="hero" id="top"><p className="eyebrow">ZERO INVESTMENT · TRANSPARENT USER NETWORK</p><h1>Good businesses<br/>grow <em>together.</em></h1><p>Discover suppliers, meet business partners, and build trusted connections — all in one place.</p><a className="cta" href="#businesses">Find a business <span>↓</span></a><div className="hero-stats"><div><b>Local-first</b><span>Discover nearby partners</span></div><div><b>Open discovery</b><span>Explore by category</span></div><div><b>Direct enquiries</b><span>Start a conversation</span></div></div></section><section id="businesses" className="directory"><div className="section-heading"><div><p className="eyebrow">THE DIRECTORY</p><h2>Find your next partner.</h2></div><span className="count">{businesses.length} businesses</span></div><form className="filters" onSubmit={e=>{e.preventDefault();loadBusinesses();}}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, service or category…" aria-label="Search businesses"/><input value={city} onChange={e=>setCity(e.target.value)} placeholder="City (e.g. Chennai)" aria-label="Filter by city"/><button className="search-btn">Search</button></form>{loading ? <p>Loading directory…</p> : businesses.length ? <div className="grid">{businesses.map(b=><article className="business-card" key={b.id}><div className="card-top"><span className="business-icon">{icons[b.category] || '🏢'}</span><span className="verified">● Listed</span></div><p className="category">{b.category}</p><h3>{b.name}</h3><p className="description">{b.description}</p><div className="card-bottom"><span>⌖ {b.city}</span><button onClick={()=>{setSelected(b);setNotice('');}}>Connect ↗</button></div></article>)}</div> : <div className="empty">No businesses match your search. Try another keyword or city.</div>}{notice && <p className="notice" role="status">{notice}</p>}</section><footer><a className="brand" href="#top"><span className="brand-mark">Z</span> zitu</a><span>Small businesses. Bigger possibilities.</span></footer>{selected && <div className="overlay" role="presentation" onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="close" onClick={()=>setSelected(null)} aria-label="Close">×</button><p className="eyebrow">START A CONNECTION</p><h2 id="modal-title">Contact {selected.name}</h2><p className="modal-desc">Send a short enquiry to start discussing a possible business partnership.</p><form className="contact-form" onSubmit={submit}><label>Your name<input required value={form.senderName} onChange={e=>setForm({...form,senderName:e.target.value})}/></label><label>Business email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Message<textarea required rows="3" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell them what you're looking for…"/></label><button className="search-btn">Send enquiry</button></form></section></div>}</main>;
}
createRoot(document.getElementById('root')).render(<App />);