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

import * as dragula from 'dragula';

import { get } from 'min-dash';

import RemoveIcon from './icons/Remove.svg';

import { iconsByType } from './icons';

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
  const { selection, setSelection } = useContext(SelectionContext);

  const {
    fields,
    removeField
  } = useContext(FormEditorContext);

  const { field } = props;

  const { id } = field;

  function onClick(event) {
    if (!field.key) {
      return;
    }

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

  return (
    <div
      class={ classes.join(' ') }
      data-id={ id }
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
    moveField,
    editField
  } = useContext(FormEditorContext);

  const { schema } = props;

  const [ selection, setSelection ] = useState(null);

  // TODO: This is a dirty hack.
  // When editing a field the field registration will update AFTER we get the it from the
  // field registry, to work around this issue we need to find the field in the schema instead.
  // It's like having an asynchronous element registry which makes no sense.
  let selectedField;

  if (selection) {
    const { schemaPath } = fields.get(selection);

    // The information we need is both in the schema and in the field registration

    // Having a properly imported and maintained structure (with $parent relationships) would allow us
    // to get the up-to-date path at any point
    selectedField = {
      ...get(schema, schemaPath),
      schemaPath
    };
  }

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

        const field = fieldRenderer.create({
          parent: targetField.id
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
    Element,
    Empty
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
        <CreatePreview />
      </DragAndDropContext.Provider>

      <div class="properties-container">
        <PropertiesPanel field={ selectedField } editField={ editField } />
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
    drake.on('cloned', handleCloned);

    return () => drake.off('cloned', handleCloned);
  }, []);

  return null;
}