import { get } from 'min-dash';

const MULTIPAGE_TYPE = 'multipage';

/**
 * Holds the page each multipage container is on, so that the position outlives
 * the rendering of the container and can be read and set from outside the form.
 *
 * Positions are kept per container and repetition. They are dropped when the
 * form is cleared or reset.
 */
export class MultiPageNavigation {
  constructor(form, eventBus, formFieldRegistry, formFieldInstanceRegistry, validator, injector) {
    this._form = form;
    this._eventBus = eventBus;
    this._formFieldRegistry = formFieldRegistry;
    this._formFieldInstanceRegistry = formFieldInstanceRegistry;
    this._validator = validator;
    this._injector = injector;

    this._positions = new Map();

    eventBus.on('form.clear', () => this._positions.clear());
    eventBus.on('reset', () => this._positions.clear());
  }

  /**
   * Get the id of the page a container shows.
   *
   * @param {string} containerId
   * @param {Object} [options]
   * @param {Object} [options.indexes] repetition indexes of a container within a repeater
   *
   * @returns {string|null}
   */
  getActivePage(containerId, options = {}) {
    const { indexes } = options;

    const container = this._getContainer(containerId);

    if (!container) {
      return null;
    }

    const page = this._getActivePage(container, indexes);

    return page ? page.id : null;
  }

  /**
   * Move a container to one of its pages.
   *
   * Fails if the container or the page is unknown, or if a condition hides the
   * page. With `validate`, it also fails if the page the container shows has
   * errors, and reports them on the fields.
   *
   * The container need not be on screen. It shows the page once it is.
   *
   * @param {string} containerId
   * @param {string} pageId
   * @param {Object} [options]
   * @param {Object} [options.indexes] repetition indexes of a container within a repeater
   * @param {boolean} [options.validate=false]
   *
   * @returns {boolean} whether the container shows the page
   */
  navigate(containerId, pageId, options = {}) {
    const { indexes, validate = false } = options;

    const container = this._getContainer(containerId);

    if (!container) {
      return false;
    }

    const page = this._getVisiblePages(container, indexes).find((candidate) => candidate.id === pageId);

    if (!page) {
      return false;
    }

    const from = this._getActivePage(container, indexes);

    if (from === page) {
      return true;
    }

    if (validate && !this._reportPageErrors(from, indexes)) {
      return false;
    }

    this._setPosition(container, from, page, indexes);

    return true;
  }

  /**
   * @internal
   *
   * The page id stored for a container, before conditions are taken into account.
   */
  _getPosition(containerId, indexes) {
    return this._positions.get(positionKey(containerId, indexes)) || null;
  }

  /**
   * @internal
   */
  _setPosition(container, from, to, indexes) {
    this._positions.set(positionKey(container.id, indexes), to.id);

    this._eventBus.fire('multipage.pageChanged', {
      formField: container,
      from,
      to,
      indexes,
    });
  }

  /**
   * @internal
   *
   * The pages of a container that are not hidden by their own condition. A
   * condition on the container or above it does not count, so that a hidden
   * container keeps the position it shows once it is revealed.
   */
  _getVisiblePages(container, indexes) {
    const pages = container.components || [];

    const conditionChecker = this._injector.get('conditionChecker', false);

    if (!conditionChecker) {
      return pages;
    }

    const { data } = this._form._getState();

    const hiddenFieldIds = conditionChecker.getHiddenFieldIds(data, indexes, { ownConditionOnly: true });

    return pages.filter((page) => !hiddenFieldIds.has(page.id));
  }

  /**
   * @internal
   *
   * Whether the fields of a page pass validation against the given data.
   * Has no side effects, so it is safe to call while rendering.
   */
  _isPageValid(page, data, indexes) {
    return this._getPageInstances(page, indexes).every(
      (fieldInstance) =>
        !this._validator.validateFieldInstance(fieldInstance, get(data, fieldInstance.valuePath)).length,
    );
  }

  /**
   * @internal
   *
   * Validate the fields of a page against the current data and show their errors.
   */
  _reportPageErrors(page, indexes) {
    const viewerCommands = this._injector.get('viewerCommands', false);

    if (!viewerCommands) {
      return true;
    }

    const { data } = this._form._getState();

    let isValid = true;

    this._getPageInstances(page, indexes).forEach((fieldInstance) => {
      const value = get(data, fieldInstance.valuePath);

      if (this._validator.validateFieldInstance(fieldInstance, value).length) {
        isValid = false;
      }

      viewerCommands.updateFieldInstanceValidation(fieldInstance, value);
    });

    return isValid;
  }

  _getContainer(containerId) {
    const container = this._formFieldRegistry.get(containerId);

    return container && container.type === MULTIPAGE_TYPE ? container : null;
  }

  _getActivePage(container, indexes) {
    const pages = container.components || [];
    const visiblePages = this._getVisiblePages(container, indexes);

    const pageId = resolveActivePageId(pages, visiblePages, this._getPosition(container.id, indexes));

    return visiblePages.find((page) => page.id === pageId) || null;
  }

  _getPageInstances(page, indexes) {
    if (!page) {
      return [];
    }

    const pageFieldIds = collectPageFieldIds(page);

    return this._formFieldInstanceRegistry.getAllKeyed().filter(({ id, indexes: instanceIndexes }) => {
      if (!pageFieldIds.has(id)) {
        return false;
      }

      const field = this._formFieldRegistry.get(id);

      if (field && field.disabled) {
        return false;
      }

      // a multipage container may itself sit within a repetition
      return Object.entries(indexes || {}).every(([key, index]) => (instanceIndexes || {})[key] === index);
    });
  }
}

MultiPageNavigation.$inject = [
  'form',
  'eventBus',
  'formFieldRegistry',
  'formFieldInstanceRegistry',
  'validator',
  'injector',
];

/**
 * Resolve the page a container shows from the page stored for it.
 *
 * A condition may hide the stored page. The container then carries on from
 * where that page stood rather than dropping back to the beginning.
 *
 * @param {Array<Object>} pages
 * @param {Array<Object>} visiblePages
 * @param {string|null} storedPageId
 *
 * @returns {string|null}
 */
export function resolveActivePageId(pages, visiblePages, storedPageId) {
  if (!visiblePages.length) {
    return null;
  }

  if (visiblePages.some((page) => page.id === storedPageId)) {
    return storedPageId;
  }

  const position = pages.findIndex((page) => page.id === storedPageId);

  if (position === -1) {
    return visiblePages[0].id;
  }

  const forward = visiblePages.find((page) => pages.indexOf(page) > position);

  return (forward || visiblePages[visiblePages.length - 1]).id;
}

function positionKey(containerId, indexes) {
  const scope = Object.keys(indexes || {})
    .sort()
    .map((key) => `${key}:${indexes[key]}`);

  return [containerId, ...scope].join('|');
}

/**
 * Collect the fields a page owns, stopping at a nested multipage container.
 *
 * A nested container governs its own pages, so holding the outer page back over
 * an error the user cannot see would leave them with no way forward.
 */
function collectPageFieldIds(field, ids = new Set()) {
  (field.components || []).forEach((component) => {
    ids.add(component.id);

    if (component.type !== MULTIPAGE_TYPE) {
      collectPageFieldIds(component, ids);
    }
  });

  return ids;
}
