import { CheckboxEntry, isCheckboxEntryEdited, SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';

import { DATETIME_SUBTYPES, DATE_DISALLOW_PAST_PATH, TIME_INTERVAL_PATH } from '@bpmn-io/form-js-viewer';

import { get } from 'min-dash';

export default function DateTimeConstraintsEntry(props) {
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

  const entries = [];

  if (subtype === DATETIME_SUBTYPES.TIME || subtype === DATETIME_SUBTYPES.DATETIME) {
    entries.push({
      id: id + '-timeInterval',
      component: TimeIntervalSelect,
      isEdited: isSelectEntryEdited,
      editField,
      field
    });
  }

  if (subtype === DATETIME_SUBTYPES.DATE || subtype === DATETIME_SUBTYPES.DATETIME) {
    entries.push({
      id: id + '-disallowPassedDates',
      component: DisallowPassedDates,
      isEdited: isCheckboxEntryEdited,
      editField,
      field
    });
  }

  return entries;
}

function DisallowPassedDates(props) {
  const {
    editField,
    field,
    id
  } = props;

  const path = DATE_DISALLOW_PAST_PATH;

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
    label: 'Disallow past dates',
    setValue
  });
}

function TimeIntervalSelect(props) {

  const {
    editField,
    field,
    id
  } = props;

  const timeIntervals = [ 1, 5, 10, 15, 30, 60 ];

  const getValue = (e) => get(field, TIME_INTERVAL_PATH);

  const setValue = (value) => editField(field, TIME_INTERVAL_PATH, parseInt(value));

  const getTimeIntervals = () => {

    return timeIntervals.map((timeInterval) => ({
      label: timeInterval === 60 ? '1h' : (timeInterval + 'm'),
      value: timeInterval
    }));
  };

  return SelectEntry({
    label: 'Time interval',
    element: field,
    getOptions: getTimeIntervals,
    getValue,
    id,
    setValue
  });
}