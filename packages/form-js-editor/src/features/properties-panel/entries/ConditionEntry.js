import { useMemo } from 'preact/hooks';
import { FeelEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';
import { get } from 'min-dash';

import {
  useService,
  useVariables
} from '../hooks';


export function ConditionEntry(props) {
  const {
    editField,
    field
  } = props;

  return [
    {
      id: 'conditional-hide',
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

  const variablesList = useVariables();

  // keep stable reference until https://github.com/bpmn-io/properties-panel/issues/196 is fixed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const variables = useMemo(() => variablesList.map(name => ({ name })), variablesList);

  const path = [ 'conditional', 'hide' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    if (!value) {
      return editField(field, 'conditional', undefined);
    }

    return editField(field, 'conditional', { hide: value });
  };

  return FeelEntry({
    debounce,
    description: 'Condition under which the field is hidden',
    element: field,
    feel: 'required',
    getValue,
    id,
    label: 'Hide if',
    setValue,
    variables
  });
}
