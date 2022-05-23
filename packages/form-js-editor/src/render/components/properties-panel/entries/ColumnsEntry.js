import { Default } from '@bpmn-io/form-js-viewer';

import { useService } from '../../../hooks';

import { NumberFieldEntry, isNumberFieldEntryEdited } from '@bpmn-io/properties-panel';


export default function ColumnsEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  const entries = [];

  if (type === 'columns') {
    entries.push({
      id: 'columns',
      component: Columns,
      editField: editField,
      field: field,
      isEdited: isNumberFieldEntryEdited
    });
  }

  return entries;
}

function Columns(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const getValue = () => {
    return field.components.length;
  };

  const setValue = (value) => {
    let components = field.components.slice();

    if (value > components.length) {
      while (value > components.length) {
        components.push(Default.create({ _parent: field.id }));
      }
    } else {
      components = components.slice(0, value);
    }

    editField(field, 'components', components);
  };

  return NumberFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Columns',
    setValue
  });
}