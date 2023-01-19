import { get } from 'min-dash';
import { CheckboxEntry, isCheckboxEntryEdited } from '@bpmn-io/properties-panel';

export default function simpleBoolEntryFactory(options) {
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
    component: SimpleBoolComponent,
    isEdited: isCheckboxEntryEdited
  };
}

const SimpleBoolComponent = (props) => {
  const {
    id,
    label,
    path,
    field,
    editField
  } = props;

  const getValue = () => get(field, path, '');

  const setValue = (value) => editField(field, path, value);

  return CheckboxEntry({
    element: field,
    getValue,
    id,
    label,
    setValue
  });
};
