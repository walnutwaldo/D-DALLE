import {
  isObject,
  sanitizeHex,
  convertStringToHex,
  convertNumberToString,
  getChainData,
  hashPersonalMessage,
} from './utilities';

describe('utilities helpers', () => {
  describe('isObject', () => {
    it('returns true for non-empty objects', () => {
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('returns false for empty objects', () => {
      expect(isObject({})).toBe(false);
    });

    it('returns false for non-objects', () => {
      expect(isObject('string')).toBe(false);
      expect(isObject(42)).toBe(false);
    });
  });

  describe('sanitizeHex', () => {
    it('adds the 0x prefix when missing', () => {
      expect(sanitizeHex('ff')).toBe('0xff');
    });

    it('keeps an existing 0x prefix', () => {
      expect(sanitizeHex('0xff')).toBe('0xff');
    });

    it('left-pads odd-length hex to an even number of characters', () => {
      expect(sanitizeHex('f')).toBe('0x0f');
      expect(sanitizeHex('0xf')).toBe('0x0f');
    });

    it('returns an empty string for empty input', () => {
      expect(sanitizeHex('')).toBe('');
      expect(sanitizeHex('0x')).toBe('');
    });
  });

  describe('convertStringToHex', () => {
    it('converts a decimal string to hex', () => {
      expect(convertStringToHex('255')).toBe('ff');
      expect(convertStringToHex(16)).toBe('10');
    });
  });

  describe('convertNumberToString', () => {
    it('stringifies numbers', () => {
      expect(convertNumberToString(123)).toBe('123');
    });
  });

  describe('getChainData', () => {
    it('returns the matching chain for a known chainId', () => {
      const data = getChainData(1);
      expect(data.name).toBe('Ethereum Mainnet');
      expect(data.chain).toBe('ETH');
    });

    it('returns Binance Smart Chain data for chainId 56', () => {
      const data = getChainData(56);
      expect(data.chain).toBe('smartchain');
      expect(data.native_currency.symbol).toBe('BNB');
    });

    it('returns an "Unknown" fallback for an unsupported chainId', () => {
      const data = getChainData(999999);
      expect(data.name).toBe('Unknown');
      expect(data.chain).toBe('unknown');
      expect(data.chain_id).toBe(0);
    });

    it('injects the Infura API key into an infura rpc url', () => {
      const previous = process.env.REACT_APP_INFURA_ID;
      process.env.REACT_APP_INFURA_ID = 'test-infura-id';
      try {
        const data = getChainData(1);
        expect(data.rpc_url).toBe('https://mainnet.infura.io/v3/test-infura-id');
        expect(data.rpc_url).not.toContain('%API_KEY%');
      } finally {
        process.env.REACT_APP_INFURA_ID = previous;
      }
    });
  });

  describe('hashPersonalMessage', () => {
    it('produces a deterministic EIP-191 hash', () => {
      expect(hashPersonalMessage('hello world')).toBe(
        '0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68'
      );
    });
  });
});
