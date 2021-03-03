import {
  batch,
  createState,
  createSignal,
  For,
  onCleanup,
  onMount,
  useContext,
  createEffect
} from 'solid-js';

import { render, Dynamic } from 'solid-js/web';

import mitt from 'mitt';

import arrayMove from 'array-move';

import {
  isArray,
  isFunction
} from 'min-dash';

import {
  Form,
  findFieldRenderer,
  fields as defaultFieldRenderers,
  FormContext,
  FormRenderContext,
  pathsEqual,
  pathParse,
  pathStringify
} from '@bpmn-io/form-js-viewer';

import {
  DragDropContext,
  SelectionContext
} from './context';

const dragula = require('dragula');

const indices = {};

const generateIndexForType = (type) => {
  if (type in indices) {
    indices[ type ]++;
  } else {
    indices[ type ] = 1;
  }

  return indices[ type ];
}

export default class FormEditor {

  constructor(options) {

    this.emitter = mitt();

    const {
      addtionalRenderers = [],
      container
    } = options;

    const renderers = [
      ...addtionalRenderers,
      ...defaultFieldRenderers
    ];

    const {
      schema,
      elementsById
    } = importSchema(options.schema);

    render(() => <App
      renderers={ renderers }
      schema={ schema }
      elementsById={ elementsById } />, container);
  }

  on(event, callback) {
    this.emitter.on(event, callback);
  }

  off(event, callback) {
    this.emitter.off(event, callback);
  }

