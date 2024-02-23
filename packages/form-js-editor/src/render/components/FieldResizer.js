import {
  useRef
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

export const TOTAL_COLUMNS_PER_ROW = 16;

export function FieldResizer(props) {

  const {
    field,
    position
  } = props;

  const ref = useRef(null);

  const formLayouter = useService('formLayouter');
  const formLayoutValidator = useService('formLayoutValidator');
  const formFieldRegistry = useService('formFieldRegistry');
  const modeling = useService('modeling');
  const dragContext = useRef(null);

  const onResize = throttle((_, delta) => {
    const { x: dx } = delta;

    const deltaColumns = calculateDeltaColumns(
      ref.current,
      dx,
      position
    );

    // validate main and possibly side field
    const fieldChanges = [];

    const main = dragContext.current.main;
    const mainStartColumns = main.field.layout.columns || main.startColumns;
    const mainComputedColumns = mainStartColumns + deltaColumns;

    if (deltaColumns) {
      fieldChanges.push({
        field: main.field,
        columns: mainComputedColumns
      });
    }

    const side = dragContext.current.side;
    let sideComputedColumns;

    if (side) {
      const sideStartColumns = side.field.layout.columns || side.startColumns;
      sideComputedColumns = sideStartColumns - deltaColumns;

      if (deltaColumns) {
        fieldChanges.push({
          field: side.field,
          columns: sideComputedColumns
        });
      }
    }

    const validationErrors = formLayoutValidator.validateChanges(fieldChanges);

    if (validationErrors) {
      return;
    }

    // make resizing updates if validation passed
    main.newColumns = deltaColumns ? mainComputedColumns : null;
    updateColumnWidth(main.columnNode, mainComputedColumns);

    if (side) {
      side.newColumns = deltaColumns ? sideComputedColumns : null;
      updateColumnWidth(side.columnNode, sideComputedColumns);
    }
  });

  const onResizeStart = (event) => {

    const target = getElementNode(field);
    const parent = getParent(target);

    // initialize the main drag context
    const columnNode = getColumnNode(target);
    const startWidth = columnNode.getBoundingClientRect().width;

    dragContext.current = {
      main: {
        startColumns: asColumns(startWidth, parent),
        newColumns: null,
        columnNode,
        field
      }
    };

    // set visual cues for resizing
    setResizing(target, position);

    // if a side field is involved, initialize its drag context
    const sideFieldId = formLayouter.getFieldAtRelativePosition(field.id, position === 'left' ? -1 : 1);

    if (sideFieldId) {

      const sideField = formFieldRegistry.get(sideFieldId);

      if (sideField) {
        const sideElement = getElementNode(sideField);
        const sideColumnNode = getColumnNode(sideElement);
        const sideStartWidth = sideColumnNode.getBoundingClientRect().width;

        dragContext.current.side = {
          startColumns: asColumns(sideStartWidth, parent),
          newColumns: null,
          columnNode: sideColumnNode,
          field: sideField
        };
      }
    }

    // initialize drag handler with the `onResize` function
    const onDragStart = createDragger(onResize);
    onDragStart(event);
  };

  const onResizeEnd = () => {

    // remove resizing classes
    const target = getElementNode(field);
    unsetResizing(target, position);

    // apply changes to the form field layout
    const main = dragContext.current.main;
    if (main.newColumns) {
      modeling.editFormField(main.field, 'layout', {
        ...main.field.layout,
        columns: main.newColumns
      });
    }

    const side = dragContext.current.side;
    if (side && side.newColumns) {
      modeling.editFormField(side.field, 'layout', {
        ...side.field.layout,
        columns: side.newColumns
      });
    }

    dragContext.current = null;
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
      draggable
      onDragStart={ onResizeStart }
      onDragEnd={ onResizeEnd }>
    </div>
  );
}


// helper //////

function asColumns(width, row) {
  const rowWidth = row.getBoundingClientRect().width;
  const columnWidth = (1 / TOTAL_COLUMNS_PER_ROW) * rowWidth;
  const columnCount = Math.round(width / columnWidth);
  const columnCountClamped = Math.min(Math.max(-TOTAL_COLUMNS_PER_ROW, columnCount), TOTAL_COLUMNS_PER_ROW);
  return columnCountClamped;
}

function calculateDeltaColumns(node, deltaX, position) {
  const parent = getParent(node);

  // invert delta if we are resizing from the left
  if (position === 'left') {
    deltaX = deltaX * -1;
  }

  const deltaColumns = asColumns(deltaX, parent);

  return deltaColumns;
}

function updateColumnWidth(node, columns) {
  removeMatching(node, COLUMNS_REGEX);
  node.classList.add(`cds--col-lg-${columns}`);
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

function setResizing(node, position) {
  classes(node).add(ELEMENT_RESIZING_CLS + '-' + position);
}

function unsetResizing(node, position) {
  classes(node).remove(ELEMENT_RESIZING_CLS + '-' + position);
}