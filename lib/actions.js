'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';
import {
  getBooks, saveBooks,
  getClubs, saveClubs,
  getLinks, saveLinks,
  getSuggestions, saveSuggestions,
  tagFor, PATHS,
} from './dataRepo';
import { checkPassword, createSessionToken, requireAuth, COOKIE, MAX_AGE } from './auth';
import { makeId } from './slugify';
import { GENRES } from '../components/GenreTabs';

function revalidateBooks() {
  revalidateTag(tagFor(PATHS.books));
  revalidatePath('/');
  revalidatePath('/book-archive');
  for (const g of GENRES) revalidatePath(`/${g.slug}`);
  revalidatePath('/manage/books');
}

function revalidateClubs() {
  revalidateTag(tagFor(PATHS.clubs));
  revalidatePath('/clubs');
  revalidatePath('/manage/clubs');
}

function revalidateLinks() {
  revalidateTag(tagFor(PATHS.links));
  revalidatePath('/useful-links');
  revalidatePath('/manage/links');
}

function revalidateSuggestions() {
  revalidateTag(tagFor(PATHS.suggestions));
  revalidatePath('/manage/suggestions');
}

// ---------- Auth ----------

export async function login(formData) {
  const password = formData.get('password');
  if (!checkPassword(password)) {
    redirect('/manage/login?error=1');
  }
  cookies().set(COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
  redirect('/manage');
}

export async function logout() {
  cookies().delete(COOKIE);
  redirect('/manage/login');
}

// ---------- Books ----------

export async function addBook(formData) {
  requireAuth();
  const books = await getBooks();
  const title = String(formData.get('title') || '').trim();
  const genre = String(formData.get('genre') || '');
  const featured = formData.get('featured') === 'on';
  const book = {
    id: makeId(title, formData.get('author')),
    title,
    author: String(formData.get('author') || '').trim(),
    genre,
    synopsis: String(formData.get('synopsis') || '').trim(),
    isbn: String(formData.get('isbn') || '').trim(),
    stamp: featured ? 'NEW' : '',
    featured,
    order: books.length,
  };
  books.push(book);
  await saveBooks(books, `Add book: ${book.title}`);
  revalidateBooks();
  redirect('/manage/books');
}

export async function updateBook(formData) {
  requireAuth();
  const id = formData.get('id');
  const books = await getBooks();
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) redirect('/manage/books');
  const featured = formData.get('featured') === 'on';
  books[idx] = {
    ...books[idx],
    title: String(formData.get('title') || '').trim(),
    author: String(formData.get('author') || '').trim(),
    genre: String(formData.get('genre') || ''),
    synopsis: String(formData.get('synopsis') || '').trim(),
    isbn: String(formData.get('isbn') || '').trim(),
    featured,
    stamp: featured ? 'NEW' : '',
  };
  await saveBooks(books, `Update book: ${books[idx].title}`);
  revalidateBooks();
  redirect('/manage/books');
}

export async function deleteBook(formData) {
  requireAuth();
  const id = formData.get('id');
  const books = await getBooks();
  const filtered = books.filter((b) => b.id !== id);
  await saveBooks(filtered, `Delete book: ${id}`);
  revalidateBooks();
  redirect('/manage/books');
}

// ---------- Clubs ----------

export async function addClub(formData) {
  requireAuth();
  const clubs = await getClubs();
  const name = String(formData.get('name') || '').trim();
  const club = {
    id: makeId(name),
    name,
    meets: String(formData.get('meets') || '').trim(),
    where: String(formData.get('where') || '').trim(),
    sponsor: String(formData.get('sponsor') || '').trim(),
    howToJoin: String(formData.get('howToJoin') || '').trim(),
  };
  clubs.push(club);
  await saveClubs(clubs, `Add club: ${club.name}`);
  revalidateClubs();
  redirect('/manage/clubs');
}

export async function updateClub(formData) {
  requireAuth();
  const id = formData.get('id');
  const clubs = await getClubs();
  const idx = clubs.findIndex((c) => c.id === id);
  if (idx === -1) redirect('/manage/clubs');
  clubs[idx] = {
    ...clubs[idx],
    name: String(formData.get('name') || '').trim(),
    meets: String(formData.get('meets') || '').trim(),
    where: String(formData.get('where') || '').trim(),
    sponsor: String(formData.get('sponsor') || '').trim(),
    howToJoin: String(formData.get('howToJoin') || '').trim(),
  };
  await saveClubs(clubs, `Update club: ${clubs[idx].name}`);
  revalidateClubs();
  redirect('/manage/clubs');
}

