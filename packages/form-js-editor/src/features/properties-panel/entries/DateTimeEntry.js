import { CheckboxEntry, isCheckboxEntryEdited, SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';

import { DATETIME_SUBTYPES, DATETIME_SUBTYPES_LABELS, DATETIME_SUBTYPE_PATH, TIME_USE24H_PATH } from '@bpmn-io/form-js-viewer';

import { get } from 'min-dash';

export default function DateTimeEntry(props) {
  const {
    editField,
    field,
    id
  } = props;

  const {
    type,
    subtype
  } = field;

  if (type !== 'datetime') {
    return [];
  }

  const entries = [
    {
      id: id + '-subtype',
      component: DateTimeSubtypeSelect,
      isEdited: isSelectEntryEdited,
      editField,
      field
    }
  ];

  if (subtype === DATETIME_SUBTYPES.TIME || subtype === DATETIME_SUBTYPES.DATETIME) {

    entries.push({
      id: id + '-use24h',
      component: Use24h,
      isEdited: isCheckboxEntryEdited,
      editField,
      field
    });

  }

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

function Use24h(props) {
  const {
    editField,
    field,
    id
  } = props;

  const path = TIME_USE24H_PATH;

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return CheckboxEntry({
    element: field,
    getValue,
    id,
    label: 'Use 24h',
    setValue
  });
}
