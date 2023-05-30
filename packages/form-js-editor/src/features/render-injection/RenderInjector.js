import SectionModuleBase from '../SectionModuleBase';

/**
 * Manages the rendering of visual plugins.
 * @constructor
 * @param {Object} eventBus - Event bus for the application.
 */
export default class RenderInjector extends SectionModuleBase {

  constructor(eventBus) {
    super(eventBus, 'renderInjector');
    this._eventBus = eventBus;
    this.registeredRenderers = [];
  }

  /**
   * Inject a new renderer into the injector.
   * @param {string} identifier - Identifier for the renderer.
   * @param {Function} Renderer - The renderer function.
   */
  attachRenderer(identifier, Renderer) {
    this.registeredRenderers = [ ...this.registeredRenderers, { identifier, Renderer } ];
  }

  /**
   * Detach a renderer from the by key injector.
   * @param {string} identifier - Identifier for the renderer.
   */
  detachRenderer(identifier) {
    this.registeredRenderers = this.registeredRenderers.filter(r => r.identifier !== identifier);
  }

  /**
   * Returns the registered renderers.
   * @returns {Array} Array of registered renderers.
   */
  fetchRenderers() {
    return this.registeredRenderers;
  }
}

RenderInjector.$inject = [ 'eventBus' ];