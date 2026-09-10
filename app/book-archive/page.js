import Link from 'next/link';
import { getBooks } from '../../lib/dataRepo';
import { GENRES } from '../../components/GenreTabs';

export const dynamic = 'force-dynamic';

export default async function BookArchivePage() {
  const books = await getBooks();

  return (
    <main>
      <h2 className="page-title">Book Archive</h2>
      <p className="page-intro">
        A running record of everything that&apos;s been featured in &quot;What&apos;s New in Books,&quot; split into one page per genre.
      </p>

      <div className="teasers">
        {GENRES.map((g) => {
          const count = books.filter((b) => b.genre === g.name).length;
          return (
            <div className="teaser" key={g.slug}>
              <div className="icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1E3A5F" strokeWidth="1.6">
                  <path d="M4 4h4v18H4zM10 4h4v18h-4zM16 4h4v18h-4z" />
                </svg>
              </div>
              <h4>{g.name}</h4>
              <p>{count} {count === 1 ? 'book' : 'books'} featured in {g.name}.</p>
              <Link className="link" href={`/${g.slug}`}>Browse {g.name}</Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
