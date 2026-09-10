import Link from 'next/link';
import { getBooks } from '../lib/dataRepo';
import BookCard from '../components/BookCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const books = await getBooks();
  const featured = books.filter((b) => b.featured);

  return (
    <main>
      <h2 className="page-title">Welcome</h2>
      <p className="page-intro">
        Search the catalog, see what&apos;s new on the shelf, find your club, and get help with research — all from here.
      </p>

      <section className="whats-new">
        <h3>What&apos;s New in Books</h3>
        <p className="sub">Fresh off the shelf this month — updated every few weeks.</p>
        <div className="shelf">
          {featured.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <div className="teasers">
        <div className="teaser">
          <div className="icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1E3A5F" strokeWidth="1.6">
              <path d="M4 4h4v18H4zM10 4h4v18h-4zM16 4h4v18h-4z" />
            </svg>
          </div>
          <h4>Book Archive</h4>
          <p>Browse every past &quot;What&apos;s New&quot; pick, sorted by genre.</p>
          <Link className="link" href="/book-archive">View archive</Link>
        </div>
        <div className="teaser">
          <div className="icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1E3A5F" strokeWidth="1.6">
              <circle cx="8" cy="9" r="3" />
              <circle cx="17" cy="9" r="3" />
              <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M11 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            </svg>
          </div>
          <h4>Clubs</h4>
          <p>Book club, manga club, and more — meeting times and how to join.</p>
          <Link className="link" href="/clubs">See clubs</Link>
        </div>
        <div className="teaser">
          <div className="icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1E3A5F" strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" />
              <path d="M9 3.5c-4 5-4 12 0 17M15 3.5c4 5 4 12 0 17M3.5 9h17M3.5 15h17" />
            </svg>
          </div>
          <h4>Useful Links</h4>
          <p>Research databases, e-book apps, and other trusted resources.</p>
          <Link className="link" href="/useful-links">Explore links</Link>
        </div>
      </div>

      <div className="info-strip">
        <div className="block">
          <h5>HOURS</h5>
          <p>Mon&ndash;Fri &middot; 8:00&ndash;8:30am, lunch, 3:00&ndash;3:45pm</p>
        </div>
        <div className="block">
          <h5>LOCATION</h5>
          <p>Room 214, second floor</p>
        </div>
        <div className="block">
          <h5>CONTACT</h5>
          <p>library@windfields.ca</p>
        </div>
      </div>
    </main>
  );
}
