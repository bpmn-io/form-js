import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

// import { simpleBoolEntryFactory } from './factories';
import { useMemo } from 'preact/hooks';


export default function TextEntry(props) {
  const {
    editField,

    /* getService, */
    field
  } = props;

  const {
    type
  } = field;

  // const templating = getService('templating');

  if (type !== 'text') {
    return [];
  }

  const entries = [
    {
      id: 'text',
      component: Text,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited
    }
  ];

  // todo: skipped to make the release without too much risk
  // if (templating.isTemplate(field.text)) {
  //   entries.push(simpleBoolEntryFactory({
  //     id: 'strict',
  //     path: [ 'strict' ],
  //     label: 'Strict templating',
  //     description: 'Enforces types to be correct',
  //     props
  //   }));
  // }

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
    return editField(field, path, value);
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