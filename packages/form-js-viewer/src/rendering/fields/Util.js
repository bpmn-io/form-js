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

export function prefixId(id) {
  return `fjs-form-${ id }`;
}