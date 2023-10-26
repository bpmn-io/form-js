import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses
} from '../Util';

import classNames from 'classnames';

const type = 'checkbox';

export default function Checkbox(props) {
  const {
    disabled,
    errors = [],
    errorMessageId,
    domId,
    onBlur,
    onFocus,
    field,
    readonly,
    value = false
  } = props;

  const {
    description,
    label,
    validate = {}
  } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.checked
    });
  };

  return <div class={ classNames(formFieldClasses(type, { errors, disabled, readonly }), { 'fjs-checked': value }) }>
    <Label
      id={ domId }
      label={ label }
      required={ required }>
      <input
        checked={ value }
        class="fjs-input"
        disabled={ disabled }
        readOnly={ readonly }
        id={ domId }
        type="checkbox"
        onChange={ onChange }
        onBlur={ () => onBlur && onBlur() }
        onFocus={ () => onFocus && onFocus() }
        aria-describedby={ errorMessageId } />
    </Label>
    <Description description={ description } />
    <Errors errors={ errors } id={ errorMessageId } />
  </div>;
}

Checkbox.config = {
  type,
  keyed: true,
  label: 'Checkbox',
  group: 'selection',
  emptyValue: false,
  sanitizeValue: ({ value }) => value === true,
  create: (options = {}) => ({
    ...options
  })
};
