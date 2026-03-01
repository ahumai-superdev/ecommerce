import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'AhumStore — Premium Products', description: 'Shop the best products, built by ahum ai.' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body style={{ margin: 0 }}>{children}</body></html>
}
