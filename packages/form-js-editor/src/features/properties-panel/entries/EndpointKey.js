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
      <p>A context key that will be evaluated to a string containing the API endpoint for downloading a document.</p>
      <p>
        This string must contain <br />
        the <code>{'{ documentId }'}</code> placeholder which will be replaced with the document ID from the documents
        metadata.
      </p>
      <p>
        If you're using the Camunda Tasklist UI this variable will be automatically injected in the context for you.
      </p>
      <p>
        Find more details in the{' '}
        <a href="https://docs.camunda.io" rel="noopener noreferrer" target="_blank">
          Camunda documentation
        </a>
        .
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
