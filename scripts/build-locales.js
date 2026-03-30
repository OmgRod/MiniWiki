const { execSync } = require('child_process');

const locales = ['en', 'es', 'fr', 'de'];

locales.forEach((locale) => {
  console.log(`Building for locale: ${locale}`);
  execSync(`next build && next export -o out/${locale} --locale ${locale}`, {
    stdio: 'inherit',
  });
});

console.log('Static export completed for all locales.');