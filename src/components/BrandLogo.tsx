import Image from 'next/image';
import Link from 'next/link';

export default function BrandLogo() {
  return <Link href="/" aria-label="Grain Nest home" className="brand-logo"><Image src="/images/grain-nest-logo.png" alt="Grain Nest — Nature in every grain" width={635} height={190} priority /></Link>;
}
