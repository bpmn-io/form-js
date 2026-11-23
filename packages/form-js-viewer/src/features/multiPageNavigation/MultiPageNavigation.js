import { get } from 'min-dash';

const MULTIPAGE_TYPE = 'multipage';

/**
 * Holds the page each multipage container is on, so that the position outlives
 * the rendering of the container and can be read and set from outside the form.
 *
 * Positions are kept per container. They are dropped when the form is cleared
 * or reset.
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
   *
   * @returns {string|null}
   */
  getActivePage(containerId) {
    const container = this._getContainer(containerId);

    if (!container) {
      return null;
    }

    const page = this._getActivePage(container);

    return page ? page.id : null;
  }

  /**
   * Get where a container stands among the pages not hidden by condition.
   *
   * Returns `null` for an unknown container. If a condition hides every page,
   * `activePageId` is `null`, `index` is `-1`, and `isFirst` and `isLast` are
   * `false`.
   *
   * @param {string} containerId
   *
   * @returns {{ activePageId: string|null, visiblePageIds: Array<string>, index: number, isFirst: boolean, isLast: boolean }|null}
   */
  getState(containerId) {
    const container = this._getContainer(containerId);

    if (!container) {
      return null;
    }

    const visiblePages = this._getVisiblePages(container);
    const activePage = this._getActivePage(container);

    const index = visiblePages.indexOf(activePage);

    return {
      activePageId: activePage ? activePage.id : null,
      visiblePageIds: visiblePages.map((page) => page.id),
      index,
      isFirst: index === 0,
      isLast: index !== -1 && index === visiblePages.length - 1,
    };
  }

  /**
   * Move a container to the next page not hidden by condition.
   *
   * Validates the page the container leaves, like the next control does, and
   * reports its errors on the fields. Pass `{ validate: false }` to move on
   * regardless.
   *
   * @param {string} containerId
   * @param {Object} [options]
   * @param {boolean} [options.validate=true]
   *
   * @returns {boolean} whether the container moved to the next page
   */
  next(containerId, options = {}) {
    const { validate = true } = options;

    return this._navigateBy(containerId, 1, { validate });
  }

  /**
   * Move a container to the previous page not hidden by condition. Never
   * validates, like the back control.
   *
   * @param {string} containerId
   *
   * @returns {boolean} whether the container moved to the previous page
   */
  back(containerId) {
    return this._navigateBy(containerId, -1, { validate: false });
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
   * Fires `multipage.pageChange` before the move. A listener that returns
   * `false` keeps the container where it is.
   *
   * @param {string} containerId
   * @param {string} pageId
   * @param {Object} [options]
   * @param {boolean} [options.validate=false]
   *
   * @returns {boolean} whether the container shows the page
   */
  navigate(containerId, pageId, options = {}) {
    const { validate = false } = options;

    const container = this._getContainer(containerId);

    if (!container) {
      return false;
    }

    const page = this._getVisiblePages(container).find((candidate) => candidate.id === pageId);

    if (!page) {
      return false;
    }

    const from = this._getActivePage(container);

    if (from === page) {
      return true;
    }

    if (validate && !this._reportPageErrors(from)) {
      return false;
    }

    if (this._eventBus.fire('multipage.pageChange', { formField: container, from, to: page }) === false) {
      return false;
    }

    this._setPosition(container, from, page);

    return true;
  }

  /**
   * @internal
   *
   * Move a container by a number of pages not hidden by condition.
   */
  _navigateBy(containerId, offset, options) {
    const container = this._getContainer(containerId);

    if (!container) {
      return false;
    }

    const visiblePages = this._getVisiblePages(container);
    const index = visiblePages.indexOf(this._getActivePage(container));

    const target = index === -1 ? null : visiblePages[index + offset];

    if (!target) {
      return false;
    }

    return this.navigate(containerId, target.id, options);
  }

  /**
   * @internal
   *
   * The page id stored for a container, before conditions are taken into account.
   */
  _getPosition(containerId) {
    return this._positions.get(containerId) || null;
  }

  /**
   * @internal
   */
  _setPosition(container, from, to) {
    this._positions.set(container.id, to.id);

    this._eventBus.fire('multipage.pageChanged', {
      formField: container,
      from,
      to,
    });
  }

  /**
   * @internal
   *
   * The pages of a container that are not hidden by their own condition. A
   * condition on the container or above it does not count, so that a hidden
   * container keeps the position it shows once it is revealed.
   */
  _getVisiblePages(container) {
    const pages = container.components || [];

    const conditionChecker = this._injector.get('conditionChecker', false);

    if (!conditionChecker) {
      return pages;
    }

    const { data } = this._form._getState();

    const hiddenFieldIds = conditionChecker.getHiddenFieldIds(data, {}, { ownConditionOnly: true });

    return pages.filter((page) => !hiddenFieldIds.has(page.id));
  }

  /**
   * @internal
   *
   * Validate the fields of a page against the current data and show their errors.
   */
  _reportPageErrors(page) {
    const viewerCommands = this._injector.get('viewerCommands', false);

    if (!viewerCommands) {
      return true;
    }

    const { data } = this._form._getState();

    let isValid = true;

    this._getPageInstances(page).forEach((fieldInstance) => {
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

  _getActivePage(container) {
    const pages = container.components || [];
    const visiblePages = this._getVisiblePages(container);

    const pageId = resolveActivePageId(pages, visiblePages, this._getPosition(container.id));

    return visiblePages.find((page) => page.id === pageId) || null;
  }

  _getPageInstances(page) {
    if (!page) {
      return [];
    }

    const pageFieldIds = collectPageFieldIds(page);

    return this._formFieldInstanceRegistry.getAllKeyed().filter(({ id }) => {
      if (!pageFieldIds.has(id)) {
        return false;
      }

      const field = this._formFieldRegistry.get(id);

      return !(field && field.disabled);
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

/**
 * Collect the fields a page owns.
 */
function collectPageFieldIds(field, ids = new Set()) {
  (field.components || []).forEach((component) => {
    ids.add(component.id);
    collectPageFieldIds(component, ids);
  });

  return ids;
}
