import dragula from '@bpmn-io/draggle';

import { set as setCursor } from '../../render/util/Cursor';
import { getAncestryList } from '@bpmn-io/form-js-viewer';

export const DRAG_CONTAINER_CLS = 'fjs-drag-container';
export const DROP_CONTAINER_VERTICAL_CLS = 'fjs-drop-container-vertical';
export const DROP_CONTAINER_HORIZONTAL_CLS = 'fjs-drop-container-horizontal';
export const DRAG_MOVE_CLS = 'fjs-drag-move';
export const DRAG_ROW_MOVE_CLS = 'fjs-drag-row-move';
export const DRAG_COPY_CLS = 'fjs-drag-copy';
export const DRAG_NO_DROP_CLS = 'fjs-no-drop';
export const DRAG_NO_MOVE_CLS = 'fjs-no-move';
export const ERROR_DROP_CLS = 'fjs-error-drop';

/**
 * @typedef { { id: String, components: Array<any> } } FormRow
 */

export class Dragging {

  /**
   * @constructor
   *
   * @param { import('../../core/FormFieldRegistry').FormFieldRegistry } formFieldRegistry
   * @param { import('../../core/FormLayouter').FormLayouter } formLayouter
   * @param { import('../../core/FormLayoutValidator').FormLayoutValidator } formLayoutValidator
   * @param { import('../../core/EventBus').EventBus } eventBus
   * @param { import('../modeling/Modeling').Modeling } modeling
   * @param { import('@bpmn-io/form-js-viewer').PathRegistry } pathRegistry
   */
  constructor(formFieldRegistry, formLayouter, formLayoutValidator, eventBus, modeling, pathRegistry) {
    this._formFieldRegistry = formFieldRegistry;
    this._formLayouter = formLayouter;
    this._formLayoutValidator = formLayoutValidator;
    this._eventBus = eventBus;
    this._modeling = modeling;
    this._pathRegistry = pathRegistry;
  }

  /**
   * Calculates position in form schema given the dropped place.
   *
   * @param { FormRow } targetRow
   * @param { any } targetFormField
   * @param { HTMLElement } sibling
   * @returns { number }
   */
  getTargetIndex(targetRow, targetFormField, sibling) {

    /** @type HTMLElement */
    const siblingFormFieldNode = sibling && sibling.querySelector('.fjs-element');
    const siblingFormField = siblingFormFieldNode && this._formFieldRegistry.get(siblingFormFieldNode.dataset.id);

    // (1) dropped before existing field => place before
    if (siblingFormField) {
      return getFormFieldIndex(targetFormField, siblingFormField);
    }

    // (2) dropped in row => place at the end of row (after last field in row)
    if (targetRow) {
      return (
        getFormFieldIndex(
          targetFormField,
          this._formFieldRegistry.get(
            targetRow.components[targetRow.components.length - 1],
          ),
        ) + 1
      );
    }

    // (3) dropped as last item
    return targetFormField.components.length;
  }

  validateDrop(element, target) {
    const formFieldNode = element.querySelector('.fjs-element');
    const targetRow = this._formLayouter.getRow(target.dataset.rowId);

    let columns;
    let formField;
    let targetParentId;

    if (formFieldNode) {
      formField = this._formFieldRegistry.get(formFieldNode.dataset.id);
      columns = (formField.layout || {}).columns;

      // (1) check for row constraints
      if (isRow(target)) {
        targetParentId = getFormParent(target).dataset.id;
        const rowError = this._formLayoutValidator.validateField(formField, columns, targetRow);
        if (rowError) {
          return rowError;
        }
      }
      else {
        targetParentId = target.dataset.id;
      }

      // (2) check target is a valid parent
      if (!targetParentId) {
        return 'Drop is not a valid target';
      }

      // (3) check  for path collisions
      const targetParentFormField = this._formFieldRegistry.get(targetParentId);
      const currentParentFormField = this._formFieldRegistry.get(formField._parent);

      if (targetParentFormField !== currentParentFormField) {
        const targetParentPath = this._pathRegistry.getValuePath(targetParentFormField);
        const currentParentPath = this._pathRegistry.getValuePath(currentParentFormField);

        if (targetParentPath.join('.') !== currentParentPath.join('.')) {

          const isDropAllowedByPathRegistry = this._pathRegistry.executeRecursivelyOnFields(formField, ({ field, isClosed, isRepeatable }) => {
            const options = {
              cutoffNode: currentParentFormField.id,
            };

            const fieldPath = this._pathRegistry.getValuePath(field, options);
            return this._pathRegistry.canClaimPath([ ...targetParentPath, ...fieldPath ], { isClosed, isRepeatable, knownAncestorIds: getAncestryList(targetParentId, this._formFieldRegistry) });
          });

          if (!isDropAllowedByPathRegistry) {
            return 'Drop not allowed by path registry';
          }
        }
      }
    }
  }

