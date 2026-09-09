import { buildExpressionContext } from '../../../src/util/expressions';

describe('util/expressions', function () {
  it('should expose current dynamic list item properties as shorthand variables', function () {
    const context = buildExpressionContext({
      this: { title: 'Hello', amount: 7 },
      data: { articles: [{ title: 'Hello', amount: 7 }] },
      parent: {},
      i: 0,
    });

    expect(context.title).to.eql('Hello');
    expect(context.amount).to.eql(7);
  });

  it('should keep top-level data precedence for conflicting keys', function () {
    const context = buildExpressionContext({
      this: { title: 'Item title' },
      data: { title: 'Form title' },
      parent: {},
      i: 0,
    });

    expect(context.title).to.eql('Form title');
  });
});
