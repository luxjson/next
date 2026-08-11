import { pool } from './db.js';

export async function findPostById(id) {
  const result = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function findPublishedPosts({ limit = 10, offset = 0 } = {}) {
  const result = await pool.query(`SELECT id, title, slug, excerpt, cover_image, author_id,
    published, views, created_at, published_at FROM blog_posts
    WHERE published = true ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
  return result.rows;
}

export async function findPostBySlug(slug) {
  const result = await pool.query(`SELECT id, title, slug, content, excerpt, cover_image,
    author_id, published, views, created_at, published_at FROM blog_posts WHERE slug = $1`, [slug]);
  return result.rows[0] || null;
}

export async function createPost(data) {
  const { title, slug, content, excerpt, cover_image, author_id, published = false } = data;
  const result = await pool.query(`INSERT INTO blog_posts
    (title, slug, content, excerpt, cover_image, author_id, published, published_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, CASE WHEN $7 = true THEN CURRENT_TIMESTAMP ELSE NULL END)
    RETURNING id, title, slug, created_at, published_at`,
    [title, slug, content, excerpt, cover_image, author_id, published]);
  return result.rows[0];
}

export async function updatePost(id, data) {
  const { title, slug, content, excerpt, cover_image, published } = data;
  const result = await pool.query(`UPDATE blog_posts
    SET title = COALESCE($1, title), slug = COALESCE($2, slug), content = COALESCE($3, content),
        excerpt = COALESCE($4, excerpt), cover_image = COALESCE($5, cover_image),
        published = COALESCE($6, published),
        published_at = CASE WHEN $6 = true AND published = false THEN CURRENT_TIMESTAMP ELSE published_at END
    WHERE id = $7 RETURNING id, title, slug, published, published_at`,
    [title, slug, content, excerpt, cover_image, published, id]);
  return result.rows[0] || null;
}

export async function deletePost(id) {
  await pool.query('DELETE FROM blog_posts WHERE id = $1', [id]);
}

export async function incrementViews(slug) {
  await pool.query('UPDATE blog_posts SET views = views + 1 WHERE slug = $1', [slug]);
}

export async function getStats() {
  const result = await pool.query(`SELECT COUNT(*) as total,
    COUNT(CASE WHEN published = true THEN 1 END) as published_count,
    COALESCE(SUM(views), 0) as total_views FROM blog_posts`);
  return {
    posts: Number.parseInt(result.rows[0].total, 10),
    published: Number.parseInt(result.rows[0].published_count, 10),
    views: Number.parseInt(result.rows[0].total_views, 10),
  };
}
