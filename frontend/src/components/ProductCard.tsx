'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/lib/store';
import { Product } from '@/lib/api';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart(s => s.addItem);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.3s' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.3)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}>
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ position: 'relative', overflow: 'hidden', height: 240 }}>
          <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
            onMouseEnter={e => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
            onMouseLeave={e => (e.target as HTMLElement).style.transform = 'scale(1)'} />
          {product.featured && (
            <span style={{ position: 'absolute', top: 12, left: 12, padding: '4px 12px', borderRadius: 20, background: '#f59e0b', color: '#000', fontSize: 11, fontWeight: 700 }}>FEATURED</span>
          )}
        </div>
        <div style={{ padding: '16px 20px 8px' }}>
          <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{product.category}</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>{product.name}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b' }}>${product.price.toFixed(2)}</div>
        </div>
      </Link>
      <div style={{ padding: '0 20px 20px' }}>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url })}
          style={{ width: '100%', padding: '10px', borderRadius: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.target as HTMLElement).style.background = '#f59e0b'; (e.target as HTMLElement).style.color = '#000'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(245,158,11,0.1)'; (e.target as HTMLElement).style.color = '#f59e0b'; }}>
          add to cart
        </motion.button>
      </div>
    </motion.div>
  );
}
