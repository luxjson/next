import { NextResponse } from 'next/server';
import { loginAdmin, requireAuth, getCurrentAdmin } from '../../../lib/auth.js';
import { findPublishedPosts, findPostBySlug, findPostById, incrementViews, getStats, createPost, updatePost, deletePost } from '../../../lib/blog.js';
import { slugify } from '../../../lib/helpers.js';
import { cleanPostHtml } from '../../../lib/sanitize.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const rateStore = globalThis.__luxjsonRateStore || new Map();
if (process.env.NODE_ENV !== 'production') globalThis.__luxjsonRateStore = rateStore;

function rateLimit(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = (forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip')) || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = process.env.NODE_ENV === 'production' ? 100 : 1000;
  const current = rateStore.get(ip);
  if (!current || now - current.startedAt >= windowMs) {
    rateStore.set(ip, { startedAt: now, count: 1 });
    return null;
  }
  current.count += 1;
  if (current.count > max) {
    return json({ success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }, 429);
  }
  return null;
}

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

async function body(request) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 10 * 1024 * 1024) throw { status: 413, message: 'Payload too large' };
  try { return await request.json(); } catch { return {}; }
}

function errorResponse(error) {
  console.error(error);
  if (error?.code === '23505') return json({ success: false, error: 'bad-request', message: 'Duplicate string. Please try again.' }, 400);
  return json({ success: false, message: error?.status && error.status < 500 ? error.message : 'Internal server error' }, error?.status || 500);
}

export async function GET(request, context) {
  const limited = rateLimit(request);
  if (limited) return limited;
  try {
    const { path = [] } = await context.params;
    const route = '/' + path.join('/');
    const url = new URL(request.url);

    if (route === '/health') return json({ status: 'ok' });
    if (route === '/auth/me') {
      const auth = requireAuth(request);
      if (auth.error) return json({ success: false, message: auth.error.message }, auth.error.status);
      const admin = await getCurrentAdmin(auth.admin.id);
      if (!admin) return json({ success: false, message: 'Admin não encontrado' }, 404);
      return json({ success: true, admin });
    }
    if (route === '/blog/posts') {
      const limit = Math.min(Math.max(Number.parseInt(url.searchParams.get('limit'), 10) || 10, 1), 50);
      const offset = Math.max(Number.parseInt(url.searchParams.get('offset'), 10) || 0, 0);
      return json({ success: true, posts: await findPublishedPosts({ limit, offset }) });
    }
    if (route === '/blog/stats') {
      const auth = requireAuth(request);
      if (auth.error) return json({ success: false, message: auth.error.message }, auth.error.status);
      return json(await getStats());
    }
    if (route.startsWith('/blog/posts/id/')) {
      const auth = requireAuth(request);
      if (auth.error) return json({ success: false, message: auth.error.message }, auth.error.status);
      const id = route.split('/').pop();
      const post = await findPostById(id);
      if (!post) return json({ success: false, message: 'Post not found' }, 404);
      return json({ success: true, post });
    }
    if (route.startsWith('/blog/posts/')) {
      const slug = decodeURIComponent(route.slice('/blog/posts/'.length));
      const post = await findPostBySlug(slug);
      if (!post || !post.published) return json({ success: false, message: 'Post not found or not published' }, 404);
      await incrementViews(slug);
      return json({ success: true, post });
    }
    return json({ success: false, message: `Route not found: ${request.method} ${url.pathname}` }, 404);
  } catch (error) { return errorResponse(error); }
}

export async function POST(request, context) {
  const limited = rateLimit(request);
  if (limited) return limited;
  try {
    const { path = [] } = await context.params;
    const route = '/' + path.join('/');
    if (route === '/auth/login') {
      const { username, password } = await body(request);
      const result = await loginAdmin(username, password);
      if (result.error) return json({ success: false, message: result.error.message }, result.error.status);
      return json({ success: true, token: result.token, admin: result.admin });
    }
    if (route === '/blog/posts') {
      const auth = requireAuth(request);
      if (auth.error) return json({ success: false, message: auth.error.message }, auth.error.status);
      const { title, content, excerpt, cover_image, published = false } = await body(request);
      if (!title || !content) return json({ success: false, message: 'Title and content are required' }, 400);
      const post = await createPost({ title, slug: slugify(title), content: cleanPostHtml(content), excerpt, cover_image, author_id: auth.admin.id, published });
      return json({ success: true, post }, 201);
    }
    return json({ success: false, message: `Route not found: ${request.method} ${new URL(request.url).pathname}` }, 404);
  } catch (error) { return errorResponse(error); }
}

export async function PUT(request, context) {
  const limited = rateLimit(request);
  if (limited) return limited;
  try {
    const { path = [] } = await context.params;
    const route = '/' + path.join('/');
    if (!route.startsWith('/blog/posts/')) return json({ success: false, message: 'Route not found' }, 404);
    const auth = requireAuth(request);
    if (auth.error) return json({ success: false, message: auth.error.message }, auth.error.status);
    const id = route.slice('/blog/posts/'.length);
    if (!id || id.includes('/')) return json({ success: false, message: 'Route not found' }, 404);
    const { title, content, excerpt, cover_image, published } = await body(request);
    const data = {};
    if (title) { data.title = title; data.slug = slugify(title); }
    if (content !== undefined) data.content = cleanPostHtml(content);
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (cover_image !== undefined) data.cover_image = cover_image;
    if (published !== undefined) data.published = published;
    const post = await updatePost(id, data);
    if (!post) return json({ success: false, message: 'Post not found' }, 404);
    return json({ success: true, post });
  } catch (error) { return errorResponse(error); }
}

export async function DELETE(request, context) {
  const limited = rateLimit(request);
  if (limited) return limited;
  try {
    const { path = [] } = await context.params;
    const route = '/' + path.join('/');
    if (!route.startsWith('/blog/posts/')) return json({ success: false, message: 'Route not found' }, 404);
    const auth = requireAuth(request);
    if (auth.error) return json({ success: false, message: auth.error.message }, auth.error.status);
    const id = route.slice('/blog/posts/'.length);
    if (!id || id.includes('/')) return json({ success: false, message: 'Route not found' }, 404);
    await deletePost(id);
    return json({ success: true, message: 'Post deleted successfully' });
  } catch (error) { return errorResponse(error); }
}
