import React from 'react';
import { Trophy, Target, Flame, Star } from 'lucide-react';

export default function RewardsScreenV2({ 
  consumedItems = [], 
  inventory = [], 
  totalWasted = 0,
  colors 
}) {
  // Fallback colors if not provided
  const safeColors = colors || {
    text: '#374151',
    textSecondary: '#6B7280',
    primary: '#60A5FA',
    secondary: '#FBBF24',
    border: '#E5E7EB',
    bg: '#F9FAFB',
    primaryLight: '#DBEAFE',
    secondaryLight: '#FEF3C7',
    bgGray: '#F9FAFB',
  };

  return (
    <div 
      className="h-full overflow-y-auto pb-24"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="px-4 pt-6">
        <h1 
          className="text-2xl font-bold mb-6" 
          style={{ color: safeColors.text }}
        >
          Rewards
        </h1>

        {/* Level Card */}
        <div 
          className="p-6 rounded-2xl mb-6 relative overflow-hidden" 
          style={{ background: 'linear-gradient(135deg, #CD7F32 0%, #B8732E 100%)' }}
        >
          <div 
            className="absolute top-4 right-4 w-16 h-16 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            <Trophy size={32} color="white" />
          </div>
          <div 
            className="text-sm font-medium mb-1" 
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            Current Level
          </div>
          <div className="text-4xl font-bold mb-4 text-white">
            Bronze
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <span 
                className="text-sm font-medium" 
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                Progress to Silver
              </span>
              <span className="text-sm font-bold text-white">
                350 / 2,000
              </span>
            </div>
            <div 
              className="w-full h-2 rounded-full" 
              style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
            >
              <div 
                className="h-2 rounded-full transition-all duration-500" 
                style={{ 
                  width: '17%', 
                  backgroundColor: 'rgba(255,255,255,0.9)' 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div 
            className="bg-white p-4 rounded-2xl border text-center" 
            style={{ borderColor: safeColors.border }}
          >
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" 
              style={{ backgroundColor: safeColors.secondaryLight }}
            >
              <Target size={24} style={{ color: safeColors.secondary }} />
            </div>
            <div 
              className="text-2xl font-bold mb-1" 
              style={{ color: safeColors.text }}
            >
              {consumedItems.length}
            </div>
            <div 
              className="text-sm" 
              style={{ color: safeColors.textSecondary }}
            >
              Earned
            </div>
          </div>
          <div 
            className="bg-white p-4 rounded-2xl border text-center" 
            style={{ borderColor: safeColors.border }}
          >
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" 
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <Flame size={24} style={{ color: '#EF4444' }} />
            </div>
            <div 
              className="text-2xl font-bold mb-1" 
              style={{ color: safeColors.text }}
            >
              7
            </div>
            <div 
              className="text-sm" 
              style={{ color: safeColors.textSecondary }}
            >
              Streak
            </div>
          </div>
          <div 
            className="bg-white p-4 rounded-2xl border text-center" 
            style={{ borderColor: safeColors.border }}
          >
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" 
              style={{ backgroundColor: safeColors.primaryLight }}
            >
              <Star size={24} style={{ color: safeColors.primary }} />
            </div>
            <div 
              className="text-2xl font-bold mb-1" 
              style={{ color: safeColors.text }}
            >
              5
            </div>
            <div 
              className="text-sm" 
              style={{ color: safeColors.textSecondary }}
            >
              Challenges
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-4">
          <h2 
            className="text-lg font-bold mb-4" 
            style={{ color: safeColors.text }}
          >
            Achievements
          </h2>

          {/* Achievement 1 - Unlocked */}
          <div 
            className="bg-white p-4 rounded-2xl mb-3" 
            style={{ border: `2px solid ${safeColors.primary}` }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" 
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
              >
                <Trophy size={32} style={{ color: '#10B981' }} />
              </div>
              <div className="flex-1">
                <div 
                  className="font-bold text-base mb-1" 
                  style={{ color: safeColors.text }}
                >
                  First Week
                </div>
                <div 
                  className="text-sm mb-2" 
                  style={{ color: safeColors.textSecondary }}
                >
                  7 days active
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-xs px-2 py-1 rounded font-medium" 
                    style={{ backgroundColor: '#F3F4F6', color: '#9CA3AF' }}
                  >
                    common
                  </span>
                  <span 
                    className="text-sm font-bold" 
                    style={{ color: safeColors.secondary }}
                  >
                    +100 pts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement 2 - Locked */}
          <div 
            className="bg-white p-4 rounded-2xl mb-3" 
            style={{ border: `1px solid ${safeColors.border}`, opacity: 0.7 }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" 
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              >
                <Star size={32} style={{ color: '#3B82F6' }} />
              </div>
              <div className="flex-1">
                <div 
                  className="font-bold text-base mb-1" 
                  style={{ color: safeColors.text }}
                >
                  Quick Start
                </div>
                <div 
                  className="text-sm mb-2" 
                  style={{ color: safeColors.textSecondary }}
                >
                  Add 10 items in your first day
                </div>
                <div className="mt-2">
                  <div 
                    className="w-full h-2 rounded-full" 
                    style={{ backgroundColor: safeColors.bgGray }}
                  >
                    <div 
                      className="h-2 rounded-full transition-all duration-500" 
                      style={{ width: '60%', backgroundColor: safeColors.primary }} 
                    />
                  </div>
                  <div 
                    className="text-xs mt-1" 
                    style={{ color: safeColors.textSecondary }}
                  >
                    60% complete
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement 3 - Locked */}
          <div 
            className="bg-white p-4 rounded-2xl" 
            style={{ border: `1px solid ${safeColors.border}`, opacity: 0.7 }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" 
                style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
              >
                <Flame size={32} style={{ color: '#FBBF24' }} />
              </div>
              <div className="flex-1">
                <div 
                  className="font-bold text-base mb-1" 
                  style={{ color: safeColors.text }}
                >
                  Streak Warrior
                </div>
                <div 
                  className="text-sm mb-2" 
                  style={{ color: safeColors.textSecondary }}
                >
                  Maintain a 7-day streak
                </div>
                <div className="mt-2">
                  <div 
                    className="w-full h-2 rounded-full" 
                    style={{ backgroundColor: safeColors.bgGray }}
                  >
                    <div 
                      className="h-2 rounded-full transition-all duration-500" 
                      style={{ width: '100%', backgroundColor: safeColors.primary }} 
                    />
                  </div>
                  <div 
                    className="text-xs mt-1" 
                    style={{ color: safeColors.textSecondary }}
                  >
                    100% complete - Ready to unlock!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
