import {
  useContext,
  useEffect
} from 'preact/hooks';

import { FormRenderContext } from '../context';

import useService from '../hooks/useService';

import {
  findData,
  findErrors,
  pathStringify
} from '../../util';

const noop = () => false;


export default function FormField(props) {
  const {
    path,
    field,
    onChange
  } = props;

  const formFieldRegistry = useService('formFieldRegistry'),
        formFields = useService('formFields'),
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

  const { id } = field;

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }

  const value = findData(data, path);

  const fieldErrors = findErrors(errors, path);

  useEffect(() => {
    formFieldRegistry.set(id, {
      ...field,
      path
    });
  }, [ pathStringify(path) ]);

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