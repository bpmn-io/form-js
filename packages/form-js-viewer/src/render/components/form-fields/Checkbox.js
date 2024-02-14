import { Description } from '../Description';
import { Errors } from '../Errors';
import { Label } from '../Label';

import {
  formFieldClasses
} from '../Util';

import classNames from 'classnames';

const type = 'checkbox';

export function Checkbox(props) {
  const {
    disabled,
    errors = [],
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

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;

  return <div class={ classNames(formFieldClasses(type, { errors, disabled, readonly }), { 'fjs-checked': value }) }>
    <Label
      htmlFor={ domId }
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
        required={ required }
        aria-invalid={ errors.length > 0 }
        aria-describedby={ [ descriptionId, errorMessageId ].join(' ') } />
    </Label>
    <Description id={ descriptionId } description={ description } />
    <Errors id={ errorMessageId } errors={ errors } />
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
