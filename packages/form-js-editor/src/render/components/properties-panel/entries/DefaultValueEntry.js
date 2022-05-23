import {
  isNumberFieldEntryEdited,
  isSelectEntryEdited,
  isTextFieldEntryEdited,
  NumberFieldEntry,
  SelectEntry,
  TextFieldEntry
} from '@bpmn-io/properties-panel';

import { get } from 'min-dash';

import { useService } from '../../../hooks';

import { INPUTS } from '../Util';


export default function DefaultValueEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  const entries = [];

  if (!INPUTS.includes(type)) {
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
      isEdited: isNumberFieldEntryEdited
    });
  }

  if (type === 'radio' || type === 'select') {
    entries.push({
      ...defaultOptions,
      component: DefaultValueMulti,
      isEdited: isSelectEntryEdited
    });
  }

  if (type === 'textfield') {
    entries.push({
      ...defaultOptions,
      component: DefaultValueTextfield,
      isEdited: isTextFieldEntryEdited
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

  const debounce = useService('debounce');

  const path = [ 'defaultValue' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return NumberFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label,
    setValue
  });
}

function DefaultValueMulti(props) {
  const {
    editField,
    field,
    id,
    label
  } = props;

  const {
    defaultValue,
    values = []
  } = field;

  const path = [ 'defaultValue' ];

  const getOptions = () => {
    return [
      {
        label: '<none>'
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