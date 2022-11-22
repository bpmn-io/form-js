import {get, set} from 'min-dash';

import {
  CheckboxEntry,
  isCheckboxEntryEdited,
  isNumberFieldEntryEdited,
  isTextFieldEntryEdited,
  NumberFieldEntry,
  TextFieldEntry,
  SelectEntry,
} from '@bpmn-io/properties-panel';

import {useService} from '../hooks';

import {INPUTS} from '../Util';

const VALIDATION_TYPE_OPTIONS = {
  custom: {
    value: 'custom',
    label: 'Custom',
  },
  email: {
    value: 'email',
    label: 'Email',
  },
  phone: {
    value: 'phone',
    label: 'Phone',
  },
};

export default function ValidationGroup(field, editField) {
  const {type} = field;
  const validate = get(field, ['validate'], {});
  const isCustomValidation = [
    undefined,
    VALIDATION_TYPE_OPTIONS.custom.value,
  ].includes(validate?.validationType);

  if (
    !(
      INPUTS.includes(type) &&
      type !== 'checkbox' &&
      type !== 'checklist' &&
      type !== 'taglist'
    )
  ) {
    return null;
  }

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
    },
  ];

  if (type === 'textfield') {
    entries.push({
      id: 'validationType',
      component: ValidationType,
      getValue,
      field,
      isEdited: isTextFieldEntryEdited,
      onChange,
    });
  }

  if (type === 'textarea' || (type === 'textfield' && isCustomValidation)) {
    entries.push(
      {
        id: 'minLength',
        component: MinLength,
        getValue,
        field,
        isEdited: isNumberFieldEntryEdited,
        onChange,
      },
      {
        id: 'maxLength',
        component: MaxLength,
        getValue,
        field,
        isEdited: isNumberFieldEntryEdited,
        onChange,
      },
    );
  }

  if (type === 'textfield' && isCustomValidation) {
    entries.push({
      id: 'pattern',
      component: Pattern,
      getValue,
      field,
      isEdited: isTextFieldEntryEdited,
      onChange,
    });
  }

  if (type === 'number') {
    entries.push(
      {
        id: 'min',
        component: Min,
        getValue,
        field,
        isEdited: isNumberFieldEntryEdited,
        onChange,
      },
      {
        id: 'max',
        component: Max,
        getValue,
        field,
        isEdited: isNumberFieldEntryEdited,
        onChange,
      },
    );
  }

  return {
    id: 'validation',
    label: 'Validation',
    entries,
  };
}

function Required(props) {
  const {field, getValue, id, onChange} = props;

  return CheckboxEntry({
    element: field,
    getValue: getValue('required'),
    id,
    label: 'Required',
    setValue: onChange('required'),
  });
}

function MinLength(props) {
  const {field, getValue, id, onChange} = props;

  const debounce = useService('debounce');

  return NumberFieldEntry({
    debounce,
    element: field,
    getValue: getValue('minLength'),
    id,
    label: 'Minimum length',
    min: 0,
    setValue: onChange('minLength'),
  });
}

function MaxLength(props) {
  const {field, getValue, id, onChange} = props;

  const debounce = useService('debounce');

  return NumberFieldEntry({
    debounce,
    element: field,
    getValue: getValue('maxLength'),
    id,
    label: 'Maximum length',
    min: 0,
    setValue: onChange('maxLength'),
  });
}

function Pattern(props) {
  const {field, getValue, id, onChange} = props;

  const debounce = useService('debounce');

  return TextFieldEntry({
    debounce,
    element: field,
    getValue: getValue('pattern'),
    id,
    label: 'Regular expression pattern',
    setValue: onChange('pattern'),
  });
}

function Min(props) {
  const {field, getValue, id, onChange} = props;

  const debounce = useService('debounce');

  return NumberFieldEntry({
    debounce,
    element: field,
    getValue: getValue('min'),
    id,
    label: 'Minimum',
    min: 0,
    setValue: onChange('min'),
  });
}

function Max(props) {
  const {field, getValue, id, onChange} = props;

  const debounce = useService('debounce');

  return NumberFieldEntry({
    debounce,
    element: field,
    getValue: getValue('max'),
    id,
    label: 'Maximum',
    min: 0,
    setValue: onChange('max'),
  });
}

function ValidationType(props) {
  const {field, getValue, id, onChange} = props;

  const debounce = useService('debounce');

  return SelectEntry({
    debounce,
    element: field,
    getValue: getValue('validationType'),
    id,
    label: 'Regular expression validation',
    setValue: onChange('validationType'),
    getOptions() {
      return Object.values(VALIDATION_TYPE_OPTIONS);
    },
  });
}
