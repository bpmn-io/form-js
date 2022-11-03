import { ConditionChecker } from '../../../src/core/ConditionChecker';


describe('ConditionChecker', function() {

  let conditionChecker,
      fields = [];

  beforeEach(function() {
    conditionChecker = new ConditionChecker({
      getAll: () => fields
    });
  });


  describe('#check', function() {

    it('should return true if there is no condition', function() {

      // when
      const result = conditionChecker.check();

      // then
      expect(result).to.be.true;
    });


    it('should return false for non-string condition', function() {

      // given
      const condition = 1;

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.false;
    });


    it('should return false if condition does not start with =', function() {

      // given
      const condition = 'foo';

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.false;
    });


    it('should return false if condition has syntax error', function() {

      // given
      const condition = '=foo-';

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.false;
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
          condition: '=2 + 2 = 5'
        },
        {
          key: 'bar',
          condition: '=2 + 2 = 4'
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
          condition: '=2 + 2 = five'
        },
        {
          key: 'bar',
          condition: '=2 + 2 = four'
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
