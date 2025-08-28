import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function AcceptEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'accept',
    component: Accept,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'filepicker',
  });

  return entries;
}

function Accept(props) {
  const { editField, field, id } = props;

  const translate = useService('translate');

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['accept'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: translate('Supported file formats'),
    singleLine: true,
    setValue,
    variables,
    description : description(translate),
  });
}

// helpers //////////
/**
 * @param {function} translate
 * @returns Description Element
 */
const description = (translate) => {
  return (
    <>
      {translate('A comma-separated list of')}{' '}
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers"
        target="_blank"
        rel="noreferrer">
        {translate('file type specifiers')}
      </a>
    </>
  )
}

