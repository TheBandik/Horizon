import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';
import ja from './locales/ja.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ru: { translation: ru },
            ja: { translation: ja },
        },
        lng: 'en', // язык по умолчанию
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
    });

export default i18n;