  moveField(element, source, targetRow, targetFormField, targetIndex) {
    const formFieldNode = element.querySelector('.fjs-element');
    const formField = this._formFieldRegistry.get(formFieldNode.dataset.id);

    const sourceParent = getFormParent(source);
    const sourceFormField = this._formFieldRegistry.get(sourceParent.dataset.id);
    const sourceIndex = getFormFieldIndex(sourceFormField, formField);
    const sourceRow = this._formLayouter.getRowForField(formField);

    this._modeling.moveFormField(
      formField,
      sourceFormField,
      targetFormField,
      sourceIndex,
      targetIndex,
      sourceRow,
      targetRow
    );
  }

  createNewField(element, targetRow, targetFormField, targetIndex) {
    const type = element.dataset.fieldType;

    let attrs = {
      type
    };

    attrs = {
      ...attrs,
      _parent: targetFormField.id,
      layout: {
        row: targetRow ? targetRow.id : this._formLayouter.nextRowId(),

        // enable auto columns
        columns: null
      }
    };

    this._modeling.addFormField(attrs, targetFormField, targetIndex);
  }

  handleRowDrop(el, target, source, sibling) {
    const targetFormField = this._formFieldRegistry.get(target.dataset.id);
    const rowNode = el.querySelector('.fjs-layout-row');
    const row = this._formLayouter.getRow(rowNode.dataset.rowId);

    // move each field in the row before first field of sibling row
    row.components.forEach((id, index) => {
      const formField = this._formFieldRegistry.get(id);

      const sourceParent = getFormParent(source);
      const sourceFormField = this._formFieldRegistry.get(sourceParent.dataset.id);

      const siblingRowNode = sibling && sibling.querySelector('.fjs-layout-row');
      const siblingRow = siblingRowNode && this._formLayouter.getRow(siblingRowNode.dataset.rowId);
      const siblingFormField = sibling && this._formFieldRegistry.get(
        siblingRow.components[0]
      );

      const sourceIndex = getFormFieldIndex(sourceFormField, formField);
      const targetIndex = (
        siblingRowNode ? getFormFieldIndex(targetFormField, siblingFormField) : targetFormField.components.length
      ) + index;

      this._modeling.moveFormField(
        formField,
        sourceFormField,
        targetFormField,
        sourceIndex,
        targetIndex,
        row,
        row);
    });
  }

  handleElementDrop(el, target, source, sibling, drake) {

    // (1) detect drop target
    const targetFormField = this._formFieldRegistry.get(getFormParent(target).dataset.id);

    let targetRow;

    // (2.1) dropped in existing row
    if (isRow(target)) {
      targetRow = this._formLayouter.getRow(target.dataset.rowId);
    }

    // (2.2) validate whether drop is allowed
    const validationError = this.validateDrop(el, target);

    if (validationError) {
      return drake.cancel(true);
    }

    drake.remove();

    // (3) detect position to drop field in schema order
    const targetIndex = this.getTargetIndex(targetRow, targetFormField, sibling);

    // (4) create new field or move existing
    if (isPalette(source)) {
      this.createNewField(el, targetRow, targetFormField, targetIndex);
    } else {
      this.moveField(el, source, targetRow, targetFormField, targetIndex);
    }
  }

