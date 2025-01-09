import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translationsNB } from './nb';
import { translationsNN } from './nn';

const savedLanguage = localStorage.getItem('preferredLanguage');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      nb: {
        translation: translationsNB
      },
      nn: {
        translation: translationsNN
      }
    },
    lng: savedLanguage || 'nn', // Use saved language or default to nn
    fallbackLng: 'nn',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator']
    }
  });

export default i18n; 