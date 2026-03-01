'use client';
import Link from 'next/link';
import { useCart } from '@/lib/store';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const count = useCart(s => s.count());
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(10,10,15,0.9)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none', transition: 'all 0.3s' }}>
      <Link href="/" style={{ fontWeight: 900, fontSize: 20, color: '#fff', textDecoration: 'none', letterSpacing: -0.5 }}>
        ahum<span style={{ color: '#f59e0b' }}>store</span> 🛒
      </Link>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {[['/', 'home'], ['/products', 'products']].map(([href, label]) => (
          <Link key={href} href={href} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = '#94a3b8'}>{label}</Link>
        ))}
        <Link href="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            🛍️
          </motion.div>
          {count > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#f59e0b', color: '#000', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {count}
            </motion.span>
          )}
        </Link>
      </div>
    </motion.nav>
  );
}
