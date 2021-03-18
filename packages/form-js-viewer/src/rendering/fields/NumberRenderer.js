import Description from './Description';
import Errors from './Errors';
import Label from './Label';

import { formFieldClasses } from './Util';

import {
  generateIdForType,
  idToLabel
} from '../../util';


export default function NumberRenderer(props) {
  const {
    dataPath,
    disabled,
    errors = [],
    field,
    value
  } = props;

  const onChange = ({ target }) => {
    props.onChange({
      dataPath,
      value: target.value ? parseInt(target.value, 10) : undefined
    });
  };

  return <div class={ formFieldClasses(errors) }>
    <Label label={ field.label } required={ field.validate && field.validate.required } />
    <input
      class="fjs-input"
      type="number"
      disabled={ disabled }
      value={ value }
      onInput={ onChange } />
    <Description description={ field.description } />
    <Errors errors={ errors } />
  </div>;
}

NumberRenderer.create = function(options = {}) {
  const type = 'number';

  const id = generateIdForType(type);

  return {
    id,
    key: id,
    label: idToLabel(id),
    type,
    ...options
  };
};

NumberRenderer.type = 'number';

NumberRenderer.label = 'Number';