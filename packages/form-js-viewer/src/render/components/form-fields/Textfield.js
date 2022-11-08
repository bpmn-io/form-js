import { isArray, isObject } from 'min-dash';

import classNames from 'classnames';

import { useContext } from 'preact/hooks';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';
import InputAdorner from './parts/InputAdorner';

const type = 'textfield';


export default function Textfield(props) {
  const {
    disabled,
    errors = [],
    field,
    label,
    readonly,
    value = ''
  } = props;

  const {
    description,
    id,
    prefixAdorner,
    suffixAdorner,
    validate = {}
  } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.value
    });
  };

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required } />
    <InputAdorner disabled={ disabled } readonly={ readonly } pre={ prefixAdorner } post={ suffixAdorner }>
      <input
        class={ classNames('fjs-input', { readonly }) }
        disabled={ disabled }
        readonly={ readonly }
        id={ prefixId(id, formId) }
        onInput={ onChange }
        type="text"
        value={ value } />
    </InputAdorner>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Textfield.create = function(options = {}) {
  return {
    ...options
  };
};

Textfield.type = type;
Textfield.label = 'Text field';
Textfield.keyed = true;
Textfield.emptyValue = '';
Textfield.sanitizeValue = ({ value }) => (isArray(value) || isObject(value)) ? '' : String(value);