import { useRef, useEffect } from 'preact/hooks';

export function createRenderer(customRenderer) {

  const {
    label = 'Custom',
    render,
    type
  } = customRenderer;

  if (!render) {
    throw new Error('renderer does not expose a <render> callback');
  }

  if (!type) {
    throw new Error('renderer does not expose a <type> property');
  }

  return {
    label,
    type,
    render: createFieldRender(render)
  };
}


export function createFieldRender(customRender) {

  return function render(props) {

    const {
      dataPath,
      field,
      schemaPath
    } = props;

    let customRenderer = useRef(null);
    let node = useRef();

    useEffect(() => {
      if (customRenderer.current) {
        customRenderer.current.update({ ...props });
      } else {
        customRenderer = customRender(node, { ...props });
      }

      return () => customRender.cleanup();
    }, [ dataPath, schemaPath, field ]);

    return <div class="form-field form-field-custom" ref={ node }></div>;
  };

}


