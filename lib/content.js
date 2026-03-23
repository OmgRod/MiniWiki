const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(process.cwd(), 'content');

function isMdxFile(fileName) {
  return fileName.endsWith('.mdx') || fileName.endsWith('.md');
}

function walkContentDirectory(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('_')) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkContentDirectory(fullPath, fileList);
      continue;
    }

    if (entry.isFile() && isMdxFile(entry.name)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

function toRelativeFilePath(fullPath) {
  return path.relative(CONTENT_DIR, fullPath).replace(/\\/g, '/');
}

function toSlugSegments(relativePath) {
  const noExtension = relativePath.replace(/\.(md|mdx)$/i, '');

  if (noExtension === 'home') {
    return [];
  }

  return noExtension.split('/');
}

function toRoutePath(segments) {
  if (!segments || segments.length === 0) {
    return '/';
  }

  return `/${segments.join('/')}`;
}

function getFilePathFromSlugSegments(slugSegments = []) {
  if (!slugSegments.length) {
    return path.join(CONTENT_DIR, 'home.mdx');
  }

  const base = path.join(CONTENT_DIR, ...slugSegments);
  const mdxPath = `${base}.mdx`;
  const mdPath = `${base}.md`;

  if (fs.existsSync(mdxPath)) {
    return mdxPath;
  }

  if (fs.existsSync(mdPath)) {
    return mdPath;
  }

  return null;
}

function getAllContentFiles() {
  return walkContentDirectory(CONTENT_DIR);
}

function getAllRoutes() {
  return getAllContentFiles().map((fullPath) => {
    const relativePath = toRelativeFilePath(fullPath);
    const slug = toSlugSegments(relativePath);

    return {
      slug,
      route: toRoutePath(slug),
      filePath: fullPath,
      relativePath,
    };
  });
}

function stripMarkdown(value = '') {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[#>*_~\-|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getPageMetaIndex() {
  return getAllRoutes().map((route) => {
    const source = fs.readFileSync(route.filePath, 'utf8');
    const { data, content } = matter(source);

    return {
      title: data.title || route.slug[route.slug.length - 1] || 'Home',
      description: data.description || '',
      route: route.route,
      slug: route.slug,
      excerpt: stripMarkdown(content).slice(0, 240),
      relativePath: route.relativePath,
    };
  });
}

module.exports = {
  CONTENT_DIR,
  getAllRoutes,
  getFilePathFromSlugSegments,
  getPageMetaIndex,
};
