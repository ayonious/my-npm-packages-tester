import { executeEngine } from 'nested-rules-engine';

describe('ESM: Advanced nested-rules-engine with ES6+ features', () => {
  it('should work with ES6 destructuring and arrow functions', () => {
    const rules = {
      is_premium_user: {
        has_valid_subscription: {
          subscription_active: 'grant_premium_access',
          subscription_expired: 'show_renewal_prompt'
        },
        trial_period: 'show_upgrade_prompt'
      },
      is_free_user: 'show_free_content',
      default: 'show_login_prompt'
    };

    const inputs = {
      userType: 'premium',
      subscription: {
        status: 'active',
        expiryDate: new Date('2025-12-31'),
        plan: 'annual'
      },
      features: ['streaming', 'downloads', 'offline']
    };

    // Using ES6+ features in functions
    const functions = {
      default: () => true,
      is_premium_user: ({ userType }) => userType === 'premium',
      is_free_user: ({ userType }) => userType === 'free',
      has_valid_subscription: ({ subscription: { status, expiryDate } }) => 
        status && new Date(expiryDate) > new Date(),
      trial_period: ({ subscription: { plan } }) => plan === 'trial',
      subscription_active: ({ subscription: { status } }) => status === 'active',
      subscription_expired: ({ subscription: { status } }) => status === 'expired',
      grant_premium_access: ({ features, subscription }) => ({
        accessLevel: 'premium',
        features,
        plan: subscription.plan,
        message: 'Welcome to premium content!'
      }),
      show_renewal_prompt: () => ({
        accessLevel: 'limited',
        message: 'Please renew your subscription'
      }),
      show_upgrade_prompt: () => ({
        accessLevel: 'trial',
        message: 'Upgrade to premium for full access'
      }),
      show_free_content: () => ({
        accessLevel: 'free',
        message: 'Enjoy our free content'
      }),
      show_login_prompt: () => ({
        accessLevel: 'guest',
        message: 'Please log in to continue'
      })
    };

    const result = executeEngine(inputs, functions, rules);

    expect(result.result.accessLevel).toBe('premium');
    expect(result.result.features).toEqual(['streaming', 'downloads', 'offline']);
    expect(result.result.plan).toBe('annual');
    expect(result.result.message).toBe('Welcome to premium content!');
  });

  it('should handle class-based functions with ESM', () => {
    class UserPermissionManager {
      constructor(userRole) {
        this.role = userRole;
      }

      checkAdminAccess = ({ permissions }) => permissions.includes('admin');
      checkModeratorAccess = ({ permissions }) => permissions.includes('moderator');
      checkUserAccess = ({ permissions }) => permissions.includes('user');

      getAdminDashboard = () => ({
        dashboard: 'admin',
        features: ['user-management', 'system-settings', 'analytics'],
        role: this.role
      });

      getModeratorDashboard = () => ({
        dashboard: 'moderator',
        features: ['content-moderation', 'user-reports'],
        role: this.role
      });

      getUserDashboard = () => ({
        dashboard: 'user',
        features: ['profile', 'settings'],
        role: this.role
      });

      getGuestAccess = () => ({
        dashboard: 'guest',
        features: ['limited-content'],
        role: 'guest'
      });
    }

    const rules = {
      has_admin_access: 'admin_dashboard',
      has_moderator_access: 'moderator_dashboard',
      has_user_access: 'user_dashboard',
      default: 'guest_access'
    };

    const inputs = {
      permissions: ['user', 'moderator'],
      userId: 'user123'
    };

    const permissionManager = new UserPermissionManager('moderator');

    const functions = {
      default: () => true,
      has_admin_access: permissionManager.checkAdminAccess,
      has_moderator_access: permissionManager.checkModeratorAccess,
      has_user_access: permissionManager.checkUserAccess,
      admin_dashboard: permissionManager.getAdminDashboard,
      moderator_dashboard: permissionManager.getModeratorDashboard,
      user_dashboard: permissionManager.getUserDashboard,
      guest_access: permissionManager.getGuestAccess
    };

    const result = executeEngine(inputs, functions, rules);

    expect(result.result.dashboard).toBe('moderator');
    expect(result.result.features).toContain('content-moderation');
    expect(result.result.role).toBe('moderator');
  });

  it('should work with Map and Set data structures', () => {
    const rules = {
      has_required_features: {
        all_features_active: 'full_access',
        partial_features: 'limited_access'
      },
      default: 'no_access'
    };

    const requiredFeatures = new Set(['feature1', 'feature2', 'feature3']);
    const userFeatures = new Map([
      ['feature1', true],
      ['feature2', true], 
      ['feature3', false]
    ]);

    const inputs = {
      userFeatures,
      requiredFeatures
    };

    const functions = {
      default: () => true,
      has_required_features: ({ userFeatures, requiredFeatures }) => {
        for (let feature of requiredFeatures) {
          if (userFeatures.has(feature)) {
            return true;
          }
        }
        return false;
      },
      all_features_active: ({ userFeatures, requiredFeatures }) => {
        return Array.from(requiredFeatures).every(feature => 
          userFeatures.get(feature) === true
        );
      },
      partial_features: ({ userFeatures, requiredFeatures }) => {
        return !Array.from(requiredFeatures).every(feature => 
          userFeatures.get(feature) === true
        );
      },
      full_access: ({ userFeatures }) => ({
        accessLevel: 'full',
        enabledFeatures: Array.from(userFeatures.entries())
          .filter(([_, enabled]) => enabled)
          .map(([feature, _]) => feature)
      }),
      limited_access: ({ userFeatures }) => ({
        accessLevel: 'limited',
        enabledFeatures: Array.from(userFeatures.entries())
          .filter(([_, enabled]) => enabled)
          .map(([feature, _]) => feature)
      }),
      no_access: () => ({
        accessLevel: 'none',
        enabledFeatures: []
      })
    };

    const result = executeEngine(inputs, functions, rules);

    expect(result.result.accessLevel).toBe('limited');
    expect(result.result.enabledFeatures).toEqual(['feature1', 'feature2']);
  });
}); 