import { isFunction, forEach } from 'min-dash';

const DEFAULT_PRIORITY = 1000;

/**
 * A service that manages context pad action providers for form fields.
 * Providers can register to contribute context pad entries for specific
 * form field types.
 *
 * Inspired by the diagram-js ContextPad + provider pattern.
 *
 * @param {import('../../core/EventBus').EventBus} eventBus
 */
export class FormFieldContextActions {
  constructor(eventBus) {
    this._eventBus = eventBus;
  }

  /**
   * Register a context pad provider with the default priority.
   *
   * @overlord
   * @param {Object} provider
   */

  /**
   * Register a context pad provider with the given priority.
   *
   * @param {number} priority
   * @param {Object} provider
   */
  registerProvider(priority, provider) {
    if (!provider) {
      provider = priority;
      priority = DEFAULT_PRIORITY;
    }

    this._eventBus.on('formFieldContextActions.getProviders', priority, function (event) {
      event.providers.push(provider);
    });
  }

  /**
   * Get context pad entries for the given form field.
   *
   * @param {Object} formField
   *
   * @return {Object} entries map
   */
  getEntries(formField) {
    const providers = this._getProviders();

    let entries = {};

    forEach(providers, function (provider) {
      if (!isFunction(provider.getContextPadEntries)) {
        return;
      }

      const entriesOrUpdater = provider.getContextPadEntries(formField);

      if (isFunction(entriesOrUpdater)) {
        entries = entriesOrUpdater(entries);
      } else {
        forEach(entriesOrUpdater, function (entry, id) {
          entries[id] = entry;
        });
      }
    });

    return entries;
  }

  _getProviders() {
    const event = this._eventBus.createEvent({
      type: 'formFieldContextActions.getProviders',
      providers: [],
    });

    this._eventBus.fire(event);

    return event.providers;
  }
}

FormFieldContextActions.$inject = ['eventBus'];
