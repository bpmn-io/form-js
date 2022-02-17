import {
  get,
  set
} from 'min-dash';

import { TextInputEntry } from '../components';

export default function ValueEntry(props) {
  const {
    editField,
    field,
    index,
    validate
  } = props;

  const getLabel = () => {
    return get(field, [ 'values', index, 'label' ]);
  };

  const getValue = () => {
    return get(field, [ 'values', index, 'value' ]);
  };

  const onChange = (key) => {
    const values = get(field, [ 'values' ]);

    return (value) => {
      editField(field, 'values', set(values, [ index, key ], value));
    };
  };

  return <>
    <TextInputEntry
      id={ `value-label-${ index }` }
      label="Label"
      onChange={ onChange('label') }
      value={ getLabel() } />
    <TextInputEntry
      id={ `value-value-${ index }` }
      label="Value"
      onChange={ onChange('value') }
      value={ getValue() }
      validate={ validate(getValue()) } />

  </>;
}