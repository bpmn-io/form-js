import { get } from 'min-dash';
import { useService } from '../../hooks';
import { NumberFieldEntry, isNumberFieldEntryEdited } from '@bpmn-io/properties-panel';

export function zeroPositiveIntegerEntryFactory(options) {
  const {
    id,
    label,
    path,
    props
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
    component: ZeroPositiveIntegerEntry,
    isEdited: isNumberFieldEntryEdited
  };
}

const ZeroPositiveIntegerEntry = (props) => {
  const {
    id,
    label,
    path,
    field,
    editField
  } = props;

  const debounce = useService('debounce');

  const getValue = () => {
    const value = get(field, path, 0);
    return Number.isInteger(value) ? value : 0;
  };

  const setValue = (value) => {
    if (Number.isInteger(value) && value >= 0) {
      editField(field, path, value);
    }
  };

  return NumberFieldEntry({
    debounce,
    label,
    element: field,
    step: 1,
    min: 0,
    getValue,
    id,
    setValue
  });
};
