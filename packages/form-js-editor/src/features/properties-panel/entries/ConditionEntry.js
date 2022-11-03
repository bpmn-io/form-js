import { useRef } from 'preact/hooks';
import { FeelEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';
import { get } from 'min-dash';

import { getSchemaVariables } from '@bpmn-io/form-js-viewer';

import { useService } from '../hooks';
import { usePrevious } from '../../../render/hooks';



export function ConditionEntry(props) {
  const {
    editField,
    field
  } = props;

  return [
    {
      id: 'condition',
      component: Condition,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited
    }
  ];
}


function Condition(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables();

  const path = [ 'condition' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, { condition: value });
  };

  return FeelEntry({
    debounce,
    description: 'Condition under which the field is displayed',
    element: field,
    feel: 'required',
    getValue,
    id,
    label: 'Show if',
    setValue,
    variables
  });
}

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
