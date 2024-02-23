export const MAX_COLUMNS_PER_ROW = 16;
export const MAX_COLUMNS = 16;
export const MIN_COLUMNS = 2;
export const MAX_FIELDS_PER_ROW = 4;

export class FormLayoutValidator {

  /**
   * @constructor
   *
   * @param { import('./FormLayouter').FormLayouter } formLayouter
   * @param { import('./FormFieldRegistry').FormFieldRegistry } formFieldRegistry
   */
  constructor(formLayouter, formFieldRegistry) {
    this._formLayouter = formLayouter;
    this._formFieldRegistry = formFieldRegistry;
  }

  /**
   * @typedef {Object} Change
   * @property {object} field
   * @property {any} columns
   * @property {object} [targetRow]
   */

  /**
   * Validate changes to field layouting.
   *
   * @param {Array<Change>} changes
   * @returns {string | null}
   */
  validateChanges(changes) {

    if (!changes.length) {
      return null;
    }

    const rowInitializedChanges = changes.map(change => change.targetRow ? change : {
      ...change,
      targetRow: this._formLayouter.getRowForField(change.field)
    });

    const changesGroupedByRow = rowInitializedChanges.reduce((grouped, change) => {
      const { targetRow } = change;
      const { rowId } = targetRow;

      if (!grouped[rowId]) {
        grouped[rowId] = [];
      }

      grouped[rowId].push(change);

      return grouped;
    }, {});

    // check if the individual changes are valid
    for (const { columns } of changes) {

      if (Number.isInteger(columns)) {
        if (columns < MIN_COLUMNS) {
          return `Minimum ${MIN_COLUMNS} columns are allowed`;
        }

        if (columns > MAX_COLUMNS) {
          return `Maximum ${MAX_COLUMNS} columns are allowed`;
        }
      }
    }

    // evalute, for each involved row, if the total row size will be valid after the changes
    for (const rowId in changesGroupedByRow) {
      const rowChanges = changesGroupedByRow[rowId];
      const row = rowChanges[0].targetRow;

      const fieldIdsAfterChange = row.fieldIds.filter(id => {

        const fieldRowHasChanged = rowChanges.some(({ field, targetRow }) => field.id === id && targetRow.rowId !== rowId);

        // filter out fields that are moving to a new row
        return !fieldRowHasChanged;

      });

      const error = validateTotalRowSize(fieldIdsAfterChange, rowChanges, this._formFieldRegistry);

      if (error) {
        return error;
      }
    }

    return null;
  }

  /**
   * Validate a change to field layouting.
   *
   * @param {object} field
   * @param {any} columns
   * @param {object} [targetRow]
   */
  validateField(field, columns, targetRow = null) {
    return this.validateChanges([ {
      field,
      columns,
      targetRow
    } ]);
  }
}

FormLayoutValidator.$inject = [ 'formLayouter', 'formFieldRegistry' ];


// helper //////////////////////

function validateTotalRowSize(rowFieldIds, changes, formFieldRegistry) {

  const sumWidths = rowFieldIds.reduce((sum, fieldId) => {

    const fieldChange = changes.find(change => change.field.id === fieldId);

    if (fieldChange) {
      return sum + (fieldChange.columns || MIN_COLUMNS);
    }

    const field = formFieldRegistry.get(fieldId);
    return sum + (field.layout && field.layout.columns || MIN_COLUMNS);

  }, 0);

  if (sumWidths > MAX_COLUMNS_PER_ROW) {
    return `New column total exceeds the maximum of ${MAX_COLUMNS_PER_ROW} per row`;
  }

  return null;

}