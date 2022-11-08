import { useContext } from 'preact/hooks';

import { get, isString } from 'min-dash';

import { FormRenderContext } from '../context';

import useService from '../hooks/useService';
import { useCondition, useConditionEvaluation } from '../hooks/useCondition';

import { findErrors } from '../../util';

const noop = () => false;


export default function FormField(props) {
  const {
    field,
    onChange
  } = props;

  const { _path } = field;

  const formFields = useService('formFields'),
        form = useService('form');

  const {
    data,
    errors,
    properties
  } = form._getState();

  const {
    Element,
    Empty
  } = useContext(FormRenderContext);

  const FormFieldComponent = formFields.get(field.type);

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }

  const value = get(data, _path);

  const fieldErrors = findErrors(errors, _path);

  const disabled = properties.readOnly || field.disabled || false;

  // todo(pinussilvestrus): find a general approach to retrieve conditional expression properties
  const readonly = useCondition(field.readonly, data, false);

  // todo(pinussilvestrus): only demo purposes, remove me later
  // eslint-disable-next-line
  const label = isExpression(field.label) ? useConditionEvaluation(field.label, data, '') : field.label;

  const visible = useCondition(field.condition, data, true);
  if (!visible) {
    return <Empty />;
  }

  return (
    <Element field={ field }>
      <FormFieldComponent
        { ...props }
        disabled={ disabled }
        errors={ fieldErrors }
        onChange={ disabled ? noop : onChange }
        label={ label }
        readonly={ readonly }
        value={ value } />
    </Element>
  );
}


// helper ///////////////

function isExpression(value) {
  return isString(value) && value.startsWith('=');
}
