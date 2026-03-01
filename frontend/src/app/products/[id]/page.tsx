'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { getProduct, Product } from '@/lib/api';
import { useCart } from '@/lib/store';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart(s => s.addItem);

  useEffect(() => {
    getProduct(id).then(setProduct).catch(() => {});
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
        <div style={{ borderRadius: 24, background: 'rgba(255,255,255,0.03)', height: 500 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[200, 100, 60, 80, 120].map((w, i) => <div key={i} style={{ height: 20, width: w, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 80px' }}>
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14, marginBottom: 40, display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}>
          ← back
        </motion.button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '1', background: 'rgba(255,255,255,0.03)' }}>
            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <span style={{ padding: '4px 14px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
                {product.category}
              </span>
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 900, margin: 0, letterSpacing: -1, lineHeight: 1.1 }}>{product.name}</h1>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#f59e0b' }}>${product.price.toFixed(2)}</div>
            <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 16, margin: 0 }}>{product.description}</p>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: product.stock > 0 ? '#22c55e' : '#ef4444' }} />
              <span style={{ fontSize: 13, color: product.stock > 0 ? '#22c55e' : '#ef4444' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'out of stock'}
              </span>
            </div>

            {/* Qty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>quantity</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.04)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18 }}>−</button>
                <span style={{ width: 48, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.04)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18 }}>+</button>
              </div>
            </div>

            {/* Add to cart */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleAdd} disabled={product.stock === 0}
              style={{ padding: '16px', borderRadius: 16, background: added ? '#22c55e' : '#f59e0b', border: 'none', color: '#000', fontWeight: 800, fontSize: 16, cursor: 'pointer', transition: 'background 0.3s' }}>
              {added ? '✓ added to cart!' : 'add to cart'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
