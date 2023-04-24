const NODE_TYPE_TEXT = 3,
      NODE_TYPE_ELEMENT = 1;

const ALLOWED_NODES = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'span',
  'em',
  'a',
  'p',
  'div',
  'ul',
  'ol',
  'li',
  'hr',
  'blockquote',
  'img',
  'pre',
  'code',
  'br',
  'strong',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td'
];

const ALLOWED_ATTRIBUTES = [
  'align',
  'alt',
  'class',
  'href',
  'id',
  'name',
  'rel',
  'target',
  'src'
];

const ALLOWED_URI_PATTERN = /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i; // eslint-disable-line no-useless-escape
const ALLOWED_IMAGE_SRC_PATTERN = /^(https?|data):.*/i; // eslint-disable-line no-useless-escape
const ATTR_WHITESPACE_PATTERN = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g; // eslint-disable-line no-control-regex

const FORM_ELEMENT = document.createElement('form');

/**
 * Sanitize a HTML string and return the cleaned, safe version.
 *
 * @param {string} html
 * @return {string}
 */

// see https://github.com/developit/snarkdown/issues/70
export function sanitizeHTML(html) {

  const doc = new DOMParser().parseFromString(
    `<!DOCTYPE html>\n<html><body><div>${ html }`,
    'text/html'
  );

  doc.normalize();

  const element = doc.body.firstChild;

  if (element) {
    sanitizeNode(/** @type Element */ (element));

    return new XMLSerializer().serializeToString(element);
  } else {

    // handle the case that document parsing
    // does not work at all, due to HTML gibberish
    return '';
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
 * Recursively sanitize a HTML node, potentially
 * removing it, its children or attributes.
 *
 * Inspired by https://github.com/developit/snarkdown/issues/70
 * and https://github.com/cure53/DOMPurify. Simplified
 * for our use-case.
 *
 * @param {Element} node
 */
function sanitizeNode(node) {

  // allow text nodes
  if (node.nodeType === NODE_TYPE_TEXT) {
    return;
  }

  // disallow all other nodes but Element
  if (node.nodeType !== NODE_TYPE_ELEMENT) {
    return node.remove();
  }

  const lcTag = node.tagName.toLowerCase();

  // disallow non-whitelisted tags
  if (!ALLOWED_NODES.includes(lcTag)) {
    return node.remove();
  }

  const attributes = node.attributes;

  // clean attributes
  for (let i = attributes.length; i--;) {
    const attribute = attributes[i];

    const name = attribute.name;
    const lcName = name.toLowerCase();

    // normalize node value
    const value = attribute.value.trim();

    node.removeAttribute(name);

    const valid = isValidAttribute(lcTag, lcName, value);

    if (valid) {
      node.setAttribute(name, value);
    }

  }

  // force noopener on target="_blank" links
  if (lcTag === 'a' && node.getAttribute('target') === '_blank' && node.getAttribute('rel') !== 'noopener') {
    node.setAttribute('rel', 'noopener');
  }

  for (let i = node.childNodes.length; i--;) {
    sanitizeNode(/** @type Element */ (node.childNodes[i]));
  }
}


/**
 * Validates attributes for validity.
 *
 * @param {string} lcTag
 * @param {string} lcName
 * @param {string} value
 * @return {boolean}
 */
function isValidAttribute(lcTag, lcName, value) {

  // disallow most attributes based on whitelist
  if (!ALLOWED_ATTRIBUTES.includes(lcName)) {
    return false;
  }

  // disallow "DOM clobbering" / polution of document and wrapping form elements
  if ((lcName === 'id' || lcName === 'name') && (value in document || value in FORM_ELEMENT)) {
    return false;
  }

  if (lcName === 'target' && value !== '_blank') {
    return false;
  }

  // allow valid url links only
  if (lcName === 'href' && !ALLOWED_URI_PATTERN.test(value.replace(ATTR_WHITESPACE_PATTERN, ''))) {
    return false;
  }

  return true;
}