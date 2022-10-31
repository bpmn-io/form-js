import Big from 'big.js';
import classNames from 'classnames';
import { useCallback, useContext, useMemo, useRef, useState } from 'preact/hooks';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

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
    onChange
  } = props;

  const {
    description,
    id,
    label,
    validate = {},
    decimalDigits,
    serializeToString = false,
    increment
  } = field;

  const { required } = validate;

  const inputRef = useRef();

  const [ stringValueCache, setStringValueCache ] = useState('');

  const valueCacheMismatch = useMemo(() => Numberfield.sanitizeValue({ value, formField: field }) !== Numberfield.sanitizeValue({ value: stringValueCache, formField: field }), [ stringValueCache, value, field ]);

  const displayValue = useMemo(() => {

    if (value === 'NaN') return 'NaN';
    return valueCacheMismatch ? ((value || value === 0) ? Big(value).toFixed() : '') : stringValueCache;

  }, [ stringValueCache, value, valueCacheMismatch ]);

  const arrowIncrement = useMemo(() => {

    if (increment) return Big(increment);
    if (decimalDigits) return Big(`1e-${decimalDigits}`);
    return Big('1');

  }, [ decimalDigits, increment ]);


  const setValue = useCallback((stringValue) => {

    if (isNullEquivalentValue(stringValue)) {
      setStringValueCache('');
      onChange({ field, value: null });
      return;
    }

    // treat commas as dots
    stringValue = stringValue.replaceAll(',', '.');

    if (isNaN(Number(stringValue))) {
      setStringValueCache('NaN');
      onChange({ field, value: 'NaN' });
      return;
    }

    setStringValueCache(stringValue);
    onChange({ field, value: serializeToString ? stringValue : Number(stringValue) });

  }, [ field, onChange, serializeToString ]);

  const addIncrement = () => {
    const base = isValidNumber(value) ? Big(value) : Big(0);
    const stepFlooredValue = base.minus(base.mod(arrowIncrement));

    // note: toFixed() behaves differently in big.js
    setValue(stepFlooredValue.plus(arrowIncrement).toFixed());
  };

  const decrement = () => {
    const base = isValidNumber(value) ? Big(value) : Big(0);
    const offset = base.mod(arrowIncrement);

    if (offset.cmp(0) === 0) {

      // if we're already on a valid step, decrement
      setValue(base.minus(arrowIncrement).toFixed());
    }
    else {

      // otherwise floor to the step
      const stepFlooredValue = base.minus(base.mod(arrowIncrement));
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
      addIncrement();
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
    const carretIndex = inputRef.current.selectionStart;
    const selectionWidth = inputRef.current.selectionStart - inputRef.current.selectionEnd;
    const previousValue = inputRef.current.value;

    if (!willKeyProduceValidNumber(e.key, previousValue, carretIndex, selectionWidth, decimalDigits)) {
      e.preventDefault();
    }
  };

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type, { errors, disabled }) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required } />
    <div class={ classNames('fjs-input-group', { 'disabled': disabled }, { 'hasErrors': errors.length }) }>
      <input
        ref={ inputRef }
        class="fjs-input"
        disabled={ disabled }
        id={ prefixId(id, formId) }
        onKeyDown={ onKeyDown }
        onKeyPress={ onKeyPress }

        // @ts-ignore
        onInput={ (e) => setValue(e.target.value) }
        type="text"
        autoComplete="off"
        step={ arrowIncrement }
        value={ displayValue } />
      <div class={ classNames('fjs-number-arrow-container', { 'disabled': disabled }) }>
        <button class="fjs-number-arrowUp" onClick={ () => addIncrement() } tabIndex={ -1 }>˄</button>
        <div class="fjs-number-arrow-separator" />
        <button class="fjs-number-arrowDown" onClick={ () => decrement() } tabIndex={ -1 }>˅</button>
      </div>
    </div>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Numberfield.create = (options = {}) => options;
Numberfield.sanitizeValue = ({ value, formField }) => {

  // null state is allowed
  if (isNullEquivalentValue(value)) return null;

  // if data cannot be parsed as a valid number, go into invalid NaN state
  if (!isValidNumber(value)) return 'NaN';

  // otherwise parse to formatting type
  return formField.serializeToString ? value.toString() : Number(value);
};

Numberfield.type = type;
Numberfield.keyed = true;
Numberfield.label = 'Number';
Numberfield.emptyValue = null;