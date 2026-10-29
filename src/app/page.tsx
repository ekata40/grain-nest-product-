import Image from 'next/image';
import Gallery from '@/components/Gallery';
import PurchaseCard from '@/components/PurchaseCard';
import BrandLogo from '@/components/BrandLogo';
import { product } from '@/lib/product';

const trust = [{ icon: '₨', label: 'Pay on delivery' }, { icon: '↗', label: 'Delivery arranged after confirmation' }, { icon: '♡', label: 'Friendly order support' }];

export default function HomePage() {
  return <main>
    <div className="border-b border-[#e8e6dc] bg-[#f1f1e9] py-2 text-center text-[11px] font-semibold tracking-wide text-[#5b6450]">A calmer kitchen starts with a little more order.</div>
    <header className="container flex h-[76px] items-center justify-between">
      <BrandLogo />
      <nav className="hidden items-center gap-8 sm:flex"><a className="nav-link" href="#details">The dispenser</a><a className="nav-link" href="#benefits">Benefits</a><a className="nav-link" href="#faq">FAQ</a></nav>
      <a className="btn-primary !px-4 !py-3" href="#order">Order Now <span aria-hidden="true">→</span></a>
    </header>

    <section className="container grid items-center gap-10 pb-16 pt-8 md:grid-cols-[.95fr_1.05fr] md:gap-16 md:pb-24 md:pt-12">
      <div className="order-2 md:order-1">
        <span className="pill"><span>✦</span> More order, less countertop clutter</span>
        <p className="eyebrow mt-7">Thoughtful everyday storage</p>
        <h1 className="display mt-3 max-w-[580px] text-[38px] font-extrabold leading-[1.12] tracking-[-.04em] sm:text-[50px]">All your everyday grains, <span className="text-[#075139]">in one easy turn.</span></h1>
        <p className="mt-5 max-w-[465px] text-[15px] leading-7 text-[#72766d]">Meet the rotating dry food dispenser designed to bring rice, beans and pantry staples together in one neat, convenient place.</p>
        <div className="mt-7 flex flex-wrap items-center gap-3"><a className="btn-primary" href="#order">Purchase Now <span aria-hidden="true">→</span></a><a className="btn-outline" href="#details">Explore the details</a></div>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-[#73776d]">{trust.map(t => <span key={t.label} className="flex items-center gap-2"><b className="text-[#c9911c]">{t.icon}</b>{t.label}</span>)}</div>
      </div>
      <div className="relative order-1 mx-auto w-full max-w-[520px] md:order-2">
        <div className="relative aspect-[1.08] overflow-hidden rounded-[10px] bg-[#eeede7]"><Image src={product.images[1]} alt="360-degree rotating grain dispenser filled with dry foods" fill priority className="img-cover" sizes="(max-width: 700px) 100vw, 50vw" /></div>
        <div className="absolute -bottom-5 left-4 rounded-lg border border-[#eeece2] bg-white px-4 py-3 shadow-lg sm:-left-6 sm:px-5"><div className="text-[10px] font-semibold uppercase tracking-widest text-[#85877e]">Designed around</div><div className="mt-1 text-sm font-bold">Everyday pantry staples</div></div>
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#075139]">360° rotation</div>
      </div>
    </section>

    <section className="border-y border-[#e9e7de] bg-white py-5"><div className="container grid grid-cols-3 gap-3 text-center">{[['6','separate sections'],['360°','rotating access'],['10 kg','listed capacity']].map(([big,small])=><div key={big}><div className="text-lg font-extrabold text-[#075139]">{big}</div><div className="mt-1 text-[10px] text-[#7d8077] sm:text-xs">{small}</div></div>)}</div></section>

    <section id="details" className="section-pad"><div className="container"><div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">A better spot for the staples</p><h2 className="display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Good storage makes room to breathe.</h2></div><p className="max-w-[350px] text-sm leading-6 text-[#777b70]">See the dispenser up close, then choose how many you would like to order.</p></div>
      <div className="grid items-start gap-8 md:grid-cols-[1fr_.85fr] md:gap-12"><Gallery/><div id="order" className="md:sticky md:top-8"><PurchaseCard/><p className="mt-4 text-center text-xs text-[#85877e]">A sales representative will call to confirm your order.</p></div></div>
    </div></section>

    <section className="bg-[#f0f1e9] py-20"><div className="container grid items-center gap-10 md:grid-cols-[.85fr_1.15fr]"><div className="relative aspect-square overflow-hidden rounded-xl"><Image src={product.images[0]} alt="Grain dispenser helping organize the kitchen counter" fill className="img-cover" sizes="(max-width: 700px) 100vw, 45vw" /></div><div><p className="eyebrow">Storage that works for your routine</p><h2 className="display mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">A place for the foods you reach for every day.</h2><p className="mt-4 text-sm leading-7 text-[#73776d]">A rotating carousel brings multiple dry-food compartments into one handy footprint. Keep frequently used staples together and dispense from the front when it is time to cook.</p><a className="btn-primary mt-6" href="#order">Order Now <span aria-hidden="true">→</span></a></div></div></section>

    <section id="benefits" className="section-pad"><div className="container"><div className="mx-auto max-w-[600px] text-center"><p className="eyebrow">The little things add up</p><h2 className="display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Make pantry time feel simpler.</h2></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{product.benefits.map((b,i)=><article key={b.title} className="rounded-lg border border-[#e9e7de] bg-white p-5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2eb] text-xl text-[#63714e]">{b.icon}</div><h3 className="mt-4 text-sm font-bold">{b.title}</h3><p className="mt-2 text-xs leading-6 text-[#797d73]">{b.text}</p></article>)}</div></div></section>

    <section className="bg-[#06462f] py-16 text-white"><div className="container flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#edc55b]">A small change, a tidier counter</p><h2 className="display mt-2 text-2xl font-bold sm:text-3xl">Ready to give your grains a home?</h2></div><a className="inline-flex items-center gap-3 rounded bg-[#f2c34f] px-6 py-4 text-sm font-bold text-[#06462f]" href="#order">Buy Now <span>→</span></a></div></section>

    <section className="section-pad"><div className="container"><div className="mx-auto max-w-[700px] text-center"><p className="eyebrow">A few good things to know</p><h2 className="display mt-3 text-3xl font-bold tracking-tight">Questions, answered.</h2></div><div id="faq" className="mx-auto mt-8 max-w-[760px]">{product.faqs.map((faq,i)=><details key={faq.q} className="faq-item py-5" open={i===0}><summary className="pr-6 text-sm font-bold">{faq.q}</summary><p className="mt-3 max-w-[650px] text-[13px] leading-6 text-[#777b70]">{faq.a}</p></details>)}</div></div></section>

    <footer className="border-t border-[#e8e6dc] py-8"><div className="container flex flex-col justify-between gap-3 text-xs text-[#85877e] sm:flex-row"><span>© {new Date().getFullYear()} Grain Nest · Everyday storage, thoughtfully considered.</span><a href="/checkout" className="font-semibold text-[#075139]">Order with Cash on Delivery →</a></div></footer>
  </main>;
}
