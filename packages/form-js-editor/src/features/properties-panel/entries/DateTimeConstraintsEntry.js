import { CheckboxEntry, isCheckboxEntryEdited, SelectEntry } from '@bpmn-io/properties-panel';

import { DATETIME_SUBTYPES, DATE_DISALLOW_PAST_PATH, TIME_INTERVAL_PATH } from '@bpmn-io/form-js-viewer';

import { get } from 'min-dash';
import { isEditedFromDefaultFactory } from '../Util';
import { useService } from '../hooks';

const isTimeIntervalEdited = isEditedFromDefaultFactory('15');

export function DateTimeConstraintsEntry(props) {
  const { editField, field, id } = props;

  function isDefaultVisible(subtypes) {
    return (field) => {
      if (field.type !== 'datetime') {
        return false;
      }

      return subtypes.includes(field.subtype);
    };
  }

  const entries = [];

  entries.push({
    id: id + '-timeInterval',
    component: TimeIntervalSelect,
    isEdited: isTimeIntervalEdited,
    editField,
    field,
    isDefaultVisible: isDefaultVisible([DATETIME_SUBTYPES.TIME, DATETIME_SUBTYPES.DATETIME]),
  });

  entries.push({
    id: id + '-disallowPassedDates',
    component: DisallowPassedDates,
    isEdited: isCheckboxEntryEdited,
    editField,
    field,
    isDefaultVisible: isDefaultVisible([DATETIME_SUBTYPES.DATE, DATETIME_SUBTYPES.DATETIME]),
  });

  return entries;
}

function DisallowPassedDates(props) {
  const { editField, field, id } = props;

  const path = DATE_DISALLOW_PAST_PATH;
  const translate = useService('translate');

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
    label: translate('Disallow past dates'),
    setValue,
  });
}

function TimeIntervalSelect(props) {
  const { editField, field, id } = props;

  const timeIntervals = [1, 5, 10, 15, 30, 60];

  const translate = useService('translate');

  const getValue = (e) => get(field, TIME_INTERVAL_PATH);

  const setValue = (value) => editField(field, TIME_INTERVAL_PATH, parseInt(value));

  const getTimeIntervals = () => {
    return timeIntervals.map((timeInterval) => ({
      label: timeInterval === 60 ? '1h' : timeInterval + 'm',
      value: timeInterval,
    }));
  };

  return SelectEntry({
    label: translate('Time interval'),
    element: field,
    getOptions: getTimeIntervals,
    getValue,
    id,
    setValue,
  });
}
