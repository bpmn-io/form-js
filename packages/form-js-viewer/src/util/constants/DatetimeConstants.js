// config  ///////////////////

export const MINUTES_IN_DAY = 60 * 24;

export const DATETIME_SUBTYPES = {
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime'
};

export const TIME_SERIALISING_FORMATS = {
  UTC_OFFSET: 'utc_offset',
  UTC_NORMALIZED: 'utc_normalized',
  NO_TIMEZONE: 'no_timezone'
};

export const DATETIME_SUBTYPES_LABELS = {
  [DATETIME_SUBTYPES.DATE]: 'Date',
  [DATETIME_SUBTYPES.TIME]: 'Time',
  [DATETIME_SUBTYPES.DATETIME]: 'Date & Time'
};

export const TIME_SERIALISINGFORMAT_LABELS = {
  [TIME_SERIALISING_FORMATS.UTC_OFFSET]: 'UTC offset',
  [TIME_SERIALISING_FORMATS.UTC_NORMALIZED]: 'UTC normalized',
  [TIME_SERIALISING_FORMATS.NO_TIMEZONE]: 'No timezone'
};

export const DATETIME_SUBTYPE_PATH = [ 'subtype' ];
export const DATE_LABEL_PATH = [ 'dateLabel' ];
export const DATE_DISALLOW_PAST_PATH = [ 'disallowPassedDates' ];
export const TIME_LABEL_PATH = [ 'timeLabel' ];
export const TIME_USE24H_PATH = [ 'use24h' ];
export const TIME_INTERVAL_PATH = [ 'timeInterval' ];
export const TIME_SERIALISING_FORMAT_PATH = [ 'timeSerializingFormat' ];
