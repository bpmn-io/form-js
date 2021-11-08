import { get } from 'min-dash';

import Select from './Select';

export default function SelectEntry(props) {
  const {
    editField,
    field,
    id,
    description,
    label,
    options,
    path
  } = props;

  const onChange = (value) => {
    if (editField && path) {
      editField(field, path, value);
    } else {
      props.onChange(value);
    }
  };

  const value = path ? get(field, path, '') : props.value;

  return (
    <div class="fjs-properties-panel-entry">
      <Select id={ id } label={ label } onChange={ onChange } options={ options } value={ value } />
      { description && <div class="fjs-properties-panel-description">{ description }</div> }
    </div>
  );
}