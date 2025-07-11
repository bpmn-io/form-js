import { get } from 'min-dash';
import { ToggleSwitchEntry, isToggleSwitchEntryEdited } from '@bpmn-io/properties-panel';
import { isTrueDefaultToggleSwitchEntryEdited } from '../../Util';

export function simpleBoolEntryFactory(options) {
  const { id, label, description, path, props, getValue, setValue, isDefaultVisible, isTrueDefault = false } = options;

  const { editField, field } = props;

  return {
    id,
    label,
    path,
    field,
    editField,
    description,
    component: SimpleBoolComponent,
    isEdited: isTrueDefault ? isTrueDefaultToggleSwitchEntryEdited : isToggleSwitchEntryEdited,
    isDefaultVisible,
    getValue,
    setValue,
  };
}

const SimpleBoolComponent = (props) => {
  const {
    id,
    label,
    path,
    field,
    editField,
    getValue = () => get(field, path, ''),
    setValue = (value) => editField(field, path, value || false),
    description,
  } = props;

  return ToggleSwitchEntry({
    element: field,
    getValue,
    id,
    label,
    setValue,
    inline: true,
    description,
  });
};
