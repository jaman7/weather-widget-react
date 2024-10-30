import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: 'src/assets/i18/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
