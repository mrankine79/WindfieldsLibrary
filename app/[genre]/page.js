import { notFound } from 'next/navigation';
import { getBooks } from '../../lib/dataRepo';
import BookCard from '../../components/BookCard';
import GenreTabs, { GENRES } from '../../components/GenreTabs';

export const dynamic = 'force-dynamic';

export default async function GenrePage({ params }) {
  const g = GENRES.find((x) => x.slug === params.genre);
  if (!g) notFound();

  const books = await getBooks();
  const list = books
    .filter((b) => b.genre === g.name)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <main>
      <h2 className="page-title">{g.name}</h2>
      <p className="page-intro">Every &quot;What&apos;s New&quot; pick we&apos;ve featured in {g.name}.</p>
      <GenreTabs current={g.slug} />
      <div className="book-grid">
        {list.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </main>
  );
}
