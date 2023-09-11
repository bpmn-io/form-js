import { isArray } from 'min-dash';
import { clone } from '../util';

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
export default class PathRegistry {
  constructor(formFieldRegistry, formFields) {
    this._formFieldRegistry = formFieldRegistry;
    this._formFields = formFields;
    this._dataPaths = [];
  }

  canClaimPath(path, closed = false) {

    let node = { children: this._dataPaths };

    for (const segment of path) {

      node = _getNextSegment(node, segment);

      // if no node at that path, we can claim it no matter what
      if (!node) {
        return true;
      }

      // if we reach a leaf node, definitely not claimable
      if (node.children === null) {
        return false;
      }

    }

    // if after all segments we reach a node with children, we can claim it only openly
    return !closed;
  }

  claimPath(path, closed = false) {

    if (!this.canClaimPath(path, closed)) {
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

    if (closed) {
      node.children = null;
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
      const callResult = fn({ field, isClosed: true, context });
      return result && callResult;
    }
    else if (formFieldConfig.pathed) {
      const callResult = fn({ field, isClosed: false, context });
      result = result && callResult;
    }

    if (field.components) {
      for (const child of field.components) {
        const callResult = this.executeRecursivelyOnFields(child, fn, clone(context));
        result = result && callResult;

        // only stop executing if false is specifically returned, not if undefined
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
   * @param {Object} [options.cutoffNode] - The ID of the parent field at which to stop generating the path.
   *
   * @returns {(Array<string>|undefined)} An array of strings representing the binding path, or undefined if not determinable.
   */
  getValuePath(field, options = {}) {
    const {
      replacements = {},
      cutoffNode = null
    } = options;

    let localValuePath = [];

    const hasReplacement = Object.prototype.hasOwnProperty.call(replacements, field.id);
    const formFieldConfig = this._formFields.get(field.type).config;

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

    if (field._parent && field._parent !== cutoffNode) {
      const parent = this._formFieldRegistry.get(field._parent);
      return [ ...(this.getValuePath(parent, options) || []), ...localValuePath ];
    }

    return localValuePath;
  }

  clear() {
    this._dataPaths = [];
  }
}

const _getNextSegment = (node, segment) => {
  if (isArray(node.children)) { return node.children.find((node) => node.segment === segment) || null; }
  return null;
};

PathRegistry.$inject = [ 'formFieldRegistry', 'formFields' ];