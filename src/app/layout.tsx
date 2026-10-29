import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grain Nest | A calmer, tidier kitchen',
  description: 'Discover a compact rotating dry food dispenser for everyday grains. Order with Cash on Delivery.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
