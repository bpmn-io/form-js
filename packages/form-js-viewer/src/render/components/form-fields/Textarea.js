import { isArray, isObject } from 'min-dash';
import { useCallback, useContext, useEffect, useRef } from 'preact/hooks';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';

const type = 'textarea';


export default function Textarea(props) {
  const {
    disabled,
    errors = [],
    field,
    readonly,
    value = ''
  } = props;

  const {
    description,
    id,
    label,
    validate = {}
  } = field;

  const { required } = validate;

  const textareaRef = useRef();

  const onInput = ({ target }) => {
    props.onChange({
      field,
      value: target.value
    });
  };

  const autoSizeTextarea = useCallback((textarea) => {

    // Ensures the textarea shrinks back, and improves resizing behavior consistency
    textarea.style.height = '0px';

    const computed = window.getComputedStyle(textarea);

    const calculatedHeight = parseInt(computed.getPropertyValue('border-top-width'))
      + parseInt(computed.getPropertyValue('padding-top'))
      + textarea.scrollHeight
      + parseInt(computed.getPropertyValue('padding-bottom'))
      + parseInt(computed.getPropertyValue('border-bottom-width'));

    const minHeight = 75;
    const maxHeight = 350;
    const displayHeight = Math.max(Math.min(calculatedHeight, maxHeight), minHeight);

    textarea.style.height = `${displayHeight}px`;

    // Overflow is hidden by default to hide scrollbar flickering
    textarea.style.overflow = calculatedHeight > maxHeight ? 'visible' : 'hidden';

  }, [ ]);

  useEffect(() => {
    autoSizeTextarea(textareaRef.current);
  }, [ autoSizeTextarea, value ]);

  const { formId } = useContext(FormContext);
  const errorMessageId = errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;

  return <div class={ formFieldClasses(type, { errors, disabled, readonly }) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required } />
    <textarea class="fjs-textarea"
      disabled={ disabled }
      readonly={ readonly }
      id={ prefixId(id, formId) }
      onInput={ onInput }
      value={ value }
      ref={ textareaRef }
      aria-describedby={ errorMessageId } />
    <Description description={ description } />
    <Errors errors={ errors } id={ errorMessageId } />
  </div>;
}

Textarea.config = {
  type,
  keyed: true,
  label: 'Text area',
  group: 'basic-input',
  emptyValue: '',
  sanitizeValue: ({ value }) => (isArray(value) || isObject(value)) ? '' : String(value),
  create: (options = {}) => ({ ...options })
};
