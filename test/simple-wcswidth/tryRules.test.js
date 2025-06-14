const { wcswidth, wcwidth } = require('simple-wcswidth');

describe('Width calculation tests', () => {
  describe('Basic ASCII characters', () => {
    it('should handle basic ASCII characters', () => {
      expect(wcswidth('hello')).toBe(5);
      expect(wcswidth('12345')).toBe(5);
      expect(wcswidth('!@#$%')).toBe(5);
    });

    it('should handle single ASCII characters', () => {
      expect(wcwidth('a'.charCodeAt(0))).toBe(1);
      expect(wcwidth('Z'.charCodeAt(0))).toBe(1);
      expect(wcwidth('9'.charCodeAt(0))).toBe(1);
    });
  });

  describe('CJK characters', () => {
    it('should handle Chinese characters', () => {
      expect(wcswidth('你好')).toBe(4);
      expect(wcwidth('请'.charCodeAt(0))).toBe(2);
      expect(wcswidth('世界')).toBe(4);
    });

    it('should handle Japanese characters', () => {
      expect(wcswidth('こんにちは')).toBe(10);
      expect(wcswidth('日本語')).toBe(6);
    });

    it('should handle Korean characters', () => {
      expect(wcswidth('안녕하세요')).toBe(10);
      expect(wcswidth('한국어')).toBe(6);
    });
  });

  describe('Special characters and symbols', () => {
    it('should handle emoji', () => {
      expect(wcswidth('😊')).toBe(2);
      expect(wcswidth('👨‍👩‍👧‍👦')).toBe(8);
      expect(wcswidth('🌟')).toBe(2);
    });

    it('should handle mathematical symbols', () => {
      expect(wcswidth('∑∏∫')).toBe(3);
      expect(wcswidth('±×÷')).toBe(3);
    });

    it('should handle currency symbols', () => {
      expect(wcswidth('$€£¥')).toBe(4);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      expect(wcswidth('')).toBe(0);
    });

    it('should handle null and undefined', () => {
      expect(() => wcswidth(null)).toThrow();
      expect(() => wcswidth(undefined)).toThrow();
    });

    it('should handle whitespace', () => {
      expect(wcswidth(' ')).toBe(1);
      expect(wcswidth('\t')).toBe(-1);
      expect(wcswidth('\n')).toBe(-1);
    });
  });

  describe('Mixed character types', () => {
    it('should handle mixed ASCII and CJK', () => {
      expect(wcswidth('Hello 世界')).toBe(10);
      expect(wcswidth('123 你好')).toBe(8);
    });

    it('should handle mixed ASCII and emoji', () => {
      expect(wcswidth('Hello 😊')).toBe(8);
      expect(wcswidth('123 🌟')).toBe(6);
    });

    it('should handle complex mixed strings', () => {
      expect(wcswidth('Hello 世界! 😊')).toBe(14);
      expect(wcswidth('123 你好 🌟')).toBe(11);
    });
  });

  describe('Zero-width and combining characters', () => {
    it('should handle zero-width characters', () => {
      expect(wcswidth('\u200B')).toBe(0);
      expect(wcswidth('\u200C')).toBe(0);
      expect(wcswidth('\u200D')).toBe(0);
    });

    it('should handle combining characters', () => {
      expect(wcswidth('e\u0301')).toBe(1);
      expect(wcswidth('a\u0308')).toBe(1);
    });
  });
});
