import { submitSuggestion } from '../../lib/actions';

export default function SuggestAPurchasePage({ searchParams }) {
  const submitted = searchParams?.submitted === '1';

  return (
    <main>
      <h2 className="page-title">Suggest a Purchase</h2>
      <p className="page-intro">
        Have a book you&apos;d love to see on the shelf? Let us know and we&apos;ll consider it for our next order.
      </p>

      {submitted && (
        <p className="note success">Thanks! Your suggestion has been submitted.</p>
      )}

      <form className="form-card" action={submitSuggestion}>
        <label htmlFor="title">Book Title</label>
        <input id="title" name="title" required />

        <label htmlFor="author">Author (if known)</label>
        <input id="author" name="author" />

        <label htmlFor="reason">Why should we get it?</label>
        <textarea id="reason" name="reason" />

        <label htmlFor="requestedBy">Your name (optional)</label>
        <input id="requestedBy" name="requestedBy" />

        <button type="submit">Submit Suggestion</button>
      </form>
    </main>
  );
}
