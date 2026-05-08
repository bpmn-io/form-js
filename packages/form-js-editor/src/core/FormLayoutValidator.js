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

  validateField(field = {}, columns, row, translate) {
    // allow empty (auto columns)
    if (Number.isInteger(columns)) {
      // allow minimum cols
      if (columns < MIN_COLUMNS) {
        return translate(`Minimum allowed columns`, { value: MIN_COLUMNS });
      }

      // allow maximum cols
      if (columns > MAX_COLUMNS) {
        return translate(`Maximum allowed columns`, { value: MAX_COLUMNS });
      }
    }

    if (!row) {
      row = this._formLayouter.getRowForField(field);
    }

    // calculate columns with and without updated field
    let sumColumns = parseInt(columns) || 0;
    let sumFields = 1;
    let sumAutoCols = columns ? 0 : 1;

    row.components.forEach((id) => {
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
      (columns === MAX_COLUMNS_PER_ROW && sumFields > 1)
    ) {
      return translate('New value exceeds', { value: MAX_COLUMNS_PER_ROW });
    }

    if (sumFields > MAX_FIELDS_PER_ROW) {
      return translate('Maximum fields allowed', { value: MAX_FIELDS_PER_ROW });
    }

    return null;
  }
}

FormLayoutValidator.$inject = ['formLayouter', 'formFieldRegistry'];

// helper //////////////////////

// on normal screen sizes, auto columns take minimum 2 columns
function calculateMaxColumnsWithAuto(autoCols) {
  return MAX_COLUMNS_PER_ROW - autoCols * 2;
}
