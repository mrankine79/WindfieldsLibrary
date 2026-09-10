import Link from 'next/link';
import { requireAuth } from '../../../lib/auth';
import { getBooks } from '../../../lib/dataRepo';
import { addBook, updateBook, deleteBook } from '../../../lib/actions';
import { GENRES } from '../../../components/GenreTabs';
import ConfirmSubmitButton from '../../../components/ConfirmSubmitButton';

export const dynamic = 'force-dynamic';

export default async function ManageBooksPage({ searchParams }) {
  requireAuth();

  const books = await getBooks();
  const editId = searchParams?.edit;
  const editing = editId ? books.find((b) => b.id === editId) : null;

  return (
    <main>
      <h2 className="page-title">Manage Books</h2>
      <p className="page-intro">
        <Link className="link" href="/manage">&larr; Back to dashboard</Link>
      </p>

      <h3 className="manage-section-title">{editing ? `Edit "${editing.title}"` : 'Add a Book'}</h3>
      <form className="form-card" action={editing ? updateBook : addBook} key={editing ? editing.id : 'new'}>
        {editing && <input type="hidden" name="id" value={editing.id} />}

        <label htmlFor="title">Title</label>
        <input id="title" name="title" defaultValue={editing?.title} required />

        <label htmlFor="author">Author</label>
        <input id="author" name="author" defaultValue={editing?.author} required />

        <label htmlFor="genre">Genre</label>
        <select id="genre" name="genre" defaultValue={editing?.genre || GENRES[0].name} required>
          {GENRES.map((g) => (
            <option key={g.slug} value={g.name}>{g.name}</option>
          ))}
        </select>

        <label htmlFor="synopsis">Synopsis</label>
        <textarea id="synopsis" name="synopsis" defaultValue={editing?.synopsis} />

        <label htmlFor="isbn">ISBN (for cover image, optional)</label>
        <input id="isbn" name="isbn" defaultValue={editing?.isbn} placeholder="e.g. 9780759555402" />

        <div className="checkbox-row">
          <input id="featured" name="featured" type="checkbox" defaultChecked={editing?.featured} />
          <label htmlFor="featured">Show in &quot;What&apos;s New&quot; on the home page</label>
        </div>

        <button type="submit">{editing ? 'Save Changes' : 'Add Book'}</button>
      </form>
      {editing && (
        <p className="page-intro">
          <Link className="link" href="/manage/books">Cancel edit</Link>
        </p>
      )}

      {GENRES.map((g) => {
        const list = books
          .filter((b) => b.genre === g.name)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        if (list.length === 0) return null;
        return (
          <div key={g.slug}>
            <h3 className="manage-section-title">{g.name} ({list.length})</h3>
            <div className="manage-list">
              {list.map((book) => (
                <div className="manage-row" key={book.id}>
                  <div className="meta">
                    <div className="primary">
                      {book.title}
                      {book.featured && <span className="badge">NEW</span>}
                    </div>
                    <div className="secondary">{book.author}</div>
                  </div>
                  <div className="actions">
                    <Link className="btn small" href={`/manage/books?edit=${book.id}`}>Edit</Link>
                    <form action={deleteBook}>
                      <input type="hidden" name="id" value={book.id} />
                      <ConfirmSubmitButton confirmText={`Delete "${book.title}"? This can't be undone.`}>
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </main>
  );
}
