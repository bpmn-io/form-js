import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';

import { DATETIME_SUBTYPES, DATETIME_SUBTYPES_LABELS, DATETIME_SUBTYPE_PATH } from '@bpmn-io/form-js-viewer';

import { get } from 'min-dash';

export default function DateTimeEntry(props) {
  const {
    editField,
    field,
    id
  } = props;

  const {
    type
  } = field;

  if (type !== 'datetime') {
    return [];
  }

  const entries = [
    {
      id: id + '-subtype-select',
      component: DateTimeSubtypeSelect,
      isEdited: isSelectEntryEdited,
      editField,
      field
    }
  ];

  return entries;
}

function DateTimeSubtypeSelect(props) {

  const {
    editField,
    field,
    id
  } = props;

  const getValue = (e) => get(field, DATETIME_SUBTYPE_PATH);

  const setValue = (value) => editField(field, DATETIME_SUBTYPE_PATH, value);

  const getDatetimeSubtypes = () => {

    return Object.values(DATETIME_SUBTYPES).map((subtype) => ({
      label: DATETIME_SUBTYPES_LABELS[subtype],
      value: subtype
    }));
  };

  return SelectEntry({
    label: 'Subtype',
    element: field,
    getOptions: getDatetimeSubtypes,
    getValue,
    id,
    setValue
  });
}

