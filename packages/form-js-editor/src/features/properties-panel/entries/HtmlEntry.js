import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function HtmlEntry(props) {
  const { editField, field } = props;

  const entries = [
    {
      id: 'content',
      component: Content,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited,
      isDefaultVisible: (field) => field.type === 'html',
    },
  ];

  return entries;
}

function Content(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');
  const translate = useService('translate');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['content'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value || '');
  };

  return FeelTemplatingEntry({
    debounce,
    description: description(translate),
    element: field,
    getValue,
    id,
    label: translate('Content'),
    hostLanguage: 'html',
    validate,
    setValue,
    variables,
  });
}

// helpers //////////

const description = (translate) => {
  return (
    <>
      {translate('Html entry description')}{' '}
      <a
        href="https://docs.camunda.io/docs/components/modeler/forms/form-element-library/forms-element-library-html/"
        target="_blank"
        rel="noreferrer">
        {translate('Learn more')}
      </a>
    </>
  );
};

/**
 * @param {string|void} value
 * @returns {string|null}
 */
const validate = (value) => {
  // allow empty state
  if (typeof value !== 'string' || value === '') {
    return null;
  }

  // allow expressions
  if (value.startsWith('=')) {
    return null;
  }
};
