module.exports = {
  trailingSlash: true,
  exportPathMap: async function (defaultPathMap) {
    const locales = ['en', 'es', 'fr', 'de'];
    const pathMap = {};
    
    Object.keys(defaultPathMap).forEach((path) => {
      locales.forEach((locale) => {
        const localizedPath = locale === 'en' ? path : `/${locale}${path}`;
        pathMap[localizedPath] = { ...defaultPathMap[path], query: { locale } };
      });
    });

    return pathMap;
  },
};
