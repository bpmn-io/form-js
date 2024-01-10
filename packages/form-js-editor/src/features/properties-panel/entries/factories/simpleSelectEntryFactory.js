import { get } from 'min-dash';
import { isSelectEntryEdited, SelectEntry } from '@bpmn-io/properties-panel';

export function simpleSelectEntryFactory(options) {
  const {
    id,
    label,
    path,
    props,
    optionsArray
  } = options;

  const {
    editField,
    field
  } = props;

  return {
    id,
    label,
    path,
    field,
    editField,
    optionsArray,
    component: SimpleSelectComponent,
    isEdited: isSelectEntryEdited,
  };
}

const SimpleSelectComponent = (props) => {
  const {
    id,
    label,
    path,
    field,
    editField,
    optionsArray
  } = props;

  const getValue = () => get(field, path, '');

  const setValue = (value) => editField(field, path, value);

  const getOptions = () => optionsArray;

  return SelectEntry({
    label,
    element: field,
    getOptions,
    getValue,
    id,
    setValue
  });
};
