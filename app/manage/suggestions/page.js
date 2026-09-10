import Link from 'next/link';
import { requireAuth } from '../../../lib/auth';
import { getSuggestions } from '../../../lib/dataRepo';
import { updateSuggestionStatus, deleteSuggestion } from '../../../lib/actions';
import ConfirmSubmitButton from '../../../components/ConfirmSubmitButton';
import StatusSelect from '../../../components/StatusSelect';

export const dynamic = 'force-dynamic';

const STATUSES = ['new', 'reviewed', 'ordered'];

export default async function ManageSuggestionsPage() {
  requireAuth();

  const suggestions = [...(await getSuggestions())].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
  );

  return (
    <main>
      <h2 className="page-title">Purchase Suggestions</h2>
      <p className="page-intro">
        <Link className="link" href="/manage">&larr; Back to dashboard</Link>
      </p>

      {suggestions.length === 0 && <p className="note">No suggestions submitted yet.</p>}

      <div className="manage-list">
        {suggestions.map((s) => (
          <div className="manage-row" key={s.id}>
            <div className="meta">
              <div className="primary">
                {s.title}
                <span className={`badge status-${s.status}`}>{s.status.toUpperCase()}</span>
              </div>
              <div className="secondary">
                {s.author && `by ${s.author} · `}
                {s.requestedBy ? `requested by ${s.requestedBy}` : 'submitted anonymously'}
                {' · '}
                {new Date(s.submittedAt).toLocaleDateString()}
              </div>
              {s.reason && <div className="secondary">&ldquo;{s.reason}&rdquo;</div>}
            </div>
            <div className="actions">
              <form action={updateSuggestionStatus}>
                <input type="hidden" name="id" value={s.id} />
                <StatusSelect name="status" defaultValue={s.status} options={STATUSES} />
              </form>
              <form action={deleteSuggestion}>
                <input type="hidden" name="id" value={s.id} />
                <ConfirmSubmitButton confirmText={`Delete the suggestion "${s.title}"?`}>
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
