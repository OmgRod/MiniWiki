const fs = require('fs');
const path = require('path');

function readJsonFile(fileName) {
  const fullPath = path.join(process.cwd(), 'content', fileName);
  const raw = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(raw);
}

function getSidebarConfig() {
  return readJsonFile('sidebar.json');
}

function getHeaderConfig() {
  return readJsonFile('header.json');
}

function getSiteConfig() {
  return readJsonFile('site.json');
}

function getTemplatesConfig() {
  return readJsonFile('templates.json');
}

function getFooterConfig() {
  return readJsonFile('footer.json');
}

module.exports = {
  getSidebarConfig,
  getHeaderConfig,
  getSiteConfig,
  getTemplatesConfig,
  getFooterConfig,
};
