// generate-sitemap.js
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://abiddasurkar.github.io/pet-adoption-frontend';

const routes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/login', priority: 0.8, changefreq: 'monthly' },
  { path: '/signup', priority: 0.8, changefreq: 'monthly' },
  { path: '/dashboard', priority: 0.7, changefreq: 'weekly' },
];

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`
  )
  .join('')}
</urlset>`;

  const buildDir = path.join(__dirname, 'public');
  fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), sitemap);
  console.log(' Sitemap generated at public/sitemap.xml');
};

generateSitemap();