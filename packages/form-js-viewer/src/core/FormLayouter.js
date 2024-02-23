import Ids from 'ids';
import { groupBy } from 'min-dash';
import { fuzzyDivide } from '../util/math';

export const TOTAL_COLUMNS_PER_ROW = 16;

/**
 * @typedef { { rowId: String, fieldIds: Array<String> } } FormRow
 * @typedef { { parentId: String, rows: Array<FormRow> } } FormRowContext
 */

/**
 * Maintains the Form layout in a given structure, for example
 *
 *  [
 *    {
 *      parentId: 'FormField_1',
 *      rows: [
 *        { rowId: 'Row_1', fieldIds: [ 'Text_1', 'Textdield_1', ... ]  }
 *      ]
 *    }
 *  ]
 *
 * Also maintains computed column sizes for automatically sized columns.
 *
 */
export class FormLayouter {

  constructor(eventBus) {

    /** @type Array<FormRowContext>  */
    this._rowContexts = [];
    this._computedAutoColumns = {};
    this._ids = new Ids([ 32, 36, 1 ]);

    this._eventBus = eventBus;
  }

  /**
   * Adds a row to a given parent.
   *
   * @param {FormRow} row
   */
  addRow(fieldId, row) {

    let fieldRowContext = this._rowContexts.find(c => c.parentId === fieldId);

    // if row context does not exist, create it
    if (!fieldRowContext) {

      fieldRowContext = {
        parentId: fieldId,
        rows: []
      };

      this._rowContexts.push(fieldRowContext);
    }

    fieldRowContext.rows.push(row);
  }

  /**
   * Gets a row by its id.
   *
   * @param {String} rowId - The ID of the row to get.
   * @returns {FormRow} - The row with the given ID, or null if not found.
   */
  getRow(rowId) {
    return allRows(this._rowContexts).find(r => r.rowId === rowId);
  }

  /**
   * Gets the row containing a given field.
   *
   * @param {any} formField - The field to get the row for.
   * @returns {FormRow} - The row containing the given field, or null if not found.
   */
  getRowForField(formField) {
    return allRows(this._rowContexts).find(row => row.fieldIds.includes(formField.id));
  }

  /**
   * Get all rows for a given parent.
   *
   * @param {String} parentId - The ID of the parent of the rows.
   * @returns { Array<FormRow> }
   */
  getRows(parentId) {
    const rowContext = this._rowContexts.find(c => parentId === c.parentId);

    if (!rowContext) {
      return [];
    }

    return rowContext.rows;
  }

  /**
   * Get the field at a relative position to a given field in the same row.
   *
   * @param {String} fieldId - The ID of the reference field.
   * @param {Number} position - The relative position from the reference field. Negative value for fields before, positive for fields after.
   * @returns {String|null} - The ID of the field at the relative position, or null if out of bounds.
   */
  getFieldAtRelativePosition(fieldId, position) {
    const row = this.getRowForField({ id: fieldId });

    // If the row doesn't exist, return null
    if (!row) {
      return null;
    }

    const { fieldIds } = row;
    const idx = fieldIds.indexOf(fieldId);

    // Calculate the new index by adding the position to the current index
    const newIdx = idx + position;

    // Check if the new index is within the bounds of the row
    if (newIdx < 0 || newIdx >= fieldIds.length) {
      return null;
    }

    // Return the field ID at the new index
    return fieldIds[newIdx];
  }

  /**
   * Get the column size for a given field.
   *
   * @param {any} field - The field to get the column size for.
   * @returns {number} - The column size for the given field.
   *
   */
  getFieldColumnSize(field) {

    const { layout } = field;

    if (layout && layout.columns) {
      return layout.columns;
    }

    return this._computedAutoColumns[field.id];
  }

  /**
   * @returns {string}
   */
  nextRowId() {
    return this._ids.nextPrefixed('Row_');
  }

  /**
   * @param {any} formField
   */
  calculateLayout(formField) {

    const {
      type,
      components
    } = formField;

    if (![ 'default', 'group', 'dynamiclist' ].includes(type) || !components) {
      return;
    }

    // (1) calculate rows order (by component order)
    const rowsInOrder = groupByRow(components, this._ids);

    Object.entries(rowsInOrder).forEach(([ id, components ]) => {

      // (2) add fields to rows
      this.addRow(formField.id, {
        rowId: id,
        fieldIds: components.map(c => c.id)
      });

      computeAutoColumns(components, this._computedAutoColumns);

    });

    // (3) traverse through nested components
    components.forEach(field => this.calculateLayout(field));

    // (4) fire event to notify interested parties
    this._eventBus.fire('form.layoutCalculated', { rows: this._rowContexts });
  }

  clear() {
    this._rowContexts = [];
    this._computedAutoColumns = {};
    this._ids.clear();

    // fire event to notify interested parties
    this._eventBus.fire('form.layoutCleared');
  }
}

FormLayouter.$inject = [ 'eventBus' ];


// helpers //////

function groupByRow(components, ids) {
  return groupBy(components, c => {

    // mitigate missing row by creating new (handle legacy)
    const { layout } = c;

    if (!layout || !layout.row) {
      return ids.nextPrefixed('Row_');
    }

    return layout.row;
  });
}

/**
 * @param {Array<FormRowContext>} rowContexts
 * @returns {Array<FormRow>}
 */
function allRows(rowContexts) {
  return rowContexts.map(r => r.rows).flat();
}

/**
 * @param {Array<any>} components - The components to compute auto columns for.
 * @param {Object<string, number>} computedAutoColumns - The computed auto columns dictionary to add to.
 */
function computeAutoColumns(components, computedAutoColumns) {

  const autoColumnComponents = components.filter(c => {
    const { layout } = c;

    return !layout || !layout.columns;
  });

  const sumOfDefinedColumns = components.reduce((sum, c) => {
    const { layout } = c;

    if (layout && layout.columns) {
      return sum + layout.columns;
    }

    return sum;
  }, 0);

  const autoColumnSizes = fuzzyDivide(TOTAL_COLUMNS_PER_ROW - sumOfDefinedColumns, autoColumnComponents.length);

  autoColumnComponents.forEach((c, idx) => {
    computedAutoColumns[c.id] = autoColumnSizes[idx];
  });

}