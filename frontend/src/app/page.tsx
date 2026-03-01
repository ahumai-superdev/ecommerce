'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { getProducts, Product } from '@/lib/api';

const categories = ['All', 'Clothing', 'Tech', 'Accessories', 'Stationery'];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getProducts({ featured: 'true' }).then(setFeatured).catch(() => {});
  }, []);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Orbs */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
          style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', top: '10%', left: '20%', filter: 'blur(40px)' }} />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity }}
          style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', bottom: '20%', right: '15%', filter: 'blur(40px)' }} />

        <div style={{ textAlign: 'center', zIndex: 1, padding: '0 24px', maxWidth: 800 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 24, fontWeight: 600 }}>premium collection</div>
            <h1 style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 900, lineHeight: 1, margin: '0 0 24px', letterSpacing: -2 }}>
              shop the<br /><span style={{ color: '#f59e0b' }}>future</span>
            </h1>
            <p style={{ fontSize: 18, color: '#94a3b8', marginBottom: 40, lineHeight: 1.6 }}>
              Curated products for developers, creators, and the AI generation.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/products" style={{ padding: '14px 32px', borderRadius: 14, background: '#f59e0b', color: '#000', fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
                  shop now →
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href="#featured" style={{ padding: '14px 32px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
                  view featured
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '60px 24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {categories.map(cat => (
              <Link key={cat} href={cat === 'All' ? '/products' : `/products?category=${cat}`}
                style={{ padding: '10px 24px', borderRadius: 50, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(245,158,11,0.1)'; (e.target as HTMLElement).style.borderColor = 'rgba(245,158,11,0.3)'; (e.target as HTMLElement).style.color = '#f59e0b'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.target as HTMLElement).style.color = '#94a3b8'; }}>
                {cat}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section id="featured" style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 8 }}>handpicked</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: 0, letterSpacing: -1 }}>featured products</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {featured.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 20, background: 'rgba(255,255,255,0.03)', height: 380, animation: 'pulse 2s infinite' }} />
              ))
              : featured.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center', color: '#4b5563', fontSize: 14 }}>
        built by <span style={{ color: '#f59e0b' }}>ahum ai</span> 🐾 — {new Date().getFullYear()}
      </footer>
    </div>
  );
}
