import { get, set, without } from 'min-dash';

import { arrayAdd } from '../Util';

import { ListGroup } from '@bpmn-io/properties-panel';

import { VALIDATION_TYPE_OPTIONS } from './ValidationGroup';
import { CustomValidationEntry } from '../entries/CustomValidationEntry';

export function CustomValidationsGroup(field, editField, getService) {
  const validate = get(field, ['validate'], {});
  const { validatable, keyed } = getService('formFields').get(field.type).config;

  const isValidatable = validatable !== undefined ? validatable : keyed;
  const isCustomValidation = [undefined, VALIDATION_TYPE_OPTIONS.custom.value].includes(validate.validationType);
  const shouldRender = isValidatable && isCustomValidation;

  if (!shouldRender) {
    return;
  }

  return {
    id: 'custom-validation',
    label: 'Custom validations',
    tooltip: "Define custom validation rules for this field. Use 'value' to reference the field value.",
    component: ListGroup,
    ...CustomValidationsEntry({ editField, field, id: 'custom-validation-list' }),
  };
}

export function CustomValidationsEntry(props) {
  const { editField, field, id: idPrefix } = props;

  const addEntry = (e) => {
    e.stopPropagation();

    const customValidations = get(field, ['validate', 'custom'], []);
    const newIndex = customValidations.length + 1;

    const newValue = {
      condition: '=false',
      message: 'Error message.',
    };

    const newArray = arrayAdd(customValidations, newIndex, newValue);
    const newValidate = set(field.validate || {}, ['custom'], newArray);

    editField(field, ['validate'], newValidate);
  };

  const removeEntry = (entry) => {
    const customValidations = get(field, ['validate', 'custom'], []);
    const newArray = without(customValidations, entry);
    const newValidate = set(field.validate, ['custom'], newArray);

    editField(field, ['validate'], newValidate);
  };

  const items = get(field, ['validate', 'custom'], []).map((entry, index) => {
    const id = idPrefix + '-' + index;

    return {
      id,
      entries: CustomValidationEntry({
        editField,
        field,
        idPrefix,
        index,
      }),
      label: 'Rule ' + (index + 1),
      remove: () => removeEntry(entry),
    };
  });

  return {
    items,
    add: addEntry,
    shouldSort: false,
  };
}
