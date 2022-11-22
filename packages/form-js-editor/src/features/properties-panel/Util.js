export function arrayAdd(array, index, item) {
  const copy = [...array];

  copy.splice(index, 0, item);

  return copy;
}

export function arrayRemove(array, index) {
  const copy = [...array];

  copy.splice(index, 1);

  return copy;
}

export function prefixId(id) {
  return `fjs-properties-panel-${id}`;
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

export const INPUTS = [
  'checkbox',
  'checklist',
  'number',
  'radio',
  'select',
  'taglist',
  'textfield',
  'textarea',
];

export const VALUES_INPUTS = ['checklist', 'radio', 'select', 'taglist'];
