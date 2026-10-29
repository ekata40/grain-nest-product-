import Link from 'next/link';
import ThankYouDetails from '@/components/ThankYouDetails';
import BrandLogo from '@/components/BrandLogo';

export const metadata = { title: 'Thank you | Grain Nest' };
export default function ThankYouPage() {
  return <main className="flex min-h-screen flex-col bg-[#fdfbed]"><header className="container flex h-[82px] items-center"><BrandLogo/></header><section className="container flex flex-1 flex-col items-center justify-center py-12 text-center"><div id="order-confirmation" className="w-full max-w-[540px] rounded-xl border border-[#e8e7df] bg-white px-6 py-10 shadow-[0_16px_55px_rgba(6,69,46,.08)]"><ThankYouDetails/></div></section><footer className="py-6 text-center text-xs text-[#85877e]">© {new Date().getFullYear()} Grain Nest</footer></main>;
}
