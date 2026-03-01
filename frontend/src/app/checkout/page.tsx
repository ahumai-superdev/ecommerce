'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useCart } from '@/lib/store';
import { createOrder } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '', country: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'invalid email';
    if (!form.address.trim()) e.address = 'required';
    if (!form.city.trim()) e.city = 'required';
    if (!form.zip.trim()) e.zip = 'required';
    if (!form.country.trim()) e.country = 'required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await createOrder({ customer_name: form.name, customer_email: form.email, items, total: total() });
      if (res.order_id) { setOrderId(res.order_id); clearCart(); }
    } catch {}
    setLoading(false);
  };

  if (orderId) return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          style={{ fontSize: 80, marginBottom: 24 }}>✅</motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16 }}>order placed!</h1>
          <p style={{ color: '#94a3b8', marginBottom: 8 }}>your order ID:</p>
          <code style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '8px 16px', borderRadius: 10, color: '#f59e0b', fontSize: 13 }}>{orderId}</code>
          <div style={{ marginTop: 40 }}>
            <button onClick={() => router.push('/products')}
              style={{ padding: '14px 32px', borderRadius: 14, background: '#f59e0b', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 15 }}>
              keep shopping →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const inputStyle = (field: string) => ({
    width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${errors[field] ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
    color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const
  });

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 8 }}>almost there</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: -2 }}>checkout</h1>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start' }}>
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { key: 'name', label: 'Full Name', placeholder: 'Jane Doe' },
              { key: 'email', label: 'Email', placeholder: 'jane@example.com' },
              { key: 'address', label: 'Address', placeholder: '123 Main St' },
              { key: 'city', label: 'City', placeholder: 'San Francisco' },
              { key: 'zip', label: 'ZIP Code', placeholder: '94102' },
              { key: 'country', label: 'Country', placeholder: 'United States' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</label>
                <input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder} style={inputStyle(key)} />
                {errors[key] && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors[key]}</div>}
              </div>
            ))}
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={loading || items.length === 0}
              style={{ padding: '16px', borderRadius: 16, background: '#f59e0b', border: 'none', color: '#000', fontWeight: 800, fontSize: 16, cursor: 'pointer', marginTop: 8, opacity: items.length === 0 ? 0.5 : 1 }}>
              {loading ? 'placing order...' : `place order — $${total().toFixed(2)}`}
            </motion.button>
          </form>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ padding: 28, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 80 }}>
            <h3 style={{ margin: '0 0 20px', fontWeight: 800 }}>order summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#94a3b8' }}>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 20 }}>
              <span>total</span><span style={{ color: '#f59e0b' }}>${total().toFixed(2)}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
