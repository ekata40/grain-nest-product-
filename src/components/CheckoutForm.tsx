'use client';
import { FormEvent, useState } from 'react';
import { product } from '@/lib/product';
import { formatNpr } from './PurchaseCard';

export default function CheckoutForm({ quantity: initialQuantity }: { quantity: number }) {
  const [quantity] = useState(initialQuantity);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string,string>>({});
  const total = product.price * quantity + product.deliveryFee;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setPending(true); setError(''); setFields({});
    const form = new FormData(e.currentTarget);
    const payload = { name: form.get('name'), phone: form.get('phone'), email: form.get('email'), location: form.get('location'), quantity };
    try {
      const response = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) { setError(result.error || 'We could not submit your order. Please try again.'); setFields(result.fields || {}); return; }
      sessionStorage.setItem('grainNestOrder', JSON.stringify(result.order));
      window.location.assign('/thank-you');
    } catch { setError('Connection problem. Please check your internet and try again.'); }
    finally { setPending(false); }
  }

  return <form onSubmit={submit} className="space-y-5">
    {error && <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-xs font-semibold">Full name<input className="input mt-2" name="name" autoComplete="name" placeholder="Your full name" required maxLength={100} aria-invalid={!!fields.name}/>{fields.name && <small className="text-red-700">{fields.name}</small>}</label>
      <label className="text-xs font-semibold">Phone number<input className="input mt-2" name="phone" type="tel" autoComplete="tel" placeholder="98XXXXXXXX" required maxLength={20} aria-invalid={!!fields.phone}/>{fields.phone && <small className="text-red-700">{fields.phone}</small>}</label>
    </div>
    <label className="block text-xs font-semibold">Email address<input className="input mt-2" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} aria-invalid={!!fields.email}/>{fields.email && <small className="text-red-700">{fields.email}</small>}</label>
    <label className="block text-xs font-semibold">Exact location<textarea className="input mt-2 min-h-24 resize-y" name="location" autoComplete="street-address" placeholder="Kindly share your exact location" required minLength={5} maxLength={500} aria-invalid={!!fields.location}/>{fields.location && <small className="text-red-700">{fields.location}</small>}</label>
    <div className="rounded-lg border border-[#e8e7df] bg-[#fafaf7] p-4"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#7d8177]">Your order</p><div className="mt-3 flex justify-between gap-4 text-sm"><span className="max-w-[250px] leading-5">{product.shortName} × {quantity}</span><span className="text-right"><del className="mr-2 text-xs text-gray-400">{formatNpr(product.compareAt * quantity)}</del><strong>{formatNpr(product.price * quantity)}</strong></span></div><div className="mt-1 text-right text-[11px] font-semibold text-[#5b6849]">7% discount applied</div><div className="mt-3 flex justify-between border-t border-[#e5e5dd] pt-3 text-sm"><span>Delivery</span><span>{product.deliveryFee ? formatNpr(product.deliveryFee) : 'To be confirmed'}</span></div><div className="mt-3 flex justify-between border-t border-[#e5e5dd] pt-3 text-sm font-bold"><span>Total</span><span>{formatNpr(total)}</span></div><p className="mt-3 text-xs text-[#777b70]">Cash on Delivery · NPR 150 delivery fee included in the total.</p></div>
    <button disabled={pending || !product.price} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50" type="submit">{pending ? 'Submitting Order…' : product.price ? 'Place COD Order' : 'Order Setup Incomplete'}</button>
    <p className="text-center text-[11px] leading-5 text-[#85877e]">By placing your order, you agree that our representative may contact you to confirm it.</p>
  </form>;
}
