import React from 'react';
import { Star, Zap, TrendingUp } from 'lucide-react';

const PlanSelectionModal = ({ practiceItemsCount, onSelectPlan }) => {
  const plans = [
    {
      id: 'free',
      name: 'FREE',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Track up to 50 items',
        '25 scans/day',
        'Expiry alerts & tracking',
        'Weekly stats only'
      ],
      cta: 'Start Free',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
      icon: Star
    },
    {
      id: 'premium_monthly',
      name: 'PREMIUM',
      badge: 'Most Popular',
      price: '$2.99',
      period: '/month',
      description: 'Full access to all features',
      features: [
        'Unlimited items & scans',
        'Advanced Analytics: Weekly, monthly & yearly trends, spending vs waste analysis, consumption patterns',
        'Full Rewards Access: Weekly challenges & budget goals'
      ],
      cta: 'Start 30-Day Free Trial',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      icon: Zap,
      recommended: true
    },
    {
      id: 'premium_annual',
      name: 'PREMIUM',
      badge: 'Best Value',
      price: '$24.99',
      period: '/year',
      subPrice: 'Just $2.08/month',
      description: 'Save 30% with annual billing',
      features: [
        'Unlimited items & scans',
        'Advanced Analytics: Weekly, monthly & yearly trends, spending vs waste analysis, consumption patterns',
        'Full Rewards Access: Weekly challenges & budget goals'
      ],
      cta: 'Start 30-Day Free Trial',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
      icon: TrendingUp
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-5xl my-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-blue-100 text-lg">Start reducing waste today</p>
            {practiceItemsCount > 0 && (
              <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 inline-block">
                <p className="text-sm">
                  ✅ You've added {practiceItemsCount} practice {practiceItemsCount === 1 ? 'item' : 'items'} - great start!
                </p>
              </div>
            )}
          </div>

          {/* Plans Grid */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-xl ${
                      plan.recommended ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                    }`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white ${
                        plan.id === 'premium_annual' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}>
                        {plan.badge}
                      </div>
                    )}

                    {/* Icon & Name */}
                    {plan.icon && (
                      <div className="flex items-center gap-2 mb-4">
                        <Icon className={`w-5 h-5 ${plan.id === 'premium_annual' ? 'text-amber-600' : plan.id === 'free' ? 'text-gray-600' : 'text-blue-600'}`} />
                        <div className="font-bold text-gray-900">{plan.name}</div>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600 text-sm">{plan.period}</span>
                      </div>
                      {plan.subPrice && (
                        <div className="text-sm text-gray-600 mt-1">({plan.subPrice})</div>
                      )}
                      <div className="text-sm text-gray-600 mt-1">{plan.description}</div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => onSelectPlan(plan.id)}
                      className={`w-full ${plan.buttonColor} text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Note */}
            <div className="text-center mt-6 text-sm text-gray-500">
              💡 30-day free trial on Premium • Cancel anytime • Change plans in Settings
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal;

