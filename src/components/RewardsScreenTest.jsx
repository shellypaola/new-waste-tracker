import React from 'react';
import { Trophy, Target, Zap } from 'lucide-react';

// Challenge definitions
const CHALLENGES = [
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    emoji: '💪',
    description: 'Waste less than $15 this week',
    difficulty: 'beginner',
    points: 200,
    duration: 7,
    bgColor: '#DBEAFE',
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
    emoji: '🏆',
    description: 'Waste less than $10 this week',
    difficulty: 'intermediate',
    points: 500,
    duration: 7,
    bgColor: '#FEF3C7',
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
    emoji: '🌍',
    description: 'Prevent 100 items from being wasted',
    difficulty: 'epic',
    points: 500,
    duration: 30,
    bgColor: '#D1FAE5',
    iconColor: '#10B981',
    criteria: {
      type: 'items_saved',
      target: 100,
      period: 'ongoing'
    }
  }
];

const DIFFICULTY_LABELS = {
  beginner: { text: 'Beginner', color: '#3B82F6', bg: '#EFF6FF' },
  intermediate: { text: 'Intermediate', color: '#F59E0B', bg: '#FFFBEB' },
  epic: { text: 'Epic', color: '#10B981', bg: '#ECFDF5' }
};

export default function RewardsScreenSimple({ 
  colors,
  totalPoints = 0,
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

        {/* Simple Progress Card */}
        <div 
          className="p-6 rounded-2xl mb-6 bg-white"
          style={{ border: `1px solid ${colors.border}` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>
                Your Progress
              </div>
              <div className="text-4xl font-bold" style={{ color: colors.primary }}>
                {totalPoints.toLocaleString()}
              </div>
              <div className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                points earned
              </div>
            </div>
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <Trophy size={32} style={{ color: colors.primary }} />
            </div>
          </div>
          
          {completedChallenges.length > 0 && (
            <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                {completedChallenges.length} {completedChallenges.length === 1 ? 'challenge' : 'challenges'} completed
              </div>
            </div>
          )}
        </div>

        {/* Active Challenge Section */}
        {activeChallenge && activeProgress && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3" style={{ color: colors.text }}>
              Active Challenge
            </h2>
            
            <div 
              className="p-5 rounded-2xl bg-white"
              style={{ border: `2px solid ${colors.primary}` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                  style={{ 
                    backgroundColor: CHALLENGES.find(c => c.id === activeChallenge.id)?.bgColor 
                  }}
                >
                  {CHALLENGES.find(c => c.id === activeChallenge.id)?.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg mb-1" style={{ color: colors.text }}>
                    {CHALLENGES.find(c => c.id === activeChallenge.id)?.name}
                  </div>
                  <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                    {CHALLENGES.find(c => c.id === activeChallenge.id)?.description}
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs px-2 py-1 rounded font-medium"
                      style={{ 
                        backgroundColor: DIFFICULTY_LABELS[CHALLENGES.find(c => c.id === activeChallenge.id)?.difficulty]?.bg,
                        color: DIFFICULTY_LABELS[CHALLENGES.find(c => c.id === activeChallenge.id)?.difficulty]?.color
                      }}
                    >
                      {DIFFICULTY_LABELS[CHALLENGES.find(c => c.id === activeChallenge.id)?.difficulty]?.text}
                    </span>
                    <span className="text-sm font-bold" style={{ color: colors.secondary }}>
                      +{CHALLENGES.find(c => c.id === activeChallenge.id)?.points} pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: colors.text }}>
                    Progress
                  </span>
                  <span className="text-sm font-bold" style={{ 
                    color: activeProgress.isOnTrack ? colors.fresh : colors.warning 
                  }}>
                    {activeProgress.displayText}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full" style={{ backgroundColor: colors.bgGray }}>
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${activeProgress.percentage}%`,
                      backgroundColor: activeProgress.isOnTrack ? colors.fresh : colors.warning
                    }}
                  />
                </div>
                <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                  {Math.round(activeProgress.percentage)}% complete • {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onCancelChallenge && onCancelChallenge()}
                  className="flex-1 py-3 rounded-xl font-medium text-sm"
                  style={{ backgroundColor: colors.bgGray, color: colors.text }}
                >
                  Cancel Challenge
                </button>
                {activeProgress.percentage >= 100 && (
                  <button
                    onClick={() => onCompleteChallenge && onCompleteChallenge(activeChallenge)}
                    className="flex-1 py-3 rounded-xl font-medium text-white text-sm"
                    style={{ backgroundColor: colors.fresh }}
                  >
                    Complete! 🎉
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Available Challenges */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            {activeChallenge ? 'Other Challenges' : 'Start a Challenge'}
          </h2>
          
          <div className="space-y-3">
            {availableChallenges.map((challenge) => {
              const difficultyInfo = DIFFICULTY_LABELS[challenge.difficulty];
              
              return (
                <div
                  key={challenge.id}
                  className="p-5 rounded-2xl bg-white"
                  style={{ border: `1px solid ${colors.border}` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: challenge.bgColor }}
                    >
                      {challenge.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-base mb-1" style={{ color: colors.text }}>
                        {challenge.name}
                      </div>
                      <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {challenge.description}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span 
                          className="text-xs px-2 py-1 rounded font-medium"
                          style={{ 
                            backgroundColor: difficultyInfo.bg,
                            color: difficultyInfo.color
                          }}
                        >
                          {difficultyInfo.text}
                        </span>
                        <span className="text-sm font-bold" style={{ color: colors.secondary }}>
                          +{challenge.points} pts
                        </span>
                        <span className="text-xs" style={{ color: colors.textLight }}>
                          • {challenge.duration} days
                        </span>
                      </div>
                    </div>
                  </div>

                  {!activeChallenge && (
                    <button
                      onClick={() => onStartChallenge && onStartChallenge(challenge)}
                      className="w-full py-3 rounded-xl font-medium text-white text-sm"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Start Challenge
                    </button>
                  )}
                  
                  {activeChallenge && (
                    <div 
                      className="w-full py-3 rounded-xl font-medium text-sm text-center"
                      style={{ backgroundColor: colors.bgGray, color: colors.textSecondary }}
                    >
                      Complete current challenge first
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
