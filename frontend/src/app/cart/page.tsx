'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCart } from '@/lib/store';

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCart();

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 8 }}>review</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: -2 }}>your cart</h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🛍️</div>
            <p style={{ color: '#4b5563', fontSize: 18, marginBottom: 32 }}>your cart is empty</p>
            <Link href="/products" style={{ padding: '14px 32px', borderRadius: 14, background: '#f59e0b', color: '#000', fontWeight: 800, textDecoration: 'none' }}>
              start shopping →
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }}>
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <AnimatePresence>
                {items.map(item => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    style={{ display: 'flex', gap: 20, padding: 20, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', alignItems: 'center' }}>
                    <img src={item.image_url} alt={item.name} style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.name}</div>
                      <div style={{ color: '#f59e0b', fontWeight: 800 }}>${item.price.toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}
                        style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.04)', border: 'none', color: '#fff', cursor: 'pointer' }}>−</button>
                      <span style={{ width: 40, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}
                        style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.04)', border: 'none', color: '#fff', cursor: 'pointer' }}>+</button>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 16, minWidth: 70, textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</div>
                    <button onClick={() => removeItem(item.id)}
                      style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: 18, padding: '0 4px' }}>✕</button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ padding: 28, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 80 }}>
              <h3 style={{ margin: '0 0 24px', fontWeight: 800, fontSize: 18 }}>order summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 14 }}>
                  <span>subtotal</span><span>${total().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 14 }}>
                  <span>shipping</span><span style={{ color: '#22c55e' }}>free</span>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 20 }}>
                  <span>total</span><span style={{ color: '#f59e0b' }}>${total().toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout" style={{ display: 'block', padding: '14px', borderRadius: 14, background: '#f59e0b', color: '#000', fontWeight: 800, fontSize: 15, textDecoration: 'none', textAlign: 'center' }}>
                checkout →
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
