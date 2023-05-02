import { useCallback, useContext, useMemo, useState, useEffect } from 'preact/hooks';

import classNames from 'classnames';

import { set } from 'min-dash';

import { FormContext } from '../../context';

import { DATETIME_SUBTYPES, DATETIME_SUBTYPE_PATH, DATE_LABEL_PATH } from '../../../util/constants/DatetimeConstants';

import Description from '../Description';
import Errors from '../Errors';
import Datepicker from './parts/Datepicker';
import Timepicker from './parts/Timepicker';

import { formFieldClasses, prefixId } from '../Util';
import { sanitizeDateTimePickerValue } from '../util/sanitizerUtil';
import { parseIsoTime, serializeDate, serializeDateTime, serializeTime } from '../util/dateTimeUtil';

const type = 'datetime';

export default function Datetime(props) {
  const {
    disabled,
    errors = [],
    field,
    onChange,
    readonly,
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

  const getNullDateTime = () => ({ date: new Date(Date.parse(null)), time: null });

  const [ dateTime, setDateTime ] = useState(getNullDateTime());
  const [ dateTimeUpdateRequest, setDateTimeUpdateRequest ] = useState(null);

  const isValidDate = (date) => date && !isNaN(date.getTime());
  const isValidTime = (time) => !isNaN(parseInt(time));

  const useDatePicker = useMemo(() => subtype === DATETIME_SUBTYPES.DATE || subtype === DATETIME_SUBTYPES.DATETIME, [ subtype ]);
  const useTimePicker = useMemo(() => subtype === DATETIME_SUBTYPES.TIME || subtype === DATETIME_SUBTYPES.DATETIME, [ subtype ]);

  useEffect(() => {

    let { date, time } = getNullDateTime();

    switch (subtype) {
    case DATETIME_SUBTYPES.DATE: {
      date = new Date(Date.parse(value));
      break;
    }
    case DATETIME_SUBTYPES.TIME: {
      time = parseIsoTime(value);
      break;
    }
    case DATETIME_SUBTYPES.DATETIME: {
      date = new Date(Date.parse(value));
      time = isValidDate(date) ? 60 * date.getHours() + date.getMinutes() : null;
      break;
    }}

    setDateTime({ date, time });

  }, [ subtype, value ]);

  const computeAndSetState = useCallback(({ date, time }) => {

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

  useEffect(() => {
    if (dateTimeUpdateRequest) {
      if (dateTimeUpdateRequest.refreshOnly) {
        computeAndSetState(dateTime);
      }
      else {
        const newDateTime = { ...dateTime, ...dateTimeUpdateRequest };
        setDateTime(newDateTime);
        computeAndSetState(newDateTime);
      }
      setDateTimeUpdateRequest(null);
    }
  }, [ computeAndSetState, dateTime, dateTimeUpdateRequest ]);

  useEffect(() => {
    setDateTimeUpdateRequest({ refreshOnly: true });
  }, [ timeSerializingFormat ]);

  const allErrors = useMemo(() => {
    if (required || subtype !== DATETIME_SUBTYPES.DATETIME) return errors;
    const isOnlyOneFieldSet = (isValidDate(dateTime.date) && !isValidTime(dateTime.time)) || (!isValidDate(dateTime.date) && isValidTime(dateTime.time));
    return isOnlyOneFieldSet ? [ 'Date and time must both be entered.', ...errors ] : errors;
  }, [ required, subtype, dateTime, errors ]);

  const setDate = useCallback((date) => {
    setDateTimeUpdateRequest((prev) => (prev ? { ...prev, date } : { date }));
  }, []);

  const setTime = useCallback((time) => {
    setDateTimeUpdateRequest((prev) => (prev ? { ...prev, time } : { time }));
  }, []);

  const errorMessageId = allErrors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;

  const datePickerProps = {
    id,
    label: dateLabel,
    collapseLabelOnEmpty: !timeLabel,
    formId,
    required,
    disabled,
    disallowPassedDates,
    date: dateTime.date,
    readonly,
    setDate,
    'aria-describedby': errorMessageId
  };
  const timePickerProps = {
    id,
    label: timeLabel,
    collapseLabelOnEmpty: !dateLabel,
    formId,
    required,
    disabled,
    readonly,
    use24h,
    timeInterval,
    time: dateTime.time,
    setTime,
    'aria-describedby': errorMessageId
  };

  return <div class={ formFieldClasses(type, { errors: allErrors, disabled, readonly }) }>
    <div class={ classNames('fjs-vertical-group') }>
      { useDatePicker && <Datepicker { ...datePickerProps } /> }
      { useTimePicker && useDatePicker && <div class="fjs-datetime-separator" /> }
      { useTimePicker && <Timepicker { ...timePickerProps } /> }
    </div>
    <Description description={ description } />
    <Errors errors={ allErrors } id={ errorMessageId } />
  </div>;
}

Datetime.config = {
  type,
  keyed: true,
  label: 'Date time',
  group: 'basic-input',
  emptyValue: null,
  sanitizeValue: sanitizeDateTimePickerValue,
  create: (options = {}) => {
    const defaults = {};
    set(defaults, DATETIME_SUBTYPE_PATH, DATETIME_SUBTYPES.DATE);
    set(defaults, DATE_LABEL_PATH, 'Date');

    return { ...defaults, ...options };
  }
};
