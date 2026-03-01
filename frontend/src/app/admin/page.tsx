'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { getProducts, createProduct, deleteProduct, Product } from '@/lib/api';

const empty = { name: '', description: '', price: '', image_url: '', category: 'Clothing', stock: '', featured: false };

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => getProducts().then(setProducts).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProduct({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) });
      setStatus({ type: 'success', msg: 'product added!' });
      setForm(empty);
      load();
    } catch { setStatus({ type: 'error', msg: 'failed to add product' }); }
    setLoading(false);
    setTimeout(() => setStatus(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('delete this product?')) return;
    await deleteProduct(id);
    load();
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 8 }}>management</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: -2 }}>admin panel</h1>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 48, alignItems: 'start' }}>
          {/* Add form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            style={{ padding: 28, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 80 }}>
            <h3 style={{ margin: '0 0 24px', fontWeight: 800 }}>add product</h3>
            {status && (
              <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 16, background: status.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${status.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: status.type === 'success' ? '#22c55e' : '#ef4444', fontSize: 13 }}>
                {status.msg}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['name', 'Name'], ['description', 'Description'], ['price', 'Price'], ['image_url', 'Image URL'], ['stock', 'Stock']].map(([key, label]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</label>
                  <input value={form[key]} onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))} style={inputStyle} required />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Category</label>
                <select value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  {['Clothing', 'Tech', 'Accessories', 'Stationery'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#94a3b8' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm((f: any) => ({ ...f, featured: e.target.checked }))} />
                featured product
              </label>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={loading}
                style={{ padding: '12px', borderRadius: 12, background: '#f59e0b', border: 'none', color: '#000', fontWeight: 800, cursor: 'pointer', marginTop: 4 }}>
                {loading ? 'adding...' : 'add product'}
              </motion.button>
            </form>
          </motion.div>

          {/* Product list */}
          <div>
            <h3 style={{ margin: '0 0 20px', fontWeight: 800 }}>all products ({products.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {products.map(p => (
                <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: 'flex', gap: 16, padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', alignItems: 'center' }}>
                  <img src={p.image_url} alt={p.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{p.category} · ${p.price} · {p.stock} in stock {p.featured && '· ⭐ featured'}</div>
                  </div>
                  <button onClick={() => handleDelete(p.id)}
                    style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                    delete
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
