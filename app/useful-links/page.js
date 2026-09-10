import { getLinks } from '../../lib/dataRepo';

export const dynamic = 'force-dynamic';

export default async function UsefulLinksPage() {
  const categories = await getLinks();

  return (
    <main>
      <h2 className="page-title">Useful Links</h2>
      <p className="page-intro">
        Trusted research databases, e-book and audiobook apps, and other resources recommended by the library.
      </p>

      {categories.map((cat) => (
        <div className="link-category" key={cat.id}>
          <h3>{cat.category}</h3>
          {cat.links.map((link) => (
            <div className="link-item" key={link.id}>
              <span className="name">
                {link.url ? (
                  <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
                ) : (
                  link.name
                )}
              </span>
              <span className="desc">{link.desc}</span>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
