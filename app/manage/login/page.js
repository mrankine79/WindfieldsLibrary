import { login } from '../../../lib/actions';

export default function ManageLoginPage({ searchParams }) {
  const error = searchParams?.error === '1';

  return (
    <main>
      <h2 className="page-title">Management Login</h2>
      <p className="page-intro">Enter the management password to edit site content.</p>

      {error && <p className="note error">Incorrect password. Try again.</p>}

      <form className="form-card" action={login}>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoFocus />
        <button type="submit">Log In</button>
      </form>
    </main>
  );
}
