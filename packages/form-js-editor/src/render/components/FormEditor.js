import { render } from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'preact/hooks';

import {
  FormComponent,
  FormContext,
  FormRenderContext
} from '@bpmn-io/form-js-viewer';

import classNames from 'classnames';

import useService from '../hooks/useService';

import { DragAndDropContext } from '../context';

import { DeleteIcon, DraggableIcon } from './icons';

import ModularSection from './ModularSection';
import Palette, { PALETTE_ENTRIES } from '../../features/palette/components/Palette';
import PropertiesPanel from '../../features/properties-panel/PropertiesPanel';
import InjectedRendersRoot from '../../features/render-injection/components/InjectedRendersRoot';

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

  const classes = [];

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

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      selection.toggle(field);
    }
  };

  return (
    <div
      class={ classes.join(' ') }
      data-id={ id }
      data-field-type={ type }
      tabIndex={ type === 'default' ? -1 : 0 }
      onClick={ onClick }
      onKeyPress={ onKeyPress }
      ref={ ref }>
      <DebugColumns field={ field } />
      <ContextPad>
        {
          selection.isSelected(field) && field.type !== 'default'
            ? <button class="fjs-context-pad-item" onClick={ onRemove }><DeleteIcon /></button>
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

export default function FormEditor(props) {
  const dragging = useService('dragging'),
        eventBus = useService('eventBus'),
        formEditor = useService('formEditor'),
        injector = useService('injector'),
        selection = useService('selection');

  const { schema, properties } = formEditor._getState();

  const { ariaLabel } = properties;

  const formContainerRef = useRef(null);

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

    let dragulaInstance = dragging.createDragulaInstance({
      container: [
        DRAG_CONTAINER_CLS,
        DROP_CONTAINER_VERTICAL_CLS,
        DROP_CONTAINER_HORIZONTAL_CLS
      ],
      direction: 'vertical',
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
        direction: 'vertical',
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
    eventBus.fire('formEditor.rendered');
  }, []);

  const formRenderContext = {
    Children,
    Column,
    Element,
    Empty,
    Row
  };

  const formContext = {
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
  };

  const onSubmit = useCallback(() => {}, []);

  const onReset = useCallback(() => {}, []);

  return (
    <div class="fjs-form-editor">
      <SlotFillRoot>
        <DragAndDropContext.Provider value={ dragAndDropContext }>
          <ModularSection rootClass="fjs-palette-container" section="palette">
            <Palette />
          </ModularSection>
          <div ref={ formContainerRef } class="fjs-form-container">
            <FormContext.Provider value={ formContext }>
              <FormRenderContext.Provider value={ formRenderContext }>
                <FormComponent onSubmit={ onSubmit } onReset={ onReset } />
              </FormRenderContext.Provider>
            </FormContext.Provider>
          </div>
          <CreatePreview />
        </DragAndDropContext.Provider>
        <ModularSection rootClass="fjs-properties-container" section="propertiesPanel">
          <PropertiesPanel />
        </ModularSection>
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

  function handleCloned(clone, original, type) {

    const fieldType = clone.dataset.fieldType;

    // (1) field preview
    if (fieldType) {

      const { label } = findPaletteEntry(fieldType);

      const Icon = iconsByType(fieldType);

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

function findPaletteEntry(type) {
  return PALETTE_ENTRIES.find(entry => entry.type === type);
}