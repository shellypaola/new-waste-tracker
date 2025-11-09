import React from 'react';
import { Target, DollarSign, Leaf, Zap, Award, Calendar } from 'lucide-react';

// ============================================
// COLOR SCHEME OPTIONS - PICK YOUR FAVORITE!
// ============================================

// OPTION 1: Purple, Orange, Teal
const COLOR_SCHEME_1 = [
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    icon: Target,
    description: 'Waste less than $15 this week',
    difficulty: 'beginner',
    duration: 7,
    cardGradient: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
    iconGradient: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
    accentColor: '#A855F7',
    criteria: { type: 'waste_threshold', threshold: 15, period: 'week' }
  },
  {
    id: 'budget_boss',
    name: 'Budget Boss',
    icon: DollarSign,
    description: 'Waste less than $10 this week',
    difficulty: 'intermediate',
    duration: 7,
    cardGradient: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)',
    iconGradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    accentColor: '#F97316',
    criteria: { type: 'waste_threshold', threshold: 10, period: 'week' }
  },
  {
    id: 'eco_champion',
    name: 'Eco Champion',
    icon: Leaf,
    description: 'Prevent 100 items from being wasted',
    difficulty: 'epic',
    duration: 30,
    cardGradient: 'linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%)',
    iconGradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    accentColor: '#14B8A6',
    criteria: { type: 'items_saved', target: 100, period: 'ongoing' }
  }
];

// OPTION 2: Pink, Amber, Emerald
const COLOR_SCHEME_2 = [
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    icon: Target,
    description: 'Waste less than $15 this week',
    difficulty: 'beginner',
    duration: 7,
    cardGradient: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
    iconGradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    accentColor: '#EC4899',
    criteria: { type: 'waste_threshold', threshold: 15, period: 'week' }
  },
  {
    id: 'budget_boss',
    name: 'Budget Boss',
    icon: DollarSign,
    description: 'Waste less than $10 this week',
    difficulty: 'intermediate',
    duration: 7,
    cardGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    iconGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    accentColor: '#F59E0B',
    criteria: { type: 'waste_threshold', threshold: 10, period: 'week' }
  },
  {
    id: 'eco_champion',
    name: 'Eco Champion',
    icon: Leaf,
    description: 'Prevent 100 items from being wasted',
    difficulty: 'epic',
    duration: 30,
    cardGradient: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    iconGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    accentColor: '#10B981',
    criteria: { type: 'items_saved', target: 100, period: 'ongoing' }
  }
];

// OPTION 3: Indigo, Coral, Lime
const COLOR_SCHEME_3 = [
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    icon: Target,
    description: 'Waste less than $15 this week',
    difficulty: 'beginner',
    duration: 7,
    cardGradient: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
    iconGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    accentColor: '#6366F1',
    criteria: { type: 'waste_threshold', threshold: 15, period: 'week' }
  },
  {
    id: 'budget_boss',
    name: 'Budget Boss',
    icon: DollarSign,
    description: 'Waste less than $10 this week',
    difficulty: 'intermediate',
    duration: 7,
    cardGradient: 'linear-gradient(135deg, #FED7D7 0%, #FCA5A5 100%)',
    iconGradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    accentColor: '#EF4444',
    criteria: { type: 'waste_threshold', threshold: 10, period: 'week' }
  },
  {
    id: 'eco_champion',
    name: 'Eco Champion',
    icon: Leaf,
    description: 'Prevent 100 items from being wasted',
    difficulty: 'epic',
    duration: 30,
    cardGradient: 'linear-gradient(135deg, #ECFCCB 0%, #D9F99D 100%)',
    iconGradient: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
    accentColor: '#84CC16',
    criteria: { type: 'items_saved', target: 100, period: 'ongoing' }
  }
];

// OPTION 4: Rose, Gold, Sky
const COLOR_SCHEME_4 = [
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    icon: Target,
    description: 'Waste less than $15 this week',
    difficulty: 'beginner',
    duration: 7,
    cardGradient: 'linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%)',
    iconGradient: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
    accentColor: '#F43F5E',
    criteria: { type: 'waste_threshold', threshold: 15, period: 'week' }
  },
  {
    id: 'budget_boss',
    name: 'Budget Boss',
    icon: DollarSign,
    description: 'Waste less than $10 this week',
    difficulty: 'intermediate',
    duration: 7,
    cardGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    iconGradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
    accentColor: '#FBBF24',
    criteria: { type: 'waste_threshold', threshold: 10, period: 'week' }
  },
  {
    id: 'eco_champion',
    name: 'Eco Champion',
    icon: Leaf,
    description: 'Prevent 100 items from being wasted',
    difficulty: 'epic',
    duration: 30,
    cardGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    iconGradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    accentColor: '#0EA5E9',
    criteria: { type: 'items_saved', target: 100, period: 'ongoing' }
  }
];

