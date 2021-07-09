import { get } from 'min-dash';

import TextInput from './TextInput';

export default function TextInputEntry(props) {
  const {
    editField,
    field,
    id,
    description,
    label,
    onChange,
    path,
    validate
  } = props;

  const onInput = (value) => {
    if (editField && path) {
      editField(field, path, value);
    } else {
      onChange(value);
    }
  };

  const value = path ? get(field, path, '') : props.value;

  return (
    <div class="fjs-properties-panel-entry">
      <TextInput id={ id } label={ label } onInput={ onInput } validate={ validate } value={ value } />
      { description && <div class="fjs-properties-panel-description">{ description }</div> }
    </div>
  );
}