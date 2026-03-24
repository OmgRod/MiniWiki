const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readJsonFile(fullPath) {
  const raw = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(raw);
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

function readContextualJsonFile(fileName, contextRelativePath = '') {
  const contextDirectory = getContextDirectory(contextRelativePath);
  const configPath = findNearestConfigPath(contextDirectory, fileName);
  return readJsonFile(configPath);
}

function getSidebarConfig(contextRelativePath = '') {
  return readContextualJsonFile('sidebar.json', contextRelativePath);
}

function getHeaderConfig(contextRelativePath = '') {
  return readContextualJsonFile('header.json', contextRelativePath);
}

function getSiteConfig(contextRelativePath = '') {
  return readContextualJsonFile('site.json', contextRelativePath);
}

function getTemplatesConfig(contextRelativePath = '') {
  return readContextualJsonFile('templates.json', contextRelativePath);
}

function getFooterConfig(contextRelativePath = '') {
  return readContextualJsonFile('footer.json', contextRelativePath);
}

module.exports = {
  getSidebarConfig,
  getHeaderConfig,
  getSiteConfig,
  getTemplatesConfig,
  getFooterConfig,
};
