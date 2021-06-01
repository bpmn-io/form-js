export default class Selection {
  constructor(eventBus) {
    this._eventBus = eventBus;
    this._selection = null;
  }

  get() {
    return this._selection;
  }

  set(selection) {
    this._selection = selection;

    this._eventBus.fire('selection.changed', this._selection);
  }

  clear() {
    this.set(null);
  }
}

Selection.$inject = [ 'eventBus' ];