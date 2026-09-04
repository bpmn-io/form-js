import { get, isNil } from 'min-dash';

import { useService } from '../hooks';

import { NumberFieldEntry, isNumberFieldEntryEdited } from '@bpmn-io/properties-panel';

import { useCallback } from 'preact/hooks';

/**
 * @typedef { import('diagram-js/lib/i18n/translate/translate').default } Translate
 */

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
    return get(field, path);
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
    description: translate(tooltip),
  });
}

// helpers //////////

/**
 * @param {number|undefined} value
 * @param {Translate} translate
 * @returns {string|null}
 */
const validate = (value, translate) => {
  if (isNil(value)) {
    return null;
  }

  if (!Number.isInteger(value)) {
    return translate('Should be an integer.');
  }

  if (value < 1) {
    return translate('Should be greater than zero.');
  }
};

const tooltip = 'Documents whose height exceeds the defined value in pixels will be vertically scrollable';
