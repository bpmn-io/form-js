import Description from './Description';
import Errors from './Errors';
import Label from './Label';

import { formFieldClasses } from './Util';

import {
  generateIdForType,
  idToLabel
} from '../../util';


export default function TextfieldRenderer(props) {
  const {
    dataPath,
    disabled,
    errors = [],
    field,
    value = ''
  } = props;

  const onChange = ({ target }) => {
    props.onChange({
      dataPath,
      value: target.value.length ? target.value : undefined
    });
  };

  return <div class={ formFieldClasses(errors) }>
    <Label label={ field.label } required={ field.validate && field.validate.required } />
    <input
      class="fjs-input"
      type="text"
      value={ value }
      onInput={ onChange }
      disabled={ disabled } />
    <Description description={ field.description } />
    <Errors errors={ errors } />
  </div>;
}

TextfieldRenderer.create = function(options = {}) {
  const type = 'textfield';

  const id = generateIdForType(type);

  return {
    id,
    key: id,
    label: idToLabel(id),
    type,
    ...options
  };
};

TextfieldRenderer.type = 'textfield';

TextfieldRenderer.label = 'Text Field';