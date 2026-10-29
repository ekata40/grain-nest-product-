'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { product } from '@/lib/product';

const slides = [
  { title: 'Make room for the grains you use every day', description: 'Bring several pantry staples together in one compact rotating dispenser. The carousel image shows how it can help reduce countertop clutter.', alt: 'Green rotating grain dispenser in a kitchen beside traditional jars' },
  { title: 'See the compartments at a glance', description: 'Transparent sections make it easy to spot what is inside, while the front outlet gives you convenient access when it is time to cook.', alt: 'Close view of the transparent compartments on a rotating grain dispenser' },
];

export default function Gallery() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const go = (direction: number) => setActive(index => (index + direction + slides.length) % slides.length);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return <div>
    <div className="relative aspect-square overflow-hidden rounded-xl bg-[#efeee8]" onTouchStart={event => setTouchStart(event.touches[0].clientX)} onTouchEnd={event => { if (touchStart === null) return; const delta = event.changedTouches[0].clientX - touchStart; if (Math.abs(delta) > 45) go(delta < 0 ? 1 : -1); setTouchStart(null); }}>
      {product.images.map((src, i) => <div key={src} className={`absolute inset-0 transition-opacity duration-500 ${i === active ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={i !== active}><Image src={src} alt={slides[i].alt} fill priority={i === 0} className="img-cover" sizes="(max-width: 700px) 100vw, 50vw" /></div>)}
      <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-2 text-[11px] font-semibold text-[#47513d]">0{active + 1} / 0{slides.length}</span>
      <button type="button" onClick={() => go(-1)} aria-label="Previous product image" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-[#394432] shadow transition hover:bg-white">‹</button>
      <button type="button" onClick={() => go(1)} aria-label="Next product image" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-[#394432] shadow transition hover:bg-white">›</button>
    </div>
    <div className="mt-5 min-h-[112px]" aria-live="polite" aria-atomic="true">
      <p className="eyebrow">Product view {active + 1}</p>
      <h3 className="display mt-2 text-xl font-bold leading-snug">{slides[active].title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#777b70]">{slides[active].description}</p>
    </div>
    <div className="mt-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2" role="group" aria-label="Choose product image">{product.images.map((src, i) => <button key={src} type="button" onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} aria-current={active === i ? 'true' : undefined} className={`thumb relative aspect-square w-[68px] overflow-hidden rounded-md bg-[#efeee8] ${active === i ? 'active' : ''}`}><Image src={src} alt="" fill className="img-cover" sizes="68px" /></button>)}</div>
      <button type="button" onClick={() => setPaused(!paused)} className="rounded border border-[#dedfd5] px-3 py-2 text-xs font-semibold text-[#536044]">{paused ? 'Play carousel' : 'Pause carousel'}</button>
    </div>
  </div>;
}
