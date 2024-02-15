import { isArray, isObject, isNil } from 'min-dash';

import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';
import { useFlushDebounce } from '../../hooks/useFlushDebounce';

import { formFieldClasses } from '../Util';

import { Description } from '../Description';
import { Errors } from '../Errors';
import { Label } from '../Label';

const type = 'textarea';

export function Textarea(props) {
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
    validate = {}
  } = field;

  const { required } = validate;
  const textareaRef = useRef();

  const [ onChange, flushOnChange ] = useFlushDebounce(({ target }) => {
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

  const onInputChange = (event) => {
    onChange({ target: event.target });
    autoSizeTextarea(textareaRef.current);
  };

  useLayoutEffect(() => {
    autoSizeTextarea(textareaRef.current);
  }, [ value ]);

  useEffect(() => {
    autoSizeTextarea(textareaRef.current);
  }, []);

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;

  return <div class={ formFieldClasses(type, { errors, disabled, readonly }) }>
    <Label
      htmlFor={ domId }
      label={ label }
      required={ required } />
    <textarea class="fjs-textarea"
      disabled={ disabled }
      readonly={ readonly }
      id={ domId }
      onInput={ onInputChange }
      onBlur={ onInputBlur }
      onFocus={ onInputFocus }
      value={ value }
      ref={ textareaRef }
      aria-describedby={ [ descriptionId, errorMessageId ].join(' ') }
      required={ required }
      aria-invalid={ errors.length > 0 } />
    <Description id={ descriptionId } description={ description } />
    <Errors id={ errorMessageId } errors={ errors } />
  </div>;
}

Textarea.config = {
  type,
  keyed: true,
  label: 'Text area',
  group: 'basic-input',
  emptyValue: '',
  sanitizeValue: ({ value }) => (isArray(value) || isObject(value) || isNil(value)) ? '' : String(value),
  create: (options = {}) => ({ ...options })
};

const autoSizeTextarea = (textarea) => {

  // Ensures the textarea shrinks back, and improves resizing behavior consistency
  textarea.style.height = '0px';

  const computed = window.getComputedStyle(textarea);

  const heightFromLines = () => {
    const lineHeight = parseInt(computed.getPropertyValue('line-height').replace('px', '')) || 0;
    const lines = textarea.value ? textarea.value.toString().split('\n').length : 0;
    return lines * lineHeight;
  };

  const calculatedHeight = parseInt(computed.getPropertyValue('border-top-width'))
    + parseInt(computed.getPropertyValue('padding-top'))
    + (textarea.scrollHeight || heightFromLines())
    + parseInt(computed.getPropertyValue('padding-bottom'))
    + parseInt(computed.getPropertyValue('border-bottom-width'));

  const minHeight = 75;
  const maxHeight = 350;
  const displayHeight = Math.max(Math.min(calculatedHeight || 0, maxHeight), minHeight);

  textarea.style.height = `${displayHeight}px`;

  // Overflow is hidden by default to hide scrollbar flickering
  textarea.style.overflow = calculatedHeight > maxHeight ? 'visible' : 'hidden';

};
