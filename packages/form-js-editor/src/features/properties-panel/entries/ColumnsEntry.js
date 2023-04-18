import { get, set } from 'min-dash';

import { useService } from '../hooks';

import {
  isSelectEntryEdited,
  SelectEntry
} from '@bpmn-io/properties-panel';

import { MIN_COLUMNS } from '../../../core/FormLayoutValidator';


export const AUTO_OPTION_VALUE = '';

export default function ColumnsEntry(props) {
  const {
    editField,
    field
  } = props;

  const entries = [
    {
      id: 'columns',
      component: Columns,
      field,
      editField,
      isEdited: isSelectEntryEdited
    },
  ];

  return entries;
}

function Columns(props) {
  const {
    field,
    editField,
    id
  } = props;

  const debounce = useService('debounce');
  const formLayoutValidator = useService('formLayoutValidator');

  const validate = (value) => {
    return formLayoutValidator.validateField(field, value ? parseInt(value) : null);
  };

  const setValue = (value) => {
    const layout = get(field, [ 'layout' ], {});

    const newValue = value ? parseInt(value) : null;

    editField(field, [ 'layout' ], set(layout, [ 'columns' ], newValue));
  };

  const getValue = () => {
    return get(field, [ 'layout', 'columns' ]);
  };

  const getOptions = () => {
    return [
      {
        label: 'Auto',
        value: AUTO_OPTION_VALUE
      },

      // todo(pinussilvestrus): make options dependant on field type
      // cf. https://github.com/bpmn-io/form-js/issues/575
      ...asArray(16).filter(i => i >= MIN_COLUMNS).map(asOption)
    ];
  };

  return SelectEntry({
    debounce,
    element: field,
    id,
    label: 'Columns',
    getOptions,
    getValue,
    setValue,
    validate
  });
}


// helper /////////

function asOption(number) {
  return {
    value: number,
    label: number.toString()
  };
}

function asArray(length) {
  return Array.from({ length }).map((_, i) => i + 1);
}
