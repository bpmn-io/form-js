import { DATETIME_SUBTYPES } from '../../../util/constants/DatetimeConstants';
import { isDateInputInformationMatching, isDateTimeInputInformationSufficient, isInvalidDateString, parseIsoTime } from './dateTimeUtil';
import { getValuesData, normalizeValuesData } from './valuesUtil';

export function sanitizeDateTimePickerValue(options) {
  const {
    formField,
    value
  } = options;

  const { subtype } = formField;

  if (typeof value !== 'string') return null;

  if (subtype === DATETIME_SUBTYPES.DATE && (isInvalidDateString(value) || !isDateInputInformationMatching(value))) return null;
  if (subtype === DATETIME_SUBTYPES.TIME && parseIsoTime(value) === null) return null;
  if (subtype === DATETIME_SUBTYPES.DATETIME && (isInvalidDateString(value) || !isDateTimeInputInformationSufficient(value))) return null;

  return value;
}

export function sanitizeSingleSelectValue(options) {
  const {
    formField,
    data,
    value
  } = options;

  try {
    const validValues = normalizeValuesData(getValuesData(formField, data)).map(v => v.value);
    return validValues.includes(value) ? value : null;
  } catch (error) {

    // use default value in case of formatting error
    // TODO(@Skaiir): log a warning when this happens - https://github.com/bpmn-io/form-js/issues/289
    return null;
  }
}

export function sanitizeMultiSelectValue(options) {
  const {
    formField,
    data,
    value
  } = options;

  try {
    const validValues = normalizeValuesData(getValuesData(formField, data)).map(v => v.value);
    return value.filter(v => validValues.includes(v));
  } catch (error) {

    // use default value in case of formatting error
    // TODO(@Skaiir): log a warning when this happens - https://github.com/bpmn-io/form-js/issues/289
    return [];
  }
}


