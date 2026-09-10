const OWNER = process.env.DATA_REPO_OWNER || 'mrankine79';
const REPO = process.env.DATA_REPO_NAME || 'windfieldslibrary-data';
const BRANCH = process.env.DATA_REPO_BRANCH || 'main';

const PATHS = {
  books: 'data/books.json',
  clubs: 'data/clubs.json',
  links: 'data/links.json',
  suggestions: 'data/suggestions.json',
};

function token() {
  const t = process.env.GITHUB_TOKEN;
  if (!t) throw new Error('GITHUB_TOKEN is not set');
  return t;
}

function contentsUrl(path) {
  return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
}

export function tagFor(path) {
  return `data:${path}`;
}

async function getFile(path) {
  const res = await fetch(`${contentsUrl(path)}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: 'application/vnd.github+json',
    },
    next: { revalidate: 30, tags: [tagFor(path)] },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  const content = Buffer.from(json.content, 'base64').toString('utf8');
  return JSON.parse(content);
}

async function putFile(path, data, message) {
  // Fetch the current sha uncached, right before writing, to avoid clobbering
  // a concurrent edit.
  const current = await fetch(`${contentsUrl(path)}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: 'application/vnd.github+json',
    },
    cache: 'no-store',
  });
  let sha;
  if (current.ok) {
    sha = (await current.json()).sha;
  }

  const body = {
    message,
    content: Buffer.from(`${JSON.stringify(data, null, 2)}\n`, 'utf8').toString('base64'),
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  };

  const res = await fetch(contentsUrl(path), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed to update ${path}: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

export { PATHS };

export async function getBooks() {
  return getFile(PATHS.books);
}
export async function getClubs() {
  return getFile(PATHS.clubs);
}
export async function getLinks() {
  return getFile(PATHS.links);
}
export async function getSuggestions() {
  return getFile(PATHS.suggestions);
}

export async function saveBooks(data, message) {
  return putFile(PATHS.books, data, message);
}
export async function saveClubs(data, message) {
  return putFile(PATHS.clubs, data, message);
}
export async function saveLinks(data, message) {
  return putFile(PATHS.links, data, message);
}
export async function saveSuggestions(data, message) {
  return putFile(PATHS.suggestions, data, message);
}
