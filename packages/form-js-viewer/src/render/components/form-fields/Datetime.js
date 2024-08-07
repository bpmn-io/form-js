import { useCallback, useContext, useMemo, useState, useEffect, useRef } from 'preact/hooks';

import classNames from 'classnames';

import { set } from 'min-dash';

import { FormContext } from '../../context';

import { DATETIME_SUBTYPES, DATETIME_SUBTYPE_PATH, DATE_LABEL_PATH } from '../../../util/constants/DatetimeConstants';

import { Description } from '../Description';
import { Errors } from '../Errors';
import { Datepicker } from './parts/Datepicker';
import { Timepicker } from './parts/Timepicker';
import { useService } from '../../hooks';

import { formFieldClasses, prefixId } from '../Util';
import { sanitizeDateTimePickerValue } from '../util/sanitizerUtil';
import {
  parseIsoTime,
  serializeDate,
  serializeDateTime,
  serializeTime,
  getNullDateTime,
  isValidDate,
  isValidTime,
} from '../util/dateTimeUtil';

const type = 'datetime';

export function Datetime(props) {
  const { disabled, errors = [], domId, onBlur, onFocus, field, onChange, readonly, value = '' } = props;

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
    timeSerializingFormat,
  } = field;

  const { required } = validate;
  const { formId } = useContext(FormContext);
  const dateTimeGroupRef = useRef();

  const [dateTime, setDateTime] = useState(getNullDateTime());
  const [dateTimeUpdateRequest, setDateTimeUpdateRequest] = useState(null);

  const useDatePicker = useMemo(
    () => subtype === DATETIME_SUBTYPES.DATE || subtype === DATETIME_SUBTYPES.DATETIME,
    [subtype],
  );
  const useTimePicker = useMemo(
    () => subtype === DATETIME_SUBTYPES.TIME || subtype === DATETIME_SUBTYPES.DATETIME,
    [subtype],
  );

  const onDateTimeBlur = useCallback(
    (e) => {
      if (e.relatedTarget && dateTimeGroupRef.current.contains(e.relatedTarget)) {
        return;
      }

      onBlur && onBlur();
    },
    [onBlur],
  );

  const onDateTimeFocus = useCallback(
    (e) => {
      if (e.relatedTarget && dateTimeGroupRef.current.contains(e.relatedTarget)) {
        return;
      }

      onFocus && onFocus();
    },
    [onFocus],
  );

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
      }
    }

    setDateTime({ date, time });
  }, [subtype, value]);

  const computeAndSetState = useCallback(
    ({ date, time }) => {
      let newDateTimeValue = null;

      if (subtype === DATETIME_SUBTYPES.DATE && isValidDate(date)) {
        newDateTimeValue = serializeDate(date);
      } else if (subtype === DATETIME_SUBTYPES.TIME && isValidTime(time)) {
        newDateTimeValue = serializeTime(time, new Date().getTimezoneOffset(), timeSerializingFormat);
      } else if (subtype === DATETIME_SUBTYPES.DATETIME && isValidDate(date) && isValidTime(time)) {
        newDateTimeValue = serializeDateTime(date, time, timeSerializingFormat);
      }

      if (value === newDateTimeValue) {
        return;
      }

      onChange({ value: newDateTimeValue, field });
    },
    [value, field, onChange, subtype, timeSerializingFormat],
  );

  useEffect(() => {
    if (dateTimeUpdateRequest) {
      if (dateTimeUpdateRequest.refreshOnly) {
        computeAndSetState(dateTime);
      } else {
        const newDateTime = { ...dateTime, ...dateTimeUpdateRequest };
        setDateTime(newDateTime);
        computeAndSetState(newDateTime);
      }
      setDateTimeUpdateRequest(null);
    }
  }, [computeAndSetState, dateTime, dateTimeUpdateRequest]);

  useEffect(() => {
    setDateTimeUpdateRequest({ refreshOnly: true });
  }, [timeSerializingFormat]);

  const allErrors = useMemo(() => {
    if (required || subtype !== DATETIME_SUBTYPES.DATETIME) return errors;
    const isOnlyOneFieldSet =
      (isValidDate(dateTime.date) && !isValidTime(dateTime.time)) ||
      (!isValidDate(dateTime.date) && isValidTime(dateTime.time));
    return isOnlyOneFieldSet ? ['Date and time must both be entered.', ...errors] : errors;
  }, [required, subtype, dateTime, errors]);

  const setDate = useCallback((date) => {
    setDateTimeUpdateRequest((prev) => (prev ? { ...prev, date } : { date }));
  }, []);

  const setTime = useCallback((time) => {
    setDateTimeUpdateRequest((prev) => (prev ? { ...prev, time } : { time }));
  }, []);

  const errorMessageId = allErrors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;
  const descriptionId = `${prefixId(id, formId)}-description`;

  const datePickerProps = {
    label: dateLabel,
    collapseLabelOnEmpty: !timeLabel,
    onDateTimeBlur,
    onDateTimeFocus,
    domId: `${domId}-date`,
    required,
    disabled,
    disallowPassedDates,
    date: dateTime.date,
    readonly,
    setDate,
    'aria-describedby': [descriptionId, errorMessageId].join(' '),
  };

  const timePickerProps = {
    label: timeLabel,
    collapseLabelOnEmpty: !dateLabel,
    onDateTimeBlur,
    onDateTimeFocus,
    domId: `${domId}-time`,
    required,
    disabled,
    readonly,
    use24h,
    timeInterval,
    time: dateTime.time,
    setTime,
    'aria-describedby': [descriptionId, errorMessageId].join(' '),
  };
  const form = useService('form');
  const { schema } = form._getState();

  const direction = schema?.direction || 'ltr'; // Fetch the direction value from the form schema

  return (
    <div class={formFieldClasses(type, { errors: allErrors, disabled, readonly })} style={{ direction: direction }}>
      <div class={classNames('fjs-vertical-group')} ref={dateTimeGroupRef}>
        {useDatePicker && <Datepicker {...datePickerProps} />}
        {useTimePicker && useDatePicker && <div class="fjs-datetime-separator" />}
        {useTimePicker && <Timepicker {...timePickerProps} />}
      </div>
      <Description id={descriptionId} description={description} />
      <Errors errors={allErrors} id={errorMessageId} />
    </div>
  );
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
  },
};
