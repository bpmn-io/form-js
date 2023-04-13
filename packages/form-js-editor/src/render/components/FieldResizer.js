import {
  useRef,
  useEffect
} from 'preact/hooks';

import {
  classes,
  query as domQuery
} from 'min-dom';

import { useService } from '../hooks';

import { createDragger, throttle } from './Util';

import { DRAG_NO_MOVE_CLS } from '../../features/dragging/Dragging';

import classNames from 'classnames';

const COLUMNS_REGEX = /^cds--col(-lg)?/;

const ELEMENT_RESIZING_CLS = 'fjs-element-resizing';

const RESIZE_DRAG_PREVIEW_CLS = 'fjs-resize-drag-preview';

const GRID_OFFSET_PX = 16;


export function FieldResizer(props) {

  const {
    field,
    position
  } = props;

  const ref = useRef(null);

  const formLayoutValidator = useService('formLayoutValidator');
  const modeling = useService('modeling');

  // we can't use state as we need to
  // manipulate this inside dragging events
  const context = useRef({
    startColumns: null,
    newColumns: null
  });

  // create a blank canvas to use as drag preview
  // ensure it was only created once
  useEffect(() => {
    let blankCanvas = getDragPreviewImage();

    if (!blankCanvas) {
      blankCanvas = document.createElement('canvas');
      blankCanvas.classList.add(RESIZE_DRAG_PREVIEW_CLS);
      document.body.appendChild(blankCanvas);
    }
  }, []);

  const onResize = throttle((_, delta) => {
    const { x: dx } = delta;

    const { layout = {} } = field;

    const newColumns = calculateNewColumns(
      ref.current,
      layout.columns || context.current.startColumns,
      dx,
      position
    );

    const errorMessage = formLayoutValidator.validateField(field, newColumns);

    if (!errorMessage) {

      context.current.newColumns = newColumns;

      // make visual updates to preview change
      const columnNode = ref.current.closest('.fjs-layout-column');
      removeMatching(columnNode, COLUMNS_REGEX);
      columnNode.classList.add(`cds--col-lg-${newColumns}`);
    }
  });

  const onResizeStart = (event) => {
    const onDragStart = createDragger(onResize, getDragPreviewImage());
    onDragStart(event);

    const target = getElementNode(field);

    // mitigate auto columns on the grid that
    // has a offset of 16px (1rem) to both side
    const columnNode = getColumnNode(target);
    const startWidth = columnNode.getBoundingClientRect().width + GRID_OFFSET_PX;
    context.current.startColumns = asColumns(startWidth, getParent(target));

    setResizing(target, position);
  };

  const onResizeEnd = () => {
    const { layout = {} } = field;

    if (context.current.newColumns) {
      modeling.editFormField(field, 'layout', {
        ...layout,
        columns: parseInt(context.current.newColumns)
      });
    }

    const target = getElementNode(field);
    unsetResizing(target, position);

    context.current.newColumns = null;
  };

  if (field.type === 'default') {
    return null;
  }

  return (
    <div
      ref={ ref }
      class={ classNames(
        'fjs-field-resize-handle',
        'fjs-field-resize-handle-' + position,
        DRAG_NO_MOVE_CLS
      ) }
      draggable={ true }
      onDragStart={ onResizeStart }
      onDragEnd={ onResizeEnd }>
    </div>
  );
}


// helper //////

function asColumns(width, parent) {
  const totalWidth = parent.getBoundingClientRect().width;

  const oneColumn = (1 / 16) * totalWidth;

  return Math.round(width / oneColumn);
}

function calculateNewColumns(node, currentColumns, deltaX, position) {
  const parent = getParent(node);

  // invert delta if we are resizing from the left
  if (position === 'left') {
    deltaX = deltaX * -1;
  }

  const deltaColumns = asColumns(deltaX, parent);

  return currentColumns + deltaColumns;
}

function getParent(node) {
  return node.closest('.fjs-layout-row');
}

function removeMatching(node, regex) {
  return classes(node).removeMatching(regex);
}

function getColumnNode(node) {
  return node.closest('.fjs-layout-column');
}

function getElementNode(field) {
  return domQuery('.fjs-element[data-id="' + field.id + '"]');
}

function getDragPreviewImage() {
  return domQuery('canvas.fjs-resize-drag-preview');
}

function setResizing(node, position) {
  classes(node).add(ELEMENT_RESIZING_CLS + '-' + position);
}

function unsetResizing(node, position) {
  classes(node).remove(ELEMENT_RESIZING_CLS + '-' + position);
}