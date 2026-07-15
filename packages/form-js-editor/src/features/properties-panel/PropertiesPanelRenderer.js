import { SectionModuleBase } from '../SectionModuleBase';

const DEFAULT_PRIORITY = 1000;

/**
 * @typedef { import('../../core/EventBus').EventBus } EventBus
 * @typedef { { getGroups: ({ formField, editFormField }) => ({ groups}) => Array } } PropertiesProvider
 */

/**
 * Manages the properties panel section rendering and the registration of
 * properties providers.
 *
 * @param {EventBus} eventBus
 */
export class PropertiesPanelRenderer extends SectionModuleBase {
  constructor(eventBus) {
    super(eventBus, 'propertiesPanel');
  }

  /**
   * Register a new properties provider to the properties panel.
   *
   * @param {PropertiesProvider} provider
   * @param {Number} [priority]
   */
  registerProvider(provider, priority) {
    if (!priority) {
      priority = DEFAULT_PRIORITY;
    }

    if (typeof provider.getGroups !== 'function') {
      console.error('Properties provider does not implement #getGroups(element) API');

      return;
    }

    this._eventBus.on('propertiesPanel.getProviders', priority, function (event) {
      event.providers.push(provider);
    });

    this._eventBus.fire('propertiesPanel.providersChanged');
  }

  getProviders() {
    const event = this._eventBus.createEvent({
      type: 'propertiesPanel.getProviders',
      providers: [],
    });

    this._eventBus.fire(event);

    return event.providers;
  }

  _getProviders() {
    return this.getProviders();
  }

  _destroy() {
    this._eventBus.fire('propertiesPanel.destroyed');
  }
}

PropertiesPanelRenderer.$inject = ['eventBus'];