// OPTION 5: Violet, Orange, Cyan (My Recommendation!)
const COLOR_SCHEME_2 = [
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    icon: Target,
    description: 'Waste less than $15 this week',
    difficulty: 'beginner',
    duration: 7,
    cardGradient: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    accentColor: '#8B5CF6',
    criteria: { type: 'waste_threshold', threshold: 15, period: 'week' }
  },
  {
    id: 'budget_boss',
    name: 'Budget Boss',
    icon: DollarSign,
    description: 'Waste less than $10 this week',
    difficulty: 'intermediate',
    duration: 7,
    cardGradient: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)',
    iconGradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    accentColor: '#F97316',
    criteria: { type: 'waste_threshold', threshold: 10, period: 'week' }
  },
  {
    id: 'eco_champion',
    name: 'Eco Champion',
    icon: Leaf,
    description: 'Prevent 100 items from being wasted',
    difficulty: 'epic',
    duration: 30,
    cardGradient: 'linear-gradient(135deg, #CFFAFE 0%, #A5F3FC 100%)',
    iconGradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    accentColor: '#06B6D4',
    criteria: { type: 'items_saved', target: 100, period: 'ongoing' }
  }
];

// ============================================
// SELECT YOUR COLOR SCHEME HERE:
// ============================================
const CHALLENGES = COLOR_SCHEME_1; // Change this number to try different schemes!

const DIFFICULTY_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  epic: 'Epic'
};

const DIFFICULTY_BADGES = {
  beginner: { bg: '#EDE9FE', text: '#6B21A8' },
  intermediate: { bg: '#FFEDD5', text: '#9A3412' },
  epic: { bg: '#CFFAFE', text: '#155E75' }
};

