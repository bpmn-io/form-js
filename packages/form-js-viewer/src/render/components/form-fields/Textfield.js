import { isArray, isObject, isNil } from 'min-dash';
import { formFieldClasses } from '../Util';

import { Description } from '../Description';
import { Errors } from '../Errors';
import { Label } from '../Label';
import { TemplatedInputAdorner } from './parts/TemplatedInputAdorner';

import { useFlushDebounce } from '../../hooks/useFlushDebounce';

const type = 'textfield';

export function Textfield(props) {
  const {
    disabled,
    errors = [],
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

  const [ onInputChange, flushOnChange ] = useFlushDebounce(({ target }) => {
    props.onChange({
      field,
      value: target.value
    });
  });

  const onInputBlur = () => {
    flushOnChange && flushOnChange();
    onBlur && onBlur();
  };

  const onInputFocus = () => {
    onFocus && onFocus();
  };

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;

  return <div class={ formFieldClasses(type, { errors, disabled, readonly }) }>
    <Label
      htmlFor={ domId }
      label={ label }
      required={ required } />
    <TemplatedInputAdorner disabled={ disabled } readonly={ readonly } pre={ prefixAdorner } post={ suffixAdorner }>
      <input
        class="fjs-input"
        disabled={ disabled }
        readOnly={ readonly }
        id={ domId }
        onInput={ onInputChange }
        onBlur={ onInputBlur }
        onFocus={ onInputFocus }
        type="text"
        value={ value }
        aria-describedby={ [ descriptionId, errorMessageId ].join(' ') }
        required={ required }
        aria-invalid={ errors.length > 0 } />
    </TemplatedInputAdorner>
    <Description id={ descriptionId } description={ description } />
    <Errors id={ errorMessageId } errors={ errors } />
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
