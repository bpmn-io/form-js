import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function EndpointKeyEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'endpointKey',
    component: EndpointKey,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'documentPreview',
  });

  return entries;
}

function EndpointKey(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['endpointKey'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  const tooltip = (
    <div>
      <p>Enter a context key that generates a string with the API endpoint to download a document.</p>
      <p>
        The string must contain <code>{'{ documentId }'}</code>, which will be replaced with the document ID from the
        document's reference.
      </p>
      <p>If you're using the Camunda Tasklist, this variable is automatically added to the context for you.</p>
      <p>
        For more details, see the{' '}
        <a href="https://docs.camunda.io" rel="noopener noreferrer" target="_blank">
          Camunda documentation
        </a>
      </p>
    </div>
  );

  return FeelTemplatingEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Document URL',
    feel: 'required',
    singleLine: true,
    setValue,
    variables,
    description,
    tooltip,
    validate,
  });
}

// helpers //////////

/**
 * @param {string|undefined} value
 * @returns {string|null}
 */
const validate = (value) => {
  if (typeof value !== 'string' || value.length === 0) {
    return 'The document reference is required.';
  }
};

const description = <>Define an API URL for downloading a document</>;
