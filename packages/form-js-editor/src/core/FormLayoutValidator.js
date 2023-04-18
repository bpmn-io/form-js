export const MAX_COLUMNS_PER_ROW = 16;
export const MAX_COLUMNS = 16;
export const MIN_COLUMNS = 2;
export const MAX_FIELDS_PER_ROW = 4;

export default class FormLayoutValidator {

  /**
   * @constructor
   *
   * @param { import('./FormLayouter').default } formLayouter
   * @param { import('./FormFieldRegistry').default } formFieldRegistry
   */
  constructor(formLayouter, formFieldRegistry) {
    this._formLayouter = formLayouter;
    this._formFieldRegistry = formFieldRegistry;
  }

  validateField(field = {}, columns, row) {

    // allow empty (auto columns)
    if (Number.isInteger(columns)) {

      // allow minimum cols
      if (columns < MIN_COLUMNS) {
        return `Minimum ${MIN_COLUMNS} columns are allowed`;
      }

      // allow maximum cols
      if (columns > MAX_COLUMNS) {
        return `Maximum ${MAX_COLUMNS} columns are allowed`;
      }
    }

    if (!row) {
      row = this._formLayouter.getRowForField(field);
    }

    // calculate columns with and without updated field
    let sumColumns = (parseInt(columns) || 0);
    let sumFields = 1;
    let sumAutoCols = columns ? 0 : 1;

    row.components.forEach(id => {
      if (field.id === id) {
        return;
      }

      const component = this._formFieldRegistry.get(id);

      const cols = (component.layout || {}).columns;

      if (!cols) {
        sumAutoCols++;
      }

      sumColumns += parseInt(cols) || 0;
      sumFields++;
    });

    // do not allow overflows
    if (
      sumColumns > MAX_COLUMNS_PER_ROW ||
      (sumAutoCols > 0 && sumColumns > calculateMaxColumnsWithAuto(sumAutoCols)) ||
      (columns === MAX_COLUMNS_PER_ROW && sumFields > 1)) {
      return `New value exceeds the maximum of ${MAX_COLUMNS_PER_ROW} columns per row`;
    }

    if (sumFields > MAX_FIELDS_PER_ROW) {
      return `Maximum ${MAX_FIELDS_PER_ROW} fields per row are allowed`;
    }

    return null;
  }
}

FormLayoutValidator.$inject = [ 'formLayouter', 'formFieldRegistry' ];


// helper //////////////////////

// on normal screen sizes, auto columns take minimum 2 columns
function calculateMaxColumnsWithAuto(autoCols) {
  return MAX_COLUMNS_PER_ROW - (autoCols * 2);
}