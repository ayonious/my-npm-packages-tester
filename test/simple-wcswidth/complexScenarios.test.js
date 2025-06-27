const { wcswidth, wcwidth } = require('simple-wcswidth');

describe('Simple WCSWidth Complex Scenarios', () => {
  describe('Complex Unicode sequences', () => {
    it('should handle complex emoji sequences correctly', () => {
      // Complex emoji with modifiers (skin tones, gender, etc.)
      const complexEmoji = '👨‍👩‍👧‍👦';
      expect(wcswidth(complexEmoji)).toBe(8);
      
      // Flag emoji
      const flags = '🇺🇸🇯🇵🇪🇺';
      expect(wcswidth(flags)).toBe(12);
      
      // Emoji with zero-width joiner
      const familyEmoji = '👨‍👨‍👧‍👧';
      expect(wcswidth(familyEmoji)).toBe(8);
      
      // Emoji with variation selectors
      const heartEmoji = '❤️';  // Red heart with variation selector-16
      expect(wcswidth(heartEmoji)).toBe(1);
    });
    
    it('should handle complex combining characters', () => {
      // Latin with multiple combining marks
      const latinWithDiacritics = 'a\u0301\u0308'; // a with acute accent and diaeresis
      expect(wcswidth(latinWithDiacritics)).toBe(1);
      
      // Hangul with combining marks
      const hangulWithMarks = '한\u1100\u1161\u11A8';
      expect(wcswidth(hangulWithMarks)).toBe(4);
      
      // Complex script with combining marks
      const arabicWithMarks = 'ب\u0651\u0670'; // Arabic letter with shadda and superscript alef
      expect(wcswidth(arabicWithMarks)).toBe(1);
    });
    
    it('should handle special Unicode blocks', () => {
      // Mathematical symbols
      const mathSymbols = '∀∂∈ℝ∧∪≡∞';
      expect(wcswidth(mathSymbols)).toBe(8);
      
      // Musical symbols
      const musicalSymbols = '♩♪♫♬';
      expect(wcswidth(musicalSymbols)).toBe(4);
      
      // Box drawing characters
      const boxDrawing = '┌─┐│ │└─┘';
      expect(wcswidth(boxDrawing)).toBe(9);
      
      // Braille patterns
      const braille = '⠏⠗⠕⠛⠗⠁⠍⠍⠊⠝⠛';
      expect(wcswidth(braille)).toBe(11);
    });
  });
  
  describe('Mixed language text', () => {
    it('should handle mixed scripts correctly', () => {
      // Mixed Latin, CJK, Arabic, and Cyrillic
      const mixedText = 'Hello 你好 مرحبا Привет';
      expect(wcswidth(mixedText)).toBe(23);
      
      // Mixed with emoji
      const mixedWithEmoji = 'Hello 👋 你好 👍';
      expect(wcswidth(mixedWithEmoji)).toBe(16);
      
      // Mixed with different widths
      const complexMixed = 'Latin1 ñáéíóú 你好 こんにちは 안녕하세요 ←→↑↓';
      expect(wcswidth(complexMixed)).toBe(45);
    });
    
    it('should handle bidirectional text', () => {
      // Mixed LTR and RTL text
      const bidiText = 'Hello مرحبا';
      expect(wcswidth(bidiText)).toBe(11);
      
      // Complex bidirectional text with numbers
      const complexBidi = 'Page 1 صفحة 2 Page 3';
      expect(wcswidth(complexBidi)).toBe(20);
    });
  });
  
  describe('Edge cases and stress tests', () => {
    it('should handle extremely long strings', () => {
      // Generate a very long string
      const longAscii = 'a'.repeat(10000);
      expect(wcswidth(longAscii)).toBe(10000);
      
      // Long string with wide characters
      const longWide = '你'.repeat(1000);
      expect(wcswidth(longWide)).toBe(2000);
      
      // Long mixed string
      const longMixed = 'a你b好c你d好'.repeat(500);
      expect(wcswidth(longMixed)).toBe(6000);
    });
    
    it('should handle unusual Unicode characters', () => {
      // Private use area
      const privateUse = '\uE000\uE001\uF8FF';
      expect(wcswidth(privateUse)).toBe(3);
      
      // Unassigned code points
      const unassigned = '\u0378\u0379\u0380';
      expect(wcswidth(unassigned)).toBe(3);
      
      // Control characters
      const control = '\u0000\u0001\u0002\u0003\u0004';
      expect(wcswidth(control)).toBe(-1);
    });
    
    it('should handle complex formatting and layout characters', () => {
      // Zero-width characters
      const zeroWidth = 'a\u200Bb\u200Cc\u200Dd';
      expect(wcswidth(zeroWidth)).toBe(4);
      
      // Directional formatting
      const directional = 'a\u202Eb\u202Dc';
      expect(wcswidth(directional)).toBe(3);
      
      // Variation selectors
      const variation = 'a\uFE0Fb\uFE0Ec';
      expect(wcswidth(variation)).toBe(3);
    });
  });
  
  describe('Real-world application scenarios', () => {
    it('should correctly calculate width for terminal output formatting', () => {
      // Simulate a table row with mixed content
      const tableRow = '| User 你好 | Score 分数 | Rank 等级 |';
      expect(wcswidth(tableRow)).toBe(38);
      
      // Calculate padding needed for alignment
      const column1 = 'User 你好';
      const column2 = 'Score 分数';
      const column3 = 'Rank 等级';
      
      const width1 = wcswidth(column1);
      const width2 = wcswidth(column2);
      const width3 = wcswidth(column3);
      
      expect(width1).toBe(9);
      expect(width2).toBe(10);
      expect(width3).toBe(9);
    });
    
    it('should handle text truncation calculations', () => {
      // Simulate truncating text to fit in a specific width
      const longText = 'This is a very long text with some 中文 characters that needs to be truncated';
      
      // Function to truncate text to a specific visual width
      function truncateToWidth(text, maxWidth) {
        let currentWidth = 0;
        let truncatedText = '';
        
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const charWidth = wcswidth(char);
          
          if (currentWidth + charWidth <= maxWidth) {
            truncatedText += char;
            currentWidth += charWidth;
          } else {
            break;
          }
        }
        
        return truncatedText;
      }
      
      const truncated20 = truncateToWidth(longText, 20);
      const truncated30 = truncateToWidth(longText, 30);
      
      expect(wcswidth(truncated20)).toBeLessThanOrEqual(20);
      expect(wcswidth(truncated30)).toBeLessThanOrEqual(30);
      
      // Check that truncation happened at the right point
      expect(truncated20).toBe('This is a very long ');
      expect(truncated30).toBe('This is a very long text with ');
    });
    
    it('should handle complex alignment scenarios', () => {
      // Create a function to center text in a given width
      function centerText(text, totalWidth) {
        const textWidth = wcswidth(text);
        const paddingTotal = Math.max(0, totalWidth - textWidth);
        const leftPadding = Math.floor(paddingTotal / 2);
        const rightPadding = paddingTotal - leftPadding;
        
        return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
      }
      
      // Test with different texts
      const centered1 = centerText('Hello', 10);
      const centered2 = centerText('你好', 10);
      const centered3 = centerText('Hello 你好', 20);
      
      expect(wcswidth(centered1)).toBe(10);
      expect(wcswidth(centered2)).toBe(10);
      expect(wcswidth(centered3)).toBe(20);
      
      // Check that centering is correct
      expect(centered1).toBe('  Hello   ');
      expect(centered2).toBe('   你好   ');
      expect(centered3).toBe('     Hello 你好     ');
    });
  });
}); 