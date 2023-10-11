import { useContext, useRef } from 'preact/hooks';
import useOptionsAsync, { LOAD_STATES } from '../../hooks/useOptionsAsync';
import classNames from 'classnames';
import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import { sanitizeSingleSelectValue } from '../util/sanitizerUtil';

import { createEmptyOptions } from '../util/optionsUtil';

import {
  formFieldClasses,
  prefixId
} from '../Util';

const type = 'radio';


export default function Radio(props) {
  const {
    disabled,
    errors = [],
    onBlur,
    onFocus,
    field,
    readonly,
    value
  } = props;

  const {
    description,
    id,
    label,
    validate = {}
  } = field;

  const outerDivRef = useRef();

  const { required } = validate;

  const onChange = (v) => {
    props.onChange({
      field,
      value: v
    });
  };

  const onRadioBlur = (e) => {
    if (outerDivRef.current.contains(e.relatedTarget)) {
      return;
    }

    onBlur && onBlur();
  };

  const onRadioFocus = (e) => {
    if (outerDivRef.current.contains(e.relatedTarget)) {
      return;
    }

    onFocus && onFocus();
  };

  const {
    loadState,
    options
  } = useOptionsAsync(field);

  const { formId } = useContext(FormContext);
  const errorMessageId = errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;

  return <div class={ formFieldClasses(type, { errors, disabled, readonly }) } ref={ outerDivRef }>
    <Label
      label={ label }
      required={ required } />
    {
      loadState == LOAD_STATES.LOADED && options.map((option, index) => {
        return (
          <Label
            id={ prefixId(`${ id }-${ index }`, formId) }
            key={ `${ id }-${ index }` }
            label={ option.label }
            class={ classNames({ 'fjs-checked': option.value === value }) }
            required={ false }>
            <input
              checked={ option.value === value }
              class="fjs-input"
              disabled={ disabled }
              readOnly={ readonly }
              id={ prefixId(`${ id }-${ index }`, formId) }
              type="radio"
              onClick={ () => onChange(option.value) }
              onBlur={ onRadioBlur }
              onFocus={ onRadioFocus }
              aria-describedby={ errorMessageId } />
          </Label>
        );
      })
    }
    <Description description={ description } />
    <Errors errors={ errors } id={ errorMessageId } />
  </div>;
}

Radio.config = {
  type,
  keyed: true,
  label: 'Radio',
  group: 'selection',
  emptyValue: null,
  sanitizeValue: sanitizeSingleSelectValue,
  create: createEmptyOptions
};
