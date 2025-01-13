const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const Middleware = require('i18next-http-middleware');
const path = require('path');

i18next
  .use(Backend)
  .use(Middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, './{{lng}}.json'),
    },
    fallbackLng: 'en', // Default language
    preload: ['en', 'es', 'fr', 'ar', 'hi', 'ja', 'ru', 'zh'], // Preload supported languages
    supportedLngs: ['en', 'es', 'fr', 'ar', 'hi', 'ja', 'ru', 'zh'], // Explicitly specify supported languages
    detection: {
      order: ['querystring', 'cookie', 'header'], // Order of language detection
      caches: ['cookie'], // Cache the language in a cookie
    },
    debug: false, // Disable debug logs in production
  });

module.exports = Middleware.handle(i18next);