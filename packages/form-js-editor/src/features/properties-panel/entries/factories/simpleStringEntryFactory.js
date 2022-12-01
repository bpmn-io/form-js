import { get } from 'min-dash';
import { useService } from '../../hooks';
import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

export default function simpleStringEntryFactory(options) {
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
    component: SimpleStringComponent,
    isEdited: isTextFieldEntryEdited
  };
}

const SimpleStringComponent = (props) => {
  const {
    id,
    label,
    path,
    field,
    editField
  } = props;

  const debounce = useService('debounce');

  const getValue = () => get(field, path, '');

  const setValue = (value) => editField(field, path, value);

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label,
    setValue
  });
};
