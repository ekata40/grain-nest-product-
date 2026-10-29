import { NextResponse } from 'next/server';
import { integrationStatus, submitOrder } from '@/lib/order';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const setup = integrationStatus();
  return NextResponse.json({ ready: setup.sheet && setup.mail, message: setup.sheet && setup.mail ? 'Order services are configured.' : 'Order services need configuration in the project .env.local file.', missing: setup.missing.map(x => x.key) }, { status: setup.sheet && setup.mail ? 200 : 503 });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Please submit a valid order form.' }, { status: 400 });
    const data = body as Record<string, unknown>;
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim() : '';
    const location = typeof data.location === 'string' ? data.location.trim() : '';
    const quantity = Number(data.quantity);
    const errors: Record<string,string> = {};
    if (name.length < 2 || name.length > 100) errors.name = 'Enter your full name.';
    if (!/^\+?[0-9\s()-]{7,20}$/.test(phone)) errors.phone = 'Enter a valid phone number.';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
    if (location.length < 5 || location.length > 500) errors.location = 'Please share your exact location.';
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 20) errors.quantity = 'Quantity must be between 1 and 20.';
    if (Object.keys(errors).length) return NextResponse.json({ error: 'Please check the highlighted details.', fields: errors }, { status: 400 });
    const origin = request.headers.get('origin');
    // Include the actual origin serving this API request. Local dev ports can
    // change when another Next.js process already owns port 3000, and the
    // browser form still makes a same-origin request to the active server.
    const requestOrigin = new URL(request.url).origin;
    const allowed = [requestOrigin, process.env.FRONTEND_URL, process.env.NEXT_PUBLIC_SITE_URL].filter(Boolean).map(x => { try { return new URL(x!).origin; } catch { return ''; } });
    if (origin && allowed.length && !allowed.includes(new URL(origin).origin)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
    const order = await submitOrder({ name, phone, email, location, quantity });
    return NextResponse.json({ success: true, order: { orderId: order.orderId, productName: order.productName, quantity: order.quantity, totalPrice: order.totalPrice, paymentMethod: order.paymentMethod } }, { status: 201 });
  } catch (error) {
    console.error('Order submission failed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'We could not submit your order. Please try again.' }, { status: 500 });
  }
}
