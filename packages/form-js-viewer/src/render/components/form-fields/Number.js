import { useContext } from 'preact/hooks';

import classNames from 'classnames';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';

const type = 'number';


export default function Number(props) {
  const {
    disabled,
    errors = [],
    field,
    label,
    readonly,
    value
  } = props;

  const {
    description,
    id,
    validate = {}
  } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: Number.sanitizeValue({ value: target.value })
    });
  };

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required } />
    <input
      class={ classNames('fjs-input', { readonly }) }
      disabled={ disabled }
      id={ prefixId(id, formId) }
      onInput={ onChange }
      readonly={ readonly }
      type="number"
      value={ value || '' } />
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Number.create = function(options = {}) {
  return {
    ...options
  };
};

Number.sanitizeValue = ({ value }) => {
  const parsedValue = parseInt(value, 10);
  return isNaN(parsedValue) ? null : parsedValue;
};

Number.type = type;
Number.keyed = true;
Number.label = 'Number';
Number.emptyValue = null;