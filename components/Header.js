'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/book-archive', label: 'Book Archive' },
  { href: '/clubs', label: 'Clubs' },
  { href: '/useful-links', label: 'Useful Links' },
  { href: '/suggest-a-purchase', label: 'Suggest a Purchase' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site">
      <div className="brand-row">
        <div>
          <h1>Windfields Library</h1>
          <div className="tagline">Room 214 &middot; Open before school, at lunch, and after school</div>
        </div>
      </div>
      <nav className="site">
        {NAV.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={active ? 'current' : undefined}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
