import {
  formFieldClasses,
  prefixId
} from '../../../src/render/components/Util';

import { Numberfield, Button } from '../../../src';

import { FormContext } from '../../../src/render/context';

import { useContext } from 'preact/hooks';

const btnType = Button.config.type;
const rangeType = 'range';

function CustomButton(props) {
  const {
    disabled,
    field
  } = props;

  const { action = 'submit' } = field;

  return <div class={ formFieldClasses(btnType) }>
    <button class="fjs-button custom-button" type={ action } disabled={ disabled }>{ field.label }</button>
  </div>;
}

CustomButton.config = {
  ...Button.config,
  label: 'Custom Button',
  create: (options = {}) => ({
    action: 'submit',
    ...options
  })
};

function Range(props) {

  const {
    field,
    value
  } = props;

  const {
    min,
    max,
    step,
    id,
    label
  } = field;

  const { formId } = useContext(FormContext);

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: Number(target.value)
    });
  };

  return <div class={ formFieldClasses(rangeType) }>
    <label class="fjs-form-field-label" for={ prefixId(id, formId) }>
      { label }
    </label>
    <input
      type="range"
      id={ prefixId(id, formId) }
      onInput={ onChange }
      min={ min }
      max={ max }
      value={ value }
      step={ step } />
  </div>;
}

Range.config = {
  ...Numberfield.config,
  type: rangeType,
  keyed: true,
  label: 'Range',
  group: 'basic-input'
};

class CustomFormFields {
  constructor(formFields) {
    formFields.register(btnType, CustomButton);
    formFields.register(rangeType, Range);
  }
}

export const CustomFormFieldsModule = {
  __init__: [ 'customFormFields' ],
  customFormFields: [ 'type', CustomFormFields ]
};