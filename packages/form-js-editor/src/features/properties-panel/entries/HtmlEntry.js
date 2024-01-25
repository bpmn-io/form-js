import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

import { useMemo } from 'preact/hooks';


export function HtmlEntry(props) {
  const {
    editField,
    field
  } = props;

  const entries = [
    {
      id: 'content',
      component: Content,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited,
      isDefaultVisible: (field) => field.type === 'html'
    }
  ];

  return entries;
}

function Content(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map(name => ({ name }));

  const path = [ 'content' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value || '');
  };

  const validate = (value) => {

    // allow empty state
    if (value === undefined || value === null || value === '') { return null; }

    // allow expressions
    if (value.startsWith('=')) { return null; }

    // disallow style tags
    if (value.includes('<style')) { return 'Style tags may not be defined here, please use inline styling here.'; }
  };

  const description = useMemo(() => <>Supports HTML, inline styling, and templating. <a href="https://docs.camunda.io/docs/components/modeler/forms/form-element-library/forms-element-library-html/" target="_blank">Learn more</a></>, []);

  return FeelTemplatingEntry({
    debounce,
    description,
    element: field,
    getValue,
    id,
    label: 'Content',
    hostLanguage: 'html',
    validate,
    setValue,
    variables
  });
}