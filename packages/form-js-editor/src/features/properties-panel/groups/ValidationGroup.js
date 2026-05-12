import { get, set } from 'min-dash';

import {
  CheckboxEntry,
  isCheckboxEntryEdited,
  isFeelEntryEdited,
  FeelNumberEntry,
  isTextFieldEntryEdited,
  TextFieldEntry,
  SelectEntry,
} from '@bpmn-io/properties-panel';

import { useService, useVariables } from '../hooks';

import { INPUTS } from '../Util';

const VALIDATION_TYPE_OPTIONS = (translate) => {
  return {
    custom: {
      value: '',
      label: translate('Custom'),
    },
    email: {
      value: 'email',
      label: translate('Email'),
    },
    phone: {
      value: 'phone',
      label: translate('Phone'),
    },
  };
};

export function ValidationGroup(field, editField, getService) {
  const { type } = field;
  const validate = get(field, ['validate'], {});
  const translate = getService('translate');
  const isCustomValidation = [undefined, VALIDATION_TYPE_OPTIONS(translate).custom.value].includes(
    validate.validationType,
  );
  const hasPattern = !!get(field, ['validate', 'pattern']);

  const onChange = (key) => {
    return (value) => {
      const validate = get(field, ['validate'], {});

      editField(field, ['validate'], set(validate, [key], value));
    };
  };

  const getValue = (key) => {
    return () => {
      return get(field, ['validate', key]);
    };
  };

  let entries = [
    {
      id: 'required',
      component: Required,
      getValue,
      field,
      isEdited: isCheckboxEntryEdited,
      onChange,
      isDefaultVisible: (field) => INPUTS.includes(field.type),
      translate,
    },
  ];

  entries.push({
    id: 'validationType',
    component: ValidationType,
    getValue,
    field,
    editField,
    isEdited: isTextFieldEntryEdited,
    onChange,
    isDefaultVisible: (field) => field.type === 'textfield',
    translate,
  });

  entries.push(
    {
      id: 'minLength',
      component: MinLength,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) =>
        INPUTS.includes(field.type) && (type === 'textarea' || (type === 'textfield' && isCustomValidation)),
      translate,
    },
    {
      id: 'maxLength',
      component: MaxLength,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) =>
        INPUTS.includes(field.type) && (type === 'textarea' || (type === 'textfield' && isCustomValidation)),
      translate,
    },
  );

  entries.push({
    id: 'pattern',
    component: Pattern,
    getValue,
    field,
    isEdited: isTextFieldEntryEdited,
    onChange,
    isDefaultVisible: (field) => INPUTS.includes(field.type) && type === 'textfield' && isCustomValidation,
    translate,
  });

  entries.push({
    id: 'patternErrorMessage',
    component: PatternErrorMessage,
    getValue,
    field,
    isEdited: isTextFieldEntryEdited,
    onChange,
    isDefaultVisible: (field) =>
      INPUTS.includes(field.type) && type === 'textfield' && isCustomValidation && hasPattern,
    translate,
  });

  entries.push(
    {
      id: 'min',
      component: Min,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) => field.type === 'number',
      translate,
    },
    {
      id: 'max',
      component: Max,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) => field.type === 'number',
      translate,
    },
  );

  return {
    id: 'validation',
    label: translate('Validation'),
    entries,
  };
}

function Required(props) {
  const { field, getValue, id, onChange, translate } = props;

  return CheckboxEntry({
    element: field,
    getValue: getValue('required'),
    id,
    label: translate('Required'),
    setValue: onChange('required'),
  });
}

function MinLength(props) {
  const { field, getValue, id, onChange, translate } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue: getValue('minLength'),
    id,
    label: translate('Minimum length'),
    min: 0,
    setValue: onChange('minLength'),
    variables,
  });
}

function MaxLength(props) {
  const { field, getValue, id, onChange, translate } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue: getValue('maxLength'),
    id,
    label: translate('Maximum length'),
    min: 0,
    setValue: onChange('maxLength'),
    variables,
  });
}

function Pattern(props) {
  const { field, getValue, id, onChange, translate } = props;

  const debounce = useService('debounce');

  return TextFieldEntry({
    debounce,
    element: field,
    getValue: getValue('pattern'),
    id,
    label: translate('Custom regular expression'),
    setValue: onChange('pattern'),
  });
}

function PatternErrorMessage(props) {
  const { field, getValue, id, onChange, translate } = props;

  const debounce = useService('debounce');

  return TextFieldEntry({
    debounce,
    element: field,
    getValue: getValue('patternErrorMessage'),
    id,
    label: translate('Custom error message'),
    tooltip: translate('TextFieldEntry tooltip'),
    setValue: onChange('patternErrorMessage'),
  });
}

function Min(props) {
  const { field, getValue, id, onChange, translate } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    id,
    label: translate('Minimum'),
    step: 'any',
    getValue: getValue('min'),
    setValue: onChange('min'),
    variables,
  });
}

function Max(props) {
  const { field, getValue, id, onChange, translate } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    id,
    label: translate('Maximum'),
    step: 'any',
    getValue: getValue('max'),
    setValue: onChange('max'),
    variables,
  });
}

function ValidationType(props) {
  const { field, getValue, id, onChange, translate } = props;

  const debounce = useService('debounce');

  const setValue = (validationType) => {
    onChange('validationType')(validationType || undefined);
  };

  return SelectEntry({
    debounce,
    element: field,
    getValue: getValue('validationType'),
    id,
    label: translate('Validation pattern'),
    setValue,
    getOptions: () => Object.values(VALIDATION_TYPE_OPTIONS(translate)),
    tooltip:
      getValue('validationType')() === VALIDATION_TYPE_OPTIONS(translate).phone.value
        ? translate('SelectEntry tooltip')
        : undefined,
  });
}
