import { debounce as _debounce } from 'min-dash';

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

export function debounce(fn) {
  if (isTest()) {
    return fn;
  }

  return _debounce(fn, 300);
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

export function textToLabel(text) {
  if (text.length > 10) {
    return `${ text.substring(0, 10) }...`;
  }

  return text;
}

export const INPUTS = [
  'checkbox',
  'number',
  'radio',
  'select',
  'textfield'
];

function isTest() {

  // @ts-ignore-next-line
  return window.__env__ && window.__env__.NODE_ENV === 'test';
}