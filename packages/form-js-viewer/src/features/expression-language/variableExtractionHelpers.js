import { parseExpressions, parseUnaryTests } from 'feelin';

export const getFlavouredFeelVariableNames = (feelString, feelFlavour, options = {}) => {

  const {
    depth = 0,
    specialDepthAccessors = {}
  } = options;

  if (![ 'expression', 'unaryTest' ].includes(feelFlavour)) return [];

  const tree = feelFlavour === 'expression' ? parseExpressions(feelString) : parseUnaryTests(feelString);

  const simpleExpressionTree = _buildSimpleFeelStructureTree(tree, feelString);

  return (function _unfoldVariables(node) {

    if (node.name === 'PathExpression') {

      if (Object.keys(specialDepthAccessors).length === 0) {
        return depth === 0 ? [ _getVariableNameAtPathIndex(node, 0) ] : [ ];
      }

      // if using special depth accessors, use a more complex extraction
      return Array.from(_smartExtractVariableNames(node, depth, specialDepthAccessors));
    }

    if (depth === 0 && node.name === 'VariableName') return [ node.variableName ];

    // for any other kind of node, traverse its children and flatten the result
    if (node.children) {
      return node.children.reduce((acc, child) => {
        return acc.concat(_unfoldVariables(child));
      }, []);
    }

    return [];
  })(simpleExpressionTree);

};


/**
 * Get the variable name at the specified index in a given path expression.
 *
 * @param {Object} root - The root node of the path expression tree.
 * @param {number} index - The index of the variable name to retrieve.
 * @returns {string|null} The variable name at the specified index or null if index is out of bounds.
 */
const _getVariableNameAtPathIndex = (root, index) => {
  const accessors = _deconstructPathExpression(root);
  return accessors[index] || null;
};


/**
 * Extracts the variables which are required of the external context for a given path expression.
 * This is done by traversing the path expression tree and keeping track of the current depth relative to the external context.
 *
 * @param {Object} node - The root node of the path expression tree.
 * @param {number} initialDepth - The depth at which the root node is located in the outer context.
 * @param {Object} specialDepthAccessors - Definitions of special keywords which represent more complex accesses of the outer context.
 * @returns {Set} - A set containing the extracted variable names.
 */
const _smartExtractVariableNames = (node, initialDepth, specialDepthAccessors) => {

  // depth info represents the previous (initialised as null) and current depth of the current accessor in the path expression
  // we track multiple of these to account for the fact that a path expression may be ambiguous due to special keywords
  let accessorDepthInfos = [ { previous: null, current: initialDepth - 1 } ];
  const extractedVariables = new Set();
  const nodeAccessors = _deconstructPathExpression(node);

  for (let i = 0; i < nodeAccessors.length; i++) {
    const currentAccessor = nodeAccessors[i];

    if (currentAccessor in specialDepthAccessors) {
      const depthOffsets = specialDepthAccessors[currentAccessor];

      // if the current accessor is a special keyword, we need to expand the current depth info set
      // this is done to account for the ambiguity of keywords like parent, which may be used to access
      // the parent of the current node, or a child variable of the same name
      accessorDepthInfos = depthOffsets.reduce((accumulator, offset) => {
        return [
          ...accumulator,
          ...accessorDepthInfos.map(depthInfo => ({ previous: depthInfo.current, current: depthInfo.current + offset })),
        ];
      }, []).filter(depthInfo => depthInfo.current >= -1); // discard all depth infos which are out of bounds

    } else {

      // if the current accessor is not a special keyword, we know it's simply accessing a child
      // hence we are now one level deeper in the tree and simply increment
      accessorDepthInfos = accessorDepthInfos.map(depthInfo => ({ previous: depthInfo.current, current: depthInfo.current + 1 }));
    }

    // finally, we check if for the current accessor, there is a scenario where:
    // previous it was at depth -1 (i.e. the root context), and is now at depth 0 (i.e. a variable)
    // these are the variables we need to request, so we add them to the set
    if (accessorDepthInfos.some(depthInfo => depthInfo.previous === -1 && depthInfo.current === 0)) {
      extractedVariables.add(currentAccessor);
    }
  }

  // we return a set to avoid duplicates
  return new Set(extractedVariables);
};


/**
 * Deconstructs a path expression tree into an array of components.
 *
 * @param {Object} root - The root node of the path expression tree.
 * @returns {Array<string>} An array of components in the path expression, in the correct order.
 */
const _deconstructPathExpression = (root) => {

  let node = root;
  let parts = [];

  // Traverse the tree and collect path components
  while (node.name === 'PathExpression') {
    parts.push(node.children[1].variableName);
    node = node.children[0];
  }

  // Add the last component to the array
  parts.push(node.variableName);

  // Reverse and return the array to get the correct order
  return parts.reverse();
};


/**
 * Builds a simplified feel structure tree from the given parse tree and feel string.
 * The nodes follow this structure: `{ name: string, children: Array, variableName?: string }`
 *
 * @param {Object} parseTree - The parse tree generated by a parser.
 * @param {string} feelString - The feel string used for parsing.
 * @returns {Object} The simplified feel structure tree.
 */
const _buildSimpleFeelStructureTree = (parseTree, feelString) => {

  const stack = [ { children: [] } ];
  parseTree.iterate({
    enter: (node) => {

      const nodeRepresentation = {
        name: node.type.name,
        children: [],
      };

      if (node.type.name === 'VariableName') {
        nodeRepresentation.variableName = feelString.slice(node.from, node.to);
      }

      stack.push(nodeRepresentation);
    },
    leave: () => {
      const result = stack.pop();
      const parent = stack[stack.length - 1];
      parent.children.push(result);
    }
  });

  return stack[0].children[0];
};