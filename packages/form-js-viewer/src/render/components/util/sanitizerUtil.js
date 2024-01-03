import isEqual from 'lodash/isEqual';
import { DATETIME_SUBTYPES } from '../../../util/constants/DatetimeConstants';
import { isDateInputInformationMatching, isDateTimeInputInformationSufficient, isInvalidDateString, parseIsoTime } from './dateTimeUtil';
import { getOptionsData, normalizeOptionsData } from './optionsUtil';

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

export function hasEqualValue(value, array) {

  if (!Array.isArray(array)) {
    return false;
  }

  return array.some(element => isEqual(value, element));
}

export function sanitizeSingleSelectValue(options) {
  const {
    formField,
    data,
    value
  } = options;

  try {
    const validValues = normalizeOptionsData(getOptionsData(formField, data)).map(v => v.value);
    return hasEqualValue(value, validValues) ? value : null;
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
    const validValues = normalizeOptionsData(getOptionsData(formField, data)).map(v => v.value);
    return value.filter(v => hasEqualValue(v, validValues));
  } catch (error) {

    // use default value in case of formatting error
    // TODO(@Skaiir): log a warning when this happens - https://github.com/bpmn-io/form-js/issues/289
    return [];
  }
}


