import { useContext } from 'preact/hooks';

import { get } from 'min-dash';

import { FormRenderContext } from '../context';

import {
  useCondition,
  useReadonly,
  useService
} from '../hooks';

import { findErrors } from '../../util';

import { gridColumnClasses } from './Util';

const noop = () => false;


export default function FormField(props) {
  const {
    field,
    onChange
  } = props;

  const formFields = useService('formFields'),
        form = useService('form');

  const {
    data,
    errors,
    properties
  } = form._getState();

  const {
    Element,
    Empty,
    Column
  } = useContext(FormRenderContext);

  const FormFieldComponent = formFields.get(field.type);

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }

  const value = get(data, field._path);

  const fieldErrors = findErrors(errors, field._path);

  const readonly = useReadonly(field, properties);

  // add precedence: global readonly > form field disabled
  const disabled = !properties.readOnly && (
    properties.disabled || field.disabled || false
  );

  const hidden = useCondition(field.conditional && field.conditional.hide || null);

  if (hidden) {
    return <Empty />;
  }

  return (
    <Column field={ field } class={ gridColumnClasses(field) }>
      <Element class="fjs-element" field={ field }>
        <FormFieldComponent
          { ...props }
          disabled={ disabled }
          errors={ fieldErrors }
          onChange={ disabled || readonly ? noop : onChange }
          readonly={ readonly }
          value={ value } />
      </Element>
    </Column>
  );
}
