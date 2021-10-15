import { render } from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'preact/hooks';

import {
  FormComponent,
  FormContext,
  FormRenderContext
} from '@bpmn-io/form-js-viewer';

import useService from '../hooks/useService';

import { DragAndDropContext } from '../context';

import Palette from './palette/Palette';
import PropertiesPanel from './properties-panel/PropertiesPanel';

import dragula from 'dragula';

import { ListDeleteIcon } from './properties-panel/icons';

import { iconsByType } from './palette/icons';

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
  const eventBus = useService('eventBus'),
        formEditor = useService('formEditor'),
        formFieldRegistry = useService('formFieldRegistry'),
        modeling = useService('modeling'),
        selection = useService('selection');

  const { field } = props;

  const {
    id,
    type
  } = field;

  const ref = useRef();

  function scrollIntoView({ selection }) {
    if (!selection || selection.id !== id || !ref.current) {
      return;
    }

    const elementBounds = ref.current.getBoundingClientRect(),
          containerBounds = formEditor._container.getBoundingClientRect();

    if (elementBounds.top < 0 || elementBounds.top > containerBounds.bottom) {
      ref.current.scrollIntoView();
    }
  }

  useEffect(() => {
    eventBus.on('selection.changed', scrollIntoView);

    return () => eventBus.off('selection.changed', scrollIntoView);
  }, [ id ]);

  function onClick(event) {
    event.stopPropagation();

    selection.toggle(field);
  }

  const classes = [ 'fjs-element' ];

  if (props.class) {
    classes.push(...props.class.split(' '));
  }

  if (selection.isSelected(field)) {
    classes.push('fjs-editor-selected');
  }

  const onRemove = (event) => {
    event.stopPropagation();

    const parentField = formFieldRegistry.get(field._parent);

    const index = getFormFieldIndex(parentField, field);

    modeling.removeFormField(field, parentField, index);
  };

  return (
    <div
      class={ classes.join(' ') }
      data-id={ id }
      data-field-type={ type }
      onClick={ onClick }
      ref={ ref }>
      <ContextPad>
        {
          selection.isSelected(field) && field.type !== 'default'
            ? <button class="fjs-context-pad-item" onClick={ onRemove }><ListDeleteIcon /></button>
            : null
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
  const eventBus = useService('eventBus'),
        formEditor = useService('formEditor'),
        formFieldRegistry = useService('formFieldRegistry'),
        injector = useService('injector'),
        modeling = useService('modeling'),
        selection = useService('selection');

  const { schema } = formEditor._getState();

  const [ selectedFormField, setSelection ] = useState(schema);

  useEffect(() => {
    function handleSelectionChanged(event) {
      setSelection(event.selection || schema);
    }

    eventBus.on('selection.changed', handleSelectionChanged);

    setSelection(selection.get() || schema);

    return () => {
      eventBus.off('selection.changed', handleSelectionChanged);
    };
  }, [ schema, selection ]);

  const [ drake, setDrake ] = useState(null);

  const dragAndDropContext = {
    drake
  };

  useEffect(() => {
    const createDragulaInstance = () => {
      const dragulaInstance = dragula({
        isContainer(el) {
          return el.classList.contains('fjs-drag-container');
        },
        copy(el) {
          return el.classList.contains('fjs-drag-copy');
        },
        accepts(el, target) {
          return !target.classList.contains('fjs-no-drop');
        },
        slideFactorX: 10,
        slideFactorY: 5
      });

      dragulaInstance.on('drop', (el, target, source, sibling) => {
        dragulaInstance.remove();

        if (!target) {
          return;
        }

        const targetFormField = formFieldRegistry.get(target.dataset.id);

        const siblingFormField = sibling && formFieldRegistry.get(sibling.dataset.id),
              targetIndex = siblingFormField ? getFormFieldIndex(targetFormField, siblingFormField) : targetFormField.components.length;

        if (source.classList.contains('fjs-palette-fields')) {
          const type = el.dataset.fieldType;

          modeling.addFormField({ type }, targetFormField, targetIndex);
        } else {
          const formField = formFieldRegistry.get(el.dataset.id),
                sourceFormField = formFieldRegistry.get(source.dataset.id),
                sourceIndex = getFormFieldIndex(sourceFormField, formField);

          modeling.moveFormField(formField, sourceFormField, targetFormField, sourceIndex, targetIndex);
        }
      });

      eventBus.fire('dragula.created');

      setDrake(dragulaInstance);

      return dragulaInstance;
    };

    let dragulaInstance = createDragulaInstance();

    const onDetach = () => {
      if (dragulaInstance) {
        dragulaInstance.destroy();

        eventBus.fire('dragula.destroyed');
      }
    };

    const onAttach = () => {
      onDetach();

      dragulaInstance = createDragulaInstance();
    };

    eventBus.on('attach', onAttach);
    eventBus.on('detach', onDetach);

    return () => {
      onDetach();

      eventBus.off('attach', onAttach);
      eventBus.off('detach', onDetach);
    };
  }, []);

  const formRenderContext = {
    Children,
    Element,
    Empty
  };

  const formContext = {
    getService(type, strict = true) {

      // TODO(philippfromme): clean up
      if (type === 'formFieldRegistry') {
        return new Map();
      } else if (type === 'form') {
        return {
          _getState() {
            return {
              data: {},
              errors: {},
              properties: {
                readOnly: true
              },
              schema
            };
          }
        };
      }

      return injector.get(type, strict);
    },
    formId: formEditor._id
  };

  const onSubmit = useCallback(() => {}, []);

  const onReset = useCallback(() => {}, []);

  const editField = useCallback((formField, key, value) => modeling.editFormField(formField, key, value), [ modeling ]);

  return (
    <div class="fjs-form-editor">

      <DragAndDropContext.Provider value={ dragAndDropContext }>
        <div class="fjs-palette-container">
          <Palette />
        </div>
        <div class="fjs-form-container">

          <FormContext.Provider value={ formContext }>
            <FormRenderContext.Provider value={ formRenderContext }>
              <FormComponent onSubmit={ onSubmit } onReset={ onReset } />
            </FormRenderContext.Provider>
          </FormContext.Provider>

        </div>
        <CreatePreview />
      </DragAndDropContext.Provider>

      <div class="fjs-properties-container">
        <PropertiesPanel field={ selectedFormField } editField={ editField } />
      </div>
    </div>
  );
}

function getFormFieldIndex(parent, formField) {
  let fieldFormIndex = parent.components.length;

  parent.components.forEach(({ id }, index) => {
    if (id === formField.id) {
      fieldFormIndex = index;
    }
  });

  return fieldFormIndex;
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