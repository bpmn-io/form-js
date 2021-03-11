import { Fragment } from 'preact';
import { useContext, useState, useEffect, useCallback } from 'preact/hooks';

import {
  FormContext,
  FormRenderContext,
  Form,
  generateIdForType
} from '@bpmn-io/form-js-viewer';

import {
  DragAndDropContext,
  FormEditorContext,
  SelectionContext
} from './context';

import * as dragula from 'dragula';


function Palette(props) {
  const fieldRenderers = props.fieldRenderers.filter(({ create }) => {
    return create && ['button', 'textfield'].includes(create().type);
  });

  return <Fragment>
    <div class="palette-header">FORM ELEMENTS LIBRARY</div>
    <div class="palette drag-container">
      {
        fieldRenderers.map((fieldRenderer) => {
          const {
            label,
            icon,
            type
          } = fieldRenderer.create();

          return (
            <div class="palette-field drag-copy no-drop" data-field-type={ type }>
              {
                icon ? <img class="palette-field-icon" src={ icon } /> : null
              }
              <span>{ label }</span>
            </div>
          );
        })
      }
    </div>
  </Fragment>;
}

const PropertiesPanel = (props) => {
  const { field = {} } = props;

  return <pre>{ JSON.stringify(field, null, 2) }</pre>;
};

function Element(props) {
  const { selection, setSelection } = useContext(SelectionContext);

  const {
    fields,
    removeField
  } = useContext(FormEditorContext);

  const { field } = props;

  const { id } = field;

  function onClick(event) {
    event.stopPropagation();

    setSelection(id);
  }

  const classes = [ 'element' ];

  if (props.class) {
    classes.push(...props.class.split(' '));
  }

  if (selection === id) {
    classes.push('fjs-editor-selected');
  }

  const onRemove = () => {
    event.stopPropagation();

    const parentField = fields.get(field.parent);

    const index = getFieldIndex(parentField, field);

    removeField(parentField, index);
  };

  return <div
    class={ classes.join(' ') }
    data-id={ id }
    onClick={ onClick }>
    {
      selection === id ? <button class="fjs-editor-remove" onClick={ onRemove }>Remove</button> : null
    }
    { props.children }
  </div>;
}

function Children(props) {
  const { id } = props;

  const classes = [ 'container', 'drag-container' ];

  if (props.class) {
    classes.push(...props.class.split(' '));
  }

  return (
    <div
      class={ classes.join(' ') }
      data-id={ id }>
      { props.children }
    </div>
  );
}

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

export default function FormEditor(props) {
  const {
    fields,
    getFieldRenderer,
    fieldRenderers,
    addField,
    moveField
  } = useContext(FormEditorContext);

  const { schema } = props;

  const [ selection, setSelection ] = useState(null);

  const selectedField = fields.get(selection);

  const dragAndDropContext = {
    drake
  };

  useEffect(() => {
    drake.on('drop', (el, target, source, sibling) => {
      drake.remove();

      if (!target) {
        return;
      }

      const targetField = fields.get(target.dataset.id);

      const siblingField = sibling && fields.get(sibling.dataset.id),
            targetIndex = siblingField ? getFieldIndex(targetField, siblingField) : targetField.components.length;

      if (source.classList.contains('palette')) {
        const type = el.dataset.fieldType;

        const fieldRenderer = getFieldRenderer(type);

        const id = generateIdForType(type);

        const field = fieldRenderer.create({
          id,
          parent: targetField.id,
          key: id,
          label: capitalize(id)
        });

        addField(targetField, targetIndex, field);
      } else {
        const field = fields.get(el.dataset.id),
              sourceField = fields.get(source.dataset.id),
              sourceIndex = getFieldIndex(sourceField, field);

        moveField(sourceField, targetField, sourceIndex, targetIndex);
      }
    });
  }, []);

  const selectionContext = {
    selection,
    setSelection
  };

  const formRenderContext = {
    Children,
    Element
  };

  const formContext = {
    fields,
    getFieldRenderer,
    properties: {
      readOnly: true
    },
    schema,
    data: {},
    errors: {}
  };

  const onSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  const onReset = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <div class="fjs-editor">

      <DragAndDropContext.Provider value={ dragAndDropContext }>
        <div class="palette-container">
          <Palette fieldRenderers={ fieldRenderers } />
        </div>
        <div class="form-container">

          <FormContext.Provider value={ formContext }>
            <FormRenderContext.Provider value={ formRenderContext }>
              <SelectionContext.Provider value={ selectionContext }>
                <Form schema={ schema } onSubmit={ onSubmit } onReset={ onReset } />
              </SelectionContext.Provider>
            </FormRenderContext.Provider>
          </FormContext.Provider>

        </div>
      </DragAndDropContext.Provider>

      <div class="properties-container">
        <PropertiesPanel field={ selectedField } />
      </div>
    </div>
  );
}

function getFieldIndex(targetField, field) {
  let targetIndex = targetField.components.length;

  targetField.components.forEach(({ id }, index) => {
    if (id === field.id) {
      targetIndex = index;
    }
  });

  return targetIndex;
}

function capitalize(string) {
  return string.replace(/^\w/, (c) => c.toUpperCase());
}