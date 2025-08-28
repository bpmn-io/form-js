import { NumberFieldEntry, isNumberFieldEntryEdited } from '@bpmn-io/properties-panel';

import { get, isFunction } from 'min-dash';
import { useService } from '../hooks';
import { useCallback } from 'preact/hooks';

export function HeightEntry(props) {
  const { editField, field, id, description, isDefaultVisible, defaultValue } = props;

  const entries = [];

  entries.push({
    id: id + '-height',
    component: Height,
    description,
    isEdited: isNumberFieldEntryEdited,
    editField,
    field,
    defaultValue,
    isDefaultVisible: (field) => {
      if (isFunction(isDefaultVisible)) {
        return isDefaultVisible(field);
      }

      return field.type === 'spacer';
    },
  });

  return entries;
}

function Height(props) {
  const { description, editField, field, id } = props;

  const debounce = useService('debounce');
  const translate = useService('translate');

  const getValue = (e) => get(field, ['height'], null);

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, ['height'], value);
  };

  return NumberFieldEntry({
    debounce,
    description,
    label: translate('Height'),
    element: field,
    id,
    getValue,
    setValue,
    validate : useCallback((value) => validate(value, translate), [translate]),
  });
}

// helpers //////////

/**
 * @param {number|void} value
 * @param {function} translate
 * @returns {string|null}
 */
const validate = (value, translate) => {
  if (typeof value !== 'number') {
    return translate('A number is required.');
  }

  if (!Number.isInteger(value)) {
    return translate('Should be an integer.');
  }

  if (value < 1) {
    return translate('Should be greater than zero.');
  }
};
