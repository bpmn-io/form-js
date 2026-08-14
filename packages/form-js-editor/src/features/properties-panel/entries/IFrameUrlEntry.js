import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

import { useCallback } from 'preact/hooks';

const HTTPS_PATTERN = /^(https):\/\/*/i;

export function IFrameUrlEntry(props) {
  const { editField, field } = props;

  const entries = [];
  entries.push({
    id: 'url',
    component: Url,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'iframe',
  });

  return entries;
}

function Url(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');
  const translate = useService('translate');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['url'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: translate('URL'),
    setValue,
    singleLine: true,
    tooltip: getTooltip(translate),
    validate: useCallback((value) => validate(value, translate), [translate]),
    variables,
  });
}

// helper //////////////////////

function getTooltip(translate) {
  return (
    <>
      <p>
        {translate(
          'Enter a HTTPS URL to a source or populate it dynamically via a template or an expression (e.g., to pass a value from the variable).',
        )}
      </p>
      <p>{translate('Please make sure that the URL is safe as it might impose security risks.')}</p>
      <p>
        {translate('Not all external sources can be displayed in the iFrame. Read more about it in the')}{' '}
        <a
          target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options"
          rel="noreferrer">
          {translate('X-FRAME-OPTIONS documentation')}
        </a>
        .
      </p>
    </>
  );
}

/**
 * @param {string|void} value
 * @param {function} translate
 * @returns {string|null}
 */
const validate = (value, translate) => {
  if (!value || value.startsWith('=')) {
    return;
  }

  if (!HTTPS_PATTERN.test(value)) {
    return translate('For security reasons the URL must start with "https".');
  }
};
