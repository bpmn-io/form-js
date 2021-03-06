import { useContext, useEffect } from 'preact/hooks';

import {
  FormContext,
  FormRenderContext
} from './context';

import NoopField from './fields/NoopField';

import {
  findData,
  findErrors,
  pathStringify
} from '../util';

const noop = () => false;


export default function FormElement(props) {
  const {
    dataPath,
    field,
    onChange,
    schemaPath
  } = props;

  const {
    data,
    errors,
    fields,
    properties,
    getFieldRenderer
  } = useContext(FormContext);

  const {
    Element
  } = useContext(FormRenderContext);

  const Renderer = getFieldRenderer(field.type);

  const id = pathStringify(dataPath);

  if (!Renderer) {
    return <NoopField id={ id } />;
  }

  const value = findData(data, dataPath);

  const fieldErrors = findErrors(errors, dataPath);

  const registeredField = {
    ...field,
    dataPath,
    schemaPath
  };

  useEffect(() => {
    fields.add(id, registeredField);

    return () => {
      fields.remove(id);
    };
  }, [ JSON.stringify(registeredField) ]);

  return (
    <Element
      dataPath={ dataPath }
      schemaPath={ schemaPath }
      field={ field }
    >
      <Renderer
        { ...props }
        disabled={ properties.readOnly || false }
        errors={ fieldErrors }
        id={ id }
        onChange={ properties.readOnly ? noop : onChange }
        value={ value } />
    </Element>
  );
}