import translate from 'diagram-js/lib/i18n/translate/translate.js';

/**
 * Whether the suite runs as a translation collection pass rather than a normal one.
 */
export const collectTranslations = !!(globalThis.__env__ && globalThis.__env__.COLLECT_TRANSLATIONS);

/**
 * Logs every template handed to `translate`, so the karma translation reporter can
 * pick the translatable keys out of the browser log.
 */
export function collectTranslation(template, replacements) {
  console.log(JSON.stringify({ type: 'translations', msg: template }));

  return translate(template, replacements);
}

/**
 * The `translate` to use where a spec wires the service up by hand instead of
 * going through an injector, so those strings are collected, too.
 */
export const testTranslate = collectTranslations ? collectTranslation : translate;

export default {
  translate: ['value', collectTranslation],
};