export default function RewardsScreenColorful({ 
  colors,
  activeChallenge = null,
  completedChallenges = [],
  thisWeekWaste = 0,
  itemsSavedFromExpiry = 0,
  onStartChallenge,
  onCancelChallenge,
  onCompleteChallenge
}) {
  // Calculate progress for active challenge
  const getActiveProgress = () => {
    if (!activeChallenge) return null;
    
    const challenge = CHALLENGES.find(c => c.id === activeChallenge.id);
    if (!challenge) return null;
    
    if (challenge.criteria.type === 'waste_threshold') {
      const current = thisWeekWaste;
      const target = challenge.criteria.threshold;
      const percentage = Math.min(100, (current / target) * 100);
      const isOnTrack = current <= target;
      
      return {
        current: current.toFixed(2),
        target: target,
        percentage: percentage,
        isOnTrack: isOnTrack,
        displayText: `$${current.toFixed(2)} / $${target}`
      };
    }
    
    if (challenge.criteria.type === 'items_saved') {
      const current = itemsSavedFromExpiry;
      const target = challenge.criteria.target;
      const percentage = Math.min(100, (current / target) * 100);
      const isComplete = current >= target;
      
      return {
        current: current,
        target: target,
        percentage: percentage,
        isOnTrack: current >= target * 0.5,
        displayText: `${current} / ${target} items`
      };
    }
    
    return null;
  };
  
  const activeProgress = getActiveProgress();
  
  const getDaysRemaining = () => {
    if (!activeChallenge) return 0;
    const startDate = new Date(activeChallenge.startDate);
    const today = new Date();
    const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const challenge = CHALLENGES.find(c => c.id === activeChallenge.id);
    return Math.max(0, challenge.duration - daysElapsed);
  };
  
  const daysRemaining = getDaysRemaining();
  
  const availableChallenges = CHALLENGES.filter(
    c => !activeChallenge || c.id !== activeChallenge.id
  );

  return (
    <div className="h-full overflow-y-auto pb-24" style={{ 
      WebkitOverflowScrolling: 'touch',
      background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)'
    }}>
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
          Rewards
        </h1>

        {/* Active Challenge Section */}
        {activeChallenge && activeProgress ? (
          <div className="mb-6">
            <div 
              className="p-6 rounded-3xl relative overflow-hidden"
              style={{ 
                background: CHALLENGES.find(c => c.id === activeChallenge.id)?.cardGradient,
                boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 10px 20px rgba(0,0,0,0.06)'
              }}
            >
              {/* Decorative element */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 opacity-20 rounded-full blur-3xl"
                style={{ 
                  background: CHALLENGES.find(c => c.id === activeChallenge.id)?.accentColor 
                }}
              />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-1">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ 
                      background: CHALLENGES.find(c => c.id === activeChallenge.id)?.iconGradient 
                    }}
                  >
                    {React.createElement(
                      CHALLENGES.find(c => c.id === activeChallenge.id)?.icon,
                      { size: 28, color: 'white', strokeWidth: 2.5 }
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-xl mb-0.5" style={{ color: colors.text }}>
                      {CHALLENGES.find(c => c.id === activeChallenge.id)?.name}
                    </div>
                    <div className="text-xs font-medium px-2 py-0.5 rounded-full inline-block"
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        color: CHALLENGES.find(c => c.id === activeChallenge.id)?.accentColor
                      }}
                    >
                      <Zap size={10} className="inline mb-0.5" /> ACTIVE
                    </div>
                  </div>
                </div>

                <div className="text-sm mb-4 ml-1" style={{ color: colors.text, opacity: 0.8 }}>
                  {CHALLENGES.find(c => c.id === activeChallenge.id)?.description}
                </div>

                {/* Progress Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold" style={{ color: colors.text }}>
                      Your Progress
                    </span>
                    <span className="text-base font-bold" style={{ 
                      color: activeProgress.isOnTrack ? colors.fresh : colors.warning 
                    }}>
                      {activeProgress.displayText}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full h-3 rounded-full overflow-hidden" 
                      style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
                    >
                      <div 
                        className="h-3 rounded-full transition-all duration-700 relative overflow-hidden"
                        style={{ 
                          width: `${activeProgress.percentage}%`,
                          background: activeProgress.isOnTrack 
                            ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                            : 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)'
                        }}
                      >
                        {/* Shimmer effect */}
                        <div 
                          className="absolute inset-0 opacity-50"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                            animation: 'shimmer 2s infinite'
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                        {Math.round(activeProgress.percentage)}% complete
                      </span>
                      <span className="text-xs font-medium" style={{ color: colors.textLight }}>
                        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onCancelChallenge && onCancelChallenge()}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      color: colors.textSecondary,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    Cancel
                  </button>
                  {activeProgress.percentage >= 100 && (
                    <button
                      onClick={() => onCompleteChallenge && onCompleteChallenge(activeChallenge)}
                      className="flex-1 px-5 py-3 rounded-xl text-white text-sm font-bold transition-all active:scale-95"
                      style={{ 
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      Complete Challenge
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {completedChallenges.length > 0 && (
              <div className="mt-3 text-center">
                <span className="text-sm font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5"
                  style={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: colors.fresh 
                  }}
                >
                  <Award size={14} /> {completedChallenges.length} {completedChallenges.length === 1 ? 'challenge' : 'challenges'} completed
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Empty State - Now with different color! */
          <div className="mb-6">
            <div 
              className="p-8 rounded-3xl flex flex-col items-center relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FBBF24 100%)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
              }}
            >
              <div 
                className="absolute top-0 right-0 w-40 h-40 opacity-20 rounded-full blur-3xl"
                style={{ background: '#F59E0B' }}
              />
              
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-4 shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
                >
                  <Target size={48} color="white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center" style={{ color: colors.text }}>
                  Ready for a Challenge?
                </h3>
                <p className="text-sm text-center mb-0" style={{ color: colors.text, opacity: 0.8, maxWidth: '280px' }}>
                  Pick your first challenge and start your journey to zero waste!
                </p>
                {completedChallenges.length > 0 && (
                  <div className="text-sm mt-4 pt-4 border-t flex items-center justify-center gap-1.5" style={{ color: colors.fresh, borderColor: 'rgba(0,0,0,0.1)', width: '100%' }}>
                    <Award size={14} /> {completedChallenges.length} {completedChallenges.length === 1 ? 'challenge' : 'challenges'} completed
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Available Challenges */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.text }}>
            {activeChallenge ? 'More Challenges' : 'Choose Your Challenge'}
          </h2>
          
          <div className="space-y-3">
            {availableChallenges.map((challenge) => {
              const IconComponent = challenge.icon;
              const difficultyStyle = DIFFICULTY_BADGES[challenge.difficulty];
              
              return (
                <div
                  key={challenge.id}
                  className="p-5 rounded-3xl transition-all duration-200 active:scale-98"
                  style={{ 
                    background: challenge.cardGradient,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                    cursor: !activeChallenge ? 'pointer' : 'default'
                  }}
                  onClick={() => !activeChallenge && onStartChallenge && onStartChallenge(challenge)}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                      style={{ background: challenge.iconGradient }}
                    >
                      <IconComponent size={28} color="white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-lg" style={{ color: colors.text }}>
                          {challenge.name}
                        </div>
                        <span 
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: difficultyStyle.bg,
                            color: difficultyStyle.text
                          }}
                        >
                          {DIFFICULTY_LABELS[challenge.difficulty].toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm mb-3" style={{ color: colors.text, opacity: 0.75 }}>
                        {challenge.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium flex items-center gap-1.5" style={{ color: colors.textLight }}>
                          <Calendar size={16} /> {challenge.duration} days
                        </div>
                        {!activeChallenge && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartChallenge && onStartChallenge(challenge);
                            }}
                            className="px-5 py-2 rounded-xl text-white text-sm font-bold transition-all active:scale-95"
                            style={{ 
                              background: challenge.iconGradient,
                              boxShadow: `0 4px 12px ${challenge.accentColor}40`
                            }}
                          >
                            Start Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {activeChallenge && (
                    <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                      <span className="text-xs font-medium" style={{ color: colors.textLight }}>
                        Complete your active challenge first
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
