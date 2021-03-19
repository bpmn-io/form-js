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
  findErrors,
  pathStringify
} from '../util';

const noop = () => false;


export default function FormElement(props) {
  const {
    path,
    field,
    onChange
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
    return <NoopField field={ field } />;
  }

  const value = findData(data, path);

  const fieldErrors = findErrors(errors, path);

  useEffect(() => {
    fields.set(id, {
      ...field,
      path
    });
  }, [ pathStringify(path) ]);

  return (
    <Element field={ field }>
      <Renderer
        { ...props }
        disabled={ properties.readOnly || false }
        errors={ fieldErrors }
        onChange={ properties.readOnly ? noop : onChange }
        value={ value } />
    </Element>
  );
}