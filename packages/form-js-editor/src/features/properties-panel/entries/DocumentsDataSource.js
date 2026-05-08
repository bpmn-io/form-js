import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';
import { useCallback } from 'preact/hooks';

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
  const translate = useService('translate');

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
      <p>{translate('Document reference tooltip1')}</p>
      <p>{translate('Document reference tooltip2')}</p>
      <p>{translate('Document reference tooltip3')}</p>
      <pre>
        <code>{schema}</code>
      </pre>
      <p>{translate('Document reference tooltip4')}</p>
      <p>
        {translate('Document reference tooltip5')}{' '}
        <a
          href="https://docs.camunda.io/docs/components/modeler/forms/form-element-library/forms-element-library-document-preview/"
          target="_blank"
          rel="noopener noreferrer">
          {translate('Document reference tooltip6')}
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
    label: translate('Document reference'),
    feel: 'required',
    singleLine: true,
    setValue,
    variables,
    tooltip,
    validate: useCallback((value) => validate(value, translate), [translate]),
  });
}

// helpers //////////

/**
 * @param {string|undefined} value
 * @param {function} translate
 * @returns {string|null}
 */
const validate = (value, translate) => {
  if (typeof value !== 'string' || value.length === 0) {
    return translate('The document data source is required.');
  }
};
