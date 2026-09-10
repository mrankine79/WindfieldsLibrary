import { getClubs } from '../../lib/dataRepo';

export const dynamic = 'force-dynamic';

export default async function ClubsPage() {
  const clubs = await getClubs();

  return (
    <main>
      <h2 className="page-title">Clubs</h2>
      <p className="page-intro">
        Meet other readers, swap recommendations, and find your people. All clubs meet in Room 214 unless
        noted otherwise — everyone is welcome, no sign-up required to try a first meeting.
      </p>

      <div className="clubs-grid">
        {clubs.map((club) => (
          <div className="club-card" key={club.id}>
            <h3>{club.name}</h3>
            <dl>
              <dt>MEETS</dt>
              <dd>{club.meets}</dd>
              <dt>WHERE</dt>
              <dd>{club.where}</dd>
              <dt>SPONSOR</dt>
              <dd>{club.sponsor}</dd>
              <dt>HOW TO JOIN</dt>
              <dd>{club.howToJoin}</dd>
            </dl>
          </div>
        ))}
      </div>
    </main>
  );
}
