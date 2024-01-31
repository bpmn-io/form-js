import { get } from 'min-dash';
import { useService } from '../../hooks';
import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { isValidNumber } from '../../Util';

import Big from 'big.js';
import { useCallback } from 'preact/hooks';

export function simpleRangeIntegerEntryFactory(options) {
  const {
    id,
    label,
    path,
    props,
    min,
    max
  } = options;

  const {
    editField,
    field
  } = props;

  return {
    id,
    label,
    path,
    field,
    editField,
    min,
    max,
    component: SimpleRangeIntegerEntry,
    isEdited: isTextFieldEntryEdited
  };
}

const SimpleRangeIntegerEntry = (props) => {
  const {
    id,
    label,
    path,
    field,
    editField,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER
  } = props;

  const debounce = useService('debounce');

  const getValue = () => {
    const value = get(field, path);
    const isValid = isValidNumber(value) && Number.isInteger(value);
    return isValid ? value : null;
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, path, Number(value));
  };

  const validate = useCallback((value) => {
    if (value === undefined || value === null || value === '') { return; }
    if (!Number.isInteger(Number(value))) { return 'Should be an integer.'; }
    if (Big(value).cmp(min) < 0) { return `Should be at least ${min}.`; }
    if (Big(value).cmp(max) > 0) { return `Should be at most ${max}.`; }
  }, [ min, max ]);

  return TextFieldEntry({
    debounce,
    label,
    element: field,
    getValue,
    id,
    setValue,
    validate
  });
};
