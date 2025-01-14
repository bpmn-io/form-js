import { getSchemaVariables } from '../../../src';

import schema from '../form.json';
import dynamicSchema from '../dynamic.json';
import conditionalSchema from '../condition-external-variable.json';
import expressionSchema from '../expression-external-variable.json';
import templateSchema from '../template-variable.json';
import complexTemplateSchema from '../template-variable-complex.json';
import readonlyExpressionSchema from '../readonly-expression.json';
import labelsSchema from '../labels.json';
import descriptionsSchema from '../descriptions.json';
import adornersSchema from '../appearance.json';
import imagesSchema from '../images.json';
import valuesExpressionSchema from '../valuesExpression.json';
import complexConditionExpressionSchema from '../complex-conditions.json';
import validateSchema from '../validate.json';
import groupsSchema from '../groups.json';
import shipsExampleSchema from '../ships-example.json';
import iframesSchema from '../iframes.json';
import htmlSchema from '../html.json';
import expressionFieldSchema from '../expressionField.json';
import filepickerSchema from '../filepicker.json';
import documentPreviewSchema from '../documentPreview.json';

describe('util/getSchemaVariables', function () {
  it('should include form field keys', function () {
    const variables = getSchemaVariables(schema);

    expect(variables).to.eql([
      'invoiceDetails',
      'clients',
      'creditor',
      'invoiceNumber',
      'amount',
      'approved',
      'approvedBy',
      'approverComments',
      'product',
      'mailto',
      'language',
      'conversation',
      'tags',
    ]);
  });

  it('should include form field keys when requesting output vars', function () {
    const variables = getSchemaVariables(schema, { inputs: false });

    expect(variables).to.eql([
      'invoiceDetails',
      'clients',
      'creditor',
      'invoiceNumber',
      'amount',
      'approved',
      'approvedBy',
      'approverComments',
      'product',
      'mailto',
      'language',
      'conversation',
      'tags',
    ]);
  });

  it('should include values formfields valuesKeys', function () {
    const variables = getSchemaVariables(dynamicSchema);

    expect(variables).to.eql(['xyzData', 'product', 'mailto', 'language', 'tags']);
  });

  it('should NOT include values formfields valuesKeys when requesting output vars', function () {
    const variables = getSchemaVariables(dynamicSchema, { inputs: false });

    expect(variables).to.eql(['product', 'mailto', 'language', 'tags']);
  });

  it('should include variables in valuesExpression', function () {
    const variables = getSchemaVariables(valuesExpressionSchema);

    expect(variables).to.eql(['myList', 'concatenate', 'myList2', 'myList3', 'myList4', 'product', 'mailto', 'foo']);
  });

  it('should include variables in conditions', function () {
    const variables = getSchemaVariables(conditionalSchema);

    expect(variables).to.eql(['externalVariable', 'amount', 'textfield']);
  });

  it('should NOT include variables in conditions when requesting output vars', function () {
    const variables = getSchemaVariables(conditionalSchema, { inputs: false });

    expect(variables).to.eql(['amount', 'textfield']);
  });

  it('should include variables in expressions', function () {
    const variables = getSchemaVariables(expressionSchema);

    expect(variables).to.eql(['logo', 'alt', 'myText']);
  });

  it('should NOT include variables in expressions when requesting output vars', function () {
    const variables = getSchemaVariables(expressionSchema, { inputs: false });

    expect(variables).to.eql([]);
  });

  it('should include variables in root of templates', function () {
    const variables = getSchemaVariables(templateSchema);

    expect(variables).to.eql(['myText', 'greeting', 'name', 'showAge', 'age', 'hobbies']);
  });

  it('should handle complex template cases', function () {
    const variables = getSchemaVariables(complexTemplateSchema);

    expect(variables).to.eql(['value', 'minimum', 'display', 'orgs', 'external1', 'external2', 'parent', 'this']);
  });

  it('should NOT include variables - no expression', function () {
    const variables = getSchemaVariables(expressionSchema);

    expect(variables).to.not.have.members(['This', 'is', 'just', 'an', 'image']);
  });

  it('should include variables in readonly expressions', function () {
    const variables = getSchemaVariables(readonlyExpressionSchema);

    expect(variables).to.eql(['foo', 'bar', 'amount', 'text']);
  });

  it('should include variables in labels', function () {
    const variables = getSchemaVariables(labelsSchema);

    expect(variables).to.eql(['foo', 'bar', 'label_var', 'template', 'expression']);
  });

  it('should include variables in descriptions', function () {
    const variables = getSchemaVariables(descriptionsSchema);

    expect(variables).to.eql(['foo', 'bar', 'description_var', 'template', 'expression']);
  });

  it('should include variables in adorners', function () {
    const variables = getSchemaVariables(adornersSchema);

    expect(variables).to.eql([
      'prefix_expression',
      'suffix_expression',
      'prefix_template',
      'suffix_template',
      'adorner_expression',
      'adorner_template',
    ]);
  });

  it('should include variables in images', function () {
    const variables = getSchemaVariables(imagesSchema);

    expect(variables).to.eql(['logo_expression', 'alt_expression', 'logo_template', 'alt_template']);
  });

  it('should include variables in validate', function () {
    const variables = getSchemaVariables(validateSchema);

    expect(variables).to.eql(['min', 'max', 'minLength', 'maxLength', 'number_expression', 'textfield_expression']);
  });

  it('should include variables in iframes', function () {
    const variables = getSchemaVariables(iframesSchema);

    expect(variables).to.eql(['projectPage', 'url', 'domain', 'page']);
  });

  it('should include variables in html', function () {
    const variables = getSchemaVariables(htmlSchema);

    expect(variables).to.eql(['heading', 'description']);
  });

  it('should include variables in ships example', function () {
    const variables = getSchemaVariables(shipsExampleSchema);

    expect(variables).to.eql(['selectedShip', 'shipsForSale']);
  });

  it('should include variables in complex conditions example', function () {
    const variables = getSchemaVariables(complexConditionExpressionSchema);

    expect(variables).to.eql(['loanOptions', 'remainingAllowance', 'offeredAdditionalLoan', 'c1']);
  });

  it('should only include root keys in nested components, but all variable references', function () {
    const variables = getSchemaVariables(groupsSchema);

    expect(variables).to.eql([
      'alt_root',
      'alt_flat',
      'alt_nested',
      'alt_pathed',
      'alt_separated',
      'text_root',
      'text_flat',
      'text_nested',
      'pathed',
      'separated',
      'separated2',
    ]);
  });

  it('should include variables in complex templates', function () {
    const variables = getSchemaVariables(expressionFieldSchema);

    expect(variables).to.include.members(['exp_expression', 'data', 'selected', 'filter']);
  });

  it('should include variables in filepickers', function () {
    const variables = getSchemaVariables(filepickerSchema);

    expect(variables).to.eql([
      'root_multiple',
      'root_formats',
      'group_multiple',
      'group_formats',
      'list_multiple',
      'list_formats',
      'root_filepicker',
      'group_path',
      'dynamiclist_path',
    ]);
  });

  it('should include variables in document preview', function () {
    const variables = getSchemaVariables(documentPreviewSchema);

    expect(variables).to.eql(['my_documents', 'my_documents_endpoint', 'case_id']);
  });
});
