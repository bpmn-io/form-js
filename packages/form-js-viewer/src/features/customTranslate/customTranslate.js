import en from './en/translations';
import ge from './ge/translations';

const translations = {
  en,
  ge,
};

let currentLang = 'en';
const fallbackLang = 'en';

export function setLanguage(lang) {
  if (lang && translations[lang]) {
    currentLang = lang;
  } else {
    console.warn(`Language "${lang}" not found. Falling back to "${fallbackLang}".`);
    currentLang = fallbackLang;
  }
}

export function customTranslate(template, replacements = {}) {
  if (typeof template !== 'string') {
    console.warn('Invalid template: ', template);
    return '';
  }

  const translated = translations[currentLang]?.[template] ?? template;

  return translated.replace(/{([^}]+)}/g, (_, key) => {
    return key in replacements ? replacements[key] : `{${key}}`;
  });
}

export const CustomTranslateModule = {
  translate: ['value', customTranslate],
};
