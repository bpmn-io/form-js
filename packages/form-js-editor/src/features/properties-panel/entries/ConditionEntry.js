import { FeelEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';
import { get } from 'min-dash';

import { getSchemaVariables } from '@bpmn-io/form-js-viewer';

import { useService } from '../hooks';



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

  const path = [ 'condition', 'expression' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
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

  const variables = getSchemaVariables(schema);

  return variables.map(key => ({ name: key }));
}
