import { get } from 'min-dash';
import { useService, useDirection } from '../hooks';
import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';

export function DirectionEntry(props) {
  const { editField, field } = props;

  const entries = [
    {
      id: 'direction',
      component: Direction,
      editField,
      field,
      isEdited: isSelectEntryEdited,
      isDefaultVisible: (field) => field.type === 'default',
    },
  ];

  return entries;
}

function Direction(props) {
  const { editField, field } = props;
  const { setDirection } = useDirection();

  const debounce = useService('debounce');

  const path = ['direction'];

  const getValue = () => {
    const value = get(field, path, 'ltr');
    return value;
  };

  const setValue = (value) => {
    setDirection(value);
    return editField(field, path, value || 'ltr');
  };

  const getOptions = () => [
    {
      label: 'Left to Right',
      value: 'ltr',
    },
    {
      label: 'Right to Left',
      value: 'rtl',
    },
  ];

  return SelectEntry({
    debounce,
    element: field,
    getValue,
    id: 'direction',
    label: 'Direction',
    setValue,
    getOptions,
  });
}
