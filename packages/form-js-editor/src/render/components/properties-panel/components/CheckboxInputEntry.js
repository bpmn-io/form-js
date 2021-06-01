import { get } from 'min-dash';

import CheckboxInput from './CheckboxInput';

export default function CheckboxInputEntry(props) {
  const {
    editField,
    field,
    id,
    label,
    path
  } = props;

  const onChange = (value) => {
    if (editField && path) {
      editField(field, path, value);
    } else {
      props.onChange(value);
    }
  };

  const value = path ? get(field, path, false) : props.value;

  return (
    <div class="fjs-properties-panel-entry">
      <CheckboxInput id={ id } label={ label } onChange={ onChange } value={ value } />
    </div>
  );
}