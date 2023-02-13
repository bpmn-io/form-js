import { get } from 'min-dash';
import { DATETIME_SUBTYPES } from '../../../util/constants/DatetimeConstants';
import { isDateInputInformationMatching, isDateTimeInputInformationSufficient, isInvalidDateString, parseIsoTime } from './dateTimeUtil';

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

/**
 * Retrieves the actual value optimistically of a provided select option/value.
 * If the provided option is a supported primitive, it returns it directly,
 * otherwise it looks for the value inside it.
 * (For future iterations, it might be better to wrap the "value"/"option" object 
 * into a dedicated class/functional, to make it easier to retrieve label and value
 * or instantiate them easily and safely from the form context)
 */
function _getValueOptimistically(potentialValue) {
  if (['string', 'number'].includes(typeof potentialValue)) {
    return potentialValue;
  }

  return potentialValue?.value || null;
}

export function sanitizeSingleSelectValue(options) {
  const {
    formField,
    data,
    value
  } = options;

  const {
    valuesKey,
    values
  } = formField;

  try {
    const validValues = (valuesKey ? get(data, [ valuesKey ]) : values).map(v => _getValueOptimistically(v)) || [];
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

  const {
    valuesKey,
    values
  } = formField;

  try {
    const validValues = (valuesKey ? get(data, [ valuesKey ]) : values).map(v => _getValueOptimistically(v)) || [];
    return value.filter(v => validValues.includes(v));
  } catch (error) {

    // use default value in case of formatting error
    // TODO(@Skaiir): log a warning when this happens - https://github.com/bpmn-io/form-js/issues/289
    return [];
  }
}


