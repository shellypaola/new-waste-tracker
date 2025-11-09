import React from 'react';
import { Target, DollarSign, Leaf, Zap, Award, Calendar } from 'lucide-react';

// Challenge definitions with vibrant styling
const CHALLENGES = [
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    icon: Target,
    description: 'Waste less than $15 this week',
    difficulty: 'beginner',
    duration: 7,
    // Light gradient for card background
    cardGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    // Stronger gradient for icon
    iconGradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    accentColor: '#3B82F6',
    criteria: {
      type: 'waste_threshold',
      threshold: 15,
      period: 'week'
    }
  },
  {
    id: 'budget_boss',
    name: 'Budget Boss',
    icon: DollarSign,
    description: 'Waste less than $10 this week',
    difficulty: 'intermediate',
    duration: 7,
    cardGradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    iconGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    accentColor: '#F59E0B',
    criteria: {
      type: 'waste_threshold',
      threshold: 10,
      period: 'week'
    }
  },
  {
    id: 'eco_champion',
    name: 'Eco Champion',
    icon: Leaf,
    description: 'Prevent 100 items from being wasted',
    difficulty: 'epic',
    duration: 30,
    cardGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    iconGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    accentColor: '#10B981',
    criteria: {
      type: 'items_saved',
      target: 100,
      period: 'ongoing'
    }
  }
];

const DIFFICULTY_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  epic: 'Epic'
};

const DIFFICULTY_BADGES = {
  beginner: { bg: '#DBEAFE', text: '#1E40AF' },
  intermediate: { bg: '#FEF3C7', text: '#92400E' },
  epic: { bg: '#D1FAE5', text: '#065F46' }
};

export default function RewardsScreenExciting({ 
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
          /* Empty State */
          <div className="mb-6">
            <div 
              className="p-8 rounded-3xl flex flex-col items-center relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #E0E7FF 100%)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
              }}
            >
              <div 
                className="absolute top-0 right-0 w-40 h-40 opacity-20 rounded-full blur-3xl"
                style={{ background: colors.primary }}
              />
              
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-4 shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
                >
                  <Target size={48} color="white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center" style={{ color: colors.text }}>
                  Ready for a Challenge?
                </h3>
                <p className="text-sm text-center mb-0" style={{ color: colors.textSecondary, maxWidth: '280px' }}>
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
                        <div className="text-xs font-medium flex items-center gap-1" style={{ color: colors.textLight }}>
                          <Calendar size={12} /> {challenge.duration} days
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
