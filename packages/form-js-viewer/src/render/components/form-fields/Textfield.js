import { isArray, isObject, isNil } from 'min-dash';
import { formFieldClasses } from '../Util';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';
import InputAdorner from './parts/TemplatedInputAdorner';

const type = 'textfield';

export default function Textfield(props) {
  const {
    disabled,
    errors = [],
    errorMessageId,
    domId,
    onBlur,
    onFocus,
    field,
    readonly,
    value = ''
  } = props;

  const {
    description,
    label,
    appearance = {},
    validate = {}
  } = field;

  const {
    prefixAdorner,
    suffixAdorner
  } = appearance;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.value
    });
  };

  return <div class={ formFieldClasses(type, { errors, disabled, readonly }) }>
    <Label
      id={ domId }
      label={ label }
      required={ required } />
    <InputAdorner disabled={ disabled } readonly={ readonly } pre={ prefixAdorner } post={ suffixAdorner }>
      <input
        class="fjs-input"
        disabled={ disabled }
        readOnly={ readonly }
        id={ domId }
        onInput={ onChange }
        onBlur={ () => onBlur && onBlur() }
        onFocus={ () => onFocus && onFocus() }
        type="text"
        value={ value }
        aria-describedby={ errorMessageId } />
    </InputAdorner>
    <Description description={ description } />
    <Errors errors={ errors } id={ errorMessageId } />
  </div>;
}

Textfield.config = {
  type,
  keyed: true,
  label: 'Text field',
  group: 'basic-input',
  emptyValue: '',
  sanitizeValue: ({ value }) => {
    if (isArray(value) || isObject(value) || isNil(value)) {
      return '';
    }

    // sanitize newlines to spaces
    if (typeof value === 'string') {
      return value.replace(/[\r\n\t]/g, ' ');
    }

    return String(value);
  },
  create: (options = {}) => ({ ...options })
};
