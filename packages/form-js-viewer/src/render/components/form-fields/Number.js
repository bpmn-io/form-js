import Big from 'big.js';
import classNames from 'classnames';
import { useCallback, useContext, useMemo, useRef, useState } from 'preact/hooks';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';
import InputAdorner from './parts/InputAdorner';

import AngelDownIcon from './icons/AngelDown.svg';
import AngelUpIcon from './icons/AngelUp.svg';

import {
  formFieldClasses,
  prefixId
} from '../Util';

import {
  isNullEquivalentValue,
  isValidNumber,
  willKeyProduceValidNumber
} from '../util/numberFieldUtil';

const type = 'number';


export default function Numberfield(props) {
  const {
    disabled,
    errors = [],
    field,
    value,
    readonly,
    onChange
  } = props;

  const {
    description,
    id,
    label,
    appearance = {},
    validate = {},
    decimalDigits,
    serializeToString = false,
    increment: incrementValue
  } = field;

  const {
    prefixAdorner,
    suffixAdorner
  } = appearance;

  const { required } = validate;

  const inputRef = useRef();

  const [ stringValueCache, setStringValueCache ] = useState('');

  // checks whether the value currently in the form data is practically different from the one in the input field cache
  // this allows us to guarantee the field always displays valid form data, but without auto-simplifying values like 1.000 to 1
  const cacheValueMatchesState = useMemo(() => Numberfield.config.sanitizeValue({ value, formField: field }) === Numberfield.config.sanitizeValue({ value: stringValueCache, formField: field }), [ stringValueCache, value, field ]);

  const displayValue = useMemo(() => {

    if (value === 'NaN') return 'NaN';
    if (stringValueCache === '-') return '-';
    return cacheValueMatchesState ? stringValueCache : ((value || value === 0) ? Big(value).toFixed() : '');

  }, [ stringValueCache, value, cacheValueMatchesState ]);

  const arrowIncrementValue = useMemo(() => {

    if (incrementValue) return Big(incrementValue);
    if (decimalDigits) return Big(`1e-${decimalDigits}`);
    return Big('1');

  }, [ decimalDigits, incrementValue ]);


  const setValue = useCallback((stringValue) => {

    if (isNullEquivalentValue(stringValue)) {
      setStringValueCache('');
      onChange({ field, value: null });
      return;
    }

    // treat commas as dots
    stringValue = stringValue.replaceAll(',', '.');

    if (stringValue === '-') {
      setStringValueCache('-');
      return;
    }

    if (isNaN(Number(stringValue))) {
      setStringValueCache('NaN');
      onChange({ field, value: 'NaN' });
      return;
    }

    setStringValueCache(stringValue);
    onChange({ field, value: serializeToString ? stringValue : Number(stringValue) });

  }, [ field, onChange, serializeToString ]);

  const increment = () => {
    if (readonly) {
      return;
    }

    const base = isValidNumber(value) ? Big(value) : Big(0);
    const stepFlooredValue = base.minus(base.mod(arrowIncrementValue));

    // note: toFixed() behaves differently in big.js
    setValue(stepFlooredValue.plus(arrowIncrementValue).toFixed());
  };

  const decrement = () => {
    if (readonly) {
      return;
    }

    const base = isValidNumber(value) ? Big(value) : Big(0);
    const offset = base.mod(arrowIncrementValue);

    if (offset.cmp(0) === 0) {

      // if we're already on a valid step, decrement
      setValue(base.minus(arrowIncrementValue).toFixed());
    }
    else {

      // otherwise floor to the step
      const stepFlooredValue = base.minus(base.mod(arrowIncrementValue));
      setValue(stepFlooredValue.toFixed());
    }
  };

  const onKeyDown = (e) => {

    // delete the NaN state all at once on backspace or delete
    if (value === 'NaN' && (e.code === 'Backspace' || e.code === 'Delete')) {
      setValue(null);
      e.preventDefault();
      return;
    }

    if (e.code === 'ArrowUp') {
      increment();
      e.preventDefault();
      return;
    }

    if (e.code === 'ArrowDown') {
      decrement();
      e.preventDefault();
      return;
    }

  };

  // intercept key presses which would lead to an invalid number
  const onKeyPress = (e) => {
    const caretIndex = inputRef.current.selectionStart;
    const selectionWidth = inputRef.current.selectionStart - inputRef.current.selectionEnd;
    const previousValue = inputRef.current.value;

    if (!willKeyProduceValidNumber(e.key, previousValue, caretIndex, selectionWidth, decimalDigits)) {
      e.preventDefault();
    }
  };

  const { formId } = useContext(FormContext);
  const errorMessageId = errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;

  return <div class={ formFieldClasses(type, { errors, disabled, readonly }) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required } />
    <InputAdorner disabled={ disabled } readonly={ readonly } pre={ prefixAdorner } post={ suffixAdorner }>
      <div class={ classNames('fjs-vertical-group', { 'fjs-disabled': disabled, 'fjs-readonly': readonly }, { 'hasErrors': errors.length }) }>
        <input
          ref={ inputRef }
          class="fjs-input"
          disabled={ disabled }
          readOnly={ readonly }
          id={ prefixId(id, formId) }
          onKeyDown={ onKeyDown }
          onKeyPress={ onKeyPress }

          // @ts-ignore
          onInput={ (e) => setValue(e.target.value) }
          type="text"
          autoComplete="off"
          step={ arrowIncrementValue }
          value={ displayValue }
          aria-describedby={ errorMessageId } />
        <div class={ classNames('fjs-number-arrow-container', { 'fjs-disabled': disabled, 'fjs-readonly': readonly }) }>
          { /* we're disabling tab navigation on both buttons to imitate the native browser behavior of input[type='number'] increment arrows */ }
          <button
            class="fjs-number-arrow-up"
            type="button"
            aria-label="Increment"
            onClick={ () => increment() }
            tabIndex={ -1 }><AngelUpIcon /></button>
          <div class="fjs-number-arrow-separator" />
          <button
            class="fjs-number-arrow-down"
            type="button"
            aria-label="Decrement"
            onClick={ () => decrement() }
            tabIndex={ -1 }><AngelDownIcon /></button>
        </div>
      </div>
    </InputAdorner>
    <Description description={ description } />
    <Errors errors={ errors } id={ errorMessageId } />
  </div>;
}

Numberfield.config = {
  type,
  keyed: true,
  label: 'Number',
  group: 'basic-input',
  emptyValue: null,
  sanitizeValue: ({ value, formField }) => {

    // null state is allowed
    if (isNullEquivalentValue(value)) return null;

    // if data cannot be parsed as a valid number, go into invalid NaN state
    if (!isValidNumber(value)) return 'NaN';

    // otherwise parse to formatting type
    return formField.serializeToString ? value.toString() : Number(value);
  },
  create: (options = {}) => ({
    ...options
  })
};
