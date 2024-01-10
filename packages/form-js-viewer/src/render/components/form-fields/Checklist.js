import { useRef } from 'preact/hooks';
import { useOptionsAsync, LOAD_STATES } from '../../hooks/useOptionsAsync';
import { useCleanupMultiSelectValue } from '../../hooks/useCleanupMultiSelectValue';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import { Description } from '../Description';
import { Errors } from '../Errors';
import { Label } from '../Label';

import { sanitizeMultiSelectValue, hasEqualValue } from '../util/sanitizerUtil';

import { createEmptyOptions } from '../util/optionsUtil';

import {
  formFieldClasses
} from '../Util';

const type = 'checklist';


export function Checklist(props) {
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

  const toggleCheckbox = (toggledValue) => {

    const newValues = hasEqualValue(toggledValue, values)
      ? values.filter(value => !isEqual(value, toggledValue))
      : [ ...values, toggledValue ];

    props.onChange({
      field,
      value: newValues,
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

  useCleanupMultiSelectValue({
    field,
    loadState,
    options,
    values,
    onChange: props.onChange
  });

  return <div class={ classNames(formFieldClasses(type, { errors, disabled, readonly })) } ref={ outerDivRef }>
    <Label
      label={ label }
      required={ required } />
    {
      loadState == LOAD_STATES.LOADED && options.map((o, index) => {

        const itemDomId = `${domId}-${index}`;
        const isChecked = hasEqualValue(o.value, values);

        return (
          <Label
            id={ itemDomId }
            label={ o.label }
            class={ classNames({
              'fjs-checked': isChecked
            }) }
            required={ false }>
            <input
              checked={ isChecked }
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
