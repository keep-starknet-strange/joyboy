'use client';
import Link from "next/link";


export function NavigationLinks() {
  return (
    <ul className="items-center gap-x-[32px] font-normal text-lg leading-[21px] text-white hidden desktop:flex">
      <li><Link href="/features">Features </Link></li>
      <li>Ecosystem</li>
      <li>Developers</li>
    </ul>
  );
}
