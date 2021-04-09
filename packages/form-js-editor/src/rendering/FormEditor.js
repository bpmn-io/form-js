import { render } from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useState
} from 'preact/hooks';

import {
  FormContext,
  FormRenderContext,
  Form
} from '@bpmn-io/form-js-viewer';

import {
  DragAndDropContext,
  FormEditorContext,
  SelectionContext
} from './context';

import Palette from './Palette';
import PropertiesPanel from './PropertiesPanel';

import dragula from 'dragula';

import RemoveIcon from './icons/Remove.svg';

import { iconsByType } from './icons';

import { isDefined } from 'min-dash';

function ContextPad(props) {
  if (!props.children) {
    return null;
  }

  return (
    <div class="fjs-context-pad">
      {
        props.children
      }
    </div>
  );
}

function Empty(props) {
  return null;
}

function Element(props) {
  const {
    selection,
    setSelection
  } = useContext(SelectionContext);

  const {
    fields,
    removeField,
    schema
  } = useContext(FormEditorContext);

  const { field } = props;

  const {
    id,
    type
  } = field;

  function onClick(event) {
    if (!field.key) {
      return;
    }

    event.stopPropagation();

    setSelection(id);
  }

  const classes = [ 'fjs-element' ];

  if (props.class) {
    classes.push(...props.class.split(' '));
  }

  if (selection === id) {
    classes.push('fjs-editor-selected');
  }

  const onRemove = () => {
    event.stopPropagation();

    const selectableField = findSelectableField(schema, fields, field);

    const parentField = fields.get(field.parent);

    const index = getFieldIndex(parentField, field);

    removeField(parentField, index);

    if (selectableField) {
      setSelection(selectableField.id);
    } else {
      setSelection(null);
    }
  };

  return (
    <div
      class={ classes.join(' ') }
      data-id={ id }
      data-field-type={ type }
      onClick={ onClick }>
      <ContextPad>
        {
          selection === id ? <button class="fjs-context-pad-item" onClick={ onRemove }><RemoveIcon width="18" /></button> : null
        }
      </ContextPad>
      { props.children }
    </div>
  );
}

function Children(props) {
  const { field } = props;

  const { id } = field;

  const classes = [ 'fjs-children', 'fjs-drag-container' ];

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

export default function FormEditor(props) {
  const {
    fields,
    getFieldRenderer,
    fieldRenderers,
    addField,
    moveField,
    editField,
    emit,
    on,
    off
  } = useContext(FormEditorContext);

  const { schema } = props;

  const [ selection, setSelection ] = useState(findSelectableField(schema, fields)
    ? findSelectableField(schema, fields).id
    : null
  );

  let selectedField;

  if (selection) {
    selectedField = fields.get(selection);
  }

  useEffect(() => {
    emit('selection.changed');
  }, [ selection ]);

  const [ drake, setDrake ] = useState(null);

  const dragAndDropContext = {
    drake
  };

  useEffect(() => {
    const createDragulaInstance = () => {
      const dragulaInstance = dragula({
        isContainer(el) {
          console.log('isContainer', el.classList.contains('fjs-drag-container'), el.classList.toString());

          return el.classList.contains('fjs-drag-container');
        },
        copy(el) {
          return el.classList.contains('fjs-drag-copy');
        },
        accepts(el, target) {
          return !target.classList.contains('fjs-no-drop');
        }
      });

      dragulaInstance.on('cloned', () => console.log('cloned'));
      dragulaInstance.on('over', () => console.log('over'));

      dragulaInstance.on('drop', (el, target, source, sibling) => {
        dragulaInstance.remove();

        if (!target) {
          return;
        }

        const targetField = fields.get(target.dataset.id);

        const siblingField = sibling && fields.get(sibling.dataset.id),
              targetIndex = siblingField ? getFieldIndex(targetField, siblingField) : targetField.components.length;

        if (source.classList.contains('fjs-palette')) {
          const type = el.dataset.fieldType;

          const fieldRenderer = getFieldRenderer(type);

          const newField = fieldRenderer.create({
            parent: targetField.id
          });

          setSelection(newField.id);

          addField(targetField, targetIndex, newField);
        } else {
          const field = fields.get(el.dataset.id),
                sourceField = fields.get(source.dataset.id),
                sourceIndex = getFieldIndex(sourceField, field);

          setSelection(field.id);

          moveField(sourceField, targetField, sourceIndex, targetIndex);
        }
      });

      emit('dragula.created');

      setDrake(dragulaInstance);

      return dragulaInstance;
    };

    let dragulaInstance = createDragulaInstance();

    const onDetach = () => {
      if (dragulaInstance) {
        dragulaInstance.destroy();

        emit('dragula.destroyed');
      }
    };

    const onAttach = () => {
      onDetach();

      dragulaInstance = createDragulaInstance();
    };

    on('attach', onAttach);
    on('detach', onDetach);

    return () => {
      onDetach();

      off('attach', onAttach);
      off('detach', onDetach);
    };
  }, []);

  const selectionContext = {
    selection,
    setSelection
  };

  const formRenderContext = {
    Children,
    Element,
    Empty
  };

  const formContext = {
    fields: new Map(),
    getFieldRenderer,
    properties: {
      readOnly: true
    },
    schema,
    data: {},
    errors: {}
  };

  const onSubmit = useCallback(() => {}, []);

  const onReset = useCallback(() => {}, []);

  return (
    <div class="fjs-form-editor">

      <DragAndDropContext.Provider value={ dragAndDropContext }>
        <div class="fjs-palette-container">
          <Palette fieldRenderers={ fieldRenderers } />
        </div>
        <div class="fjs-form-container">

          <FormContext.Provider value={ formContext }>
            <FormRenderContext.Provider value={ formRenderContext }>
              <SelectionContext.Provider value={ selectionContext }>
                <Form schema={ schema } onSubmit={ onSubmit } onReset={ onReset } />
              </SelectionContext.Provider>
            </FormRenderContext.Provider>
          </FormContext.Provider>

        </div>
        <CreatePreview />
      </DragAndDropContext.Provider>

      <div class="fjs-properties-container">
        <PropertiesPanel field={ selectedField } editField={ editField } />
      </div>
    </div>
  );
}

function getFieldIndex(parent, field) {
  let fieldIndex = parent.components.length;

  parent.components.forEach(({ id }, index) => {
    if (id === field.id) {
      fieldIndex = index;
    }
  });

  return fieldIndex;
}

function CreatePreview(props) {

  const { drake } = useContext(DragAndDropContext);

  function handleCloned(clone, original, type) {

    const fieldType = clone.dataset.fieldType;

    const Icon = iconsByType[ fieldType ];

    if (fieldType) {
      clone.innerHTML = '';

      clone.class = 'gu-mirror';

      render(<Icon />, clone);
    }
  }

  useEffect(() => {
    if (!drake) {
      return;
    }

    drake.on('cloned', handleCloned);

    return () => drake.off('cloned', handleCloned);
  }, [ drake ]);

  return null;
}

function findSelectableField(schema, fields, field) {

  if (field) {
    const parent = fields.get(field.parent);

    const index = getFieldIndex(parent, field);

    return parent.components[ index + 1 ];
  }

  return schema.components.find(field => isDefined(field.key));
}