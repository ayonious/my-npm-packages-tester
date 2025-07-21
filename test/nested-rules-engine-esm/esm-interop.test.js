import { executeEngine } from 'nested-rules-engine';

describe('ESM: Interoperability tests between CommonJS and ESM', () => {
  it('should work when imported as ESM but used with CommonJS style functions', () => {
    // Using traditional function declarations (hoisted, function keyword)
    function isAdminUser(inputs) {
      return inputs.role === 'admin';
    }

    function isModerator(inputs) {
      return inputs.role === 'moderator';
    }

    function isRegularUser(inputs) {
      return inputs.role === 'user';
    }

    const rules = {
      is_admin: 'admin_access',
      is_moderator: 'moderator_access', 
      is_regular_user: 'user_access',
      default: 'guest_access'
    };

    const inputs = {
      role: 'admin',
      userId: 'admin123'
    };

    const functions = {
      default: () => true,
      is_admin: isAdminUser,
      is_moderator: isModerator,
      is_regular_user: isRegularUser,
      admin_access: function() {
        return {
          level: 'admin',
          permissions: ['read', 'write', 'delete', 'manage']
        };
      },
      moderator_access: function() {
        return {
          level: 'moderator',
          permissions: ['read', 'write', 'moderate']
        };
      },
      user_access: function() {
        return {
          level: 'user',
          permissions: ['read']
        };
      },
      guest_access: function() {
        return {
          level: 'guest',
          permissions: []
        };
      }
    };

    const result = executeEngine(inputs, functions, rules);

    expect(result.result.level).toBe('admin');
    expect(result.result.permissions).toContain('manage');
  });

  it('should handle dynamic imports within the execution context', async () => {
    const rules = {
      needs_dynamic_module: 'load_dynamic_module',
      default: 'use_static_result'
    };

    const inputs = {
      requiresDynamic: true,
      moduleType: 'utility'
    };

    const functions = {
      default: () => true,
      needs_dynamic_module: ({ requiresDynamic }) => requiresDynamic === true,
      load_dynamic_module: async ({ moduleType }) => {
        // Simulate dynamic import (in real scenario this could be a real dynamic import)
        const dynamicModule = await Promise.resolve({
          processData: (type) => `Processed ${type} data dynamically`,
          version: '1.0.0'
        });
        
        return {
          result: dynamicModule.processData(moduleType),
          version: dynamicModule.version,
          loadedDynamically: true
        };
      },
      use_static_result: () => ({
        result: 'Static result',
        loadedDynamically: false
      })
    };

    const result = executeEngine(inputs, functions, rules);

    expect(result.result.result).toBe('Processed utility data dynamically');
    expect(result.result.loadedDynamically).toBe(true);
    expect(result.result.version).toBe('1.0.0');
  });

  it('should work with generators and iterators (ES6+ features)', () => {
    function* numberGenerator(max) {
      for (let i = 1; i <= max; i++) {
        yield i;
      }
    }

    const rules = {
      should_process_sequence: 'process_with_generator',
      default: 'simple_result'
    };

    const inputs = {
      processSequence: true,
      maxNumber: 5
    };

    const functions = {
      default: () => true,
      should_process_sequence: ({ processSequence }) => processSequence === true,
      process_with_generator: ({ maxNumber }) => {
        const numbers = Array.from(numberGenerator(maxNumber));
        return {
          sequence: numbers,
          sum: numbers.reduce((acc, num) => acc + num, 0),
          count: numbers.length
        };
      },
      simple_result: () => ({
        sequence: [],
        sum: 0,
        count: 0
      })
    };

    const result = executeEngine(inputs, functions, rules);

    expect(result.result.sequence).toEqual([1, 2, 3, 4, 5]);
    expect(result.result.sum).toBe(15);
    expect(result.result.count).toBe(5);
  });

  it('should handle Symbol keys and WeakMap/WeakSet', () => {
    const userSymbol = Symbol('user');
    const adminSymbol = Symbol('admin');
    
    const userRegistry = new WeakMap();
    const adminRegistry = new WeakSet();
    
    const userObj = { id: 'user123' };
    const adminObj = { id: 'admin456' };
    
    userRegistry.set(userObj, 'user-data');
    adminRegistry.add(adminObj);

    const rules = {
      is_registered_admin: 'admin_access',
      is_registered_user: 'user_access',
      default: 'no_access'
    };

    const inputs = {
      currentUser: adminObj,
      userRegistry,
      adminRegistry,
      symbols: {
        user: userSymbol,
        admin: adminSymbol
      }
    };

    const functions = {
      default: () => true,
      is_registered_admin: ({ currentUser, adminRegistry }) => {
        return adminRegistry.has(currentUser);
      },
      is_registered_user: ({ currentUser, userRegistry }) => {
        return userRegistry.has(currentUser);
      },
      admin_access: ({ symbols, currentUser }) => ({
        access: 'admin',
        userType: symbols.admin.description || 'admin',
        userId: currentUser.id
      }),
      user_access: ({ symbols, currentUser }) => ({
        access: 'user', 
        userType: symbols.user.description || 'user',
        userId: currentUser.id
      }),
      no_access: () => ({
        access: 'none',
        userType: 'guest',
        userId: null
      })
    };

    const result = executeEngine(inputs, functions, rules);

    expect(result.result.access).toBe('admin');
    expect(result.result.userId).toBe('admin456');
    expect(result.result.userType).toBe('admin');
  });
}); 