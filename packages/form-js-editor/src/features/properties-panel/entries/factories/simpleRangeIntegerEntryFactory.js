import { get } from 'min-dash';
import { useService } from '../../hooks';
import { NumberFieldEntry, isNumberFieldEntryEdited } from '@bpmn-io/properties-panel';

export function simpleRangeIntegerEntryFactory(options) {
  const {
    id,
    label,
    path,
    props,
    min,
    max,
    defaultValue
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
    defaultValue,
    component: SimpleRangeIntegerEntry,
    isEdited: isNumberFieldEntryEdited
  };
}

const SimpleRangeIntegerEntry = (props) => {
  const {
    id,
    label,
    path,
    field,
    editField,
    min,
    max,
    defaultValue
  } = props;

  const debounce = useService('debounce');

  const getValue = () => {
    const value = get(field, path, defaultValue);
    return Number.isInteger(value) ? value : defaultValue;
  };

  const setValue = (value) => {
    editField(field, path, value);
  };

  return NumberFieldEntry({
    debounce,
    label,
    element: field,
    step: 1,
    min,
    max,
    getValue,
    id,
    setValue
  });
};
