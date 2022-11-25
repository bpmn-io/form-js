import { parseExpressions, parseUnaryTests } from 'feelin';

/**
 * Retrieve variable names from given FEEL unary test.
 *
 * @param {string} unaryTest
 * @returns {string[]}
 */
export function getVariableNames(unaryTest) {
  const tree = parseUnaryTests(unaryTest);
  const cursor = tree.cursor();

  const variables = new Set();
  do {
    const node = cursor.node;

    if (node.type.name === 'VariableName') {
      variables.add(unaryTest.slice(node.from, node.to));
    }

  } while (cursor.next());

  return Array.from(variables);
}

/**
 * Retrieve variable names from given FEEL expression.
 *
 * @param {string} expression
 * @returns {string[]}
 */
export function getExpressionVariableNames(expression) {
  const tree = parseExpressions(expression);
  const cursor = tree.cursor();

  const variables = new Set();
  do {
    const node = cursor.node;

    if (node.type.name === 'VariableName') {
      variables.add(expression.slice(node.from, node.to));
    }

  } while (cursor.next());

  return Array.from(variables);
}