import { get } from 'min-dash';

import { useService } from '../hooks';

import { NumberFieldEntry, isNumberFieldEntryEdited } from '@bpmn-io/properties-panel';

import { useCallback } from 'preact/hooks';

export function MaxHeightEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'maxHeight',
    component: MaxHeight,
    editField: editField,
    field: field,
    isEdited: isNumberFieldEntryEdited,
    isDefaultVisible: (field) => field.type === 'documentPreview',
  });

  return entries;
}

function MaxHeight(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');
  const translate = useService('translate');

  const path = ['maxHeight'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return NumberFieldEntry({
    debounce,
    label: translate('Max height of preview container'),
    element: field,
    id,
    getValue,
    setValue,
    validate: useCallback((value) => validate(value, translate), [translate]),
    description: description(translate),
  });
}

// helpers //////////

/**
 * @param {string|number|undefined} value
 * @param {function} translate
 * @returns {string|null}
 */
const validate = (value, translate) => {
  if (value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'string') {
    return translate('Value must be a number.');
  }

  if (!Number.isInteger(value)) {
    return translate('Should be an integer.');
  }

  if (value < 1) {
    return translate('Should be greater than zero.');
  }
};

const description = (translate) => {
  return <>{translate('MaxHeightEntry description')}</>;
};
