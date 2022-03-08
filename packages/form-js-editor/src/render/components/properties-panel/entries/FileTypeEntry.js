import { get } from 'min-dash';

import { TextInput } from '../components';

export default function FileTypeEntry(props) {
  const {
    editField,
    field,
    id,
    description,
    label,
    onChange,
    path
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
      <TextInput
        id={ id }
        label={ label }
        onInput={ onInput }
        value={ value }
      />
      { description && <div class="fjs-properties-panel-description">{ description }</div> }
    </div>
  );
}