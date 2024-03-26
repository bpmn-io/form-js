import { render } from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'preact/hooks';

import {
  FormComponent,
  FormContext,
  FormRenderContext,
  getScrollContainer
} from '@bpmn-io/form-js-viewer';

import {
  EmptyFormIcon
} from './icons';

import classNames from 'classnames';

import { useService } from '../hooks/useService';

import { DragAndDropContext } from '../context';

import { DeleteIcon, DraggableIcon } from './icons';

import { ModularSection } from './ModularSection';
import { Palette, collectPaletteEntries, getPaletteIcon } from '../../features/palette/components/Palette';
import { InjectedRendersRoot } from '../../features/render-injection/components/InjectedRendersRoot';

import { SlotFillRoot } from '../../features/render-injection/slot-fill';

import {
  DRAG_CONTAINER_CLS,
  DROP_CONTAINER_HORIZONTAL_CLS,
  DROP_CONTAINER_VERTICAL_CLS,
  DRAG_MOVE_CLS,
  DRAG_ROW_MOVE_CLS
} from '../../features/dragging/Dragging';

import {
  FieldDragPreview
} from './FieldDragPreview';

import {
  FieldResizer
} from './FieldResizer';

import { set as setCursor, unset as unsetCursor } from '../util/Cursor';

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

function EmptyGroup() {
  return (
    <div class="fjs-empty-component">
      <span class="fjs-empty-component-text">Drag and drop components here.</span>
    </div>
  );
}

function EmptyForm() {
  return (
    <div class="fjs-empty-editor">
      <div class="fjs-empty-editor-card">
        <EmptyFormIcon />
        <h2>Build your form</h2>
        <span>Drag and drop components here to start designing.</span>
        <span>Use the preview window to test your form.</span>
      </div>
    </div>
  );
}

function Empty(props) {
  if ([ 'group', 'dynamiclist' ].includes(props.field.type)) {
    return <EmptyGroup />;
  }

  if (props.field.type === 'default') {
    return <EmptyForm />;
  }

  return null;
}

function Element(props) {
  const eventBus = useService('eventBus'),
        formFieldRegistry = useService('formFieldRegistry'),
        formFields = useService('formFields'),
        modeling = useService('modeling'),
        selection = useService('selection');

  const { hoverInfo } = useContext(FormRenderContext);

  const { field } = props;

  const {
    id,
    type,
    showOutline
  } = field;

  const ref = useRef();

  const [ hovered, setHovered ] = useState(false);

  useEffect(() => {

    function scrollIntoView({ selection }) {
      const scrollContainer = getScrollContainer(ref.current);
      if (!selection || selection.type === 'default' || selection.id !== id || !scrollContainer || !ref.current) {
        return;
      }

      const elementBounds = ref.current.getBoundingClientRect();
      const scrollContainerBounds = scrollContainer.getBoundingClientRect();
      const isElementLarger = elementBounds.height > scrollContainerBounds.height;
      const isNotFullyVisible = elementBounds.bottom > scrollContainerBounds.bottom || elementBounds.top < scrollContainerBounds.top;

      if (isNotFullyVisible && !isElementLarger) {
        ref.current.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      }
    }

    eventBus.on('selection.changed', scrollIntoView);

    return () => eventBus.off('selection.changed', scrollIntoView);
  }, [ eventBus, id ]);

  useLayoutEffect(() => {
    if (selection.isSelected(field)) {
      ref.current.focus();
    }
  }, [ selection, field ]);

  function onClick(event) {
    event.stopPropagation();

    selection.toggle(field);

    // properly focus on field
    ref.current.focus();
  }

  const isSelected = selection.isSelected(field);

  const classString = useMemo(() => {

    const classes = [];

    if (props.class) {
      classes.push(...props.class.split(' '));
    }

    if (isSelected) {
      classes.push('fjs-editor-selected');
    }

    const grouplike = [ 'group', 'dynamiclist' ].includes(type);

    if (grouplike) {
      classes.push(showOutline ? 'fjs-outlined' : 'fjs-dashed-outlined');
    }

    if (hovered) {
      classes.push('fjs-editor-hovered');
    }

    return classes.join(' ');

  }, [ hovered, isSelected, props.class, showOutline, type ]);

  const onRemove = (event) => {
    event.stopPropagation();

    const parentField = formFieldRegistry.get(field._parent);

    const index = getFormFieldIndex(parentField, field);

    modeling.removeFormField(field, parentField, index);
  };

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      selection.toggle(field);
    }
  };

  return (
    <div
      class={ classString }
      data-id={ id }
      data-field-type={ type }
      tabIndex={ type === 'default' ? -1 : 0 }
      onClick={ onClick }
      onKeyPress={ onKeyPress }
      onMouseOver={
        (e) => {
          if (hoverInfo.cleanup) {
            hoverInfo.cleanup();
          }

          setHovered(true);
          hoverInfo.cleanup = () => setHovered(false);
          e.stopPropagation();
        }
      }
      ref={ ref }>
      <DebugColumns field={ field } />
      <ContextPad>
        {
          selection.isSelected(field) && field.type !== 'default'
            ? <button type="button" title={ getRemoveButtonTitle(field, formFields) } class="fjs-context-pad-item" onClick={ onRemove }><DeleteIcon /></button>
            : null
        }
      </ContextPad>
      { props.children }
      <FieldResizer position="left" field={ field }></FieldResizer>
      <FieldResizer position="right" field={ field }></FieldResizer>
    </div>
  );
}

