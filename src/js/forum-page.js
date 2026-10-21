import { FORUM_POSTS } from './forum-posts.js';

// Iniciales del autor para el avatar.
function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// Fecha en formato español, p. ej. "6 oct 2026".
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Crea un elemento con clase y texto. El texto va siempre por textContent,
// así el contenido de los posts (incluido el código) nunca se interpreta como HTML.
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderPost(post) {
  const article = el('article', 'post');

  const avatar = el('span', 'avatar', initials(post.author));
  avatar.setAttribute('aria-hidden', 'true');
  const author = el('div', 'author');
  author.append(
    el('strong', '', post.author),
    el('span', '', `${post.role} · ${formatDate(post.date)}`),
  );
  const meta = el('div', 'post-meta');
  meta.append(avatar, author, el('span', 'slide', post.slide));

  article.append(meta, el('h2', '', post.title));
  for (const paragraph of post.paragraphs) article.append(el('p', '', paragraph));

  if (post.code) {
    const pre = el('pre');
    pre.append(el('code', '', post.code));
    article.append(pre);
  }

  const tags = el('ul', 'tags');
  for (const tag of post.tags) tags.append(el('li', '', `#${tag}`));
  const footer = el('footer', 'post-footer');
  footer.append(tags, el('span', 'replies', `💬 ${post.replies} respuestas`));
  article.append(footer);

  return article;
}

document.querySelector('.posts').append(...FORUM_POSTS.map(renderPost));
