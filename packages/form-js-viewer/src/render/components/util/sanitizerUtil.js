import isEqual from 'lodash/isEqual';
import { DATETIME_SUBTYPES } from '../../../util/constants/DatetimeConstants';
import { isDateInputInformationMatching, isDateTimeInputInformationSufficient, isInvalidDateString, parseIsoTime } from './dateTimeUtil';
import { getSimpleOptionsData, normalizeOptionsData } from './optionsUtil';

const ALLOWED_IMAGE_SRC_PATTERN = /^(https?|data):.*/i; // eslint-disable-line no-useless-escape
const ALLOWED_IFRAME_SRC_PATTERN = /^(https):\/\/*/i; // eslint-disable-line no-useless-escape

export function sanitizeDateTimePickerValue(options) {
  const {
    formField,
    value
  } = options;

  const { subtype } = formField;

  if (typeof value !== 'string') return null;

  if (subtype === DATETIME_SUBTYPES.DATE && (isInvalidDateString(value) || !isDateInputInformationMatching(value))) return null;
  if (subtype === DATETIME_SUBTYPES.TIME && parseIsoTime(value) === null) return null;
  if (subtype === DATETIME_SUBTYPES.DATETIME && (isInvalidDateString(value) || !isDateTimeInputInformationSufficient(value))) return null;

  return value;
}

export function hasEqualValue(value, array) {

  if (!Array.isArray(array)) {
    return false;
  }

  return array.some(element => isEqual(value, element));
}

export function sanitizeSingleSelectValue(options) {
  const {
    formField,
    data,
    value
  } = options;

  const {
    valuesExpression: optionsExpression
  } = formField;

  try {

    // if options are expression evaluated, we don't need to sanitize the value against the options
    // and defer to the field's internal validation
    if (optionsExpression) {
      return value;
    }

    const validValues = normalizeOptionsData(getSimpleOptionsData(formField, data)).map(v => v.value);
    return hasEqualValue(value, validValues) ? value : null;
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
    valuesExpression: optionsExpression
  } = formField;

  try {

    // if options are expression evaluated, we don't need to sanitize the values against the options
    // and defer to the field's internal validation
    if (optionsExpression) {
      return value;
    }

    const validValues = normalizeOptionsData(getSimpleOptionsData(formField, data)).map(v => v.value);
    return value.filter(v => hasEqualValue(v, validValues));
  } catch (error) {

    // use default value in case of formatting error
    // TODO(@Skaiir): log a warning when this happens - https://github.com/bpmn-io/form-js/issues/289
    return [];
  }
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
export function sanitizeImageSource(src) {
  const valid = ALLOWED_IMAGE_SRC_PATTERN.test(src);

  return valid ? src : '';
}

/**
 * Sanitizes an iframe source to ensure we only allow for links
 * that start with http(s).
 *
 * @param {string} src
 * @returns {string}
 */
export function sanitizeIFrameSource(src) {
  const valid = ALLOWED_IFRAME_SRC_PATTERN.test(src);

  return valid ? src : '';
}

/**
 * Escapes HTML and returns pure text.
 * @param {string} html
 * @returns {string}
 */
export function escapeHTML(html) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '{': '&#123;',
    '}': '&#125;',
    ':': '&#58;',
    ';': '&#59;'
  };

  return html.replace(/[&<>"'{};:]/g, match => escapeMap[match]);
}