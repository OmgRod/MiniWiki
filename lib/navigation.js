const isServer = typeof window === 'undefined';
const fs = isServer ? require('fs') : null;
const path = require('path');
const siteConfig = isServer
  ? JSON.parse(fs.readFileSync(path.join(process.cwd(), 'miniwiki.config.json'), 'utf8'))
  : {}; // Fallback to an empty object on the client side

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readJsonFile(fullPath) {
  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`File not found: ${fullPath}`);
      return {}; // Return an empty object as a fallback
    }
    throw error; // Re-throw other errors
  }
}

function normalizeRelativePath(value = '') {
  return String(value || '').replace(/\\/g, '/').replace(/^\/+/, '');
}

function getContextDirectory(contextRelativePath = '') {
  if (!contextRelativePath) {
    return CONTENT_DIR;
  }

  const normalizedRelativePath = normalizeRelativePath(contextRelativePath);
  const absolutePath = path.resolve(CONTENT_DIR, normalizedRelativePath);

  if (!absolutePath.startsWith(CONTENT_DIR)) {
    return CONTENT_DIR;
  }

  if (path.extname(absolutePath)) {
    return path.dirname(absolutePath);
  }

  return absolutePath;
}

function findNearestConfigPath(contextDirectory, fileName) {
  let currentDirectory = contextDirectory;

  while (true) {
    const candidate = path.join(currentDirectory, fileName);

    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }

    if (currentDirectory === CONTENT_DIR) {
      break;
    }

    const parentDirectory = path.dirname(currentDirectory);
    if (parentDirectory === currentDirectory || !parentDirectory.startsWith(CONTENT_DIR)) {
      break;
    }

    currentDirectory = parentDirectory;
  }

  return path.join(CONTENT_DIR, fileName);
}

function getConfigSection(sectionName) {
  return siteConfig[sectionName] || {}; // Return the section or an empty object
}

function getHeaderConfig() {
  return getConfigSection('header');
}

function getSidebarConfig() {
  return getConfigSection('sidebar');
}

function getTemplatesConfig() {
  return siteConfig.templates || {};
}

function getFooterConfig() {
  return getConfigSection('footer');
}

module.exports = {
  getSidebarConfig,
  getHeaderConfig,
  siteConfig,
  getTemplatesConfig,
  getFooterConfig,
};
