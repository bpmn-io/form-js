import { useContext } from 'preact/hooks';

import { get } from 'min-dash';

import { FormRenderContext } from '../context';

import useService from '../hooks/useService';

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
    Element
  } = useContext(FormRenderContext);

  const FormFieldComponent = formFields.get(field.type);

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }

  const value = get(data, _path);

  const fieldErrors = findErrors(errors, _path);

  const disabled = properties.readOnly || field.disabled || false;

  return (
    <Element field={ field }>
      <FormFieldComponent
        { ...props }
        disabled={ disabled }
        errors={ fieldErrors }
        onChange={ disabled ? noop : onChange }
        value={ value } />
    </Element>
  );
}