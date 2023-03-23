import Ids from 'ids';

import { groupBy, flatten } from 'min-dash';


/**
 * @typedef { { id: String, components: Array<String> } } FormRow
 * @typedef { { formFieldId: String, rows: Array<FormRow> } } FormRows
 */

/**
 * Maintains the Form layout in a given structure, for example
 *
 *  [
 *    {
 *      formFieldId: 'FormField_1',
 *      rows: [
 *        { id: 'Row_1', components: [ 'Text_1', 'Textdield_1', ... ]  }
 *      ]
 *    }
 *  ]
 *
 */
export default class FormLayouter {

  constructor(eventBus) {

    /** @type Array<FormRows>  */
    this._rows = [];
    this._ids = new Ids([ 32, 36, 1 ]);

    this._eventBus = eventBus;
  }

  /**
   * @param {FormRow} row
   */
  addRow(formFieldId, row) {
    let rowsPerComponent = this._rows.find(r => r.formFieldId === formFieldId);

    if (!rowsPerComponent) {
      rowsPerComponent = {
        formFieldId,
        rows: []
      };

      this._rows.push(rowsPerComponent);
    }

    rowsPerComponent.rows.push(row);
  }

  /**
   * @param {String} id
   * @returns {FormRow}
   */
  getRow(id) {
    const rows = allRows(this._rows);
    return rows.find(r => r.id === id);
  }

  /**
   * @param {any} formField
   * @returns {FormRow}
   */
  getRowForField(formField) {
    return allRows(this._rows).find(r => {
      const { components } = r;

      return components.includes(formField.id);
    });
  }

  /**
   * @param {String} formFieldId
   * @returns { Array<FormRow> }
   */
  getRows(formFieldId) {
    const rowsForField = this._rows.find(r => formFieldId === r.formFieldId);

    if (!rowsForField) {
      return [];
    }

    return rowsForField.rows;
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

    if (type !== 'default' || !components) {
      return;
    }

    // (1) calculate rows order (by component order)
    const rowsInOrder = groupByRow(components, this._ids);

    Object.entries(rowsInOrder).forEach(([ id, components ]) => {

      // (2) add fields to rows
      this.addRow(formField.id, {
        id: id,
        components: components.map(c => c.id)
      });
    });

    // (3) traverse through nested components
    components.forEach(field => this.calculateLayout(field));

    // (4) fire event to notify interested parties
    this._eventBus.fire('form.layoutCalculated', { rows: this._rows });
  }

  clear() {
    this._rows = [];
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
 * @param {Array<FormRows>} formRows
 * @returns {Array<FormRow>}
 */
function allRows(formRows) {
  return flatten(formRows.map(c => c.rows));
}