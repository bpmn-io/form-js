import { useContext } from 'preact/hooks';

import classNames from 'classnames';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';

const type = 'checkbox';


export default function Checkbox(props) {
  const {
    disabled,
    errors = [],
    field,
    label,
    readonly,
    value = false
  } = props;

  const {
    description,
    id
  } = field;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.checked
    });
  };


  const { formId } = useContext(FormContext);

  return <div class={ classNames(formFieldClasses(type, errors), { readonly }) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ false }>
      <input
        checked={ value }
        class="fjs-input"

        // todo(pinussilvestrus): a11y concerns?
        tabIndex={ readonly ? -1 : 0 }
        disabled={ disabled }
        id={ prefixId(id, formId) }
        type="checkbox"
        onChange={ onChange } />
    </Label>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Checkbox.create = function(options = {}) {
  return {
    ...options
  };
};

Checkbox.type = type;
Checkbox.label = 'Checkbox';
Checkbox.keyed = true;
Checkbox.emptyValue = false;
Checkbox.sanitizeValue = ({ value }) => value === true;