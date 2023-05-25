import {
  render
} from 'preact';

import {
  domify,
  query as domQuery
} from 'min-dom';

import InjectedRendersRoot from './components/InjectedRendersRoot';

import { Fill, Slot } from './slot-fill';

/**
 * Manages the rendering of visual plugins.
 * @constructor
 * @param {Object} renderInjectorConfig - Configuration object.
 * @param {HTMLElement} renderInjectorConfig.parent - Parent HTML element.
 * @param {Object} eventBus - Event bus for the application.
 * @param {Object} injector - Injector for dependencies.
 */
export default class RenderInjector {

  constructor(renderInjectorConfig, eventBus, injector) {
    const {
      parent
    } = renderInjectorConfig || {};

    this._eventBus = eventBus;
    this._injector = injector;

    this._container = domify('<div class="fjs-render-injector"></div>');

    this._registeredRenderers = [];

    this._helpers = {
      Fill,
      Slot
    }

    if (parent) {
      this.attachTo(parent);
    }

    this._eventBus.once('formEditor.rendered', 500, () => {
      this._render();
    });
  }

  /**
   * Attaches the visual plugins renderer to a container.
   * @param container - The container to attach to.
   */
  attachTo(container) {
    if (!container) {
      throw new Error('container required');
    }

    if (typeof container === 'string') {
      container = domQuery(container);
    }

    this.detach();
    
    container.appendChild(this._container);

    this._eventBus.fire('renderInjector.attach');
  }

  /**
   * Detaches the visual plugins renderer from its parent node.
   */
  detach() {
    const parentNode = this._container.parentNode;

    if (parentNode) {
      parentNode.removeChild(this._container);

      this._eventBus.fire('renderInjector.detach');
    }
  }

  /**
   * Registers a new renderer with the injector.
   * @param {string} identifier - Identifier for the renderer.
   * @param {Function} Renderer - The renderer function.
   */
  registerInjectedRenderer(identifier, Renderer) { 
    this._registeredRenderers = [ ...this._registeredRenderers, { identifier, Renderer } ];
    this._eventBus.fire('renderInjector.registerRenderer', { identifier, Renderer }); 
  }

  /**
   * Deregisters a renderer from the injector.
   * @param {string} identifier - Identifier for the renderer.
   */
  deregisterInjectedRenderer(identifier) { 
    this._registeredRenderers = this._registeredRenderers.filter(r => r.identifier !== identifier);
    this._eventBus.fire('renderInjector.deregisterRenderer', { identifier }); 
  }

  _render() {
    render(
      <InjectedRendersRoot
        eventBus={ this._eventBus }
        injector={ this._injector }
        helpers={ this._helpers }
      />,
      this._container
    );

    this._eventBus.fire('renderInjector.initialized', { initialRenderers: this._registeredRenderers });
  }

  _destroy() {
    if (this._container) {
      render(null, this._container);

      this._eventBus.fire('renderInjector.destroyed');
    }
  }
}

RenderInjector.$inject = [ 'config.renderInjector', 'eventBus', 'injector' ];