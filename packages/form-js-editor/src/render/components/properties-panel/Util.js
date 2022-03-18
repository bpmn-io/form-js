/**
 * @typedef { import('../../../types').ComponentTypes} ComponentTypes
 */


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

export function stopPropagation(listener) {
  return (event) => {
    event.stopPropagation();

    listener(event);
  };
}

export function textToLabel(text = '...') {
  if (text.length > 10) {
    return `${ text.substring(0, 30) }...`;
  }

  return text;
}

/**
 * @type {ComponentTypes[]}
 */
export const INPUTS = [
  'checkbox',
  'number',
  'radio',
  'select',
  'textfield',

];

export const labelsByType = {
  button: 'BUTTON',
  checkbox: 'CHECKBOX',
  columns: 'COLUMNS',
  default: 'FORM',
  number: 'NUMBER',
  radio: 'RADIO',
  select: 'SELECT',
  text: 'TEXT',
  textfield: 'TEXT FIELD',
};

/**
 * @type {ComponentTypes[]}
 */
export const ALL_COMPONENTS = [...INPUTS, 'button','text'];