import PropertiesPanel from './PropertiesPanel';

import {render} from 'preact';

import {domify, query as domQuery} from 'min-dom';

/**
 * @typedef { { parent: Element } } PropertiesPanelConfig
 * @typedef { import('../../core/EventBus').default } EventBus
 * @typedef { import('../../types').Injector } Injector
 */

/**
 * @param {PropertiesPanelConfig} propertiesPanelConfig
 * @param {Injector} injector
 * @param {EventBus} eventBus
 */
export default class PropertiesPanelRenderer {
  constructor(propertiesPanelConfig, injector, eventBus) {
    const {parent} = propertiesPanelConfig || {};

    this._eventBus = eventBus;
    this._injector = injector;

    this._container = domify(
      '<div class="fjs-properties-container" input-handle-modified-keys="y,z"></div>',
    );

    if (parent) {
      this.attachTo(parent);
    }

    this._eventBus.once('formEditor.rendered', 500, () => {
      this._render();
    });
  }

  /**
   * Attach the properties panel to a parent node.
   *
   * @param {HTMLElement} container
   */
  attachTo(container) {
    if (!container) {
      throw new Error('container required');
    }

    if (typeof container === 'string') {
      container = domQuery(container);
    }

    // (1) detach from old parent
    this.detach();

    // (2) append to parent container
    container.appendChild(this._container);

    // (3) notify interested parties
    this._eventBus.fire('propertiesPanel.attach');
  }

  /**
   * Detach the properties panel from its parent node.
   */
  detach() {
    const parentNode = this._container.parentNode;

    if (parentNode) {
      parentNode.removeChild(this._container);

      this._eventBus.fire('propertiesPanel.detach');
    }
  }

  _render() {
    render(
      <PropertiesPanel eventBus={this._eventBus} injector={this._injector} />,
      this._container,
    );

    this._eventBus.fire('propertiesPanel.rendered');
  }

  _destroy() {
    if (this._container) {
      render(null, this._container);

      this._eventBus.fire('propertiesPanel.destroyed');
    }
  }
}

PropertiesPanelRenderer.$inject = [
  'config.propertiesPanel',
  'injector',
  'eventBus',
];
