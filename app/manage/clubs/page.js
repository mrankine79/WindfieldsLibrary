import Link from 'next/link';
import { requireAuth } from '../../../lib/auth';
import { getClubs } from '../../../lib/dataRepo';
import { addClub, updateClub, deleteClub } from '../../../lib/actions';
import ConfirmSubmitButton from '../../../components/ConfirmSubmitButton';

export const dynamic = 'force-dynamic';

export default async function ManageClubsPage({ searchParams }) {
  requireAuth();

  const clubs = await getClubs();
  const editId = searchParams?.edit;
  const editing = editId ? clubs.find((c) => c.id === editId) : null;

  return (
    <main>
      <h2 className="page-title">Manage Clubs</h2>
      <p className="page-intro">
        <Link className="link" href="/manage">&larr; Back to dashboard</Link>
      </p>

      <h3 className="manage-section-title">{editing ? `Edit "${editing.name}"` : 'Add a Club'}</h3>
      <form className="form-card" action={editing ? updateClub : addClub} key={editing ? editing.id : 'new'}>
        {editing && <input type="hidden" name="id" value={editing.id} />}

        <label htmlFor="name">Club Name</label>
        <input id="name" name="name" defaultValue={editing?.name} required />

        <label htmlFor="meets">Meets (day & time)</label>
        <input id="meets" name="meets" defaultValue={editing?.meets} placeholder="e.g. Wednesdays, lunch" />

        <label htmlFor="where">Where</label>
        <input id="where" name="where" defaultValue={editing?.where} placeholder="e.g. Room 214" />

        <label htmlFor="sponsor">Sponsor</label>
        <input id="sponsor" name="sponsor" defaultValue={editing?.sponsor} />

        <label htmlFor="howToJoin">How to Join</label>
        <input id="howToJoin" name="howToJoin" defaultValue={editing?.howToJoin} />

        <button type="submit">{editing ? 'Save Changes' : 'Add Club'}</button>
      </form>
      {editing && (
        <p className="page-intro">
          <Link className="link" href="/manage/clubs">Cancel edit</Link>
        </p>
      )}

      <h3 className="manage-section-title">Current Clubs ({clubs.length})</h3>
      <div className="manage-list">
        {clubs.map((club) => (
          <div className="manage-row" key={club.id}>
            <div className="meta">
              <div className="primary">{club.name}</div>
              <div className="secondary">{club.meets} &middot; {club.where}</div>
            </div>
            <div className="actions">
              <Link className="btn small" href={`/manage/clubs?edit=${club.id}`}>Edit</Link>
              <form action={deleteClub}>
                <input type="hidden" name="id" value={club.id} />
                <ConfirmSubmitButton confirmText={`Delete "${club.name}"? This can't be undone.`}>
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
