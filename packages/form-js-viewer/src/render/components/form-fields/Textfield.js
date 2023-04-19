import { isArray, isObject } from 'min-dash';
import { useContext } from 'preact/hooks';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';
import InputAdorner from './parts/InputAdorner';

import {
  formFieldClasses,
  prefixId
} from '../Util';

const type = 'textfield';


export default function Textfield(props) {
  const {
    disabled,
    errors = [],
    field,
    value = ''
  } = props;

  const {
    description,
    id,
    label,
    appearance = {},
    validate = {}
  } = field;

  const {
    prefixAdorner,
    suffixAdorner
  } = appearance;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.value
    });
  };

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type, { errors, disabled }) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required } />
    <InputAdorner disabled={ disabled } pre={ prefixAdorner } post={ suffixAdorner }>
      <input
        class="fjs-input"
        disabled={ disabled }
        id={ prefixId(id, formId) }
        onInput={ onChange }
        type="text"
        value={ value } />
    </InputAdorner>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Textfield.config = {
  type,
  keyed: true,
  label: 'Text field',
  group: 'basic-input',
  emptyValue: '',
  sanitizeValue: ({ value }) => (isArray(value) || isObject(value)) ? '' : String(value),
  create: (options = {}) => ({ ...options })
};
