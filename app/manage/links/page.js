import Link from 'next/link';
import { requireAuth } from '../../../lib/auth';
import { getLinks } from '../../../lib/dataRepo';
import { addLinkCategory, deleteLinkCategory, addLink, updateLink, deleteLink } from '../../../lib/actions';
import ConfirmSubmitButton from '../../../components/ConfirmSubmitButton';

export const dynamic = 'force-dynamic';

export default async function ManageLinksPage({ searchParams }) {
  requireAuth();

  const categories = await getLinks();
  const editCategoryId = searchParams?.editCategory;
  const editLinkId = searchParams?.editLink;
  const editingCategory = editCategoryId ? categories.find((c) => c.id === editCategoryId) : null;
  const editingLink = editingCategory && editLinkId
    ? editingCategory.links.find((l) => l.id === editLinkId)
    : null;

  return (
    <main>
      <h2 className="page-title">Manage Useful Links</h2>
      <p className="page-intro">
        <Link className="link" href="/manage">&larr; Back to dashboard</Link>
      </p>

      <h3 className="manage-section-title">Add a Category</h3>
      <form className="form-card" action={addLinkCategory}>
        <label htmlFor="category">Category Name</label>
        <input id="category" name="category" placeholder="e.g. Research &amp; Databases" required />
        <button type="submit">Add Category</button>
      </form>

      {editingCategory && (
        <>
          <h3 className="manage-section-title">
            {editingLink ? `Edit "${editingLink.name}"` : `Add a Link to "${editingCategory.category}"`}
          </h3>
          <form
            className="form-card"
            action={editingLink ? updateLink : addLink}
            key={editingLink ? editingLink.id : `new-${editingCategory.id}`}
          >
            <input type="hidden" name="categoryId" value={editingCategory.id} />
            {editingLink && <input type="hidden" name="linkId" value={editingLink.id} />}

            <label htmlFor="name">Link Name</label>
            <input id="name" name="name" defaultValue={editingLink?.name} required />

            <label htmlFor="url">URL</label>
            <input id="url" name="url" type="url" defaultValue={editingLink?.url} placeholder="https://..." />

            <label htmlFor="desc">Description</label>
            <input id="desc" name="desc" defaultValue={editingLink?.desc} />

            <button type="submit">{editingLink ? 'Save Changes' : 'Add Link'}</button>
          </form>
          <p className="page-intro">
            <Link className="link" href="/manage/links">Done editing this category</Link>
          </p>
        </>
      )}

      {categories.map((cat) => (
        <div key={cat.id}>
          <h3 className="manage-section-title">
            {cat.category} ({cat.links.length})
          </h3>
          <div className="manage-list">
            {cat.links.map((lnk) => (
              <div className="manage-row" key={lnk.id}>
                <div className="meta">
                  <div className="primary">{lnk.name}</div>
                  <div className="secondary">{lnk.desc || lnk.url || 'No description yet'}</div>
                </div>
                <div className="actions">
                  <Link className="btn small" href={`/manage/links?editCategory=${cat.id}&editLink=${lnk.id}`}>
                    Edit
                  </Link>
                  <form action={deleteLink}>
                    <input type="hidden" name="categoryId" value={cat.id} />
                    <input type="hidden" name="linkId" value={lnk.id} />
                    <ConfirmSubmitButton confirmText={`Delete "${lnk.name}"?`}>Delete</ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            ))}
            <div className="manage-row">
              <div className="meta">
                <Link className="link" href={`/manage/links?editCategory=${cat.id}`}>+ Add a link here</Link>
              </div>
              <div className="actions">
                <form action={deleteLinkCategory}>
                  <input type="hidden" name="categoryId" value={cat.id} />
                  <ConfirmSubmitButton confirmText={`Delete category "${cat.category}" and all its links?`}>
                    Delete Category
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
