import React from 'react';
import { Target, DollarSign, Leaf } from 'lucide-react';

// Challenge definitions with Lucide icons
const CHALLENGES = [
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    icon: Target,
    description: 'Waste less than $15 this week',
    difficulty: 'beginner',
    duration: 7,
    gradient: 'linear-gradient(135deg, #DBEAFE 0%, #EEF2FF 100%)',
    iconColor: '#3B82F6',
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
    gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
    iconColor: '#F59E0B',
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
    gradient: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)',
    iconColor: '#10B981',
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

export default function RewardsScreenSimple({ 
  colors,
  activeChallenge = null,
  completedChallenges = [],
  thisWeekWaste = 0,
  itemsSavedFromExpiry = 0,
  onStartChallenge,
  onCancelChallenge,
  onCompleteChallenge
}) {
  // Points tracked silently (200 for beginner, 500 for intermediate/epic)
  // Not displayed in UI but stored for future tier system
  
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
        isOnTrack: current >= target * 0.5, // On track if 50%+
        displayText: `${current} / ${target} items`
      };
    }
    
    return null;
  };
  
  const activeProgress = getActiveProgress();
  
  // Calculate days remaining for active challenge
  const getDaysRemaining = () => {
    if (!activeChallenge) return 0;
    const startDate = new Date(activeChallenge.startDate);
    const today = new Date();
    const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const challenge = CHALLENGES.find(c => c.id === activeChallenge.id);
    return Math.max(0, challenge.duration - daysElapsed);
  };
  
  const daysRemaining = getDaysRemaining();
  
  // Get available challenges (not currently active)
  const availableChallenges = CHALLENGES.filter(
    c => !activeChallenge || c.id !== activeChallenge.id
  );

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Rewards</h1>

        {/* Active Challenge Section */}
        {activeChallenge && activeProgress ? (
          <div className="mb-6">
            <div 
              className="p-6 rounded-2xl bg-white"
              style={{ border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-start gap-4 mb-5">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: CHALLENGES.find(c => c.id === activeChallenge.id)?.gradient 
                  }}
                >
                  {React.createElement(
                    CHALLENGES.find(c => c.id === activeChallenge.id)?.icon,
                    { size: 24, style: { color: CHALLENGES.find(c => c.id === activeChallenge.id)?.iconColor } }
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg mb-1" style={{ color: colors.text }}>
                    {CHALLENGES.find(c => c.id === activeChallenge.id)?.name}
                  </div>
                  <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                    {CHALLENGES.find(c => c.id === activeChallenge.id)?.description}
                  </div>
                  <div className="text-xs" style={{ color: colors.textLight }}>
                    {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: colors.text }}>
                    Progress
                  </span>
                  <span className="text-sm font-semibold" style={{ 
                    color: activeProgress.isOnTrack ? colors.fresh : colors.warning 
                  }}>
                    {activeProgress.displayText}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.bgGray }}>
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${activeProgress.percentage}%`,
                      backgroundColor: activeProgress.isOnTrack ? colors.fresh : colors.warning
                    }}
                  />
                </div>
                <div className="text-xs mt-1.5" style={{ color: colors.textLight }}>
                  {Math.round(activeProgress.percentage)}% complete
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => onCancelChallenge && onCancelChallenge()}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: colors.bgGray, color: colors.textSecondary }}
                >
                  Cancel
                </button>
                {activeProgress.percentage >= 100 && (
                  <button
                    onClick={() => onCompleteChallenge && onCompleteChallenge(activeChallenge)}
                    className="px-5 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: colors.fresh }}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
            
            {/* Completed Count */}
            {completedChallenges.length > 0 && (
              <div className="mt-3 text-center">
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {completedChallenges.length} {completedChallenges.length === 1 ? 'challenge' : 'challenges'} completed
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Empty State - No Active Challenge */
          <div className="mb-6">
            <div 
              className="p-8 rounded-2xl bg-white flex flex-col items-center"
              style={{ border: `1px solid ${colors.border}` }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #DBEAFE 0%, #EEF2FF 100%)' }}
              >
                <Target size={32} style={{ color: colors.primary }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: colors.text }}>
                No Active Challenge
              </h3>
              <p className="text-sm text-center mb-0" style={{ color: colors.textSecondary, maxWidth: '280px' }}>
                Start a challenge below to track your progress
              </p>
              {completedChallenges.length > 0 && (
                <div className="text-sm mt-4 pt-4 border-t" style={{ color: colors.textSecondary, borderColor: colors.border, width: '100%', textAlign: 'center' }}>
                  {completedChallenges.length} {completedChallenges.length === 1 ? 'challenge' : 'challenges'} completed
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available Challenges */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.text }}>
            {activeChallenge ? 'More Challenges' : 'Start a Challenge'}
          </h2>
          
          <div className="space-y-3">
            {availableChallenges.map((challenge) => {
              const IconComponent = challenge.icon;
              
              return (
                <div
                  key={challenge.id}
                  className="p-5 rounded-2xl bg-white"
                  style={{ border: `1px solid ${colors.border}` }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: challenge.gradient }}
                    >
                      <IconComponent size={24} style={{ color: challenge.iconColor }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base mb-1" style={{ color: colors.text }}>
                        {challenge.name}
                      </div>
                      <div className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                        {challenge.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs" style={{ color: colors.textLight }}>
                          {DIFFICULTY_LABELS[challenge.difficulty]} · {challenge.duration} days
                        </div>
                        {!activeChallenge && (
                          <button
                            onClick={() => onStartChallenge && onStartChallenge(challenge)}
                            className="px-4 py-1.5 rounded-lg text-white text-sm font-medium"
                            style={{ backgroundColor: colors.primary }}
                          >
                            Start
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {activeChallenge && (
                    <div className="mt-3 pt-3 border-t text-center">
                      <span className="text-xs" style={{ color: colors.textLight }}>
                        Complete current challenge first
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
