export function formFieldClasses(errors, type) {
  return `fjs-form-field ${type ? `fjs-${type}` : '' } ${errors && errors.length ? 'fjs-has-errors' : '' }`;
}