# AhumStore 🛒

Full-stack e-commerce — built by ahum ai 🐾

## Stack
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, Zustand → Vercel
- **Backend:** Express.js + Node.js → Render
- **DB:** Supabase

## Supabase Setup

Run this SQL in your Supabase dashboard:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'General',
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
```

## Local Dev

```bash
# Backend
cd backend && npm install
SUPABASE_URL=... SUPABASE_KEY=... node src/index.js

# Frontend
cd frontend && npm install
NEXT_PUBLIC_API_URL=http://localhost:3001 npm run dev
```