  /**
   * @param { { container: Array<string>, direction: string, mirrorContainer: string } } options
   */
  createDragulaInstance(options) {

    const {
      container,
      mirrorContainer
    } = options || {};

    let dragulaOptions = {
      direction: function(el, target) {
        if (isRow(target)) {
          return 'horizontal';
        }

        return 'vertical';
      },
      mirrorContainer,
      isContainer(el) {
        return container.some(cls => el.classList.contains(cls));
      },
      moves(el, source, handle) {
        return !handle.classList.contains(DRAG_NO_MOVE_CLS) && (
          el.classList.contains(DRAG_MOVE_CLS) ||
          el.classList.contains(DRAG_COPY_CLS) ||
          el.classList.contains(DRAG_ROW_MOVE_CLS)
        );
      },
      copy(el) {
        return el.classList.contains(DRAG_COPY_CLS);
      },

      accepts: (el, target) => {

        unsetDropNotAllowed(target);

        // allow dropping rows only between rows
        if (el.classList.contains(DRAG_ROW_MOVE_CLS)) {
          return !target.classList.contains(DROP_CONTAINER_HORIZONTAL_CLS);
        }

        // validate field drop
        const validationError = this.validateDrop(el, target);

        if (validationError) {

          // set error feedback to row
          setDropNotAllowed(target);
        }

        return !target.classList.contains(DRAG_NO_DROP_CLS);
      },
      slideFactorX: 10,
      slideFactorY: 5
    };

    const dragulaInstance = dragula(dragulaOptions);

    // bind life cycle events
    dragulaInstance.on('drag', (element, source) => {
      this.emit('drag.start', { element, source });
    });

    dragulaInstance.on('dragend', (element) => {
      this.emit('drag.end', { element });
    });

    dragulaInstance.on('drop', (element, target, source, sibling) => {
      this.emit('drag.drop', { element, target, source, sibling });
    });

    dragulaInstance.on('over', (element, container, source) => {
      this.emit('drag.hover', { element, container, source });
    });

    dragulaInstance.on('out', (element, container, source) => {
      this.emit('drag.out', { element, container, source });
    });

    dragulaInstance.on('cancel', (element, container, source) => {
      this.emit('drag.cancel', { element, container, source });
    });

    dragulaInstance.on('drop', (el, target, source, sibling) => {
      if (!target) {
        dragulaInstance.remove();
        return;
      }

      // (1) handle row drop
      if (isDragRow(el)) {
        this.handleRowDrop(el, target, source, sibling);
      } else {

        // (2) handle form field drop
        this.handleElementDrop(el, target, source, sibling, dragulaInstance);
      }

    });

    this.emit('dragula.created', dragulaInstance);

    return dragulaInstance;
  }

  emit(event, context) {
    this._eventBus.fire(event, context);
  }
}

Dragging.$inject = [
  'formFieldRegistry',
  'formLayouter',
  'formLayoutValidator',
  'eventBus',
  'modeling',
  'pathRegistry'
];


// helper //////////

function getFormFieldIndex(parent, formField) {
  let fieldFormIndex = parent.components.length;

  parent.components.forEach(({ id }, index) => {
    if (id === formField.id) {
      fieldFormIndex = index;
    }
  });

  return fieldFormIndex;
}

function isRow(node) {
  return node.classList.contains('fjs-layout-row');
}

function isDragRow(node) {
  return node.classList.contains(DRAG_ROW_MOVE_CLS);
}

function isPalette(node) {
  return node.classList.contains('fjs-palette-fields');
}

function getFormParent(node) {
  return node.closest('.fjs-element');
}

function setDropNotAllowed(node) {
  node.classList.add(ERROR_DROP_CLS);
  setCursor('not-allowed');
}

function unsetDropNotAllowed(node) {
  node.classList.remove(ERROR_DROP_CLS);
  setCursor('grabbing');
}