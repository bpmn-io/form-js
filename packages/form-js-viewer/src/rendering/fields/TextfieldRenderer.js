import Description from './Description';
import Errors from './Errors';
import Label from './Label';

import { formFieldClasses } from './Util';

import { prefixId } from './Util';

import { generateIdForType } from '../../util';

const type = 'textfield';

export default function TextfieldRenderer(props) {
  const {
    disabled,
    errors = [],
    field,
    path,
    value = ''
  } = props;

  const {
    description,
    id,
    label,
    validate = {}
  } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      path,
      value: target.value.length ? target.value : undefined
    });
  };

  return <div class={ formFieldClasses(errors, type) }>
    <Label
      id={ prefixId(id) }
      label={ label }
      required={ required } />
    <input
      class="fjs-input"
      disabled={ disabled }
      id={ prefixId(id) }
      onInput={ onChange }
      type="text"
      value={ value } />
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

TextfieldRenderer.create = function(options = {}) {
  const id = generateIdForType(type);

  return {
    id,
    key: id,
    label: this.label,
    type,
    ...options
  };
};

TextfieldRenderer.type = type;

TextfieldRenderer.label = 'Text Field';