import { expect } from 'chai';

import { validateNesting } from '../../../src/util/nesting';

describe('util/nesting', function () {
  it('should allow a page inside a multipage container', function () {
    // then
    expect(validateNesting('page', 'multipage')).to.not.exist;
  });

  it('should reject a page outside a multipage container', function () {
    // then
    expect(validateNesting('page', 'default')).to.exist;
    expect(validateNesting('page', 'group')).to.exist;
    expect(validateNesting('page', 'dynamiclist')).to.exist;
  });

  it('should reject anything but a page inside a multipage container', function () {
    // then
    expect(validateNesting('textfield', 'multipage')).to.exist;
    expect(validateNesting('group', 'multipage')).to.exist;
    expect(validateNesting('multipage', 'multipage')).to.exist;
  });

  it('should not constrain unrelated types', function () {
    // then
    expect(validateNesting('textfield', 'group')).to.not.exist;
    expect(validateNesting('multipage', 'default')).to.not.exist;
    expect(validateNesting('multipage', 'group')).to.not.exist;
  });
});
