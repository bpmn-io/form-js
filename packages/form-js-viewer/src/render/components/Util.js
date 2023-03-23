import snarkdown from '@bpmn-io/snarkdown';
import classNames from 'classnames';

import { sanitizeHTML, sanitizeImageSource } from './Sanitizer';

export function formFieldClasses(type, { errors = [], disabled = false } = {}) {
  if (!type) {
    throw new Error('type required');
  }

  return classNames('fjs-form-field', `fjs-form-field-${type}`, {
    'fjs-has-errors': errors.length > 0,
    'fjs-disabled': disabled
  });
}

export function gridColumnClasses(formField) {
  const {
    layout = {}
  } = formField;

  const {
    columns
  } = layout;

  return classNames(
    'fjs-layout-column',
    `cds--col${columns ? '-lg-' + columns : ''}`,

    // always fall back to top-down on smallest screens
    'cds--col-sm-16'
  );
}


export function prefixId(id, formId) {
  if (formId) {
    return `fjs-form-${ formId }-${ id }`;
  }

  return `fjs-form-${ id }`;
}

export function markdownToHTML(markdown) {
  const htmls = markdown
    .toString()
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

/**
 * Sanitizes an image source to ensure we only allow for data URI and links
 * that start with http(s).
 *
 * Note: Most browsers anyway do not support script execution in <img> elements.
 *
 * @param {string} src
 * @returns {string}
 */
export function safeImageSource(src) {
  return sanitizeImageSource(src);
}
