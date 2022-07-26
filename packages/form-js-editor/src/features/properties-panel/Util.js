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

export const INPUTS = [
  'checkbox',
  'checklist',
  'number',
  'radio',
  'select',
  'taglist',
  'textfield'
];

export const VALUES_INPUTS = [
  'checklist',
  'radio',
  'select',
  'taglist'
];