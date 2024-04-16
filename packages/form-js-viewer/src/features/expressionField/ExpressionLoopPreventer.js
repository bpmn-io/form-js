export class ExpressionLoopPreventer {
  constructor(eventBus) {
    this._computedExpressions = [];

    eventBus.on('field.updated', ({ doNotRecompute }) => {
      if (doNotRecompute) {
        return;
      }

      this.reset();
    });

    eventBus.on('import.done', this.reset.bind(this));
    eventBus.on('reset', this.reset.bind(this));
  }

  requestOnce(expression) {
    if (this._computedExpressions.includes(expression)) {
      return false;
    }

    this._computedExpressions.push(expression);

    return true;
  }

  reset() {
    this._computedExpressions = [];
  }
}

ExpressionLoopPreventer.$inject = ['eventBus'];
