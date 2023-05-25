import {
  getSchemaVariables
} from '../../../src';

import schema from '../form.json';
import dynamicSchema from '../dynamic.json';
import conditionalSchema from '../condition-external-variable.json';
import expressionSchema from '../expression-external-variable.json';
import templateSchema from '../template-variable.json';
import complexTemplateSchema from '../template-variable-complex.json';
import readonlyExpressionSchema from '../readonly-expression.json';
import labelsSchema from '../labels.json';
import descriptionsSchema from '../descriptions.json';

describe('util/getSchemaVariables', () => {

  it('should include form field keys', () => {

    const variables = getSchemaVariables(schema);

    expect(variables).to.eql([ 'creditor', 'invoiceNumber', 'amount', 'approved', 'approvedBy', 'approverComments', 'product', 'mailto', 'language', 'conversation', 'tags' ]);

  });


  it('should include values formfields valuesKeys', () => {

    const variables = getSchemaVariables(dynamicSchema);

    expect(variables).to.eql([ 'product', 'xyzData', 'mailto', 'language', 'tags' ]);

  });


  it('should include variables in the conditions', () => {

    const variables = getSchemaVariables(conditionalSchema);

    expect(variables).to.eql([ 'amount', 'externalVariable' ]);
  });


  it('should include variables in expressions', () => {

    const variables = getSchemaVariables(expressionSchema);

    expect(variables).to.eql([ 'logo', 'alt', 'myText' ]);
  });


  it('should include variables in root of templates', () => {

    const variables = getSchemaVariables(templateSchema);

    expect(variables).to.eql([ 'myText', 'greeting', 'name', 'showAge', 'age', 'hobbies' ]);
  });


  it('should handle complex template cases', () => {

    const variables = getSchemaVariables(complexTemplateSchema);

    expect(variables).to.eql([ 'value', 'minimum', 'display', 'orgs', 'external1', 'external2', 'parent', 'this' ]);
  });


  it('should NOT include variables - no expression', () => {

    const variables = getSchemaVariables(expressionSchema);

    expect(variables).to.not.have.members([ 'This', 'is', 'just', 'an', 'image' ]);
  });


  it('should include variables in readonly expressions', () => {

    const variables = getSchemaVariables(readonlyExpressionSchema);

    expect(variables).to.eql([ 'amount', 'foo', 'bar', 'text' ]);
  });


  it('should include variables in labels', () => {

    const variables = getSchemaVariables(labelsSchema);

    expect(variables).to.eql([ 'template', 'foo', 'bar', 'expression', 'label_var' ]);
  });


  it('should include variables in descriptions', () => {

    const variables = getSchemaVariables(descriptionsSchema);

    expect(variables).to.eql([ 'template', 'foo', 'bar', 'expression', 'description_var' ]);
  });

});