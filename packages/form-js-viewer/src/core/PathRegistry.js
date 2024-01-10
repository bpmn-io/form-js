import { isArray } from 'min-dash';
import { clone, getAncestryList } from '../util';

/**
 * The PathRegistry class manages a hierarchical structure of paths associated with form fields.
 * It enables claiming, unclaiming, and validating paths within this structure.
 *
 * Example Tree Structure:
 *
 *   [
 *     {
 *       segment: 'root',
 *       claimCount: 1,
 *       children: [
 *         {
 *           segment: 'child1',
 *           claimCount: 2,
 *           children: null  // A leaf node (closed path)
 *         },
 *         {
 *           segment: 'child2',
 *           claimCount: 1,
 *           children: [
 *             {
 *               segment: 'subChild1',
 *               claimCount: 1,
 *               children: []  // An open node (open path)
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 */
export class PathRegistry {
  constructor(formFieldRegistry, formFields, injector) {
    this._formFieldRegistry = formFieldRegistry;
    this._formFields = formFields;
    this._injector = injector;
    this._dataPaths = [];
  }

  canClaimPath(path, options = {}) {

    const {
      isClosed = false,
      isRepeatable = false,
      skipAncestryCheck = false,
      claimerId = null,
      knownAncestorIds = []
    } = options;

    let node = { children: this._dataPaths };

    // (1) if we reach a leaf node, we cannot claim it, if we reach an open node, we can
    // if we reach a repeatable node, we need to ensure that the claimer is (or will be) an ancestor of the repeater
    for (const segment of path) {

      node = _getNextSegment(node, segment);

      if (!node) {
        return true;
      }

      if (node.isRepeatable && !skipAncestryCheck) {

        if (!(claimerId || knownAncestorIds.length)) {
          throw new Error('cannot claim a path that contains a repeater without specifying a claimerId or knownAncestorIds');
        }

        const isValidRepeatClaim =
          knownAncestorIds.includes(node.repeaterId) ||
          claimerId && getAncestryList(claimerId, this._formFieldRegistry).includes(node.repeaterId);

        if (!isValidRepeatClaim) {
          return false;
        }
      }

      if (node.children === null) {
        return false;
      }

    }

    // (2) if the path lands in the middle of the tree, we can only claim an open, non-repeatable path
    return !(isClosed || isRepeatable);
  }

  claimPath(path, options = {}) {

    const {
      isClosed = false,
      isRepeatable = false,
      claimerId = null,
      knownAncestorIds = []
    } = options;

    if (!this.canClaimPath(path, { isClosed, isRepeatable, claimerId, knownAncestorIds })) {
      throw new Error(`cannot claim path '${ path.join('.') }'`);
    }

    let node = { children: this._dataPaths };

    for (const segment of path) {

      let child = _getNextSegment(node, segment);

      if (!child) {
        child = { segment, claimCount: 1, children: [] };
        node.children.push(child);
      }
      else {
        child.claimCount++;
      }

      node = child;
    }

    if (isClosed) {
      node.children = null;
    }

    // add some additional info when we make a repeatable path claim
    if (isRepeatable) {
      node.isRepeatable = true;
      node.repeaterId = claimerId;
    }

  }

  unclaimPath(path) {

    // verification Pass
    let node = { children: this._dataPaths };
    for (const segment of path) {
      const child = _getNextSegment(node, segment);
      if (!child) {
        throw new Error(`no open path found for '${ path.join('.') }'`);
      }
      node = child;
    }

    // mutation Pass
    node = { children: this._dataPaths };
    for (const segment of path) {
      const child = _getNextSegment(node, segment);

      child.claimCount--;

      if (child.claimCount === 0) {
        node.children.splice(node.children.indexOf(child), 1);
        break; // Abort early if claimCount reaches zero
      }

      node = child;
    }
  }

