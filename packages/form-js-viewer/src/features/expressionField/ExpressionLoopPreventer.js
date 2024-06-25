export class ExpressionLoopPreventer {
  constructor(eventBus) {
    this._computedExpressions = [];

    eventBus.on('field.updated', ({ shouldNotRecompute }) => {
      if (shouldNotRecompute) {
        return;
      }

      this.reset();
    });

    eventBus.on('import.done', this.reset.bind(this));
    eventBus.on('reset', this.reset.bind(this));
  }

  /**
   * Checks if the expression field has already been computed, and registers it if not.
   *
   * @param {any} expressionField
   * @returns {boolean} - whether the expression field has already been computed within the current cycle
   */
  registerExpressionExecution(expressionField) {
    if (this._computedExpressions.includes(expressionField)) {
      return false;
    }

    this._computedExpressions.push(expressionField);

    return true;
  }

  /**
   * Resets the list of computed expressions.
   */
  reset() {
    this._computedExpressions = [];
  }
}

ExpressionLoopPreventer.$inject = ['eventBus'];
