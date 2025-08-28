import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { get } from 'min-dash';
import { useService } from '../hooks';
import { OPTIONS_SOURCES, OPTIONS_SOURCES_PATHS } from '@bpmn-io/form-js-viewer';
import { useCallback } from 'preact/hooks';

export function InputKeyOptionsSourceEntry(props) {
  const { editField, field, id } = props;

  return [
    {
      id: id + '-key',
      component: InputValuesKey,
      isEdited: isTextFieldEntryEdited,
      editField,
      field,
    },
  ];
}

function InputValuesKey(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');
  const translate = useService('translate');

  const path = OPTIONS_SOURCES_PATHS[OPTIONS_SOURCES.INPUT];

  const schema = '[\n  {\n    "label": "dollar",\n    "value": "$"\n  }\n]';

  const tooltip = (
    <div>
      {translate('Input values key tooltip')}
      <pre>
        <code>{schema}</code>
      </pre>
    </div>
  );

  const getValue = () => get(field, path, '');

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, path, value || '');
  };

  return TextFieldEntry({
    debounce,
    description: translate('Input values key description'),
    tooltip,
    element: field,
    getValue,
    id,
    label: translate('Input values key'),
    setValue,
    validate : useCallback((value) => validate(value, translate), [translate]),
  });
}

// helpers //////////

/**
 * @param {string|void} value
 * @param {function} translate
 * @returns {string|null}
 */
const validate = (value, translate) => {
  if (typeof value !== 'string' || value.length === 0) {
    return translate('Must not be empty.');
  }

  if (/\s/.test(value)) {
    return translate('Must not contain spaces.');
  }

  return null;
};
