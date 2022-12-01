import { useCallback, useContext, useMemo, useState } from 'preact/hooks';

import classNames from 'classnames';

import { set } from 'min-dash';

import { FormContext } from '../../context';

import { DATETIME_SUBTYPES, DATETIME_SUBTYPE_PATH, DATE_LABEL_PATH } from '../../../util/constants/DatetimeConstants';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';
import Datepicker from './parts/Datepicker';
import Timepicker from './parts/Timepicker';

import { formFieldClasses, prefixId } from '../Util';
import { sanitizeDateTimePickerValue } from '../util/sanitizerUtil';
import { isDateTimeInputInformationSufficient, parseIsoTime, serializeDate, serializeDateTime, serializeTime } from '../util/dateTimeUtil';

const type = 'datetime';

export default function Datetime(props) {
  const {
    disabled,
    errors = [],
    field,
    onChange,
    value = ''
  } = props;

  const {
    description,
    id,
    dateLabel,
    timeLabel,
    validate = {},
    subtype,
    use24h,
    disallowPassedDates,
    timeInterval,
    timeSerializingFormat
  } = field;

  const { required } = validate;
  const { formId } = useContext(FormContext);

  const getNullDate = () => new Date(Date.parse(null));

  const [ dateCache, setDateCache ] = useState(getNullDate());
  const [ timeCache, setTimeCache ] = useState(null);

  const isValidDate = (date) => date && !isNaN(date.getTime());
  const isValidTime = (time) => !isNaN(parseInt(time));

  const useDatePicker = useMemo(() => subtype === DATETIME_SUBTYPES.DATE || subtype === DATETIME_SUBTYPES.DATETIME, [ subtype ]);
  const useTimePicker = useMemo(() => subtype === DATETIME_SUBTYPES.TIME || subtype === DATETIME_SUBTYPES.DATETIME, [ subtype ]);

  const [ date, time ] = useMemo(() => {
    switch (subtype) {
    case DATETIME_SUBTYPES.DATE:
      return [ new Date(Date.parse(value)), null ];
    case DATETIME_SUBTYPES.TIME:
      return [ null, parseIsoTime(value) ];
    case DATETIME_SUBTYPES.DATETIME: {

      // ensure enough information is provided in the input, as Date.parse() is way too forgiving
      const isInputSufficient = isDateTimeInputInformationSufficient(value);

      let date, time;

      if (isInputSufficient) {
        date = new Date(Date.parse(value));
        time = isValidDate(date) ? 60 * date.getHours() + date.getMinutes() : null;
      }
      else {
        date = getNullDate();
        time = null;
      }

      setDateCache(date);
      setTimeCache(time);

      return [ date, time ];
    }}
  }, [ subtype, value ]);

  const evaluate = useCallback(({ time, date }) => {

    let newDateTimeValue = null;

    if (subtype === DATETIME_SUBTYPES.DATE && isValidDate(date)) {
      newDateTimeValue = serializeDate(date);
    }
    else if (subtype === DATETIME_SUBTYPES.TIME && isValidTime(time)) {
      newDateTimeValue = serializeTime(time, new Date().getTimezoneOffset(), timeSerializingFormat);
    }
    else if (subtype === DATETIME_SUBTYPES.DATETIME && isValidDate(date) && isValidTime(time)) {
      newDateTimeValue = serializeDateTime(date, time, timeSerializingFormat);
    }

    onChange({ value: newDateTimeValue, field });

  }, [ field, onChange, subtype, timeSerializingFormat ]);

  const setDate = useCallback((date) => {
    evaluate({ date, time: timeCache });
    setDateCache(date);
  }, [ evaluate, timeCache ]);

  const setTime = useCallback((time) => {
    evaluate({ time, date: dateCache });
    setTimeCache(time);
  }, [ evaluate, dateCache ]);

  const allErrors = useMemo(() => {

    if (required || subtype !== DATETIME_SUBTYPES.DATETIME) return errors;

    const isOnlyOneFieldSet = (isValidDate(dateCache) && !isValidTime(timeCache)) || (isValidDate(dateCache) && !isValidTime(timeCache));

    return isOnlyOneFieldSet ? [ 'Date and time must both be entered.', ...errors ] : errors;

  }, [ required, subtype, dateCache, timeCache, errors ]);

  const datePickerProps = {
    id,
    label: dateLabel,
    formId,
    required,
    disabled,
    disallowPassedDates,
    date,
    setDate
  };

  const timePickerProps = {
    id,
    label: timeLabel,
    formId,
    required,
    disabled,
    use24h,
    timeInterval,
    time,
    setTime
  };

  return <div class={ formFieldClasses(type, allErrors) }>
    <div class={ classNames('fjs-vertical-group') }>
      { useDatePicker && <Datepicker { ...datePickerProps } /> }
      { useTimePicker && useDatePicker && <div class="fjs-datetime-separator" /> }
      { useTimePicker && <Timepicker { ...timePickerProps } /> }
    </div>
    <Description description={ description } />
    <Errors errors={ allErrors } />
  </div>;
}

Datetime.create = function(options = {}) {
  const newOptions = { ...options };
  set(newOptions, DATETIME_SUBTYPE_PATH, DATETIME_SUBTYPES.DATE);
  set(newOptions, DATE_LABEL_PATH, 'Date');
  return newOptions;
};

Datetime.type = type;
Datetime.keyed = true;
Datetime.emptyValue = null;
Datetime.sanitizeValue = sanitizeDateTimePickerValue;