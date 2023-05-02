import classNames from 'classnames';

export function formFieldClasses(type, { errors = [], disabled = false, readonly = false } = {}) {
  if (!type) {
    throw new Error('type required');
  }

  return classNames('fjs-form-field', `fjs-form-field-${type}`, {
    'fjs-has-errors': errors.length > 0,
    'fjs-disabled': disabled,
    'fjs-readonly': readonly
  });
}

export function gridColumnClasses(formField) {
  const {
    layout = {}
  } = formField;

  const {
    columns
  } = layout;

  return classNames(
    'fjs-layout-column',
    `cds--col${columns ? '-lg-' + columns : ''}`,

    // always fall back to top-down on smallest screens
    'cds--col-sm-16',
    'cds--col-md-16'
  );
}


export function prefixId(id, formId) {
  if (formId) {
    return `fjs-form-${ formId }-${ id }`;
  }

  return `fjs-form-${ id }`;
}
