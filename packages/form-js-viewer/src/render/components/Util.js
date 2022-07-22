import snarkdown from '@bpmn-io/snarkdown';
import { get } from 'min-dash';

import { sanitizeHTML } from './Sanitizer';

export function formFieldClasses(type, errors = []) {
  if (!type) {
    throw new Error('type required');
  }

  const classes = [
    'fjs-form-field',
    `fjs-form-field-${ type }`
  ];

  if (errors.length) {
    classes.push('fjs-has-errors');
  }

  return classes.join(' ');
}

export function prefixId(id, formId) {
  if (formId) {
    return `fjs-form-${ formId }-${ id }`;
  }

  return `fjs-form-${ id }`;
}

export function markdownToHTML(markdown) {
  const htmls = markdown
    .split(/(?:\r?\n){2,}/)
    .map(line =>
      /^((\d+.)|[><\s#-*])/.test(line)
        ? snarkdown(line)
        : `<p>${ snarkdown(line) }</p>`,
    );

  return htmls.join('\n\n');
}

// see https://github.com/developit/snarkdown/issues/70
export function safeMarkdown(markdown) {
  const html = markdownToHTML(markdown);

  return sanitizeHTML(html);
}

export function sanitizeSingleSelectValue(options) {
  const {
    formField,
    data,
    value
  } = options;

  const {
    valuesKey,
    values
  } = formField;

  try {
    const validValues = (valuesKey ? get(data, [ valuesKey ]) : values).map(v => v.value) || [];
    return validValues.includes(value) ? value : null;
  } catch (error) {

    // use default value in case of formatting error
    // TODO(@Skaiir): log a warning when this happens - https://github.com/bpmn-io/form-js/issues/289
    return null;
  }
}

export function sanitizeMultiSelectValue(options) {
  const {
    formField,
    data,
    value
  } = options;

  const {
    valuesKey,
    values
  } = formField;

  try {
    const validValues = (valuesKey ? get(data, [ valuesKey ]) : values).map(v => v.value) || [];
    return value.filter(v => validValues.includes(v));
  } catch (error) {

    // use default value in case of formatting error
    // TODO(@Skaiir): log a warning when this happens - https://github.com/bpmn-io/form-js/issues/289
    return [];
  }
}
