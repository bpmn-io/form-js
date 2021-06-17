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

  const { path } = field;

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

  const value = get(data, path);

  const fieldErrors = findErrors(errors, path);

  return (
    <Element field={ field }>
      <FormFieldComponent
        { ...props }
        disabled={ properties.readOnly || false }
        errors={ fieldErrors }
        onChange={ properties.readOnly ? noop : onChange }
        value={ value } />
    </Element>
  );
}