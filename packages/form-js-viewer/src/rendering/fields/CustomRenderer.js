import {
  createEffect,
  onMount,
  onCleanup
} from 'solid-js';

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

    let customRenderer;
    let node;

    onMount(() => {
      customRenderer = customRender(node, { ...props });
    });

    createEffect(() => {
      customRenderer.update({ ...props });
    });

    onCleanup(() => {
      customRenderer.cleanup();
    });

    return <div class="form-field form-field-custom" ref={ node }></div>;
  };

}


