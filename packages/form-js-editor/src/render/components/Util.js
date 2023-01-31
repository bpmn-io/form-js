import classNames from 'classnames';

export function editorFormFieldClasses(type, { disabled = false } = {}) {
  if (!type) {
    throw new Error('type required');
  }

  return classNames('fjs-form-field', `fjs-form-field-${type}`, {
    'fjs-disabled': disabled
  });
}