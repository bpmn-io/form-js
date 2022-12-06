import { CheckboxEntry, isCheckboxEntryEdited, SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';

import {
  DATETIME_SUBTYPES,
  DATETIME_SUBTYPES_LABELS,
  DATETIME_SUBTYPE_PATH,
  DATE_LABEL_PATH,
  DATE_DISALLOW_PAST_PATH,
  TIME_USE24H_PATH,
  TIME_LABEL_PATH,
  TIME_INTERVAL_PATH,
  TIME_SERIALISING_FORMAT_PATH,
  TIME_SERIALISING_FORMATS
} from '@bpmn-io/form-js-viewer';

import { get } from 'min-dash';

export default function DateTimeEntry(props) {
  const {
    editField,
    field
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
      id: 'subtype',
      component: DateTimeSubtypeSelect,
      isEdited: isSelectEntryEdited,
      editField,
      field
    }
  ];

  if (subtype === DATETIME_SUBTYPES.TIME || subtype === DATETIME_SUBTYPES.DATETIME) {

    entries.push({
      id: 'use24h',
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

  const clearTimeConfig = () => {
    const timeConfigPaths = [ TIME_LABEL_PATH, TIME_USE24H_PATH, TIME_INTERVAL_PATH, TIME_SERIALISING_FORMAT_PATH ];
    for (const path of timeConfigPaths) {
      editField(field, path, undefined);
    }
  };

  const initTimeConfig = () => {
    editField(field, TIME_LABEL_PATH, 'Time');
    editField(field, TIME_SERIALISING_FORMAT_PATH, TIME_SERIALISING_FORMATS.UTC_OFFSET);
    editField(field, TIME_INTERVAL_PATH, 15);
  };

  const clearDateConfig = () => {
    const dateConfigPaths = [ DATE_LABEL_PATH, DATE_DISALLOW_PAST_PATH ];
    for (const path of dateConfigPaths) {
      editField(field, path, undefined);
    }
  };

  const initDateConfig = () => {
    editField(field, DATE_LABEL_PATH, 'Date');
  };

  const setValue = (value) => {

    const oldValue = getValue();

    if (oldValue === value) return;

    if (value === DATETIME_SUBTYPES.DATE) {
      clearTimeConfig();
      oldValue === DATETIME_SUBTYPES.TIME && initDateConfig();
    }
    else if (value === DATETIME_SUBTYPES.TIME) {
      clearDateConfig();
      oldValue === DATETIME_SUBTYPES.DATE && initTimeConfig();
    }
    else if (value === DATETIME_SUBTYPES.DATETIME) {
      oldValue === DATETIME_SUBTYPES.DATE && initTimeConfig();
      oldValue === DATETIME_SUBTYPES.TIME && initDateConfig();
    }

    return editField(field, DATETIME_SUBTYPE_PATH, value);
  };

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
