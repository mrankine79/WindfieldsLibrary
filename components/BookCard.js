import BookCover from './BookCover';

export default function BookCard({ book }) {
  return (
    <div className="book">
      <BookCover isbn={book.isbn} title={book.title} stamp={book.stamp} />
      <div className="info">
        <div className="genre">{book.genre}</div>
        <p className="title">{book.title}</p>
        <p className="author">{book.author}</p>
        <p className="synopsis">{book.synopsis}</p>
      </div>
    </div>
  );
}
