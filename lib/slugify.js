export function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function makeId(...parts) {
  const base = slugify(parts.filter(Boolean).join('-')) || 'item';
  return `${base}-${Date.now().toString(36)}`;
}
