import { useContext, useRef } from 'preact/hooks';
import useOptionsAsync, { LOAD_STATES } from '../../hooks/useOptionsAsync';
import useCleanupMultiSelectValues from '../../hooks/useCleanupMultiSelectValues';
import classNames from 'classnames';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import { sanitizeMultiSelectValue } from '../util/sanitizerUtil';

import { createEmptyOptions } from '../util/optionsUtil';

import {
  formFieldClasses
} from '../Util';

const type = 'checklist';


export default function Checklist(props) {
  const {
    disabled,
    errors = [],
    errorMessageId,
    domId,
    onBlur,
    onFocus,
    field,
    readonly,
    value: values = [],
  } = props;

  const {
    description,
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

  useCleanupMultiSelectValues({
    field,
    loadState,
    options,
    values,
    onChange: props.onChange
  });

  const { formId } = useContext(FormContext);

  return <div class={ classNames(formFieldClasses(type, { errors, disabled, readonly })) } ref={ outerDivRef }>
    <Label
      label={ label }
      required={ required } />
    {
      loadState == LOAD_STATES.LOADED && options.map((o, index) => {

        const itemDomId = `${domId}-${index}`;

        return (
          <Label
            id={ itemDomId }
            label={ o.label }
            class={ classNames({
              'fjs-checked': values.includes(v.value)
            }) }
            required={ false }>
            <input
              checked={ values.includes(v.value) }
              class="fjs-input"
              disabled={ disabled }
              readOnly={ readonly }
              id={ itemDomId }
              type="checkbox"
              onClick={ () => toggleCheckbox(o.value) }
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
  label: 'Checkbox group',
  group: 'selection',
  emptyValue: [],
  sanitizeValue: sanitizeMultiSelectValue,
  create: createEmptyOptions
};
