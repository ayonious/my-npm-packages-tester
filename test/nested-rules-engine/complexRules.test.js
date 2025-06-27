const { executeEngine } = require('nested-rules-engine');

describe('Nested Rules Engine Complex Scenarios', () => {
  describe('Deep nested rules with multiple conditions', () => {
    it('should handle deep nested rules with multiple conditions', () => {
      // Complex nested rules structure
      const rules = {
        is_customer: {
          has_account: {
            account_active: {
              has_subscription: 'premium_content',
              default: 'basic_content'
            },
            account_suspended: 'account_reactivation',
            account_closed: 'signup_offer'
          },
          is_guest: 'guest_content'
        },
        is_admin: {
          has_full_access: 'admin_dashboard',
          has_limited_access: 'limited_dashboard'
        },
        is_system: 'system_operations',
        default: 'public_content'
      };

      // Test case 1: Customer with active account and subscription
      const customerInput = {
        userType: 'customer',
        accountStatus: 'active',
        hasAccount: true,
        subscriptionLevel: 'premium'
      };

      const functions = {
        default: () => true,
        is_customer: ({ userType }) => userType === 'customer',
        is_admin: ({ userType }) => userType === 'admin',
        is_system: ({ userType }) => userType === 'system',
        has_account: ({ hasAccount }) => hasAccount === true,
        is_guest: ({ hasAccount }) => hasAccount === false,
        account_active: ({ accountStatus }) => accountStatus === 'active',
        account_suspended: ({ accountStatus }) => accountStatus === 'suspended',
        account_closed: ({ accountStatus }) => accountStatus === 'closed',
        has_subscription: ({ subscriptionLevel }) => subscriptionLevel === 'premium',
        has_full_access: ({ accessLevel }) => accessLevel === 'full',
        has_limited_access: ({ accessLevel }) => accessLevel === 'limited',
        premium_content: () => ({
          content: 'premium',
          features: ['streaming', 'downloads', 'exclusive']
        }),
        basic_content: () => ({
          content: 'basic',
          features: ['streaming']
        }),
        guest_content: () => ({
          content: 'guest',
          features: ['previews']
        }),
        account_reactivation: () => ({
          content: 'reactivation',
          action: 'reactivate'
        }),
        signup_offer: () => ({
          content: 'signup',
          action: 'offer'
        }),
        admin_dashboard: () => ({
          content: 'admin',
          access: 'full'
        }),
        limited_dashboard: () => ({
          content: 'admin',
          access: 'limited'
        }),
        system_operations: () => ({
          content: 'system',
          operations: ['maintenance', 'backup', 'monitoring']
        }),
        public_content: () => ({
          content: 'public',
          features: []
        })
      };

      // Execute engine for customer with premium subscription
      const customerResult = executeEngine(customerInput, functions, rules);
      expect(customerResult.result).toEqual({
        content: 'premium',
        features: ['streaming', 'downloads', 'exclusive']
      });

      // Test case 2: Customer with active account but no subscription
      const basicCustomerInput = {
        userType: 'customer',
        accountStatus: 'active',
        hasAccount: true,
        subscriptionLevel: 'basic'
      };

      const basicCustomerResult = executeEngine(basicCustomerInput, functions, rules);
      expect(basicCustomerResult.result).toEqual({
        content: 'basic',
        features: ['streaming']
      });

      // Test case 3: Admin with full access
      const adminInput = {
        userType: 'admin',
        accessLevel: 'full'
      };

      const adminResult = executeEngine(adminInput, functions, rules);
      expect(adminResult.result).toEqual({
        content: 'admin',
        access: 'full'
      });

      // Test case 4: Unknown user type (default case)
      const unknownInput = {
        userType: 'unknown'
      };

      const unknownResult = executeEngine(unknownInput, functions, rules);
      expect(unknownResult.result).toEqual({
        content: 'public',
        features: []
      });
    });
  });

  describe('Rules with complex data transformations', () => {
    it('should handle rules with complex data transformations', () => {
      // Rules for data processing pipeline
      const rules = {
        has_raw_data: {
          needs_normalization: 'normalize_data',
          needs_filtering: 'filter_data',
          is_valid: 'process_valid_data'
        },
        has_processed_data: {
          needs_aggregation: 'aggregate_data',
          needs_transformation: 'transform_data'
        },
        default: 'invalid_data'
      };

      // Sample dataset
      const sampleData = {
        dataType: 'raw',
        values: [10, 25, -5, 100, 30, -20, 45],
        metadata: {
          source: 'sensor',
          timestamp: Date.now(),
          needsNormalization: true,
          validationStatus: 'partial'
        }
      };

      // Complex functions with data transformations
      const functions = {
        default: () => true,
        has_raw_data: ({ dataType }) => dataType === 'raw',
        has_processed_data: ({ dataType }) => dataType === 'processed',
        needs_normalization: ({ metadata }) => metadata.needsNormalization === true,
        needs_filtering: ({ values }) => values.some(v => v < 0),
        is_valid: ({ metadata }) => metadata.validationStatus === 'valid',
        needs_aggregation: ({ metadata }) => metadata.needsAggregation === true,
        needs_transformation: ({ metadata }) => metadata.needsTransformation === true,
        
        normalize_data: ({ values, ...rest }) => {
          const max = Math.max(...values);
          const normalizedValues = values.map(v => v / max);
          return {
            ...rest,
            dataType: 'processed',
            values: normalizedValues,
            metadata: {
              ...rest.metadata,
              normalized: true,
              needsNormalization: false,
              processingStep: 'normalization'
            }
          };
        },
        
        filter_data: ({ values, ...rest }) => {
          const filteredValues = values.filter(v => v >= 0);
          return {
            ...rest,
            dataType: 'processed',
            values: filteredValues,
            metadata: {
              ...rest.metadata,
              filtered: true,
              processingStep: 'filtering'
            }
          };
        },
        
        process_valid_data: (data) => ({
          ...data,
          dataType: 'processed',
          metadata: {
            ...data.metadata,
            processingStep: 'validation'
          }
        }),
        
        aggregate_data: ({ values, ...rest }) => {
          const sum = values.reduce((acc, val) => acc + val, 0);
          const avg = sum / values.length;
          return {
            ...rest,
            dataType: 'aggregated',
            aggregatedValues: {
              sum,
              avg,
              min: Math.min(...values),
              max: Math.max(...values)
            },
            metadata: {
              ...rest.metadata,
              processingStep: 'aggregation'
            }
          };
        },
        
        transform_data: (data) => ({
          ...data,
          dataType: 'transformed',
          metadata: {
            ...data.metadata,
            processingStep: 'transformation'
          }
        }),
        
        invalid_data: (data) => ({
          error: 'Invalid data',
          originalData: data
        })
      };

      // Execute the rules engine
      const result = executeEngine(sampleData, functions, rules);
      
      // Check that normalization was applied
      expect(result.result.dataType).toBe('processed');
      expect(result.result.metadata.normalized).toBe(true);
      expect(result.result.metadata.processingStep).toBe('normalization');
      
      // Check that values were normalized (divided by max value)
      const maxOriginal = Math.max(...sampleData.values);
      const expectedNormalized = sampleData.values.map(v => v / maxOriginal);
      expect(result.result.values).toEqual(expectedNormalized);
    });
  });

  describe('Rules with recursive patterns', () => {
    it('should handle rules with recursive patterns', () => {
      // Define a rule set that processes hierarchical data
      const rules = {
        is_node: {
          has_children: 'process_children',
          is_leaf: 'process_leaf'
        },
        default: 'unknown_node'
      };

      // Create a tree structure
      const treeData = {
        id: 'root',
        type: 'node',
        children: [
          {
            id: 'child1',
            type: 'node',
            children: [
              { id: 'leaf1', type: 'leaf', value: 10 },
              { id: 'leaf2', type: 'leaf', value: 20 }
            ]
          },
          {
            id: 'child2',
            type: 'node',
            children: [
              { id: 'leaf3', type: 'leaf', value: 30 },
              { 
                id: 'child3', 
                type: 'node',
                children: [
                  { id: 'leaf4', type: 'leaf', value: 40 }
                ]
              }
            ]
          },
          { id: 'leaf5', type: 'leaf', value: 50 }
        ]
      };

      // Keep track of processed nodes
      const processedNodes = [];
      const leafValues = [];

      // Define functions with recursive processing
      const functions = {
        default: () => true,
        is_node: ({ type }) => type === 'node',
        has_children: ({ children }) => children && children.length > 0,
        is_leaf: ({ type }) => type === 'leaf',
        
        process_children: (node) => {
          processedNodes.push(node.id);
          
          // Process each child node recursively
          if (node.children) {
            node.children.forEach(child => {
              // Recursively apply rules to each child
              const childResult = executeEngine(child, functions, rules);
              
              // Process the child result directly here instead of relying on side effects
              if (child.type === 'leaf') {
                leafValues.push(child.value);
              }
              
              // Add the processed child to our tracking array
              if (childResult && childResult.result && childResult.result.id) {
                if (!processedNodes.includes(childResult.result.id)) {
                  processedNodes.push(childResult.result.id);
                }
              }
            });
          }
          
          return {
            id: node.id,
            processed: true,
            childCount: node.children ? node.children.length : 0
          };
        },
        
        process_leaf: (node) => {
          processedNodes.push(node.id);
          leafValues.push(node.value);
          return {
            id: node.id,
            processed: true,
            value: node.value
          };
        },
        
        unknown_node: (node) => {
          return {
            id: node.id,
            processed: false,
            error: 'Unknown node type'
          };
        }
      };

      // Execute the rules engine on the root node
      const result = executeEngine(treeData, functions, rules);
      
      // Verify the root was processed
      expect(result.result.processed).toBe(true);
      expect(result.result.id).toBe('root');
      
      // Verify all nodes were processed
      expect(processedNodes).toContain('root');
      expect(processedNodes).toContain('child1');
      expect(processedNodes).toContain('child2');
      expect(processedNodes).toContain('child3');
      expect(processedNodes).toContain('leaf1');
      expect(processedNodes).toContain('leaf2');
      expect(processedNodes).toContain('leaf3');
      expect(processedNodes).toContain('leaf4');
      expect(processedNodes).toContain('leaf5');
      
      // Verify all leaf values were collected
      expect(leafValues).toContain(10);
      expect(leafValues).toContain(20);
      expect(leafValues).toContain(30);
      expect(leafValues).toContain(40);
      expect(leafValues).toContain(50);
      expect(leafValues.length).toBe(5);
    });
  });
}); 