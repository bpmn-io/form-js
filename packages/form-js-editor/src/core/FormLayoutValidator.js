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
    if (columns) {

      // allow minimum 2 cols
      if (columns < 2) {
        return 'Minimum 2 columns are allowed';
      }

      // allow maximum 16 cols
      if (columns > 16) {
        return 'Maximum 16 columns are allowed';
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
      sumColumns > 16 ||
      (sumColumns === 16 && sumAutoCols > 0) ||
      (columns === 16 && sumFields > 1)) {
      return 'New value exceeds the maximum of 16 columns per row';
    }

    if (sumFields > 4) {
      return 'Maximum 4 fields per row are allowed';
    }

    return null;
  }
}

FormLayoutValidator.$inject = [ 'formLayouter', 'formFieldRegistry' ];