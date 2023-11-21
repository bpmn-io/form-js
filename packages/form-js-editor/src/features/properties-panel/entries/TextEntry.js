import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

import { useMemo } from 'preact/hooks';


export default function TextEntry(props) {
  const {
    editField,
    field
  } = props;

  const entries = [
    {
      id: 'text',
      component: Text,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited,
      isDefaultVisible: (field) => field.type === 'text'
    }
  ];

  return entries;
}

function Text(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map(name => ({ name }));

  const path = [ 'text' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value || '');
  };

  const description = useMemo(() => <>Supports markdown and templating. <a href="https://docs.camunda.io/docs/components/modeler/forms/form-element-library/forms-element-library-text/" target="_blank">Learn more</a></>, []);

  return FeelTemplatingEntry({
    debounce,
    description,
    element: field,
    getValue,
    id,
    label: 'Text',
    hostLanguage: 'markdown',
    setValue,
    variables
  });
}