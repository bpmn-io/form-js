import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';

import { DATETIME_SUBTYPES, TIME_SERIALISING_FORMATS, TIME_SERIALISINGFORMAT_LABELS, TIME_SERIALISING_FORMAT_PATH } from '@bpmn-io/form-js-viewer';

import { get } from 'min-dash';

export default function DateTimeFormatEntry(props) {
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

  const entries = [];

  if (subtype === DATETIME_SUBTYPES.TIME || subtype === DATETIME_SUBTYPES.DATETIME) {
    entries.push({
      id: 'time-format',
      component: TimeFormatSelect,
      isEdited: isSelectEntryEdited,
      editField,
      field
    });
  }

  return entries;
}

function TimeFormatSelect(props) {

  const {
    editField,
    field,
    id
  } = props;

  const getValue = (e) => get(field, TIME_SERIALISING_FORMAT_PATH);

  const setValue = (value) => editField(field, TIME_SERIALISING_FORMAT_PATH, value);

  const getTimeSerialisingFormats = () => {

    return Object.values(TIME_SERIALISING_FORMATS).map((format) => ({
      label: TIME_SERIALISINGFORMAT_LABELS[format],
      value: format
    }));
  };

  return SelectEntry({
    label: 'Time format',
    element: field,
    getOptions: getTimeSerialisingFormats,
    getValue,
    id,
    setValue
  });
}