import ConditionChecker from '../../../../src/features/expression-language/ConditionChecker';

describe('ConditionChecker', function() {

  let conditionChecker,
      fields = [],
      fireSpy;

  beforeEach(function() {
    fireSpy = sinon.spy();
    conditionChecker = new ConditionChecker({
      getAll: () => fields
    }, { fire: fireSpy });
  });


  describe('#check', function() {

    it('should return null if there is no condition', function() {

      // when
      const result = conditionChecker.check();

      // then
      expect(result).to.be.null;
    });


    it('should return null for non-string condition', function() {

      // given
      const condition = 1;

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.null;
    });


    it('should return null if condition does not start with =', function() {

      // given
      const condition = 'foo';

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.null;
    });


    it('should return null and report error if condition has syntax error', function() {

      // given
      const condition = '=foo-';

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.null;
      expect(fireSpy).to.have.been.calledWith('error');
      expect(fireSpy.args[0][1].error).to.be.instanceof(Error);
    });


    it('should return false if condition is not met', function() {

      // given
      const condition = '=2 + 2 = 5';

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.false;
    });


    it('should return false if condition is not met (with data)', function() {

      // given
      const condition = '=2 + 2 = five';

      // when
      const result = conditionChecker.check(condition, { five: 5 });

      // then
      expect(result).to.be.false;
    });


    it('should return true if condition is met', function() {

      // given
      const condition = '=2 + 2 = 4';

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.true;
    });


    it('should return true if condition is met (with data)', function() {

      // given
      const condition = '=2 + 2 = four';

      // when
      const result = conditionChecker.check(condition, { four: 4 });

      // then
      expect(result).to.be.true;
    });

  });


  describe('#applyConditions', function() {

    it('should filter out properties for which condition is not met', function() {

      // given
      fields = [
        {
          key: 'foo',
          conditional: {
            hide: '=2 + 2 = 4'
          }
        },
        {
          key: 'bar',
          conditional: {
            hide: '=2 + 2 = 5'
          }
        }
      ];

      const properties = {
        foo: 'FOO',
        bar: 'BAR'
      };

      // when
      const result = conditionChecker.applyConditions(properties);

      // then
      expect(result).to.eql({
        bar: 'BAR'
      });
    });


    it('should filter out properties for which condition is not met (with data)', function() {

      // given
      fields = [
        {
          key: 'foo',
          conditional: {
            hide: '=2 + 2 = four'
          }
        },
        {
          key: 'bar',
          conditional: {
            hide: '=2 + 2 = five'
          }
        }
      ];

      const properties = {
        foo: 'FOO',
        bar: 'BAR'
      };

      const data = {
        five: 5,
        four: 4
      };

      // when
      const result = conditionChecker.applyConditions(properties, data);

      // then
      expect(result).to.eql({
        bar: 'BAR'
      });
    });
  });
});
