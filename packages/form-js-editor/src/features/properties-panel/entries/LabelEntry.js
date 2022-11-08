import { get } from 'min-dash';

import { useRef } from 'preact/hooks';

import { INPUTS } from '../Util';

import { getSchemaVariables } from '@bpmn-io/form-js-viewer';

import { useService } from '../hooks';
import { usePrevious } from '../../../render/hooks';

import { FeelEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';


export default function LabelEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  const entries = [];

  if (INPUTS.includes(type) || type === 'button') {
    entries.push({
      id: 'label',
      component: Label,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited
    });
  }

  return entries;
}

function Label(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables();

  const path = [ 'label' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: 'Field label',
    setValue,
    variables
  });
}

// todo(pinussilvestrus): move this to something reusable
function useVariables() {
  const form = useService('formEditor');
  const schema = form.getSchema();

  const variablesRef = useRef([]);

  const variables = getSchemaVariables(schema);
  const previousVariables = usePrevious(variables) || [];

  const variablesChanged = !areEqual(variables, previousVariables);

  if (variablesChanged) {
    variablesRef.current = variables.map(key => ({ name: key }));
  }

  return variablesRef.current;
}

function areEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}