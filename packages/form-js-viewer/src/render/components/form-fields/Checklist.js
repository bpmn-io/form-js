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

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;

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
            htmlFor={ itemDomId }
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
              required={ required }
              aria-invalid={ errors.length > 0 }
              aria-describedby={ [ descriptionId, errorMessageId ].join(' ') } />
          </Label>
        );
      })
    }
    <Description id={ descriptionId } description={ description } />
    <Errors id={ errorMessageId } errors={ errors } />
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
