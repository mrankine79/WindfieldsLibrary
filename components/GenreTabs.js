import Link from 'next/link';

export const GENRES = [
  { slug: 'fantasy', name: 'Fantasy' },
  { slug: 'graphic-novel', name: 'Graphic Novel' },
  { slug: 'nonfiction', name: 'Nonfiction' },
  { slug: 'mystery', name: 'Mystery' },
  { slug: 'sci-fi', name: 'Sci-Fi' },
  { slug: 'realistic-fiction', name: 'Realistic Fiction' },
];

export default function GenreTabs({ current }) {
  return (
    <div className="genre-tabs">
      {GENRES.map((g) => (
        <Link key={g.slug} href={`/${g.slug}`} className={g.slug === current ? 'current' : undefined}>
          {g.name}
        </Link>
      ))}
    </div>
  );
}
