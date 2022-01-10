import { useContext } from 'preact/hooks';

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
    value
  } = props;

  const {
    description,
    id,
    label,
    validate = {}
  } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    const parsedValue = parseInt(target.value, 10);

    props.onChange({
      field,
      value: isNaN(parsedValue) ? null : parsedValue
    });
  };

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required } />
    <input
      class="fjs-input"
      disabled={ disabled }
      id={ prefixId(id, formId) }
      onInput={ onChange }
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

Number.type = type;
Number.keyed = true;
Number.label = 'Number';
Number.emptyValue = null;