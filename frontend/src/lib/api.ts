const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export interface Product { id: string; name: string; description: string; price: number; image_url: string; category: string; stock: number; featured: boolean; }
export interface Order { customer_name: string; customer_email: string; items: any[]; total: number; }
export const getProducts = (params?: Record<string,string>) => fetch(`${API}/api/products${params ? '?'+new URLSearchParams(params) : ''}`).then(r => r.json());
export const getProduct = (id: string) => fetch(`${API}/api/products/${id}`).then(r => r.json());
export const createProduct = (data: any) => fetch(`${API}/api/products`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json());
export const deleteProduct = (id: string) => fetch(`${API}/api/products/${id}`, { method: 'DELETE' }).then(r => r.json());
export const createOrder = (data: Order) => fetch(`${API}/api/orders`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json());
