import { get } from 'min-dash';
import { useService } from '../hooks';
import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useDirection } from '../../../../../form-js-viewer/src/render/context/DirectionContext';

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
  const { editField, field, id } = props;
  const { setDirection } = useDirection(); // Get the context

  const debounce = useService('debounce');

  const path = ['direction'];

  const getValue = () => {
    const value = get(field, path, 'ltr');
    console.log('DirectionEntry getValue:', value); // Log getValue
    return value;
  };

  const setValue = (value) => {
    console.log('DirectionEntry setValue:', value); // Log setValue
    setDirection(value); // Update context
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
