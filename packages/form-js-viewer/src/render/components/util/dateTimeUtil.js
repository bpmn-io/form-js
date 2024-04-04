import { isNumber } from 'min-dash';
import { MINUTES_IN_DAY, TIME_SERIALISING_FORMATS } from '../../../util/constants/DatetimeConstants';

export const ENTER_KEYDOWN_EVENT = new KeyboardEvent('keydown', {
  code: 'Enter',
  key: 'Enter',
  charCode: 13,
  keyCode: 13,
  bubbles: true
});

export function focusRelevantFlatpickerDay(flatpickrInstance) {

  if (!flatpickrInstance) return;

  !flatpickrInstance.isOpen && flatpickrInstance.open();

  const container = flatpickrInstance.calendarContainer;
  const dayToFocus =
    container.querySelector('.flatpickr-day.selected') ||
    container.querySelector('.flatpickr-day.today') ||
    container.querySelector('.flatpickr-day');

  dayToFocus && dayToFocus.focus();
}

export function formatTime(use24h, minutes) {

  if (minutes === null) return null;

  const wrappedMinutes = minutes % (24 * 60);

  const minute = minutes % 60;
  let hour = Math.floor(wrappedMinutes / 60);

  if (use24h) {
    return _getZeroPaddedString(hour) + ':' + _getZeroPaddedString(minute);
  }

  hour = (hour % 12 || 12);

  const isPM = (wrappedMinutes >= 12 * 60);

  return _getZeroPaddedString(hour) + ':' + _getZeroPaddedString(minute) + ' ' + (isPM ? 'PM' : 'AM');
}

export function parseInputTime(stringTime) {

  let workingString = stringTime.toLowerCase();
  const is12h = workingString.includes('am') || workingString.includes('pm');

  if (is12h) {
    const isPM = workingString.includes('pm');
    const digits = workingString.match(/\d+/g);
    const displayHour = parseInt(digits && digits[0]);
    const minute = parseInt(digits && digits[1]) || 0;

    const isValidDisplayHour = isNumber(displayHour) && (displayHour >= 1) && (displayHour <= 12);
    const isValidMinute = (minute >= 0) && (minute <= 59);

    if (!isValidDisplayHour || !isValidMinute) return null;

    const hour = (displayHour % 12) + (isPM ? 12 : 0);

    return hour * 60 + minute;
  }
  else {
    const digits = workingString.match(/\d+/g);
    const hour = parseInt(digits && digits[0]);
    const minute = parseInt(digits && digits[1]);

    const isValidHour = isNumber(hour) && (hour >= 0) && (hour <= 23);
    const isValidMinute = isNumber(minute) && (minute >= 0) && (minute <= 59);

    if (!isValidHour || !isValidMinute) return null;

    return hour * 60 + minute;
  }
}

export function serializeTime(minutes, offset, timeSerializingFormat) {

  if (timeSerializingFormat === TIME_SERIALISING_FORMATS.UTC_NORMALIZED) {
    const normalizedMinutes = (minutes + offset + MINUTES_IN_DAY) % MINUTES_IN_DAY;
    return _getZeroPaddedString(Math.floor(normalizedMinutes / 60)) + ':' + _getZeroPaddedString(normalizedMinutes % 60) + 'Z';
  }

  const baseTime = _getZeroPaddedString(Math.floor(minutes / 60)) + ':' + _getZeroPaddedString(minutes % 60);
  const addUTCOffset = timeSerializingFormat === TIME_SERIALISING_FORMATS.UTC_OFFSET;

  return baseTime + (addUTCOffset ? formatTimezoneOffset(offset) : '');
}

