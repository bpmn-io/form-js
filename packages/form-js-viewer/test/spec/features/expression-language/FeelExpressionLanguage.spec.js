import FeelExpressionLanguage from '../../../../src/features/expression-language/FeelExpressionLanguage';

describe('FeelExpressionLanguage', function() {

  let feelExpressionLanguage,
      fireSpy;

  beforeEach(function() {
    fireSpy = sinon.spy();
    feelExpressionLanguage = new FeelExpressionLanguage({ fire: fireSpy });
  });


  describe('#evaluate', function() {

    it('should return null if there is no expression', function() {

      // when
      const result = feelExpressionLanguage.evaluate(null, null, false);

      // then
      expect(result).to.be.null;
    });


    it('should return null for non-string expression', function() {

      // given
      const expression = 1;

      // when
      const result = feelExpressionLanguage.evaluate(expression);

      // then
      expect(result).to.be.null;
    });


    it('should return null if expression does not start with =', function() {

      // given
      const expression = 'foo';

      // when
      const result = feelExpressionLanguage.evaluate(expression);

      // then
      expect(result).to.be.null;
    });


    it('should return null and report error if condition has syntax error', function() {

      // given
      const expression = '=foo-';

      // when
      const result = feelExpressionLanguage.evaluate(expression);

      // then
      expect(result).to.be.null;
      expect(fireSpy).to.have.been.calledWith('error');
      expect(fireSpy.args[0][1].error).to.be.instanceof(Error);
    });


    it('should return expression result', function() {

      // given
      const expression = '=2 + 2 + 5';

      // when
      const result = feelExpressionLanguage.evaluate(expression);

      // then
      expect(result).to.equal(9);
    });


    it('should return expression result (with data)', function() {

      // given
      const expression = '=2 + 2 + five';

      // when
      const result = feelExpressionLanguage.evaluate(expression, { five: 5 });

      // then
      expect(result).to.equal(9);
    });

  });


  describe('#isExpression', function() {

    it('should return false if there is no expression', function() {

      // when
      const result = feelExpressionLanguage.isExpression(null);

      // then
      expect(result).to.be.false;
    });


    it('should return false for non-string expression', function() {

      // given
      const expression = 1;

      // when
      const result = feelExpressionLanguage.isExpression(expression);

      // then
      expect(result).to.be.false;
    });


    it('should return false if expression does not start with =', function() {

      // given
      const expression = 'foo';

      // when
      const result = feelExpressionLanguage.isExpression(expression);

      // then
      expect(result).to.be.false;
    });


    it('should return true if expression starts with =', function() {

      // given
      const expression = '=foo';

      // when
      const result = feelExpressionLanguage.isExpression(expression);

      // then
      expect(result).to.be.true;
    });

  });


  describe('#getVariableNames', function() {

    it('should return empty array if there is no expression', function() {

      // when
      const result = feelExpressionLanguage.getVariableNames(null);

      // then
      expect(result).to.eql([]);
    });


    it('should return empty array for non-string expression', function() {

      // given
      const expression = 1;

      // when
      const result = feelExpressionLanguage.getVariableNames(expression);

      // then
      expect(result).to.eql([]);
    });


    it('should return empty array if expression does not start with =', function() {

      // given
      const expression = 'foo';

      // when
      const result = feelExpressionLanguage.getVariableNames(expression);

      // then
      expect(result).to.eql([]);
    });


    it('should return variable names', function() {

      // given
      const expression = '=foo + bar';

      // when
      const result = feelExpressionLanguage.getVariableNames(expression);

      // then
      expect(result).to.eql([ 'foo', 'bar' ]);
    });


    it('should NOT return child variable names', function() {

      // given
      const expression = '=foo1+foo2.bar1+foo3.bar2.baz1';

      // when
      const result = feelExpressionLanguage.getVariableNames(expression);

      // then
      expect(result).to.eql([ 'foo1', 'foo2', 'foo3' ]);
    });

  });

});
