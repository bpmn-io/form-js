import { FeelEntry, isFeelEntryEdited, TextAreaEntry, isTextAreaEntryEdited, SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { get } from 'min-dash';
import { simpleRangeIntegerEntryFactory } from './factories';

import { useService, useVariables } from '../hooks';

export function JSFunctionEntry(props) {
  const {
    editField,
    field
  } = props;

  const entries = [
    {
      id: 'variable-mappings',
      component: FunctionParameters,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited,
      isDefaultVisible: (field) => field.type === 'script'
    },
    {
      id: 'function',
      component: FunctionDefinition,
      editField: editField,
      field: field,
      isEdited: isTextAreaEntryEdited,
      isDefaultVisible: (field) => field.type === 'script'
    },
    {
      id: 'computeOn',
      component: JSFunctionComputeOn,
      isEdited: isSelectEntryEdited,
      editField,
      field,
      isDefaultVisible: (field) => field.type === 'script'
    },
    simpleRangeIntegerEntryFactory({
      id: 'interval',
      label: 'Time interval (ms)',
      path: [ 'interval' ],
      min: 100,
      max: 60000,
      props,
      isDefaultVisible: (field) => field.type === 'script' && field.computeOn === 'interval'
    })
  ];

  return entries;
}

function FunctionParameters(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map(name => ({ name }));

  const path = [ 'functionParameters' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value || '');
  };

  const tooltip = <div>
    Functions parameters should be described as an object, e.g.:
    <pre><code>{`{
      name: user.name,
      age: user.age
    }`}</code></pre>
  </div>;

  return FeelEntry({
    debounce,
    feel: 'required',
    element: field,
    getValue,
    id,
    label: 'Function parameters',
    tooltip,
    description: 'Define the parameters to pass to the javascript function.',
    setValue,
    variables
  });
}

function FunctionDefinition(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const path = [ 'jsFunction' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    return editField(field, path, value || '');
  };

  const validate = (value) => {

    try {
      new Function(value);
    } catch (e) {
      return `Invalid syntax: ${e.message}`;
    }

    return null;
  };

  return TextAreaEntry({
    debounce,
    element: field,
    getValue,
    validate,
    description: 'Define the javascript function to execute.\nAccess the `data` object and use `setValue` to update the form state.',
    id,
    label: 'Javascript code',
    setValue
  });
}

function JSFunctionComputeOn(props) {
  const { editField, field, id } = props;

  const getValue = () => field.computeOn || '';

  const setValue = (value) => {
    editField(field, [ 'computeOn' ], value);
  };

  const getOptions = () => ([
    { value: 'load', label: 'Form load' },
    { value: 'change', label: 'Value change' },
    { value: 'interval', label: 'Time interval' }
  ]);

  return SelectEntry({
    id,
    label: 'Compute on',
    description: 'Define when to execute the function',
    getValue,
    setValue,
    getOptions
  });
}
