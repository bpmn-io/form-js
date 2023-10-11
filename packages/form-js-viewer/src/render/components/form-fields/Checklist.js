import { useContext, useEffect, useRef } from 'preact/hooks';
import useOptionsAsync, { LOAD_STATES } from '../../hooks/useOptionsAsync';
import classNames from 'classnames';
import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import { sanitizeMultiSelectValue } from '../util/sanitizerUtil';

import { createEmptyOptions } from '../util/optionsUtil';

import {
  formFieldClasses,
  prefixId
} from '../Util';

const type = 'checklist';


export default function Checklist(props) {
  const {
    disabled,
    errors = [],
    onBlur,
    onFocus,
    field,
    readonly,
    value: values = [],
  } = props;

  const {
    description,
    id,
    label,
    validate = {}
  } = field;

  const outerDivRef = useRef();

  const { required } = validate;

  const toggleCheckbox = (v) => {

    let newValue = [ ...values ];

    if (!newValue.includes(v)) {
      newValue.push(v);
    } else {
      newValue = newValue.filter(x => x != v);
    }

    props.onChange({
      field,
      value: newValue,
    });
  };

  const onCheckboxBlur = (e) => {

    if (outerDivRef.current.contains(e.relatedTarget)) {
      return;
    }

    onBlur && onBlur();
  };

  const onCheckboxFocus = (e) => {

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

  return <div class={ classNames(formFieldClasses(type, { errors, disabled, readonly })) } ref={ outerDivRef }>
    <Label
      label={ label }
      required={ required } />
    {
      loadState == LOAD_STATES.LOADED && options.map((v, index) => {
        return (
          <Label
            id={ prefixId(`${id}-${index}`, formId) }
            key={ `${id}-${index}` }
            label={ v.label }
            class={ classNames({
              'fjs-checked': values.includes(v.value)
            }) }
            required={ false }>
            <input
              checked={ values.includes(v.value) }
              class="fjs-input"
              disabled={ disabled }
              readOnly={ readonly }
              id={ prefixId(`${id}-${index}`, formId) }
              type="checkbox"
              onClick={ () => toggleCheckbox(v.value) }
              onBlur={ onCheckboxBlur }
              onFocus={ onCheckboxFocus }
              aria-describedby={ errorMessageId } />
          </Label>
        );
      })
    }
    <Description description={ description } />
    <Errors errors={ errors } id={ errorMessageId } />
  </div>;
}

Checklist.config = {
  type,
  keyed: true,
  label: 'Checklist',
  group: 'selection',
  emptyValue: [],
  sanitizeValue: sanitizeMultiSelectValue,
  create: createEmptyOptions
};
