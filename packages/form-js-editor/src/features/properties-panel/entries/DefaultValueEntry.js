import {
  isSelectEntryEdited,
  isTextFieldEntryEdited,
  isTextAreaEntryEdited,
  SelectEntry,
  TextFieldEntry,
  TextAreaEntry
} from '@bpmn-io/properties-panel';

import { get } from 'min-dash';

import Big from 'big.js';

import { useService } from '../hooks';

import { countDecimals, INPUTS, isValidNumber, VALUES_INPUTS } from '../Util';

export const EMPTY_OPTION = null;

export default function DefaultOptionEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  const entries = [];

  // Only make default values available when they are statically defined
  if (!INPUTS.includes(type) || VALUES_INPUTS.includes(type) && !field.values) {
    return entries;
  }

  const defaultOptions = {
    editField,
    field,
    id: 'defaultValue',
    label: 'Default value'
  };

  if (type === 'checkbox') {
    entries.push({
      ...defaultOptions,
      component: DefaultValueCheckbox,
      isEdited: isSelectEntryEdited
    });
  }

  if (type === 'number') {
    entries.push({
      ...defaultOptions,
      component: DefaultValueNumber,
      isEdited: isTextFieldEntryEdited
    });
  }

  if (type === 'radio' || type === 'select') {
    entries.push({
      ...defaultOptions,
      component: DefaultValueSingleSelect,
      isEdited: isSelectEntryEdited
    });
  }

  // todo(Skaiir): implement a multiselect equivalent (cf. https://github.com/bpmn-io/form-js/issues/265)

  if (type === 'textfield') {
    entries.push({
      ...defaultOptions,
      component: DefaultValueTextfield,
      isEdited: isTextFieldEntryEdited
    });
  }

  if (type === 'textarea') {
    entries.push({
      ...defaultOptions,
      component: DefaultValueTextarea,
      isEdited: isTextAreaEntryEdited
    });
  }

  return entries;
}

function DefaultValueCheckbox(props) {
  const {
    editField,
    field,
    id,
    label
  } = props;

  const {
    defaultValue
  } = field;

  const path = [ 'defaultValue' ];

  const getOptions = () => {
    return [
      {
        label: 'Checked',
        value: 'true'
      },
      {
        label: 'Not checked',
        value: 'false'
      }
    ];
  };

  const setValue = (value) => {
    return editField(field, path, parseStringToBoolean(value));
  };

  const getValue = () => {
    return parseBooleanToString(defaultValue);
  };

  return SelectEntry({
    element: field,
    getOptions,
    getValue,
    id,
    label,
    setValue
  });
}

function DefaultValueNumber(props) {
  const {
    editField,
    field,
    id,
    label
  } = props;

  const {
    decimalDigits,
    serializeToString = false
  } = field;

  const debounce = useService('debounce');

  const path = [ 'defaultValue' ];

  const getValue = (e) => {

    let value = get(field, path);

    if (!isValidNumber(value)) return;

    // Enforces decimal notation so that we do not submit defaults in exponent form
    return serializeToString ? Big(value).toFixed() : value;
  };

  const setValue = (value) => {

    let newValue;

    if (isValidNumber(value)) {
      newValue = serializeToString ? value : Number(value);
    }

    return editField(field, path, newValue);
  };

  const decimalDigitsSet = decimalDigits || decimalDigits === 0;

  return TextFieldEntry({
    debounce,
    label,
    element: field,
    getValue,
    id,
    setValue,
    validate: (value) => {
      if (value === undefined || value === null) return;
      if (!isValidNumber(value)) return 'Should be a valid number';
      if (decimalDigitsSet && countDecimals(value) > decimalDigits) return `Should not contain more than ${decimalDigits} decimal digits`;
    }
  });
}

function DefaultValueSingleSelect(props) {
  const {
    editField,
    field,
    id,
    label
  } = props;

  const {
    defaultValue = EMPTY_OPTION,
    values = []
  } = field;

  const path = [ 'defaultValue' ];

  const getOptions = () => {
    return [
      {
        label: '<none>',
        value: EMPTY_OPTION
      },
      ...values
    ];
  };

  const setValue = (value) => {
    return editField(field, path, value.length ? value : undefined);
  };

  const getValue = () => {
    return defaultValue;
  };

  return SelectEntry({
    element: field,
    getOptions,
    getValue,
    id,
    label,
    setValue
  });
}

function DefaultValueTextfield(props) {
  const {
    editField,
    field,
    id,
    label
  } = props;

  const debounce = useService('debounce');

  const path = [ 'defaultValue' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label,
    setValue
  });
}

function DefaultValueTextarea(props) {
  const {
    editField,
    field,
    id,
    label
  } = props;

  const debounce = useService('debounce');

  const path = [ 'defaultValue' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return TextAreaEntry({
    debounce,
    element: field,
    getValue,
    id,
    label,
    setValue
  });
}

// helpers /////////////////

function parseStringToBoolean(value) {
  if (value === 'true') {
    return true;
  }

  return false;
}

function parseBooleanToString(value) {
  if (value === true) {
    return 'true';
  }

  return 'false';
}