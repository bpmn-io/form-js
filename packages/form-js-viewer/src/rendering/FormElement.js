import {
  useContext,
  useEffect
} from 'preact/hooks';

import {
  FormContext,
  FormRenderContext
} from './context';

import NoopField from './fields/NoopField';

import {
  findData,
  findErrors
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

  const { id } = field;

  if (!Renderer) {
    return <NoopField id={ id } />;
  }

  const value = findData(data, dataPath);

  const fieldErrors = findErrors(errors, dataPath);

  useEffect(() => {
    fields.add(id, {
      ...field,
      dataPath,
      schemaPath
    });
  });

  return (
    <Element { ...props } id={ id }>
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