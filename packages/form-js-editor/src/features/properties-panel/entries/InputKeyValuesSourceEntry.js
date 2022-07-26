import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { get } from 'min-dash';
import { useService } from '../hooks';
import { VALUES_SOURCES, VALUES_SOURCES_PATHS } from './ValuesSourceUtil';

export default function InputKeyValuesSourceEntry(props) {
  const {
    editField,
    field,
    id
  } = props;

  return [
    {
      id: id + '-key',
      component: InputValuesKey,
      label: 'Input values key',
      description: 'Define which input property to populate the values from',
      isEdited: isTextFieldEntryEdited,
      editField,
      field,
    }
  ];
}

function InputValuesKey(props) {
  const {
    editField,
    field,
    id,
    label,
    description
  } = props;

  const debounce = useService('debounce');

  const path = VALUES_SOURCES_PATHS[VALUES_SOURCES.INPUT];

  const getValue = () => get(field, path, '');

  const setValue = (value) => editField(field, path, value || '');

  return TextFieldEntry({
    debounce,
    description,
    element: field,
    getValue,
    id,
    label,
    setValue
  });
}
