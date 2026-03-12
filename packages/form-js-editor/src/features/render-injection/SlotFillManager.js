/**
 * Framework-agnostic service for managing slot fills.
 *
 * Fills are registered as render callbacks: `(container: HTMLElement) => (() => void) | void`.
 * The optional return value is a cleanup function called when the fill is removed or the slot unmounts.
 *
 * @example
 *
 * // Via config (simplest):
 * new FormEditor({
 *   slots: {
 *     'editor-empty-state__footer': (container) => {
 *       container.textContent = 'Hello from vanilla JS';
 *     }
 *   }
 * });
 *
 * // Via config (multiple fills per slot):
 * new FormEditor({
 *   slots: {
 *     'editor-empty-state__footer': [
 *       (container) => { container.textContent = 'First'; },
 *       { render: (container) => { container.textContent = 'Second'; }, priority: 10 }
 *     ]
 *   }
 * });
 *
 * // Via service (runtime):
 * const slotFillManager = editor.get('slotFillManager');
 * slotFillManager.addFill('editor-empty-state__footer', 'my-fill', {
 *   render: (container) => { ... },
 *   priority: 10,
 *   group: 'custom'
 * });
 */
export class SlotFillManager {
  /**
   * @param {Object} slotsConfig
   * @param {import('../../core/EventBus').EventBus} eventBus
   */
  constructor(slotsConfig, eventBus) {
    this._eventBus = eventBus;

    /** @type {Array<{ slotName: string, fillId: string, render: Function, priority: number, group: string }>} */
    this._fills = [];

    this._populateFromConfig(slotsConfig);
  }

  /**
   * Register a fill for a named slot.
   *
   * @param {string} slotName - The slot to fill.
   * @param {string} fillId - Unique identifier for this fill.
   * @param {Function|Object} options - A render callback `(container) => cleanup`, or `{ render, priority?, group? }`.
   */
  addFill(slotName, fillId, options) {
    const fill = normalizeFill(slotName, fillId, options);

    this._fills = [...this._fills.filter((f) => f.fillId !== fillId), fill];

    this._eventBus.fire('slotFillManager.changed');
  }

  /**
   * Remove a fill by its ID.
   *
   * @param {string} fillId
   */
  removeFill(fillId) {
    const remaining = this._fills.filter((f) => f.fillId !== fillId);

    if (remaining.length === this._fills.length) {
      return;
    }

    this._fills = remaining;
    this._eventBus.fire('slotFillManager.changed');
  }

  /**
   * Get fills for a given slot, sorted by group (alphabetical) then priority (descending).
   *
   * @param {string} slotName
   * @returns {Array<{ slotName: string, fillId: string, render: Function, priority: number, group: string }>}
   */
  getFills(slotName) {
    const matching = this._fills.filter((f) => f.slotName === slotName);

    return sortFills(matching);
  }

  /**
   * @private
   */
  _populateFromConfig(slotsConfig) {
    Object.entries(slotsConfig || {}).forEach(([slotName, value]) => {
      if (Array.isArray(value)) {
        value.forEach((entry, index) => {
          this.addFill(slotName, `config__${slotName}_${index}`, entry);
        });
      } else {
        this.addFill(slotName, `config__${slotName}`, value);
      }
    });
  }
}

SlotFillManager.$inject = ['config.slots', 'eventBus'];

// helpers //////////

/**
 * @param {string} slotName
 * @param {string} fillId
 * @param {Function|Object} options
 * @returns {{ slotName: string, fillId: string, render: Function, priority: number, group: string }}
 */
function normalizeFill(slotName, fillId, options) {
  if (typeof options === 'function') {
    return { slotName, fillId, render: options, priority: 0, group: 'z_default' };
  }

  const { render, priority = 0, group = 'z_default' } = options;

  return { slotName, fillId, render, priority, group };
}

/**
 * Sort fills by group (alphabetical) then by priority (descending) within each group.
 */
function sortFills(fills) {
  const grouped = groupBy(fills, (f) => f.group);

  return Object.keys(grouped)
    .sort()
    .flatMap((key) => grouped[key].toSorted((a, b) => b.priority - a.priority));
}

function groupBy(items, keyFn) {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    return { ...groups, [key]: [...(groups[key] || []), item] };
  }, {});
}
