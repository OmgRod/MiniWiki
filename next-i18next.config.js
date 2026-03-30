const fs = require('fs');
const path = require('path');

const i18nConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'miniwiki.config.json'), 'utf8')
).i18nConfig;

module.exports = {
  i18n: i18nConfig,
};