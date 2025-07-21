import { executeEngine } from 'nested-rules-engine';

describe('ESM: Basic nested-rules-engine functionality', () => {
  it('should work with ES6 import syntax', async () => {
    // Step1: Define your conditional rules
    const rules = {
      you_are_a_human: {
        you_are_kind: 'help_me_find_my_book',
        you_are_smart: 'please_do_my_homework',
      },
      default: 'please_do_my_homework',
    };

    // Step2: make set of inputs collection
    const inputs = {
      type: 'human',
      kindnessLevel: 0,
      intelligence: 10,
    };

    // Step3: Make your custom Functions
    const functions = {
      default: () => true,
      you_are_a_human: ({ type }) => type === 'human',
      you_are_kind: ({ kindnessLevel }) => kindnessLevel > 300,
      you_are_smart: ({ intelligence }) => intelligence > 5,
      help_me_find_my_book: () => ({
        payload: 'lets help someone',
        effort: 'finding the book',
      }),
      please_do_my_homework: () => ({
        payload: 'doing homework',
        effort: 'im getting sick',
      }),
    };

    // Step4: Execute Engine
    const res = executeEngine(inputs, functions, rules);

    expect(res).toBeDefined();
    expect(res.result).toBeDefined();
    expect(res.result.payload).toBe('doing homework');
    expect(res.result.effort).toBe('im getting sick');
    expect(res.logs).toEqual([]);
  });

  it('should handle async functions in ESM context', async () => {
    const rules = {
      is_async_operation: 'async_result',
      default: 'sync_result'
    };

    const inputs = {
      operation: 'async'
    };

    const functions = {
      default: () => true,
      is_async_operation: ({ operation }) => operation === 'async',
      async_result: async () => {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 10));
        return {
          status: 'completed',
          data: 'async data'
        };
      },
      sync_result: () => ({
        status: 'completed',
        data: 'sync data'
      })
    };

    const res = executeEngine(inputs, functions, rules);

    expect(res).toBeDefined();
    expect(res.result).toBeDefined();
    expect(res.result.status).toBe('completed');
    expect(res.result.data).toBe('async data');
  });
}); 