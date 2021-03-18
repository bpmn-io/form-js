import Description from './Description';
import Errors from './Errors';
import Label from './Label';

import { formFieldClasses } from './Util';

import {
  generateIdForType,
  idToLabel
} from '../../util';


export default function CheckboxRenderer(props) {
  const {
    disabled,
    errors = [],
    field,
    path,
    value = false
  } = props;

  const onChange = ({ target }) => {
    props.onChange({
      path,
      value: target.checked
    });
  };

  return <div class={ formFieldClasses(errors) }>
    <Label label={ field.label } required={ field.validate && field.validate.required } />
    <input
      class="fjs-input"
      type="checkbox"
      checked={ value }
      onChange={ onChange }
      disabled={ disabled } />
    <Description description={ field.description } />
    <Errors errors={ errors } />
  </div>;
}

CheckboxRenderer.create = function(options = {}) {
  const type = 'checkbox';

  const id = generateIdForType(type);

  return {
    id,
    key: id,
    label: idToLabel(id),
    type,
    ...options
  };
};

CheckboxRenderer.type = 'checkbox';

CheckboxRenderer.label = 'Checkbox';