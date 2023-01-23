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

import dragula from 'dragula';

import { ListDeleteIcon } from '../../features/properties-panel/icons';

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
        selection = useService('selection'),
        palette = useService('palette'),
        paletteConfig = useService('config.palette'),
        propertiesPanel = useService('propertiesPanel'),
        propertiesPanelConfig = useService('config.propertiesPanel');

  const { schema } = formEditor._getState();

  const paletteRef = useRef(null);
  const propertiesPanelRef = useRef(null);

  const [ , setSelection ] = useState(schema);

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

    const handleDragEvent = (type, context) => {
      return eventBus.fire(type, context);
    };

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

      // bind life cycle events
      dragulaInstance.on('drag', (element, source) => {
        handleDragEvent('drag.start', { element, source });
      });

      dragulaInstance.on('dragend', (element) => {
        handleDragEvent('drag.end', { element });
      });

      dragulaInstance.on('drop', (element, target, source, sibling) => {
        handleDragEvent('drag.drop', { element, target, source, sibling });
      });

      dragulaInstance.on('over', (element, container, source) => {
        handleDragEvent('drag.hover', { element, container, source });
      });

      dragulaInstance.on('out', (element, container, source) => {
        handleDragEvent('drag.out', { element, container, source });
      });

      dragulaInstance.on('cancel', (element, container, source) => {
        handleDragEvent('drag.cancel', { element, container, source });
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

  // fire event after render to notify interested parties
  useEffect(() => {
    eventBus.fire('formEditor.rendered');
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

  // attach default palette
  const hasDefaultPalette = defaultPalette(paletteConfig);

  useEffect(() => {
    if (hasDefaultPalette) {
      palette.attachTo(paletteRef.current);
    }
  }, [ palette, paletteRef, hasDefaultPalette ]);

  // attach default properties panel
  const hasDefaultPropertiesPanel = defaultPropertiesPanel(propertiesPanelConfig);

  useEffect(() => {
    if (hasDefaultPropertiesPanel) {
      propertiesPanel.attachTo(propertiesPanelRef.current);
    }
  }, [ propertiesPanelRef, propertiesPanel, hasDefaultPropertiesPanel ]);

  return (
    <div class="fjs-form-editor">

      <DragAndDropContext.Provider value={ dragAndDropContext }>
        { hasDefaultPalette && <div class="fjs-editor-palette-container" ref={ paletteRef } /> }
        <div class="fjs-form-container">

          <FormContext.Provider value={ formContext }>
            <FormRenderContext.Provider value={ formRenderContext }>
              <FormComponent onSubmit={ onSubmit } onReset={ onReset } />
            </FormRenderContext.Provider>
          </FormContext.Provider>

        </div>
        <CreatePreview />
      </DragAndDropContext.Provider>

      { hasDefaultPropertiesPanel && <div class="fjs-editor-properties-container" ref={ propertiesPanelRef } /> }
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


// helper //////

function defaultPalette(paletteConfig) {
  return !(paletteConfig && paletteConfig.parent);
}

function defaultPropertiesPanel(propertiesPanelConfig) {
  return !(propertiesPanelConfig && propertiesPanelConfig.parent);
}