  addField() {}
  moveField() {}
  removeField() {}
  editField() {}
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function Empty(props) {
  return null;
}

function Element(props) {
  const classes = [ 'element' ];

  const { selection, setSelection } = useContext(SelectionContext);

  if (props.class) {
    classes.push(...props.class.split(' '));
  }

  function selectElement(event) {
    event.stopPropagation();

    setSelection(props.field.id);
  }

  return <div
    className={ classes.join(' ') }
    classList={ { 'fjs-editor-selected': selection() === props.field.id } }
    data-id={ pathStringify(props.dataPath) }
    data-path={ pathStringify(props.schemaPath) }
    onClick={ selectElement }>{ props.children }</div>;
}

function Children(props) {
  const classes = [ 'container', 'drag-container' ];

  if (props.class) {
    classes.push(...props.class.split(' '));
  }

  return (
    <div
      class={ classes.join(' ') }
      data-id={ pathStringify(props.dataPath) }
      data-path={ pathStringify(props.schemaPath) }>
      { props.children }
    </div>
  );
}


function App(props) {

  const [ state, setState ] = createState({
    data: {},
    schema: props.schema
  });

  const [ selection, setSelection ] = createSignal('field_0');

  createEffect(() => {
    console.log('schema', state.schema);
  });

  const addField = (targetPath, targetIndex, field) => {
    setState('schema', ...targetPath, components => arrayAdd(components, targetIndex, field));

    console.log('schema', state.schema);
  };

  const moveField = (sourcePath, targetPath, sourceIndex, targetIndex) => {
    batch(() => {
      if (pathsEqual(sourcePath, targetPath)) {
        if (sourceIndex < targetIndex) {
          targetIndex--;
        }

        console.log(`Move field from ${ pathStringify(sourcePath) }.${ sourceIndex } to ${ pathStringify(targetPath) }.${ targetIndex }`);

        setState('schema', ...targetPath, components => {
          return arrayMove(components, sourceIndex, targetIndex);
        });
      } else {
        const field = removeField(sourcePath, sourceIndex);

        addField(targetPath, targetIndex, field);
      }
    });

    console.log('schema', state.schema);
  };

  const removeField = (sourcePath, sourceIndex) => {
    let field;

    setState('schema', ...sourcePath, components => {
      field = components[ sourceIndex ];

      return arrayRemove(components, sourceIndex)
    });

    console.log('schema', state.schema);

    return clone(field);
  };

  const updateField = (path, data) => {

  };

  const selectedField = () => {
    return props.elementsById[selection()];
  };

  createEffect(() => {
    console.log('SELECTED FIED', selectedField());
  });

  const renderContext = {
    Empty,
    Children,
    Element
  };

  const formContext = {
    fields: {
      add(path, field) {},
      update(path, newPath) {},
      remove(path) {}
    },
    get data() {
      return state.data;
    },
    get errors() {
      return [];
    },
    get properties() {
      return {
        readOnly: true
      }
    },
    getFieldRenderer(field) {
      return findFieldRenderer(props.renderers, field);
    }
  };

  const selectionContext = {
    selection,
    setSelection
  };

  const drake = dragula({
    isContainer(el) {
      return el.classList.contains('drag-container');
    },
    copy(el) {
      return el.classList.contains('drag-copy');
    },
    accepts(el, target) {
      return !target.classList.contains('no-drop');
    }
  });

  const dragDropContext = {
    drake
  };

  drake.on('drop', (el, target, source, sibling) => {
    drake.remove();

    const targetPath = target.dataset.path && pathParse(target.dataset.path),
          targetField = targetPath && findField(state.schema, targetPath);

    if (!isArray(targetField)) {
      return;
    }

    let siblingPath = sibling && sibling.dataset.path && pathParse(sibling.dataset.path),
        targetIndex = siblingPath ? siblingPath.pop() : targetField.length;

    if (source.classList.contains('palette')) {
      const type = el.dataset.fieldType;

      const renderer = findFieldRenderer(props.renderers, type);

      const indexForType = generateIndexForType(type);

      const field = renderer.create({
        key: `${ type }${ indexForType }`,
        label: `${ capitalize(type) } ${ indexForType }`
      });

      addField(targetPath, targetIndex, field);
    } else {
      const fieldPath = el.dataset.path && pathParse(el.dataset.path),
            sourcePath = pathParse(source.dataset.path),
            sourceIndex = fieldPath && fieldPath.pop();

      moveField(sourcePath, targetPath, sourceIndex, targetIndex);
    }
  });

  return (
    <SelectionContext.Provider value={ selectionContext }>
      <DragDropContext.Provider value={ dragDropContext }>
        <FormContext.Provider value={ formContext }>
          <FormRenderContext.Provider value={ renderContext }>
            <div class="fjs-editor">
              <div class="palette-container">
                <Palette renderers={ props.renderers } />
              </div>
              <div class="form-container">
                <Form schema={ state.schema } />
              </div>
              <div class="properties-container">
                <PropertiesPanel
                  element={ selectedField() }
                  onUpdate={ (update) => updateField(selection() || [], update) }
                />
              </div>
            </div>
            <CreatePreview />
          </FormRenderContext.Provider>
        </FormContext.Provider>
      </DragDropContext.Provider>
    </SelectionContext.Provider>
  );
};

function Palette(props) {

  const renderers = () => props.renderers.filter(({ create }) => {
    return isFunction(create) && ['button', 'textfield'].includes(create().type);
  });

  return (
    <div class="palette drag-container">
      <For each={ renderers() }>
        {(renderer) => {
          const {
            label,
            type
          } = renderer.create();

          return (
            <div class="palette-field drag-copy no-drop" data-field-type={ type }>
              { label }
            </div>
          );
        }}
      </For>
    </div>
  );
}


function PropertiesPanel(props) {

  return (
    <div>{ JSON.stringify(props.element) }</div>
  );
}

/**
 * A component that renders a field preview,
 * as it is dragged out from the palette.
 *
 * @param {any} props
 */
function CreatePreview(props) {

  const { drake } = useContext(DragDropContext);

  const { getFieldRenderer } = useContext(FormContext);

  function handleCloned(clone, original, type) {

    const fieldType = clone.dataset.fieldType;

    if (fieldType) {

      const renderer = getFieldRenderer(fieldType);

      let field;

      if (renderer) {
        field = renderer.create();
      }

      if (renderer && field) {

        console.log('Render field preview', field);

        const id = `${ fieldType }_${Math.floor(Math.random() * 100000)}`;

        clone.innerHTML = '';

        render(
          () => <Dynamic
            component={ renderer }
            errors={ [] }
            field={ field }
            id={ id }
            onChange={ () => {} }
            path={ [ id ] }
          />,
          clone
        );
      }
    }
  }

  onMount(() => {
    drake.on('cloned', handleCloned);
  });

  onCleanup(() => {
    drake.off('cloned', handleCloned);
  });

  return null;
}

function findField(schema, schemaPath) {
  return schemaPath.reduce((field, key) => {
    if (field && field[ key ]) {
      return field[ key ];
    }

    return null;
  }, schema);
}

function arrayAdd(array, index, item) {
  const copy = [ ...array ];

  copy.splice(index, 0, item);

  return copy;
}

function arrayRemove(array, index) {
  const copy = [ ...array ];

  copy.splice(index, 1);

  return copy;
}

function capitalize(string) {
  return string.replace(/^\w/, (c) => c.toUpperCase());
}


function importSchema(schema) {

  schema = clone(schema);

  const context = {
    i: 0,
    elementsById: {},
    assignId(el) {

      const id = `field_${this.i++}`;

      el.id = id;
      this.elementsById[id] = el;

      return id;
    }
  };

  visitElement(schema, context);

  return {
    schema,
    elementsById: context.elementsById
  };
}


function visitElement(element, context) {

  const containments = [ 'components', 'columns' ];

  context.assignId(element);

  for (const containment of containments) {
    if (element[containment]) {
      for (const child of element[containment]) {
        visitElement(child, context);
      }
    }
  }
}