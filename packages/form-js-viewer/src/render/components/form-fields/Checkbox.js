import { useContext } from 'preact/hooks';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';
import classNames from 'classnames';

const type = 'checkbox';


export default function Checkbox(props) {
  const {
    disabled,
    errors = [],
    field,
    readonly,
    value = false
  } = props;

  const {
    description,
    id,
    label,
    validate = {}
  } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.checked
    });
  };

  const { formId } = useContext(FormContext);
  const errorMessageId = errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;

  return <div class={ classNames(formFieldClasses(type, { errors, disabled, readonly }), { 'fjs-checked': value }) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required }>
      <input
        checked={ value }
        class="fjs-input"
        disabled={ disabled }
        readOnly={ readonly }
        id={ prefixId(id, formId) }
        type="checkbox"
        onChange={ onChange }
        aria-describedby={ errorMessageId } />
    </Label>
    <Description description={ description } />
    <Errors errors={ errors } id={ errorMessageId } />
  </div>;
}

Checkbox.config = {
  type,
  keyed: true,
  label: 'Checkbox',
  group: 'selection',
  emptyValue: false,
  sanitizeValue: ({ value }) => value === true,
  create: (options = {}) => ({
    ...options
  })
};
