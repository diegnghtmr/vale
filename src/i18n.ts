import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from './translations';

const initI18n = () => {
  return i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: translations.en
        },
        es: {
          translation: translations.es
        }
      },
      fallbackLng: 'en',
      supportedLngs: ['en', 'es'],
      load: 'languageOnly',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      // Ensure translations are loaded synchronously
      initImmediate: false,
      // Save language preference
      detection: {
        lookupLocalStorage: 'i18nextLng',
        caches: ['localStorage'],
      },
    });
};

export const i18nInstance = initI18n();

i18nInstance.then(() => {
  console.log('i18n initialized successfully');
}).catch((error) => {
  console.error('Failed to initialize i18n:', error);
});

export default i18n;