import Big from 'big.js';

export function arrayAdd(array, index, item) {
  const copy = [ ...array ];

  copy.splice(index, 0, item);

  return copy;
}

export function arrayRemove(array, index) {
  const copy = [ ...array ];

  copy.splice(index, 1);

  return copy;
}

export function prefixId(id) {
  return `fjs-properties-panel-${ id }`;
}


export function countDecimals(number) {
  const num = Big(number);
  if (num.toString() === num.toFixed(0)) return 0;
  return num.toFixed().split('.')[1].length || 0;
}

/**
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isValidNumber(value) {
  return (typeof value === 'number' || typeof value === 'string') && value !== '' && !isNaN(Number(value));
}

export function stopPropagation(listener) {
  return (event) => {
    event.stopPropagation();

    listener(event);
  };
}

export function textToLabel(text) {

  if (typeof text != 'string') return null;

  for (const line of text.split('\n')) {

    const displayLine = line.trim();

    // we use the first non-whitespace line in the text as label
    if (displayLine !== '') {
      return displayLine;
    }
  }

  return null;
}

/**
  * @param {string} path
  */
export function isValidDotPath(path) {
  return /^\w+(\.\w+)*$/.test(path);
}

/**
  * @param {string} path
  */
export function isProhibitedPath(path) {
  const prohibitedSegments = [
    '__proto__',
    'prototype',
    'constructor'
  ];

  return path.split('.').some(segment => prohibitedSegments.includes(segment));
}

export const LABELED_NON_INPUTS = [
  'button',
  'group',
  'dynamiclist',
  'iframe',
  'table'
];

export const INPUTS = [
  'checkbox',
  'checklist',
  'datetime',
  'number',
  'radio',
  'select',
  'taglist',
  'textfield',
  'textarea'
];

export const OPTIONS_INPUTS = [
  'checklist',
  'radio',
  'select',
  'taglist'
];

export function hasEntryConfigured(formFieldDefinition, entryId) {
  const { propertiesPanelEntries = [] } = formFieldDefinition;

  if (!propertiesPanelEntries.length) {
    return false;
  }

  return propertiesPanelEntries.some(id => id === entryId);
}

export function hasOptionsGroupsConfigured(formFieldDefinition) {
  const { propertiesPanelEntries = [] } = formFieldDefinition;

  if (!propertiesPanelEntries.length) {
    return false;
  }

  return propertiesPanelEntries.some(id => id === 'values');
}

/**
  * @param {string} path
  */
export function hasIntegerPathSegment(path) {
  return path.split('.').some(segment => /^\d+$/.test(segment));
}