import {
  getSchemaVariables
} from '../../../src';

import schema from '../form.json';
import dynamicSchema from '../dynamic.json';
import conditionalSchema from '../condition-external-variable.json';

describe('util/getSchemaVariables', () => {

  it('should include form field keys', () => {

    const variables = getSchemaVariables(schema);

    expect(variables).to.eql([ 'creditor', 'invoiceNumber', 'amount', 'approved', 'approvedBy', 'approverComments', 'product', 'mailto', 'language', 'tags' ]);

  });


  it('should include values formfields valuesKeys', () => {

    const variables = getSchemaVariables(dynamicSchema);

    expect(variables).to.eql([ 'product', 'xyzData', 'mailto', 'language', 'tags' ]);

  });


  it('should include variables in the conditions', () => {

    const variables = getSchemaVariables(conditionalSchema);

    expect(variables).to.eql([ 'amount', 'externalVariable' ]);
  });

});