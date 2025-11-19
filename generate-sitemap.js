const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

const hostname = 'https://abiddasurkar.github.io/banking-dashboard/';

const links = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/dashboard', changefreq: 'weekly', priority: 0.95 },
  { url: '/transactions', changefreq: 'weekly', priority: 0.9 },
  { url: '/loans', changefreq: 'weekly', priority: 0.9 },
  { url: '/profile', changefreq: 'monthly', priority: 0.7 },
  { url: '/settings', changefreq: 'monthly', priority: 0.6 },
];

async function generateSitemap() {
  try {
    const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
    const stream = new SitemapStream({ hostname });
    const writeStream = createWriteStream(sitemapPath);

    stream.pipe(writeStream);

    links.forEach(link => {
      stream.write(link);
    });

    stream.end();

    await streamToPromise(stream);
    console.log('✅ sitemap.xml generated successfully at public/sitemap.xml');
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap().catch(console.error);