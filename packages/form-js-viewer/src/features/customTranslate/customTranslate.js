import translations from './translation_ger';

// TODO custom package ???

export function customTranslate(template, replacements) {
  // TODO Think of better handling if null or undefined???
  if (!template) {
    return '';
  }
  replacements = replacements || {};

  // Translate
  template = translations[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || '{' + key + '}';
  });
}

export const CustomTranslateModule = {
  translate: ['value', customTranslate],
};

