export default class Selection {
  constructor(eventBus) {
    this._eventBus = eventBus;
    this._selection = null;
  }

  get() {
    return this._selection;
  }

  set(selection) {
    if (this._selection === selection) {
      return;
    }

    this._selection = selection;

    this._eventBus.fire('selection.changed', {
      selection: this._selection
    });
  }

  toggle(selection) {
    const newSelection = this._selection === selection ? null : selection;

    this.set(newSelection);
  }

  clear() {
    this.set(null);
  }

  isSelected(formField) {
    return this._selection === formField;
  }
}

Selection.$inject = [ 'eventBus' ];