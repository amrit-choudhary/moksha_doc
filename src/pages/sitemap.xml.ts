import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { games } from '../data/games';

export const GET: APIRoute = async ({ site }) => {
  const docs = await getCollection('docs');
  const paths = [
    '/',
    '/play/',
    ...games.map((game) => `/play/${game.slug}/`),
    '/docs/',
    ...docs.sort((a, b) => a.data.order - b.data.order).map((page) => `/docs/${page.id}/`),
  ];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
