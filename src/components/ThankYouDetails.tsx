'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatNpr } from './PurchaseCard';

type OrderSummary = { orderId: string; productName: string; quantity: number; totalPrice: number; paymentMethod: string };
export default function ThankYouDetails() {
  const [order, setOrder] = useState<OrderSummary | null>(null);
  useEffect(() => { try { const raw = sessionStorage.getItem('grainNestOrder'); if (raw) setOrder(JSON.parse(raw)); } catch { /* Keep the general confirmation copy visible. */ } }, []);
  return <><div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#e7efe8] text-3xl text-[#075139]">✓</div><p className="eyebrow">Order received</p><h1 className="display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Thank you for your order!</h1><p className="mx-auto mt-3 max-w-[440px] text-sm leading-6 text-[#777b70]">Our sales representative will call you soon to confirm your order and delivery details.</p>
    {order && <div className="mx-auto mt-7 max-w-[430px] rounded-lg border border-[#e8e7df] bg-[#fafaf7] p-5 text-left"><div className="flex justify-between text-xs"><span className="text-[#777b70]">Order ID</span><strong>{order.orderId}</strong></div><p className="mt-4 text-sm font-bold">{order.productName}</p><div className="mt-4 flex justify-between text-xs"><span className="text-[#777b70]">Quantity</span><strong>{order.quantity}</strong></div><div className="mt-3 flex justify-between text-xs"><span className="text-[#777b70]">Total</span><strong>{formatNpr(order.totalPrice)}</strong></div><div className="mt-3 flex justify-between text-xs"><span className="text-[#777b70]">Payment method</span><strong>{order.paymentMethod}</strong></div></div>}
    <Link href="/" className="btn-primary mt-8">Back to Home <span>→</span></Link></>;
}
