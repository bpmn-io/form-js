import { useContext, useRef } from 'preact/hooks';
import useValuesAsync, { LOAD_STATES } from '../../hooks/useValuesAsync';
import classNames from 'classnames';
import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import { sanitizeMultiSelectValue } from '../util/sanitizerUtil';

import { createEmptyOptions } from '../util/valuesUtil';

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
    value = [],
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

    let newValue = [ ...value ];

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
    state: loadState,
    values: options
  } = useValuesAsync(field);

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
              'fjs-checked': value.includes(v.value)
            }) }
            required={ false }>
            <input
              checked={ value.includes(v.value) }
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
