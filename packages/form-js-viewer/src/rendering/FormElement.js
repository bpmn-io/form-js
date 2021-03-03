import {
  Show,
  onMount,
  onCleanup,
  createMemo,
  createSignal,
  useContext,
  createEffect,
  splitProps
} from 'solid-js';

import { Dynamic } from 'solid-js/web';

import {
  FormContext,
  FormRenderContext
} from './context';

import NoopField from './fields/NoopField';

import {
  findData,
  findErrors,
  pathsEqual,
  pathStringify
} from '../util';

const noop = () => false;


export default function FormElement(props) {
  const {
    data,
    errors,
    properties,
    getFieldRenderer
  } = useContext(FormContext);

  const renderer = createMemo(
    () => getFieldRenderer(props.field.type),
    null,
    true
  );

  const dataPath = () => props.dataPath;
  const schemaPath = () => props.schemaPath;

  const id = () => pathStringify(schemaPath());

  const value = () => findData(data, dataPath());

  const fieldErrors = () => findErrors(errors, dataPath());

  return (
    <FormElement.Element
      dataPath={ dataPath() }
      schemaPath={ schemaPath() }
      field={ props.field }
    >
      <Show when={ renderer() } fallback={ () => <NoopField id={ id() } /> }>
        <FieldRegistration
          field={ props.field }
          dataPath={ dataPath() }
        />
        <Dynamic
          component={ renderer() }
          errors={ fieldErrors() }
          field={ props.field }
          disabled={ properties.readOnly || false }
          id={ id() }
          onChange={ properties.readOnly ? noop : props.onChange }
          dataPath={ dataPath() }
          schemaPath={ schemaPath() }
          value={ value() }
        />
      </Show>
    </FormElement.Element>
  );
}

function FieldRegistration(props) {
  const {
    fields
  } = useContext(FormContext);

  const [ oldPath, setOldPath ] = createSignal(null);

  createEffect(() => {
    if (!oldPath() || !pathsEqual(oldPath(), props.dataPath)) {
      fields.update(oldPath(), props.dataPath);

      setOldPath(props.dataPath);
    }
  });

  onMount(() => {
    const dataPath = props.dataPath,
          field = props.field;

    field.key && fields.add(dataPath, field);
  });

  onCleanup(() => {
    const path = props.path;
    const field = props.field;

    field.key && fields.remove(path);
  });

  return null;
}

FormElement.unkeyed = function(Component) {

  return function UnkeyedComponent(props) {

    const [ localProps, restProps ] = splitProps(props, [ 'path' ]);

    const path = () => localProps.path.slice(0, -1);

    return <Component { ...restProps } path={ path() } />;
  };
};

FormElement.Children = function(props) {

  const {
    Children
  } = useContext(FormRenderContext);

  return <Children { ...props }>{ props.children }</Children>;
};

FormElement.Element = function(props) {

  const {
    Element
  } = useContext(FormRenderContext);

  return <Element { ...props }>{ props.children }</Element>;
};

FormElement.Empty = function(props) {

  const {
    Empty
  } = useContext(FormRenderContext);

  return <Empty { ...props } />;
};