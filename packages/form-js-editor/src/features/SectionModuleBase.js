/**
 * Base class for sectionable UI modules.
 *
 * @property {EventBus} _eventBus - EventBus instance used for event handling.
 * @property {string} managerType - Type of the render manager. Used to form event names.
 *
 * @class SectionModuleBase
 */
export class SectionModuleBase {
  /**
   * Create a SectionModuleBase instance.
   *
   * @param {any} eventBus - The EventBus instance used for event handling.
   * @param {string} sectionKey - The type of render manager. Used to form event names.
   *
   * @constructor
   */
  constructor(eventBus, sectionKey) {
    this._eventBus = eventBus;
    this._sectionKey = sectionKey;
    this._eventBus.on(`${this._sectionKey}.section.rendered`, () => {
      this.isSectionRendered = true;
    });
    this._eventBus.on(`${this._sectionKey}.section.destroyed`, () => {
      this.isSectionRendered = false;
    });
  }

  /**
   * Attach the managed section to a parent node.
   *
   * @param {HTMLElement} container - The parent node to attach to.
   */
  attachTo(container) {
    this._onceSectionRendered(() => this._eventBus.fire(`${this._sectionKey}.attach`, { container }));
  }

  /**
   * Detach the managed section from its parent node.
   */
  detach() {
    this._onceSectionRendered(() => this._eventBus.fire(`${this._sectionKey}.detach`));
  }

  /**
   * Reset the managed section to its initial state.
   */
  reset() {
    this._onceSectionRendered(() => this._eventBus.fire(`${this._sectionKey}.reset`));
  }

  /**
   * Circumvents timing issues.
   */
  _onceSectionRendered(callback) {
    if (this.isSectionRendered) {
      callback();
    } else {
      this._eventBus.once(`${this._sectionKey}.section.rendered`, callback);
    }
  }
}
