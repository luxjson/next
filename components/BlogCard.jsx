import React from 'react';
import Link from 'next/link';

export default function BlogCard({ post }) {
  const date = new Date(post.published_at || post.created_at);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Link href={`/blog/${post.slug}`} className="blog-card-link">
      <article className="blog-card">
        {post.cover_image && (
          <div className="blog-card-image">
            <img src={post.cover_image} alt={post.title} loading="lazy" />
          </div>
        )}
        <div className="blog-card-content">
          <h3 className="blog-card-title">{post.title}</h3>
          {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
          <div className="blog-card-footer">
            <span className="blog-card-date">{formattedDate}</span>
            {post.views > 0 && (
              <span className="blog-card-views">
                <i className="material-icons">visibility</i> {post.views}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}