  /**
   * Applies a function (fn) recursively on a given field and its children.
   *
   * - `field`: Starting field object.
   * - `fn`: Function to apply.
   * - `context`: Optional object for passing data between calls.
   *
   * Stops early if `fn` returns `false`. Useful for traversing the form field tree.
   *
   * @returns {boolean} Success status based on function execution.
   */
  executeRecursivelyOnFields(field, fn, context = {}) {

    let result = true;

    const formFieldConfig = this._formFields.get(field.type).config;

    if (formFieldConfig.keyed) {
      const callResult = fn({ field, isClosed: true, isRepeatable: false, context });
      return result && callResult;
    }
    else if (formFieldConfig.pathed) {
      const callResult = fn({ field, isClosed: false, isRepeatable: formFieldConfig.repeatable, context });
      result = result && callResult;
    }

    // stop executing if false is specifically returned or if preventing recursion
    if (result === false || context.preventRecursion) {
      return result;
    }

    if (Array.isArray(field.components)) {
      for (const child of field.components) {
        const callResult = this.executeRecursivelyOnFields(child, fn, clone(context));
        result = result && callResult;

        // stop executing if false is specifically returned
        if (result === false) {
          return result;
        }
      }
    }

    return result;
  }

  /**
   * Generates an array representing the binding path to an underlying data object for a form field.
   *
   * @param {Object} field - The field object with properties: `key`, `path`, `id`, and optionally `_parent`.
   * @param {Object} [options={}] - Configuration options.
   * @param {Object} [options.replacements={}] - A map of field IDs to alternative path arrays.
   * @param {Object} [options.indexes=null] - A map of parent IDs to the index of the field within said parent, leave null to get an unindexed path.
   * @param {Object} [options.cutoffNode] - The ID of the parent field at which to stop generating the path.
   *
   * @returns {(Array<string>|undefined)} An array of strings representing the binding path, or undefined if not determinable.
   */
  getValuePath(field, options = {}) {
    const {
      replacements = {},
      indexes = null,
      cutoffNode = null
    } = options;

    let localValuePath = [];

    const hasReplacement = Object.prototype.hasOwnProperty.call(replacements, field.id);
    const formFieldConfig = this._formFields.get(field.type).config;

    // uses path overrides instead of true path to calculate a potential value path
    if (hasReplacement) {
      const replacement = replacements[field.id];

      if (replacement === null || replacement === undefined || replacement === '') {
        localValuePath = [];
      } else if (typeof replacement === 'string') {
        localValuePath = replacement.split('.');
      } else if (Array.isArray(replacement)) {
        localValuePath = replacement;
      } else {
        throw new Error(`replacements for field ${ field.id } must be a string, array or null/undefined`);
      }

    } else if (formFieldConfig.keyed) {
      localValuePath = field.key.split('.');
    } else if (formFieldConfig.pathed && field.path) {
      localValuePath = field.path.split('.');
    }

    // add potential indexes of repeated fields
    if (indexes) {
      localValuePath = this._addIndexes(localValuePath, field, indexes);
    }

    // if parent exists and isn't cutoff node, add parent's value path
    if (field._parent && field._parent !== cutoffNode) {
      const parent = this._formFieldRegistry.get(field._parent);
      return [ ...(this.getValuePath(parent, options) || []), ...localValuePath ];
    }

    return localValuePath;
  }

  clear() {
    this._dataPaths = [];
  }

  _addIndexes(localValuePath, field, indexes) {

    const repeatRenderManager = this._injector.get('repeatRenderManager', false);

    if (repeatRenderManager && repeatRenderManager.isFieldRepeating(field._parent)) {
      return [ indexes[field._parent], ...localValuePath ];
    }

    return localValuePath;
  }
}

const _getNextSegment = (node, segment) => {
  if (isArray(node.children)) { return node.children.find((node) => node.segment === segment) || null; }
  return null;
};

PathRegistry.$inject = [ 'formFieldRegistry', 'formFields', 'injector' ];