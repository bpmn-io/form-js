import { getFlavouredFeelVariableNames } from '../../../../src/features/expressionLanguage/variableExtractionHelpers';

describe('getFlavouredFeelVariableNames', () => {

  expectVariables('SimpleAddition', '2 + 2', []);

  expectVariables('SingleVariable', 'variable1 + 2', [ 'variable1' ]);

  expectVariables('MultipleVariables', 'variable1 + variable2', [ 'variable1', 'variable2' ]);

  expectVariables('ExpressionWithConstants', 'variable1 + 2*3/4 - 5', [ 'variable1' ]);

  expectVariables('MultipleOccurrences', 'variable1 + variable1 - variable1 * variable1 / variable1', [ 'variable1' ]);

  expectVariables('ExpressionWithList', '[variable1, variable2, variable3]', [ 'variable1', 'variable2', 'variable3' ]);

  expectVariables('VariableInContextEntry', '{entry1: variable1}', [ 'variable1' ]);

  expectVariables('VariableInNestedContext', '{entry1: {entry2: variable1}}', [ 'variable1' ]);

  expectVariables('VariableInBooleanExpression', 'variable1 > variable2', [ 'variable1', 'variable2' ]);

  expectVariables('VariableInIfExpression', 'if variable1 > variable2 then "yes" else "no"', [ 'variable1', 'variable2' ]);

  expectVariables('VariableInInterval', '[variable1..variable2]', [ 'variable1', 'variable2' ]);

  expectVariables('VariableInDateFunction', 'date(variable1)', [ 'variable1' ]);

  expectVariables('VariableInTimeFunction', 'time(variable1)', [ 'variable1' ]);

  expectVariables('VariableInDateTimeFunction', 'date and time(variable1)', [ 'variable1' ]);

  expectVariables('NestedList', '[[variable1, variable2], [variable3, variable4]]', [ 'variable1', 'variable2', 'variable3', 'variable4' ]);

  expectVariables('ListInContextEntry', '{entry1: [variable1, variable2]}', [ 'variable1', 'variable2' ]);

  expectVariables('ContextIntoPathExpression', '={ entry1: variable1 }.accessor1 < 0', [ 'variable1' ]);

  expectVariables('VariableInUnaryTest', 'variable1 in (variable2..variable3)', [ 'variable1', 'variable2', 'variable3' ]);

  expectVariables('ArrayAccessorSingleVariable', 'variable1[1]', [ 'variable1' ]);

  expectVariables('ArrayAccessorMultipleVariables', 'variable1[variable2]', [ 'variable1', 'variable2' ]);

  expectVariables('ArrayAccessorNestedVariables', 'variable1[variable2[1]]', [ 'variable1', 'variable2' ]);

  expectVariables('NestedArrayAccessor', 'variable1[variable2[1]][2]', [ 'variable1', 'variable2' ]);

  expectVariables('VariableInArrayFilter', 'variable1[item > 3]', [ 'variable1' ]);

  expectVariables('ComplexArrayFilter', 'variable1[item.a > 3 and item.b < 5]', [ 'variable1' ]);


  // TODO(@skaiir) these tests should ideally pass, but right now our variable extraction logic doesn't ignore certain keywords
  // https://github.com/bpmn-io/form-js/issues/710

  describe.skip('Oversensitive', () => {

    expectVariables('FunctionWithConstants', 'sum(1, 2, 3)', []);

    expectVariables('FunctionWithVariable', 'sum(variable1, 2, 3)', [ 'variable1' ]);

    expectVariables('FunctionWithMultipleVariables', 'sum(variable1, variable2, variable3)', [ 'variable1', 'variable2', 'variable3' ]);

    expectVariables('FunctionNestedInFunction', 'sum(product(variable1, variable2), sum(variable3, variable4))', [ 'variable1', 'variable2', 'variable3', 'variable4' ]);

    expectVariables('FunctionInList', '[sum(variable1, variable2), product(variable3, variable4)]', [ 'variable1', 'variable2', 'variable3', 'variable4' ]);

    expectVariables('VariableInFunction', 'sum(variable1, variable2)', [ 'variable1', 'variable2' ]);

    expectVariables('NestedFunctions', 'sum(product(variable1, variable2), variable3)', [ 'variable1', 'variable2', 'variable3' ]);

    expectVariables('ContextEntryWithFunction', '{entry1: sum(variable1, variable2)}', [ 'variable1', 'variable2' ]);

    expectVariables('FunctionInContextEntry', '{entry1: sum(variable1, variable2), entry2: product(variable3, variable4)}', [ 'variable1', 'variable2', 'variable3', 'variable4' ]);

    expectVariables('VariableInUnaryNotTest', 'variable1 not in (variable2..variable3)', [ 'variable1', 'variable2', 'variable3' ]);

    expectVariables('VariableInQuantifiedExpression', 'some x in variable1 satisfies x > variable2', [ 'variable1', 'variable2' ]);

    expectVariables('VariableInInstanceOfTest', 'variable1 instance of tNumber', [ 'variable1' ]);

    expectVariables('VariableInForExpression', 'for x in variable1 return x > variable2', [ 'variable1', 'variable2' ]);

    expectVariables('ArrayAccessorInFunction', 'sum(variable1[1], variable2[2])', [ 'variable1', 'variable2' ]);

    expectVariables('ArrayFilterInFunction', 'sum(variable1[item > 3])', [ 'variable1' ]);

  });

});


// helpers ///////////////

function expectVariables(name, feel, variables) {
  it(name, () => expect(getFlavouredFeelVariableNames(feel)).to.eql(variables));
}