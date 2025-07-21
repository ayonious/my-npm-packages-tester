import { executeEngine } from 'nested-rules-engine';

describe('ESM: TypeScript compatibility and modern JavaScript features', () => {
  it('should work with optional chaining and nullish coalescing', () => {
    const rules = {
      has_valid_user: {
        user_has_permissions: 'grant_access',
        user_lacks_permissions: 'limited_access'
      },
      default: 'no_access'
    };

    const inputs = {
      user: {
        profile: {
          name: 'John Doe',
          settings: {
            notifications: true,
            theme: 'dark'
          }
        },
        permissions: ['read', 'write']
      }
    };

    const functions = {
      default: () => true,
      has_valid_user: ({ user }) => user?.profile?.name !== undefined,
      user_has_permissions: ({ user }) => {
        const permissions = user?.permissions ?? [];
        return permissions.length > 0;
      },
      user_lacks_permissions: ({ user }) => {
        const permissions = user?.permissions ?? [];
        return permissions.length === 0;
      },
      grant_access: ({ user }) => ({
        access: 'granted',
        userName: user?.profile?.name ?? 'Unknown',
        theme: user?.profile?.settings?.theme ?? 'light',
        permissions: user?.permissions ?? []
      }),
      limited_access: ({ user }) => ({
        access: 'limited',
        userName: user?.profile?.name ?? 'Unknown',
        theme: user?.profile?.settings?.theme ?? 'light',
        permissions: []
      }),
      no_access: () => ({
        access: 'denied',
        userName: 'Guest',
        theme: 'light',
        permissions: []
      })
    };

    const result = executeEngine(inputs, functions, rules);

    expect(result.result.access).toBe('granted');
    expect(result.result.userName).toBe('John Doe');
    expect(result.result.theme).toBe('dark');
    expect(result.result.permissions).toEqual(['read', 'write']);
  });

  it('should handle template literals and tagged templates', () => {
    const rules = {
      should_format_message: 'format_with_template',
      default: 'simple_message'
    };

    const inputs = {
      formatMessage: true,
      user: 'Alice',
      action: 'login',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      metadata: {
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0'
      }
    };

    // Tagged template function
    function logFormat(strings, ...values) {
      return strings.reduce((result, string, i) => {
        const value = values[i];
        if (value instanceof Date) {
          return result + string + value.toISOString();
        }
        if (typeof value === 'object') {
          return result + string + JSON.stringify(value);
        }
        return result + string + (value || '');
      }, '');
    }

    const functions = {
      default: () => true,
      should_format_message: ({ formatMessage }) => formatMessage === true,
      format_with_template: ({ user, action, timestamp, metadata }) => {
        const basicTemplate = `User ${user} performed ${action} at ${timestamp}`;
        const taggedTemplate = logFormat`User: ${user}, Action: ${action}, Time: ${timestamp}, Meta: ${metadata}`;
        
        return {
          basicMessage: basicTemplate,
          taggedMessage: taggedTemplate,
          multilineMessage: `
            ═══ User Activity Log ═══
            User: ${user}
            Action: ${action}
            Timestamp: ${timestamp.toISOString()}
            IP Address: ${metadata.ip}
            User Agent: ${metadata.userAgent}
            ═══════════════════════════
          `.trim()
        };
      },
      simple_message: () => ({
        basicMessage: 'Simple message',
        taggedMessage: 'Simple tagged message',
        multilineMessage: 'Simple multiline message'
      })
    };

    const result = executeEngine(inputs, functions, rules);

    expect(result.result.basicMessage).toContain('Alice');
    expect(result.result.basicMessage).toContain('login');
    expect(result.result.taggedMessage).toContain('User: Alice');
    expect(result.result.multilineMessage).toContain('User Activity Log');
    expect(result.result.multilineMessage).toContain('192.168.1.1');
  });

  it('should work with private fields and static methods (Class features)', () => {
    class UserValidator {
      // Static private field (simulated with Symbol)
      static #validationRules = Symbol('validationRules');
      
      // Static method
      static getValidationRules() {
        return {
          email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
          age: (age) => age >= 18 && age <= 120
        };
      }

      // Private field (simulated)
      #validationCache = new Map();

      constructor(config = {}) {
        this.strictMode = config.strictMode ?? false;
        this.allowGuests = config.allowGuests ?? true;
      }

      // Method with parameter destructuring and default values
      validateUser = ({ email = '', password = '', age = 0, isGuest = false } = {}) => {
        if (isGuest && this.allowGuests) {
          return { valid: true, reason: 'Guest user allowed' };
        }

        const cacheKey = `${email}_${password}_${age}`;
        if (this.#validationCache.has(cacheKey)) {
          return this.#validationCache.get(cacheKey);
        }

        const rules = UserValidator.getValidationRules();
        
        if (!rules.email.test(email)) {
          const result = { valid: false, reason: 'Invalid email format' };
          this.#validationCache.set(cacheKey, result);
          return result;
        }

        if (!rules.password.test(password)) {
          const result = { valid: false, reason: 'Password does not meet requirements' };
          this.#validationCache.set(cacheKey, result);
          return result;
        }

        if (!rules.age(age)) {
          const result = { valid: false, reason: 'Age must be between 18 and 120' };
          this.#validationCache.set(cacheKey, result);
          return result;
        }

        const result = { valid: true, reason: 'User validation passed' };
        this.#validationCache.set(cacheKey, result);
        return result;
      };

      getUserStatus = ({ email, password, age, isGuest }) => {
        const validation = this.validateUser({ email, password, age, isGuest });
        
        if (!validation.valid) {
          return {
            status: 'rejected',
            message: validation.reason,
            accessLevel: 'none'
          };
        }

        if (isGuest) {
          return {
            status: 'guest',
            message: 'Guest access granted',
            accessLevel: 'limited'
          };
        }

        return {
          status: 'authenticated',
          message: 'Full access granted',
          accessLevel: 'full'
        };
      };
    }

    const rules = {
      is_valid_user: 'grant_user_access',
      default: 'deny_access'
    };

    const inputs = {
      email: 'user@example.com',
      password: 'SecurePass123!',
      age: 25,
      isGuest: false
    };

    const validator = new UserValidator({ strictMode: true, allowGuests: true });

    const functions = {
      default: () => true,
      is_valid_user: validator.validateUser,
      grant_user_access: validator.getUserStatus,
      deny_access: () => ({
        status: 'denied',
        message: 'Access denied',
        accessLevel: 'none'
      })
    };

    const result = executeEngine(inputs, functions, rules);

    expect(result.result.status).toBe('authenticated');
    expect(result.result.accessLevel).toBe('full');
    expect(result.result.message).toBe('Full access granted');
  });

  it('should handle BigInt and modern numeric operations', () => {
    const rules = {
      needs_big_calculation: 'perform_big_calculation',
      default: 'simple_calculation'
    };

    const inputs = {
      useBigInt: true,
      largeNumber: 9007199254740991n, // Number.MAX_SAFE_INTEGER as BigInt
      precision: 'high'
    };

    const functions = {
      default: () => true,
      needs_big_calculation: ({ useBigInt }) => useBigInt === true,
      perform_big_calculation: ({ largeNumber, precision }) => {
        // BigInt operations
        const doubled = largeNumber * 2n;
        const powered = largeNumber ** 2n;
        
        // Numeric separator in literals
        const maxSafeInteger = 9_007_199_254_740_991n;
        const comparison = largeNumber === maxSafeInteger;

        return {
          original: largeNumber.toString(),
          doubled: doubled.toString(),
          powered: powered.toString(),
          isMaxSafe: comparison,
          precision,
          // Using Object.fromEntries for dynamic object creation
          calculations: Object.fromEntries([
            ['addition', (largeNumber + 1000n).toString()],
            ['subtraction', (largeNumber - 1000n).toString()],
            ['division', (largeNumber / 1000n).toString()]
          ])
        };
      },
      simple_calculation: ({ largeNumber }) => ({
        original: typeof largeNumber === 'bigint' ? largeNumber.toString() : largeNumber,
        doubled: 'N/A',
        powered: 'N/A',
        isMaxSafe: false,
        precision: 'low',
        calculations: {}
      })
    };

    const result = executeEngine(inputs, functions, rules);

    expect(result.result.original).toBe('9007199254740991');
    expect(result.result.isMaxSafe).toBe(true);
    expect(result.result.precision).toBe('high');
    expect(result.result.calculations.addition).toBe('9007199254741991');
  });
}); 