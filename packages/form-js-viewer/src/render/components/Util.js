import snarkdown from '@bpmn-io/snarkdown';

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