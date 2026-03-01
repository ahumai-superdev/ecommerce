'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { getProducts, Product } from '@/lib/api';

const categories = ['All', 'Clothing', 'Tech', 'Accessories', 'Stationery'];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    setLoading(true);
    const params = active !== 'All' ? { category: active } : undefined;
    getProducts(params).then(data => { setProducts(data); setLoading(false); }).catch(() => setLoading(false));
  }, [active]);

  return (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setActive(cat)}
            style={{ padding: '8px 20px', borderRadius: 50, border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              background: active === cat ? '#f59e0b' : 'rgba(255,255,255,0.04)',
              borderColor: active === cat ? '#f59e0b' : 'rgba(255,255,255,0.08)',
              color: active === cat ? '#000' : '#94a3b8' }}>
            {cat}
          </motion.button>
        ))}
      </div>
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 20, background: 'rgba(255,255,255,0.03)', height: 380 }} />
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
          {products.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0', color: '#4b5563' }}>no products found</div>
          )}
        </motion.div>
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 8 }}>catalog</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: -2 }}>all products</h1>
        </motion.div>
        <Suspense fallback={<div style={{ color: '#4b5563' }}>loading...</div>}>
          <ProductsContent />
        </Suspense>
      </div>
    </div>
  );
}
