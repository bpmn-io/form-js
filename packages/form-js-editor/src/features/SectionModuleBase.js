/**
 * Base class for sectionable UI modules.
 *
 * @property {EventBus} _eventBus - EventBus instance used for event handling.
 * @property {string} managerType - Type of the render manager. Used to form event names.
 *
 * @class SectionModuleBase
 */
export default class SectionModuleBase {

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
    this.sectionKey = sectionKey;
  }

  /**
   * Attach the managed section to a parent node.
   *
   * @param {HTMLElement} container - The parent node to attach to.
   */
  attachTo(container) { this._eventBus.fire(`${this.sectionKey}.attach`, { container }); }

  /**
   * Detach the managed section from its parent node.
   */
  detach() { this._eventBus.fire(`${this.sectionKey}.detach`); }

  /**
   * Reset the managed section to its initial state.
   */
  reset() { this._eventBus.fire(`${this.sectionKey}.reset`); }
}
