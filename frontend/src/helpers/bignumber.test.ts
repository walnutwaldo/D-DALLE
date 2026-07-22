import {
  isNaN,
  isNumber,
  isInteger,
  isPositive,
  isNegative,
  isZero,
  countDecimalPlaces,
  convertNumberToString,
  convertStringToNumber,
  convertHexToString,
  convertStringToHex,
  greaterThan,
  greaterThanOrEqual,
  smallerThan,
  smallerThanOrEqual,
  multiply,
  divide,
  floorDivide,
  mod,
  add,
  subtract,
  convertAmountToRawNumber,
  convertAmountFromRawNumber,
  handleSignificantDecimals,
  formatFixedDecimals,
  formatInputDecimals,
} from './bignumber';

describe('bignumber helpers', () => {
  describe('isNaN', () => {
    it('returns true for non-numeric input', () => {
      expect(isNaN('abc')).toBe(true);
      expect(isNaN(undefined)).toBe(true);
    });

    it('returns false for numeric input', () => {
      expect(isNaN('123')).toBe(false);
      expect(isNaN(0)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('is the inverse of isNaN', () => {
      expect(isNumber('42')).toBe(true);
      expect(isNumber('not a number')).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('detects integers', () => {
      expect(isInteger('10')).toBe(true);
      expect(isInteger(-3)).toBe(true);
    });

    it('rejects non-integers', () => {
      expect(isInteger('10.5')).toBe(false);
    });
  });

  describe('sign predicates', () => {
    it('isPositive', () => {
      expect(isPositive('1')).toBe(true);
      expect(isPositive('-1')).toBe(false);
    });

    it('isNegative', () => {
      expect(isNegative('-1')).toBe(true);
      expect(isNegative('1')).toBe(false);
    });

    it('isZero', () => {
      expect(isZero('0')).toBe(true);
      expect(isZero('0.0')).toBe(true);
      expect(isZero('1')).toBe(false);
    });
  });

  describe('countDecimalPlaces', () => {
    it('counts decimal digits', () => {
      expect(countDecimalPlaces('1.234')).toBe(3);
      expect(countDecimalPlaces('5')).toBe(0);
    });
  });

  describe('conversions', () => {
    it('convertNumberToString', () => {
      expect(convertNumberToString(1000)).toBe('1000');
    });

    it('convertStringToNumber', () => {
      expect(convertStringToNumber('42')).toBe(42);
    });

    it('convertHexToString parses decimal-string input', () => {
      expect(convertHexToString('255')).toBe('255');
    });

    it('convertStringToHex returns base-16 representation', () => {
      expect(convertStringToHex('255')).toBe('ff');
      expect(convertStringToHex(16)).toBe('10');
    });
  });

  describe('comparisons', () => {
    it('greaterThan', () => {
      expect(greaterThan('2', '1')).toBe(true);
      expect(greaterThan('1', '1')).toBe(false);
      expect(greaterThan('1', '2')).toBe(false);
    });

    it('greaterThanOrEqual', () => {
      expect(greaterThanOrEqual('2', '1')).toBe(true);
      expect(greaterThanOrEqual('1', '1')).toBe(true);
      expect(greaterThanOrEqual('0', '1')).toBe(false);
    });

    it('smallerThan', () => {
      expect(smallerThan('1', '2')).toBe(true);
      expect(smallerThan('1', '1')).toBe(false);
      expect(smallerThan('2', '1')).toBe(false);
    });

    it('smallerThanOrEqual', () => {
      expect(smallerThanOrEqual('1', '2')).toBe(true);
      expect(smallerThanOrEqual('1', '1')).toBe(true);
      expect(smallerThanOrEqual('2', '1')).toBe(false);
    });
  });

  describe('arithmetic', () => {
    it('multiply', () => {
      expect(multiply('3', '4')).toBe('12');
    });

    it('divide', () => {
      expect(divide('10', '4')).toBe('2.5');
    });

    it('floorDivide', () => {
      expect(floorDivide('10', '4')).toBe('2');
    });

    it('mod', () => {
      expect(mod('10', '3')).toBe('1');
    });

    it('add', () => {
      expect(add('1', '2')).toBe('3');
    });

    it('subtract', () => {
      expect(subtract('5', '2')).toBe('3');
    });

    it('handles large integers without precision loss', () => {
      expect(add('1000000000000000000', '1')).toBe('1000000000000000001');
    });
  });

  describe('raw number conversion', () => {
    it('convertAmountToRawNumber uses 18 decimals by default', () => {
      expect(convertAmountToRawNumber('1')).toBe('1000000000000000000');
      expect(convertAmountToRawNumber('1.5')).toBe('1500000000000000000');
    });

    it('convertAmountToRawNumber honours a custom decimal count', () => {
      expect(convertAmountToRawNumber('1', 9)).toBe('1000000000');
    });

    it('convertAmountFromRawNumber is the inverse', () => {
      expect(convertAmountFromRawNumber('1000000000000000000')).toBe('1');
      expect(convertAmountFromRawNumber('1000000000', 9)).toBe('1');
    });
  });

  describe('handleSignificantDecimals', () => {
    it('returns null when decimals is not an integer', () => {
      expect(handleSignificantDecimals('1', 2.5, 0)).toBeNull();
    });

    it('formats a value that is >= 1', () => {
      expect(handleSignificantDecimals('123.456', 4, 0)).toBe('123.456');
    });

    it('formats a value smaller than 1 using significant digits', () => {
      expect(handleSignificantDecimals('0.00012345', 8, 0)).toBe('0.000123');
    });
  });

  describe('formatFixedDecimals', () => {
    it('rounds to the requested number of decimals', () => {
      expect(formatFixedDecimals('1.23456', 2)).toBe('1.23');
      expect(formatFixedDecimals('1.5', 0)).toBe('2');
    });
  });

  describe('formatInputDecimals', () => {
    it('formats based on the decimal places of the second input', () => {
      expect(formatInputDecimals('1.23456789', '0.1')).toBe('1.23456789');
    });
  });
});
