import { parser as feelersParser, buildSimpleTree, evaluate as evaluateFeelers } from 'feelers';
import { isString } from 'min-dash';
import { getFlavouredFeelVariableNames } from './variableExtractionHelpers';

export default class FeelersTemplating {

  constructor() { }

  /**
   * Determines if the given value is a feelers template.
   *
   * @param {any} value
   * @returns {boolean}
   *
   */
  isTemplate(value) { return isString(value) && (value.startsWith('=') || /{{.*?}}/.test(value)); }


  /**
   * Retrieve variable names from a given feelers template.
   *
   * @param {string} template
   *
   * @returns {string[]}
   */
  getVariableNames(template) {

    if (!this.isTemplate(template)) {
      return [];
    }

    const expressions = this._extractExpressionsWithDepth(template);

    // defines special accessors, and the change(s) in depth they could imply (e.g. parent can be used to access the parent context (depth - 1) or a child variable named parent (depth + 1)
    const specialDepthAccessors = {
      parent: [ -1, 1 ],
      _parent_: [ -1 ],
      this: [ 0, 1 ],
      _this_: [ 0 ],
    };

    return expressions.reduce((variables, { expression, depth }) => {
      return variables.concat(getFlavouredFeelVariableNames(expression, 'expression', { depth, specialDepthAccessors }));
    }, []);
  }


  /**
   * Evaluate a template.
   *
   * @param {string} template
   * @param {Object<string, any>} context
   * @param {Object} options
   * @param {boolean} [options.debug = false]
   * @param {boolean} [options.strict = false]
   * @param {Function} [options.buildDebugString]
   *
   * @returns
   */
  evaluate(template, context = {}, options = {}) {

    const {
      debug = false,
      strict = false,
      buildDebugString = (err) => ' {{⚠}} '
    } = options;

    return evaluateFeelers(template, context, { debug, strict, buildDebugString });
  }


  /**
 * @typedef {Object} ExpressionWithDepth
 * @property {number} depth - The depth of the expression in the syntax tree.
 * @property {string} expression - The extracted expression
 */

  /**
 * Extracts all feel expressions in the template along with their depth in the syntax tree.
 * The depth is incremented for child expressions of loops to account for context drilling.

 * @name extractExpressionsWithDepth
 * @param {string} template - A feelers template string.
 * @returns {Array<ExpressionWithDepth>} An array of objects, each containing the depth and the extracted expression.
 *
 * @example
 * const template = "Hello {{user}}, you have:{{#loop items}}\n- {{amount}} {{name}}{{/loop}}.";
 * const extractedExpressions = _extractExpressionsWithDepth(template);
 */
  _extractExpressionsWithDepth(template) {

    // build simplified feelers syntax tree
    const parseTree = feelersParser.parse(template);
    const tree = buildSimpleTree(parseTree, template);

    return (function _traverse(n, depth = 0) {

      if ([ 'Feel', 'FeelBlock' ].includes(n.name)) {
        return [ { depth, expression: n.content } ];
      }

      if (n.name === 'LoopSpanner') {
        const loopExpression = n.children[0].content;
        const childResults = n.children.slice(1).reduce((acc, child) => {
          return acc.concat(_traverse(child, depth + 1));
        }, []);
        return [ { depth, expression: loopExpression }, ...childResults ];
      }

      return n.children.reduce((acc, child) => {
        return acc.concat(_traverse(child, depth));
      }, []);

    })(tree);

  }
}

FeelersTemplating.$inject = [];