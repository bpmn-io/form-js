import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function DocumentsDataSourceEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'dataSource',
    component: DocumentsDataSource,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'documentPreview',
  });

  return entries;
}

function DocumentsDataSource(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['dataSource'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  const schema = `[
  {
    "documentId": "u123",
    "endpoint": "https://api.example.com/documents/u123",
    "metadata": {
      "fileName": "Document.pdf",
      "contentType": "application/pdf"
    }
  }
]`;

  const tooltip = (
    <div>
      <p>A source is a JSON object containing metadata for a document or an array of documents.</p>
      <p>Each entry must include a document ID, name, and MIME type.</p>
      <p>Additional details are optional. The expected format is as follows:</p>
      <pre>
        <code>{schema}</code>
      </pre>
      <p>
        When using Camunda Tasklist UI, additional document reference attributes are automatically handled. Modifying
        the document reference may affect the document preview functionality.
      </p>
      <p>
        Learn more in our{' '}
        <a
          href="https://docs.camunda.io/docs/8.7/components/modeler/forms/form-element-library/forms-element-library-document-preview/"
          target="_blank"
          rel="noopener noreferrer">
          documentation
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
    label: 'Document reference',
    feel: 'required',
    singleLine: true,
    setValue,
    variables,
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
    return 'The document data source is required.';
  }
};
