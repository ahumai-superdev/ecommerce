const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/products', async (req, res) => {
  try {
    let q = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (req.query.category) q = q.eq('category', req.query.category);
    if (req.query.featured === 'true') q = q.eq('featured', true);
    const { data, error } = await q;
    if (error) throw error;
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (e) { res.status(404).json({ error: 'Not found' }); }
});

app.post('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').insert(req.body).select().single();
    if (error) throw error;
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customer_name, customer_email, items, total } = req.body;
    const { data: order, error } = await supabase.from('orders').insert({ customer_name, customer_email, total }).select().single();
    if (error) throw error;
    const orderItems = items.map(i => ({ order_id: order.id, product_id: i.id, product_name: i.name, quantity: i.quantity, price: i.price }));
    await supabase.from('order_items').insert(orderItems);
    res.json({ success: true, order_id: order.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/seed', async (req, res) => {
  try {
    const products = [
      { name: 'Neural Hoodie', description: 'Premium heavyweight hoodie for the AI generation. 400gsm cotton blend, oversized fit.', price: 89.00, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&auto=format', category: 'Clothing', stock: 50, featured: true },
      { name: 'Dev Mode Tee', description: 'Minimal tee for developers. 100% organic cotton, relaxed fit.', price: 45.00, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format', category: 'Clothing', stock: 100, featured: true },
      { name: 'Mechanical Keyboard', description: 'Compact 65% mechanical keyboard with RGB backlight. Cherry MX switches.', price: 199.00, image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format', category: 'Tech', stock: 25, featured: true },
      { name: 'Wireless Earbuds', description: 'Active noise cancellation. 30hr battery life. Premium sound quality.', price: 149.00, image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format', category: 'Tech', stock: 40, featured: true },
      { name: 'Laptop Stand', description: 'Aluminum adjustable laptop stand. Ergonomic design for all laptops.', price: 79.00, image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format', category: 'Tech', stock: 60, featured: false },
      { name: 'Dev Mug', description: 'Large 16oz ceramic mug. Microwave and dishwasher safe.', price: 25.00, image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&auto=format', category: 'Accessories', stock: 200, featured: false },
      { name: 'Sticker Pack', description: '20 premium vinyl stickers. Waterproof and UV resistant.', price: 12.00, image_url: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=600&auto=format', category: 'Accessories', stock: 500, featured: false },
      { name: 'Notebook', description: 'A5 dotted notebook. 200 pages, lay-flat binding. Perfect for ideas.', price: 19.00, image_url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format', category: 'Stationery', stock: 150, featured: false },
    ];
    const { error } = await supabase.from('products').insert(products);
    if (error) throw error;
    res.json({ success: true, count: products.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🛒 E-commerce API running on port ${PORT}`));