export async function deleteClub(formData) {
  requireAuth();
  const id = formData.get('id');
  const clubs = await getClubs();
  const filtered = clubs.filter((c) => c.id !== id);
  await saveClubs(filtered, `Delete club: ${id}`);
  revalidateClubs();
  redirect('/manage/clubs');
}

// ---------- Links ----------

export async function addLinkCategory(formData) {
  requireAuth();
  const categories = await getLinks();
  const name = String(formData.get('category') || '').trim();
  if (!name) redirect('/manage/links');
  categories.push({ id: makeId(name), category: name, links: [] });
  await saveLinks(categories, `Add link category: ${name}`);
  revalidateLinks();
  redirect('/manage/links');
}

export async function deleteLinkCategory(formData) {
  requireAuth();
  const categoryId = formData.get('categoryId');
  const categories = await getLinks();
  const filtered = categories.filter((c) => c.id !== categoryId);
  await saveLinks(filtered, `Delete link category: ${categoryId}`);
  revalidateLinks();
  redirect('/manage/links');
}

export async function addLink(formData) {
  requireAuth();
  const categoryId = formData.get('categoryId');
  const categories = await getLinks();
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) redirect('/manage/links');
  const name = String(formData.get('name') || '').trim();
  cat.links.push({
    id: makeId(name),
    name,
    url: String(formData.get('url') || '').trim(),
    desc: String(formData.get('desc') || '').trim(),
  });
  await saveLinks(categories, `Add link: ${name}`);
  revalidateLinks();
  redirect('/manage/links');
}

export async function updateLink(formData) {
  requireAuth();
  const categoryId = formData.get('categoryId');
  const linkId = formData.get('linkId');
  const categories = await getLinks();
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) redirect('/manage/links');
  const link = cat.links.find((l) => l.id === linkId);
  if (!link) redirect('/manage/links');
  link.name = String(formData.get('name') || '').trim();
  link.url = String(formData.get('url') || '').trim();
  link.desc = String(formData.get('desc') || '').trim();
  await saveLinks(categories, `Update link: ${link.name}`);
  revalidateLinks();
  redirect('/manage/links');
}

export async function deleteLink(formData) {
  requireAuth();
  const categoryId = formData.get('categoryId');
  const linkId = formData.get('linkId');
  const categories = await getLinks();
  const cat = categories.find((c) => c.id === categoryId);
  if (cat) {
    cat.links = cat.links.filter((l) => l.id !== linkId);
  }
  await saveLinks(categories, `Delete link: ${linkId}`);
  revalidateLinks();
  redirect('/manage/links');
}

// ---------- Suggestions ----------

export async function submitSuggestion(formData) {
  const suggestions = await getSuggestions();
  const title = String(formData.get('title') || '').trim();
  if (!title) redirect('/suggest-a-purchase');
  suggestions.push({
    id: makeId(title),
    title,
    author: String(formData.get('author') || '').trim(),
    reason: String(formData.get('reason') || '').trim(),
    requestedBy: String(formData.get('requestedBy') || '').trim(),
    status: 'new',
    submittedAt: new Date().toISOString(),
  });
  await saveSuggestions(suggestions, `New purchase suggestion: ${title}`);
  revalidateSuggestions();
  redirect('/suggest-a-purchase?submitted=1');
}

export async function updateSuggestionStatus(formData) {
  requireAuth();
  const id = formData.get('id');
  const status = formData.get('status');
  const suggestions = await getSuggestions();
  const item = suggestions.find((s) => s.id === id);
  if (item) item.status = status;
  await saveSuggestions(suggestions, `Update suggestion status: ${id} -> ${status}`);
  revalidateSuggestions();
  redirect('/manage/suggestions');
}

export async function deleteSuggestion(formData) {
  requireAuth();
  const id = formData.get('id');
  const suggestions = await getSuggestions();
  const filtered = suggestions.filter((s) => s.id !== id);
  await saveSuggestions(filtered, `Delete suggestion: ${id}`);
  revalidateSuggestions();
  redirect('/manage/suggestions');
}
