import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { get, isUndefined } from 'min-dash';
import { useService } from '../hooks';
import { VALUES_SOURCES, VALUES_SOURCES_PATHS } from '@bpmn-io/form-js-viewer';


export default function InputKeyValuesSourceEntry(props) {
  const {
    editField,
    field,
    id
  } = props;

  const schema = '[\n  {\n    "label": "dollar",\n    "value": "$"\n  }\n]';

  const description = <div>
    Define which input property to populate the values from.
    <br /><br />The input property may be an array of simple values or alternatively follow this schema:
    <pre><code>{schema}</code></pre>
  </div>;

  return [
    {
      id: id + '-key',
      component: InputValuesKey,
      label: 'Input values key',
      description,
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

  const validate = (value) => {
    if (isUndefined(value) || !value.length) {
      return 'Must not be empty.';
    }

    if (/\s/.test(value)) {
      return 'Must not contain spaces.';
    }

    return null;
  };

  return TextFieldEntry({
    debounce,
    description,
    element: field,
    getValue,
    id,
    label,
    setValue,
    validate
  });
}
