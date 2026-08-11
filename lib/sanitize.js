import sanitizeHtml from 'sanitize-html';

export function cleanPostHtml(content) {
  return sanitizeHtml(content, {
    allowedTags: ['p','br','strong','em','u','s','h1','h2','h3','h4','ul','ol','li','blockquote','code','pre','a'],
    allowedAttributes: { a: ['href','target','rel'] },
    allowedSchemes: ['http','https','mailto'],
  });
}
