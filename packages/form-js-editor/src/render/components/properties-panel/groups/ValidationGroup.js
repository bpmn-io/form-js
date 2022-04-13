import {
  get,
  set
} from 'min-dash';

import {
  CheckboxInputEntry,
  Group,
  NumberInputEntry,
  TextInputEntry
} from '../components';

export default function ValidationGroup(field, editField) {
  const { type } = field;

  const onChange = (key) => {
    return (value) => {
      const validate = get(field, [ 'validate' ], {});

      editField(field, [ 'validate' ], set(validate, [ key ], value));
    };
  };

  const entries = [
    <CheckboxInputEntry
      id="required"
      label="Required"
      onChange={ onChange('required') }
      value={ get(field, [ 'validate', 'required' ]) } />
  ];

  if (type === 'textfield') {
    entries.push(
      <NumberInputEntry
        id="minLength"
        label="Minimum Length"
        min="0"
        onChange={ onChange('minLength') }
        value={ get(field, [ 'validate', 'minLength' ]) } />,
      <NumberInputEntry
        id="maxLength"
        label="Maximum Length"
        min="0"
        onChange={ onChange('maxLength') }
        value={ get(field, [ 'validate', 'maxLength' ]) } />,
      <TextInputEntry
        id="pattern"
        label="Regular Expression Pattern"
        onChange={ onChange('pattern') }
        value={ get(field, [ 'validate', 'pattern' ]) } />
    );
  }

  if (type === 'number') {
    entries.push(
      <NumberInputEntry
        id="min"
        label="Minimum"
        onChange={ onChange('min') }
        value={ get(field, [ 'validate', 'min' ]) } />,
      <NumberInputEntry
        id="max"
        label="Maximum"
        onChange={ onChange('max') }
        value={ get(field, [ 'validate', 'max' ]) } />
    );
  }

  return (
    <Group label="Validation">
      {
        entries.length ? entries : null
      }
    </Group>
  );
}