export function parseIsoTime(isoTimeString) {

  if (!isoTimeString) return null;

  const parseBasicMinutes = (timeString) => {
    const timeSegments = timeString.split(':');
    const hour = parseInt(timeSegments[0]);
    const minute = timeSegments.length > 1 ? parseInt(timeSegments[1]) : 0;
    if (isNaN(hour) || hour < 0 || hour > 24 || isNaN(minute) || minute < 0 || minute > 60) return null;
    return hour * 60 + minute;
  };

  const localOffset = new Date().getTimezoneOffset();

  // Parse normalized time
  if (isoTimeString.includes('Z')) {
    isoTimeString = isoTimeString.replace('Z', '');
    const minutes = parseBasicMinutes(isoTimeString);
    if (minutes === null) return null;
    return (minutes - localOffset + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  }

  // Parse offset positive time
  else if (isoTimeString.includes('+')) {
    const [ timeString, offsetString ] = isoTimeString.split('+');

    const minutes = parseBasicMinutes(timeString);
    let inboundOffset = parseBasicMinutes(offsetString);

    if (minutes === null || inboundOffset === null) return null;

    // The offset is flipped for consistency with javascript
    inboundOffset = -inboundOffset;

    return (minutes + inboundOffset - localOffset + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  }

  // Parse offset negative time
  else if (isoTimeString.includes('-')) {
    const [ timeString, offsetString ] = isoTimeString.split('-');

    const minutes = parseBasicMinutes(timeString);
    let inboundOffset = parseBasicMinutes(offsetString);

    if (minutes === null || inboundOffset === null) return null;

    return (minutes + inboundOffset - localOffset + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  }

  // Default to local parsing
  else {
    return parseBasicMinutes(isoTimeString);
  }
}

export function serializeDate(date) {
  var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [ year, month, day ].join('-');
}

// this method is used to make the `new Date(value)` parsing behavior stricter
export function isDateTimeInputInformationSufficient(value) {

  if (!value || typeof value !== 'string') return false;

  const segments = value.split('T');
  if (segments.length != 2) return false;

  const dateNumbers = segments[0].split('-');
  if (dateNumbers.length != 3) return false;

  return true;

}

// this method checks if the date isn't a datetime, or a partial date
export function isDateInputInformationMatching(value) {

  if (!value || typeof value !== 'string') return false;

  if (value.includes('T')) return false;

  const dateNumbers = value.split('-');
  if (dateNumbers.length != 3) return false;

  return true;
}

export function serializeDateTime(date, time, timeSerializingFormat) {

  const workingDate = new Date();
  workingDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  workingDate.setHours(Math.floor(time / 60), time % 60, 0, 0);

  if (timeSerializingFormat === TIME_SERIALISING_FORMATS.UTC_NORMALIZED) {

    const timezoneOffsetMinutes = workingDate.getTimezoneOffset();
    const dayOffset = (time + timezoneOffsetMinutes < 0) ? -1 : (((time + timezoneOffsetMinutes) > MINUTES_IN_DAY) ? 1 : 0);

    // Apply the date rollover pre-emptively
    workingDate.setHours(workingDate.getHours() + dayOffset * 24);
  }

  return serializeDate(workingDate) + 'T' + serializeTime(time, workingDate.getTimezoneOffset(), timeSerializingFormat);

}

export function formatTimezoneOffset(minutes) {
  return _getSignedPaddedHours(minutes) + ':' + _getZeroPaddedString(Math.abs(minutes % 60));
}

export function isInvalidDateString(value) {
  return isNaN(new Date(Date.parse(value)).getTime());
}

export function getNullDateTime() {
  return {
    date: new Date(Date.parse(null)),
    time: null
  };
}

export function isValidDate(date) {
  return date && !isNaN(date.getTime());
}

export function isValidTime(time) {
  return !isNaN(parseInt(time));
}

function _getSignedPaddedHours(minutes) {
  if (minutes > 0) {
    return '-' + _getZeroPaddedString(Math.floor(minutes / 60));
  }
  else {
    return '+' + _getZeroPaddedString(Math.floor((0 - minutes) / 60));
  }
}

function _getZeroPaddedString(time) {
  return time.toString().padStart(2, '0');
}