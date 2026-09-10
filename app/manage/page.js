import Link from 'next/link';
import { requireAuth } from '../../lib/auth';
import { getBooks, getClubs, getLinks, getSuggestions } from '../../lib/dataRepo';
import { logout } from '../../lib/actions';

export const dynamic = 'force-dynamic';

export default async function ManageDashboard() {
  requireAuth();

  const [books, clubs, links, suggestions] = await Promise.all([
    getBooks(),
    getClubs(),
    getLinks(),
    getSuggestions(),
  ]);
  const newSuggestions = suggestions.filter((s) => s.status === 'new').length;
  const totalLinks = links.reduce((n, c) => n + c.links.length, 0);

  return (
    <main>
      <h2 className="page-title">Management Panel</h2>
      <p className="page-intro">
        Edit site content here. Changes save straight to the content repo and go live within about a minute.
      </p>

      <div className="clubs-grid stat-grid">
        <div className="club-card">
          <h3>Books</h3>
          <p>{books.length} books across 6 genres.</p>
          <Link className="link" href="/manage/books">Manage books &rarr;</Link>
        </div>
        <div className="club-card">
          <h3>Clubs</h3>
          <p>{clubs.length} clubs listed.</p>
          <Link className="link" href="/manage/clubs">Manage clubs &rarr;</Link>
        </div>
        <div className="club-card">
          <h3>Useful Links</h3>
          <p>{totalLinks} links in {links.length} categories.</p>
          <Link className="link" href="/manage/links">Manage links &rarr;</Link>
        </div>
        <div className="club-card">
          <h3>Suggestions</h3>
          <p>{suggestions.length} total, {newSuggestions} new.</p>
          <Link className="link" href="/manage/suggestions">View suggestions &rarr;</Link>
        </div>
      </div>

      <form action={logout}>
        <button type="submit" className="btn">Log Out</button>
      </form>
    </main>
  );
}
