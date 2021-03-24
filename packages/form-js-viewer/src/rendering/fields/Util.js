export function formFieldClasses(errors = [], type) {
  const classes = [ 'fjs-form-field' ];

  if (type) {
    classes.push(`fjs-${ type }`);
  }

  if (errors.length) {
    classes.push('fjs-has-errors');
  }

  return classes.join(' ');
}