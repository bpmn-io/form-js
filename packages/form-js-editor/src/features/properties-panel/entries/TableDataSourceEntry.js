import { get, isString } from 'min-dash';

import { hasIntegerPathSegment, isValidDotPath } from '../Util';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

import { useCallback } from 'preact/hooks';

export function TableDataSourceEntry(props) {
  const { editField, field } = props;

  const entries = [];
  entries.push({
    id: 'dataSource',
    component: Source,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'table',
  });

  return entries;
}

function Source(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');
  const translate = useService('translate');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['dataSource'];

  const getValue = () => {
    return get(field, path, field.id);
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    description: translate('Specify the source from which to populate the table'),
    element: field,
    feel: 'required',
    getValue,
    id,
    label: translate('Data source'),
    tooltip: translate(
      'Enter a form input variable that contains the data for the table or define an expression to populate the data dynamically.',
    ),
    setValue,
    singleLine: true,
    variables,
    validate: useCallback((value) => validate(value, translate), [translate]),
  });
}

// helper ////////////////

/**
 * @param {string|void} value
 * @param translate
 * @returns {string|null}
 */
const validate = (value, translate) => {
  if (!isString(value) || value.length === 0) {
    return translate('Must not be empty.');
  }

  if (value.startsWith('=')) {
    return null;
  }

  if (!isValidDotPath(value)) {
    return translate('Must be a variable or a dot separated path.');
  }

  if (hasIntegerPathSegment(value)) {
    return translate('Must not contain numerical path segments.');
  }

  return null;
};
