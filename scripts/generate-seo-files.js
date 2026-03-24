const fs = require('fs');
const path = require('path');

const { getAllRoutes } = require('../lib/content');
const { getSiteConfig } = require('../lib/navigation');

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const CNAME_PATH = path.join(ROOT_DIR, 'CNAME');

function trimSlashes(value = '') {
  return String(value || '').replace(/^\/+|\/+$/g, '');
}

function ensureProtocol(value = '') {
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function resolveSiteUrl() {
  const siteConfig = getSiteConfig();

  const explicit =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    siteConfig?.siteUrl;

  if (explicit) {
    return ensureProtocol(String(explicit).trim()).replace(/\/+$/, '');
  }

  if (fs.existsSync(CNAME_PATH)) {
    const customDomain = fs.readFileSync(CNAME_PATH, 'utf8').trim();
    if (customDomain) {
      return ensureProtocol(customDomain).replace(/\/+$/, '');
    }
  }

  const repository = process.env.GITHUB_REPOSITORY || '';
  const [owner, repo] = repository.split('/');
  if (owner && repo) {
    return `https://${owner}.github.io/${trimSlashes(repo)}`;
  }

  return 'https://example.com';
}

function toAbsoluteUrl(siteUrl, routePath) {
  const base = siteUrl.replace(/\/+$/, '');
  const route = routePath === '/' ? '' : `/${trimSlashes(routePath)}`;
  return `${base}${route}/`;
}

function buildSitemapXml(siteUrl, routes) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  for (const route of routes) {
    const absoluteUrl = toAbsoluteUrl(siteUrl, route.route);
    const lastModified = fs.statSync(route.filePath).mtime.toISOString();

    lines.push('  <url>');
    lines.push(`    <loc>${absoluteUrl}</loc>`);
    lines.push(`    <lastmod>${lastModified}</lastmod>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return `${lines.join('\n')}\n`;
}

function buildRobotsTxt(siteUrl) {
  const sitemapUrl = `${siteUrl.replace(/\/+$/, '')}/sitemap.xml`;
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const siteUrl = resolveSiteUrl();
  const routes = getAllRoutes();

  const sitemapXml = buildSitemapXml(siteUrl, routes);
  const robotsTxt = buildRobotsTxt(siteUrl);

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf8');

  console.log(`SEO files generated with base URL: ${siteUrl}`);
}

main();
