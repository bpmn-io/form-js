import Errors from './Errors';
import Description from './Description';
import Label from './Label';

import { formFieldClasses } from './Field';


export default function NumberRenderer(props) {
  const onInput = ({ target }) => {
    props.onChange({
      dataPath: props.dataPath,
      value: target.value ? parseInt(target.value, 10) : undefined
    });
  };

  return (
    <div class={ formFieldClasses(props.errors) }>
      <Label field={ props.field } for={ props.id } />
      <input
        class="fjs-input"
        id={ props.id }
        type="number"
        value={ props.value }
        disabled={ props.disabled || props.field.disabled }
        onInput={ onInput }
        onBlur={ onInput }
      />
      <Errors errors={ props.errors } />
      <Description field={ props.field } />
    </div>
  );
}

NumberRenderer.create = function(options = {}) {
  return {
    label : 'Number',
    type: 'number',
    ...options
  };
};