'use client';
import { useState } from 'react';
import { product } from '@/lib/product';

export function formatNpr(amount: number) {
  return new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(amount);
}

export default function PurchaseCard({ compact = false }: { compact?: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const total = product.price * quantity + product.deliveryFee;
  const orderUrl = `/checkout?quantity=${quantity}`;
  return <div className={`rounded-xl border border-[#e9e8df] bg-white p-6 ${compact ? '' : 'shadow-[0_18px_60px_rgba(52,59,42,.06)]'}`}>
    <div className="flex items-center justify-between gap-2"><span className="eyebrow">Ready for a tidier pantry</span><span className="pill">Cash on Delivery</span></div>
    <h3 className="mt-3 text-[21px] font-bold leading-snug">{product.shortName}</h3>
    <p className="mt-2 text-[13px] leading-6 text-[#777b70]">Six-in-one dry food storage with easy 360° rotation and a convenient front dispenser.</p>
    <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1"><span className="text-[26px] font-extrabold text-[#394432]">{formatNpr(product.price)}</span>{product.compareAt > product.price && <><del className="pb-1 text-sm text-gray-400">{formatNpr(product.compareAt)}</del><span className="mb-0.5 rounded-full bg-[#edf1e6] px-2.5 py-1 text-[11px] font-bold text-[#526143]">7% OFF</span></>}</div>
    {product.deliveryFee > 0 && <p className="mt-1 text-xs text-[#777b70]">Delivery: {formatNpr(product.deliveryFee)}</p>}
    <div className="mt-5 flex items-center justify-between"><span className="text-sm font-semibold">Quantity</span><div className="flex items-center rounded border border-[#e5e5dc]"><button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2">−</button><span className="min-w-8 text-center text-sm">{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)} className="px-3 py-2">+</button></div></div>
    <div className="mt-4 flex justify-between border-t border-dashed border-[#e4e4dc] pt-4 text-sm"><span className="text-[#777b70]">Estimated total</span><strong>{total ? formatNpr(total) : 'Set price in src/lib/product.ts'}</strong></div>
    <a className="btn-primary mt-5 w-full" href={orderUrl}>Order Now <span aria-hidden="true">→</span></a>
    <p className="mt-3 text-center text-[11px] text-[#85877e]">No online payment · Pay on delivery</p>
  </div>;
}
