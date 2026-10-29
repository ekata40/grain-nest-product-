import Link from 'next/link';
import CheckoutForm from '@/components/CheckoutForm';
import BrandLogo from '@/components/BrandLogo';
import { product } from '@/lib/product';

export const metadata = { title: 'Checkout | Grain Nest' };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ quantity?: string }> }) {
  const params = await searchParams;
  const requested = Number(params.quantity || 1);
  const quantity = Number.isSafeInteger(requested) && requested >= 1 && requested <= 20 ? requested : 1;
  return <main className="min-h-screen bg-[#faf9f5]">
    <header className="container flex h-[82px] items-center justify-between"><BrandLogo/><Link href="/" className="text-xs font-semibold text-[#075139]">← Continue browsing</Link></header>
    <div className="container pb-16 pt-7"><div className="mx-auto max-w-[880px]"><p className="eyebrow">Cash on Delivery</p><h1 className="display mt-2 text-3xl font-extrabold tracking-tight">Complete your order</h1><p className="mt-2 text-sm text-[#777b70]">Share your delivery details and our team will call to confirm.</p>
      <div className="mt-8 grid items-start gap-6 md:grid-cols-[1fr_.72fr]">
        <section className="rounded-xl border border-[#e8e7df] bg-white p-6 sm:p-8"><h2 className="display mb-6 text-lg font-bold">Delivery details</h2><CheckoutForm quantity={quantity}/></section>
        <aside className="rounded-xl border border-[#e8e7df] bg-white p-6"><p className="eyebrow">You are ordering</p><h2 className="display mt-3 text-lg font-bold leading-6">{product.shortName}</h2><p className="mt-2 text-xs leading-5 text-[#777b70]">Six-compartment rotating dispenser · Listed capacity 10 kg</p><div className="mt-5 space-y-3 border-t border-[#e8e7df] pt-4 text-sm"><div className="flex justify-between"><span className="text-[#777b70]">Quantity</span><strong>{quantity}</strong></div><div className="flex justify-between"><span className="text-[#777b70]">Payment</span><strong>Cash on Delivery</strong></div></div><p className="mt-5 rounded bg-[#f1f3ed] p-3 text-xs leading-5 text-[#5e6853]">No payment is collected online. The sales team will confirm delivery and the final total by phone.</p></aside>
      </div>
    </div></div>
  </main>;
}
