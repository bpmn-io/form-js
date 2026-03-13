import {
  willKeyProduceValidNumber,
  countDecimals,
  isNumberInputSafe,
} from '../../../../../../src/render/components/util/numberFieldUtil.js';

describe('numberFieldUtil', function () {
  it('#countDecimals', function () {
    // given
    const valuesMatrix = [
      [1, 0],
      [1.1, 1],
      [1.11, 2],
      [1.111, 3],
      [1.111111, 6],
      [1e-13, 13],
      ['1.0000000000000000001', 19],
      ['1.1', 1],
    ];

    // then
    for (const [value, result] of valuesMatrix) {
      expect(countDecimals(value)).to.equal(result);
    }
  });

  it('#willKeyProduceValidNumber', function () {
    // given
    const scenarios = [
      // entering a number at the start
      ['a', '123', 0, 0, 0, false],

      // entering a digit at the start
      ['1', '123', 0, 0, 0, true],

      // entering a digit at the end
      ['1', '123', 3, 0, 0, true],

      // entering a period for an integer
      ['.', '123', 3, 0, 0, false],

      // entering a period for a decimal
      ['.', '123', 3, 0, 3, true],

      // entering a second period for a decimal
      ['.', '123.', 4, 0, 3, false],

      // entering a minus at the start of a decimal
      ['-', '123.', 0, 0, 3, true],

      // entering a second minus at the start of a decimal
      ['-', '-123.', 0, 0, 3, false],

      // entering minus in the middle of a decimal
      ['-', '123.', 1, 0, 3, false],

      // entering too many decimals
      ['3', '123.333', 7, 0, 3, false],

      // entering too many decimals #2
      ['3', '123.3333', 7, 0, 3, false],
    ];

    // then
    for (const [key, previousValue, caretIndex, selectionWidth, decimalDigits, expectedValue] of scenarios) {
      expect(willKeyProduceValidNumber(key, previousValue, caretIndex, selectionWidth, decimalDigits)).to.equal(
        expectedValue,
      );
    }
  });

  describe('#isNumberInputSafe', function () {
    it('should return true for values that survive Number() round-trip', function () {
      const safeCases = ['2', '123.456', '1.000000000000001', '0.0000000000000001', '999999999999999', '1e-100'];

      for (const value of safeCases) {
        expect(isNumberInputSafe(value)).to.equal(true, `expected '${value}' to be safe`);
      }
    });

    it('should return false for values that lose precision through Number()', function () {
      const unsafeCases = [
        '1.0000000000000001', // 1 + tiny delta collapses to 1
        '9999999999999999', // 16-digit integer exceeds safe range
        '1.' + '0'.repeat(99) + '1', // 1 + 1e-100 collapses to 1
      ];

      for (const value of unsafeCases) {
        expect(isNumberInputSafe(value)).to.equal(false, `expected '${value}' to be unsafe`);
      }
    });
  });
});