function DebugColumns(props) {

  const { field } = props;

  const debugColumnsConfig = useService('config.debugColumns');

  if (!debugColumnsConfig || field.type == 'default') {
    return null;
  }

  return (
    <div
      style="width: fit-content;
        padding: 2px 6px;
        height: 16px;
        background: var(--color-blue-205-100-95);
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: -2px;
        z-index: 2;
        font-size: 10px;
        right: 3px;"
      class="fjs-debug-columns">
      { (field.layout || {}).columns || 'auto' }
    </div>
  );
}

function Children(props) {
  const { field } = props;

  const { id } = field;

  const classes = [ 'fjs-children', DROP_CONTAINER_VERTICAL_CLS ];

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

function Row(props) {
  const { row } = props;

  const { id } = row;

  const classes = [ DROP_CONTAINER_HORIZONTAL_CLS ];

  if (props.class) {
    classes.push(...props.class.split(' '));
  }

  return (
    <div class={ classNames(DRAG_ROW_MOVE_CLS) }>
      <span class="fjs-row-dragger">
        <DraggableIcon></DraggableIcon>
      </span>
      <div
        class={ classes.join(' ') }
        style={ props.style }
        data-row-id={ id }>
        { props.children }
      </div>
    </div>
  );
}

function Column(props) {
  const { field } = props;

  const classes = [ DRAG_MOVE_CLS ];

  if (field.type === 'default') {
    return props.children;
  }

  if (props.class) {
    classes.push(...props.class.split(' '));
  }

  return (
    <div
      data-field-type={ field.type }
      class={ classes.join(' ') }>
      { props.children }
    </div>
  );
}

export function FormEditor() {
  const dragging = useService('dragging'),
        eventBus = useService('eventBus'),
        formEditor = useService('formEditor'),
        injector = useService('injector'),
        selection = useService('selection'),
        propertiesPanel = useService('propertiesPanel'),
        propertiesPanelConfig = useService('config.propertiesPanel');

  const { schema, properties } = formEditor._getState();

  const { ariaLabel } = properties;

  const formContainerRef = useRef(null);

  const propertiesPanelRef = useRef(null);

  const [ , setSelection ] = useState(schema);

  const [ hasInitialized, setHasInitialized ] = useState(false);

  useEffect(() => {
    function handleSelectionChanged(event) {
      setSelection(event.selection || schema);
    }

    eventBus.on('selection.changed', handleSelectionChanged);

    return () => {
      eventBus.off('selection.changed', handleSelectionChanged);
    };
  }, [ eventBus, schema ]);

  useEffect(() => {
    setSelection(selection.get() || schema);
  }, [ selection, schema ]);

  const [ drake, setDrake ] = useState(null);

  const dragAndDropContext = {
    drake
  };

  useEffect(() => {

    let dragulaInstance = dragging.createDragulaInstance({
      container: [
        DRAG_CONTAINER_CLS,
        DROP_CONTAINER_VERTICAL_CLS,
        DROP_CONTAINER_HORIZONTAL_CLS
      ],
      mirrorContainer: formContainerRef.current
    });

    setDrake(dragulaInstance);

    const onDetach = () => {
      if (dragulaInstance) {
        dragulaInstance.destroy();
        eventBus.fire('dragula.destroyed');
      }
    };

    const onAttach = () => {
      onDetach();

      dragulaInstance = dragging.createDragulaInstance({
        container: [
          DRAG_CONTAINER_CLS,
          DROP_CONTAINER_VERTICAL_CLS,
          DROP_CONTAINER_HORIZONTAL_CLS
        ],
        mirrorContainer: formContainerRef.current
      });
      setDrake(dragulaInstance);
    };

    const onCreate = (drake) => {
      setDrake(drake);
    };

    const onDragStart = () => {
      setCursor('grabbing');
    };

    const onDragEnd = () => {
      unsetCursor();
    };

    eventBus.on('attach', onAttach);
    eventBus.on('detach', onDetach);
    eventBus.on('dragula.created', onCreate);
    eventBus.on('drag.start', onDragStart);
    eventBus.on('drag.end', onDragEnd);

    return () => {
      onDetach();

      eventBus.off('attach', onAttach);
      eventBus.off('detach', onDetach);
      eventBus.off('dragula.created', onCreate);
      eventBus.off('drag.start', onDragStart);
      eventBus.off('drag.end', onDragEnd);
    };
  }, [ dragging, eventBus ]);

  // fire event after render to notify interested parties
  useEffect(() => {

    if (hasInitialized) {
      return;
    }

    setHasInitialized(true);
    eventBus.fire('rendered');

    // keep deprecated event to ensure backward compatibility
    eventBus.fire('formEditor.rendered');
  }, [ eventBus, hasInitialized ]);

  const formRenderContext = useMemo(() => ({
    Children,
    Column,
    Element,
    Empty,
    Row,
    hoverInfo: {}
  }), []);

  const formContext = useMemo(() => ({
    getService(type, strict = true) {

      // TODO(philippfromme): clean up
      if (type === 'form') {
        return {
          _getState() {
            return {
              data: {},
              errors: {},
              properties: {
                ariaLabel,
                disabled: true
              },
              schema
            };
          }
        };
      }

      return injector.get(type, strict);
    },
    formId: formEditor._id
  }), [ ariaLabel, formEditor, injector, schema ]);

  const onSubmit = useCallback(() => {}, []);

  const onReset = useCallback(() => {}, []);

  // attach default properties panel
  const hasDefaultPropertiesPanel = defaultPropertiesPanel(propertiesPanelConfig);

  useEffect(() => {
    if (hasDefaultPropertiesPanel) {
      propertiesPanel.attachTo(propertiesPanelRef.current);
    }
  }, [ propertiesPanelRef, propertiesPanel, hasDefaultPropertiesPanel ]);

  return (
    <div class="fjs-form-editor">
      <SlotFillRoot>
        <DragAndDropContext.Provider value={ dragAndDropContext }>
          <ModularSection rootClass="fjs-palette-container" section="palette">
            <Palette />
          </ModularSection>
          <div ref={ formContainerRef } class="fjs-form-container">
            <FormContext.Provider value={ formContext }>
              <FormRenderContext.Provider

                // @ts-ignore
                value={ formRenderContext }>
                <FormComponent onSubmit={ onSubmit } onReset={ onReset } />
              </FormRenderContext.Provider>
            </FormContext.Provider>
          </div>
          <CreatePreview />
        </DragAndDropContext.Provider>
        { hasDefaultPropertiesPanel && <div class="fjs-editor-properties-container" ref={ propertiesPanelRef } /> }
        <ModularSection rootClass="fjs-render-injector-container" section="renderInjector">
          <InjectedRendersRoot />
        </ModularSection>
      </SlotFillRoot>
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

  const formFields = useService('formFields');

  useEffect(() => {
    if (!drake) {
      return;
    }

    function handleCloned(clone, original, type) {

      const fieldType = clone.dataset.fieldType;

      // (1) field preview
      if (fieldType) {

        const paletteEntry = findPaletteEntry(fieldType, formFields);

        if (!paletteEntry) {
          return;
        }

        const { label } = paletteEntry;

        const Icon = getPaletteIcon(paletteEntry);

        clone.innerHTML = '';

        clone.class = 'gu-mirror';
        clone.classList.add('fjs-field-preview-container');

        if (original.classList.contains('fjs-palette-field')) {

          // default to auto columns when creating from palette
          clone.classList.add('cds--col');
        }

        // todo(pinussilvestrus): dragula, how to mitigate cursor position
        // https://github.com/bevacqua/dragula/issues/285
        render(
          <FieldDragPreview label={ label } Icon={ Icon } />,
          clone
        );
      } else {

        // (2) row preview

        // remove elements from copy (context pad, row dragger, ...)
        [
          'fjs-context-pad',
          'fjs-row-dragger',
          'fjs-debug-columns'
        ].forEach(cls => {
          const cloneNode = clone.querySelectorAll('.' + cls);
          cloneNode.length && cloneNode.forEach(e => e.remove());
        });

        // mirror grid
        clone.classList.add('cds--grid');
        clone.classList.add('cds--grid--condensed');
      }
    }

    drake.on('cloned', handleCloned);

    return () => drake.off('cloned', handleCloned);
  }, [ drake, formFields ]);

  return null;
}


// helper //////

function findPaletteEntry(type, formFields) {
  return collectPaletteEntries(formFields).find(entry => entry.type === type);
}

function defaultPropertiesPanel(propertiesPanelConfig) {
  return !(propertiesPanelConfig && propertiesPanelConfig.parent);
}

function getRemoveButtonTitle(formField, formFields) {
  const entry = findPaletteEntry(formField.type, formFields);

  if (!entry) {
    return 'Remove form field';
  }

  return `Remove ${entry.label}`;
}