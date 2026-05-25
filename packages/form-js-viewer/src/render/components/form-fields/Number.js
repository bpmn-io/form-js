import Big from 'big.js';
import classNames from 'classnames';
import { useCallback, useMemo, useRef, useState } from 'preact/hooks';
import { useFlushDebounce, usePrevious } from '../../hooks';

import { Description } from '../Description';
import { Errors } from '../Errors';
import { Warning } from '../Warning';
import { Label } from '../Label';
import { TemplatedInputAdorner } from './parts/TemplatedInputAdorner';

import AngelDownIcon from './icons/AngelDown.svg';
import AngelUpIcon from './icons/AngelUp.svg';

import { formFieldClasses } from '../Util';

import {
  isNullEquivalentValue,
  isValidNumber,
  willKeyProduceValidNumber,
  isNumberInputSafe,
} from '../util/numberFieldUtil';

const type = 'number';

export function Numberfield(props) {
  const { disabled, errors = [], domId, onBlur, onFocus, field, value, readonly } = props;

  const {
    description,
    label,
    appearance = {},
    validate = {},
    decimalDigits,
    increment: incrementValue,
    serializeToString,
  } = field;

  const { prefixAdorner, suffixAdorner } = appearance;

  const { required } = validate;

  /** @type {import("preact").RefObject<HTMLInputElement>} */
  const inputRef = useRef();

  const [cachedValue, setCachedValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);

  const sanitize = useCallback((value) => Numberfield.config.sanitizeValue({ value, formField: field }), [field]);

  const [debouncedOnChange, flushOnChange] = useFlushDebounce(props.onChange);

  const previousCachedValue = usePrevious(value);

  if (previousCachedValue !== cachedValue) {
    debouncedOnChange({ field, value: cachedValue });
  }

  const onInputBlur = () => {
    flushOnChange && flushOnChange();
    onBlur && onBlur();
  };

  const onInputFocus = () => {
    onFocus && onFocus();
  };

  // all value changes must go through this function
  const setValue = useCallback(
    (stringValue) => {
      if (isNullEquivalentValue(stringValue)) {
        setDisplayValue('');
        setCachedValue(null);
        return;
      }

      // converts automatically for countries where the comma is used as a decimal separator
      stringValue = stringValue.replaceAll(',', '.');

      if (stringValue === '-') {
        setDisplayValue('-');
        return;
      }

      // provides feedback for invalid numbers entered via pasting as opposed to just ignoring the paste
      if (isNaN(Number(stringValue))) {
        setDisplayValue('NaN');
        setCachedValue(null);
        return;
      }

      setDisplayValue(stringValue);
      setCachedValue(sanitize(stringValue));
    },
    [sanitize],
  );

  // when external changes occur independently of the input, we update the display and cache values of the component
  const previousValue = usePrevious(value);
  const outerValueChanged = previousValue != value;
  const outerValueEqualsCache = sanitize(value) === sanitize(cachedValue);

  if (outerValueChanged && !outerValueEqualsCache) {
    setValue((value && value.toString()) || '');
  }

  // caches the value an increment/decrement operation will be based on
  const incrementAmount = useMemo(() => {
    if (incrementValue) return Big(incrementValue);
    if (decimalDigits) return Big(`1e-${decimalDigits}`);
    return Big('1');
  }, [decimalDigits, incrementValue]);

  // determine whether stepping would produce a value that loses precision as a Number
  const arrowsDisabled = useMemo(() => {
    if (serializeToString) return false;

    const base = isValidNumber(cachedValue) ? Big(cachedValue) : Big(0);

    const stepFlooredValue = base.minus(base.mod(incrementAmount));
    const incrementedValue = stepFlooredValue.plus(incrementAmount).toFixed();

    const offset = base.mod(incrementAmount);
    let decrementedValue;
    if (offset.cmp(0) === 0) {
      decrementedValue = base.minus(incrementAmount).toFixed();
    } else {
      decrementedValue = base.minus(offset).toFixed();
    }

    return !isNumberInputSafe(incrementedValue) && !isNumberInputSafe(decrementedValue);
  }, [cachedValue, incrementAmount, serializeToString]);

  const increment = () => {
    if (readonly || arrowsDisabled) {
      return;
    }

    const base = isValidNumber(cachedValue) ? Big(cachedValue) : Big(0);
    const stepFlooredValue = base.minus(base.mod(incrementAmount));
    const newValue = stepFlooredValue.plus(incrementAmount).toFixed();

    // note: toFixed() behaves differently in big.js
    setValue(newValue);
  };

  const decrement = () => {
    if (readonly || arrowsDisabled) {
      return;
    }

    const base = isValidNumber(cachedValue) ? Big(cachedValue) : Big(0);
    const offset = base.mod(incrementAmount);

    let newValue;
    if (offset.cmp(0) === 0) {
      // if we're already on a valid step, decrement
      newValue = base.minus(incrementAmount).toFixed();
    } else {
      // otherwise floor to the step
      const stepFlooredValue = base.minus(base.mod(incrementAmount));
      newValue = stepFlooredValue.toFixed();
    }

    setValue(newValue);
  };

  const onKeyDown = (e) => {
    // delete the NaN state all at once on backspace or delete
    if (displayValue === 'NaN' && (e.code === 'Backspace' || e.code === 'Delete')) {
      setValue('');
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

    if (e.code === 'Enter') {
      flushOnChange && flushOnChange();
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

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;
  const warningMessageId = `${domId}-warning-message`;

  const precisionWarnings = useMemo(() => {
    if (serializeToString || !isValidNumber(displayValue) || isNumberInputSafe(displayValue.toString())) {
      return [];
    }
    return ['This value exceeds the precision supported by this field. It will be rounded.'];
  }, [serializeToString, displayValue]);

  return (
    <div class={formFieldClasses(type, { errors, disabled, readonly })}>
      <Label htmlFor={domId} label={label} required={required} />
      <TemplatedInputAdorner disabled={disabled} readonly={readonly} pre={prefixAdorner} post={suffixAdorner}>
        <div
          class={classNames(
            'fjs-vertical-group',
            { 'fjs-disabled': disabled, 'fjs-readonly': readonly },
            { hasErrors: errors.length },
          )}>
          <input
            ref={inputRef}
            class="fjs-input"
            disabled={disabled}
            readOnly={readonly}
            id={domId}
            onKeyDown={onKeyDown}
            onKeyPress={onKeyPress}
            onBlur={onInputBlur}
            onFocus={onInputFocus}
            // @ts-ignore
            onInput={(e) => setValue(e.target.value, true)}
            onPaste={(e) => displayValue === 'NaN' && e.preventDefault()}
            type="text"
            autoComplete="off"
            step={incrementAmount}
            value={displayValue}
            aria-describedby={[descriptionId, errorMessageId, warningMessageId].join(' ')}
            required={required}
            aria-invalid={errors.length > 0}
          />
          <div class={classNames('fjs-number-arrow-container', { 'fjs-disabled': disabled || arrowsDisabled, 'fjs-readonly': readonly })}>
            {/* we're disabling tab navigation on both buttons to imitate the native browser behavior of input[type='number'] increment arrows */}
            <button
              type="button"
              class="fjs-number-arrow-up"
              aria-label="Increment"
              disabled={disabled || arrowsDisabled}
              onClick={() => increment()}
              tabIndex={-1}>
              <AngelUpIcon />
            </button>
            <div class="fjs-number-arrow-separator" />
            <button
              type="button"
              class="fjs-number-arrow-down"
              aria-label="Decrement"
              disabled={disabled || arrowsDisabled}
              onClick={() => decrement()}
              tabIndex={-1}>
              <AngelDownIcon />
            </button>
          </div>
        </div>
      </TemplatedInputAdorner>
      <Description id={descriptionId} description={description} />
      <Errors id={errorMessageId} errors={errors} />
      <Warning id={warningMessageId} warnings={precisionWarnings} />
    </div>
  );
}

Numberfield.config = {
  type,
  keyed: true,
  name: 'Number',
  group: 'basic-input',
  emptyValue: null,
  sanitizeValue: ({ value, formField }) => {
    // invalid value types are sanitized to null
    if (isNullEquivalentValue(value) || !isValidNumber(value)) return null;

    // otherwise, we return a string or a number depending on the form field configuration
    return formField.serializeToString ? value.toString() : Number(value);
  },
  create: (options = {}) => ({
    label: 'Number',
    ...options,
  }),
};
