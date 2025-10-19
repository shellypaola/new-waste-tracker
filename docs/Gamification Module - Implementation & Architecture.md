# Gamification Module - Implementation & Architecture

## Module Overview
The Gamification Module transforms food waste reduction from a task into an engaging experience through achievements, challenges, social features, and progression systems. It leverages psychological principles of motivation to drive sustained behavioral change.

**Core Purpose:** Motivate users to consistently reduce waste through rewards, competition, and community engagement.

---

## Core Features

### 1. **Achievement & Badge System**
- Milestone badges (usage duration)
- Performance badges (waste reduction)
- Savings badges (money saved)
- Consistency badges (streaks)
- Special/seasonal badges

### 2. **Progression Systems**
- Streak tracking (daily, weekly)
- Level system (Bronze → Silver → Gold → Platinum)
- Points and rewards
- Visual progress indicators

### 3. **Challenge Framework**
- Personal challenges (custom goals)
- Community challenges (shared objectives)
- Seasonal challenges (time-limited)
- Social/team challenges

### 4. **Social & Community Features**
- Leaderboards and rankings
- Social sharing capabilities
- Challenge invitations
- Community goals and collective impact

---

## Data Architecture

### Achievement Data Model
```javascript
const AchievementModel = {
  id: string,
  category: 'milestone' | 'performance' | 'consistency' | 'special',
  name: string,
  description: string,
  icon: string,
  rarity: 'common' | 'rare' | 'epic' | 'legendary',
  
  // Unlock criteria
  criteria: {
    type: 'streak' | 'waste_rate' | 'items_saved' | 'days_active',
    threshold: number,
    period: 'daily' | 'weekly' | 'monthly' | 'all-time'
  },
  
  // Rewards
  points: number,
  level: 'bronze' | 'silver' | 'gold' | 'platinum',
  
  // Status
  unlocked: boolean,
  unlockedAt: Date,
  progress: number,  // 0-100
  
  // Social
  shareText: string,
  shareImage: string
};
```

### User Progression Model
```javascript
const UserProgressionModel = {
  userId: string,
  
  // Level system
  level: 'bronze' | 'silver' | 'gold' | 'platinum',
  totalPoints: number,
  pointsToNextLevel: number,
  
  // Streaks
  currentStreak: number,
  longestStreak: number,
  lastActiveDate: Date,
  zeroWasteDays: number,
  
  // Achievements
  achievements: Achievement[],
  unlockedCount: number,
  totalAchievements: number,
  
  // Challenges
  activeChallenges: Challenge[],
  completedChallenges: number,
  
  // Social
  rank: number,
  followers: number,
  following: number
};
```

### Challenge Data Model
```javascript
const ChallengeModel = {
  id: string,
  type: 'personal' | 'community' | 'seasonal' | 'social',
  
  // Details
  title: string,
  description: string,
  icon: string,
  startDate: Date,
  endDate: Date,
  
  // Goal
  goal: {
    type: 'waste_rate' | 'savings' | 'items_saved' | 'streak',
    target: number,
    current: number
  },
  
  // Community (for community challenges)
  participantCount: number,
  collectiveProgress: number,
  
  // Rewards
  points: number,
  badge: Achievement,
  
  // Status
  status: 'active' | 'completed' | 'failed' | 'upcoming',
  progress: number,  // 0-100
  
  // Social
  leaderboard: LeaderboardEntry[],
  isPublic: boolean
};
```

### Points System Configuration
```javascript
const PointsConfig = {
  // Core actions
  itemConsumed: 10,
  itemSavedFromExpiry: 25,  // Consumed within last 24h of expiry
  zeroWasteDay: 100,
  perfectWeek: 500,  // Zero waste all week
  
  // Streaks
  streakDay: 15,  // Per day
  weekStreak: 100,  // 7 days
  monthStreak: 500,  // 30 days
  
  // Savings milestones
  save10Dollars: 50,
  save50Dollars: 200,
  save100Dollars: 500,
  
  // Engagement
  challengeJoin: 20,
  challengeComplete: 100,
  shareAchievement: 25,
  inviteFriend: 50
};
```

### Level Thresholds
```javascript
const LevelThresholds = {
  bronze: { min: 0, max: 999, color: '#CD7F32' },
  silver: { min: 1000, max: 4999, color: '#C0C0C0' },
  gold: { min: 5000, max: 14999, color: '#FFD700' },
  platinum: { min: 15000, max: Infinity, color: '#E5E4E2' }
};
```

---

## Core Component Architecture

### 1. Achievement System

```javascript
const AchievementSystem = {
  // Define all achievements
  achievements: [
    // Milestone Achievements
    {
      id: 'first_week',
      category: 'milestone',
      name: 'First Week Complete',
      description: 'Used the app for 7 consecutive days',
      icon: '📅',
      rarity: 'common',
      criteria: { type: 'days_active', threshold: 7, period: 'all-time' },
      points: 100,
      level: 'bronze',
      shareText: '🎉 I completed my first week with Waste Warrior!'
    },
    {
      id: 'month_warrior',
      category: 'milestone',
      name: '30 Days Strong',
      description: 'Active for 30 consecutive days',
      icon: '💪',
      rarity: 'rare',
      criteria: { type: 'days_active', threshold: 30, period: 'all-time' },
      points: 500,
      level: 'silver',
      shareText: '🏆 30 days of fighting food waste!'
    },
    
    // Performance Achievements
    {
      id: 'zero_waste_day',
      category: 'performance',
      name: 'Zero Waste Day',
      description: 'No food wasted for an entire day',
      icon: '🌟',
      rarity: 'common',
      criteria: { type: 'waste_rate', threshold: 0, period: 'daily' },
      points: 100,
      level: 'bronze',
      shareText: '🌱 I had a zero waste day!'
    },
    {
      id: 'perfect_week',
      category: 'performance',
      name: 'Perfect Week',
      description: 'Zero waste for 7 consecutive days',
      icon: '⭐',
      rarity: 'epic',
      criteria: { type: 'waste_rate', threshold: 0, period: 'weekly' },
      points: 500,
      level: 'gold',
      shareText: '🎯 Perfect week - zero food waste!'
    },
    {
      id: 'waste_warrior',
      category: 'performance',
      name: 'Waste Warrior',
      description: 'Maintain waste rate below 5% for a month',
      icon: '⚔️',
      rarity: 'legendary',
      criteria: { type: 'waste_rate', threshold: 5, period: 'monthly' },
      points: 1000,
      level: 'platinum',
      shareText: '⚔️ I\'m a certified Waste Warrior!'
    },
    
    // Savings Achievements
    {
      id: 'fifty_saver',
      category: 'savings',
      name: '$50 Saved',
      description: 'Saved $50 by consuming food',
      icon: '💰',
      rarity: 'common',
      criteria: { type: 'savings', threshold: 50, period: 'all-time' },
      points: 200,
      level: 'bronze',
      shareText: '💰 Saved $50 with Waste Warrior!'
    },
    {
      id: 'hundred_saver',
      category: 'savings',
      name: '$100 Saved',
      description: 'Saved $100 by consuming food',
      icon: '💵',
      rarity: 'rare',
      criteria: { type: 'savings', threshold: 100, period: 'all-time' },
      points: 500,
      level: 'silver',
      shareText: '💵 $100 saved from food waste!'
    },
    {
      id: 'budget_master',
      category: 'savings',
      name: 'Budget Master',
      description: 'Saved $500 total',
      icon: '🏆',
      rarity: 'legendary',
      criteria: { type: 'savings', threshold: 500, period: 'all-time' },
      points: 2000,
      level: 'platinum',
      shareText: '🏆 Budget Master - $500 saved!'
    },
    
    // Consistency Achievements
    {
      id: 'week_streak',
      category: 'consistency',
      name: 'Week Streak',
      description: '7-day streak of zero waste days',
      icon: '🔥',
      rarity: 'rare',
      criteria: { type: 'streak', threshold: 7, period: 'all-time' },
      points: 300,
      level: 'silver',
      shareText: '🔥 7-day zero waste streak!'
    },
    {
      id: 'month_streak',
      category: 'consistency',
      name: 'Streak Master',
      description: '30-day streak of zero waste days',
      icon: '🔥🔥',
      rarity: 'epic',
      criteria: { type: 'streak', threshold: 30, period: 'all-time' },
      points: 1500,
      level: 'gold',
      shareText: '🔥 30-day zero waste streak!'
    }
  ],
  
  // Check if achievement should be unlocked
  checkAchievement: (userId, achievementId, currentMetrics) => {
    const achievement = this.achievements.find(a => a.id === achievementId);
    const userProgress = getUserProgression(userId);
    
    // Already unlocked
    if (userProgress.achievements.some(a => a.id === achievementId && a.unlocked)) {
      return false;
    }
    
    // Check criteria
    const meetsRequirement = this.evaluateCriteria(achievement.criteria, currentMetrics);
    
    if (meetsRequirement) {
      this.unlockAchievement(userId, achievement);
      return true;
    }
    
    return false;
  },
  
  evaluateCriteria: (criteria, metrics) => {
    switch (criteria.type) {
      case 'waste_rate':
        if (criteria.period === 'daily') {
          return metrics.daily.wasteRate <= criteria.threshold;
        } else if (criteria.period === 'weekly') {
          return metrics.weekly.wasteRate <= criteria.threshold;
        } else if (criteria.period === 'monthly') {
          return metrics.monthly.wasteRate <= criteria.threshold;
        }
        break;
        
      case 'savings':
        return metrics.totalSaved >= criteria.threshold;
        
      case 'streak':
        return metrics.currentStreak >= criteria.threshold;
        
      case 'days_active':
        return metrics.daysActive >= criteria.threshold;
        
      case 'items_saved':
        return metrics.itemsConsumed >= criteria.threshold;
    }
    
    return false;
  },
  
  unlockAchievement: (userId, achievement) => {
    const userProgress = getUserProgression(userId);
    
    // Add to user's achievements
    const unlockedAchievement = {
      ...achievement,
      unlocked: true,
      unlockedAt: new Date(),
      progress: 100
    };
    
    userProgress.achievements.push(unlockedAchievement);
    userProgress.unlockedCount += 1;
    userProgress.totalPoints += achievement.points;
    
    // Update level if threshold crossed
    this.updateLevel(userId, userProgress.totalPoints);
    
    // Save progress
    saveUserProgression(userId, userProgress);
    
    // Trigger notification
    NotificationSystem.showAchievementUnlocked(achievement);
    
    // Emit event for other modules
    EventBus.emit('gamification:achievement_unlocked', {
      userId,
      achievement,
      totalPoints: userProgress.totalPoints,
      level: userProgress.level
    });
  },
  
  updateLevel: (userId, totalPoints) => {
    let newLevel = 'bronze';
    
    if (totalPoints >= LevelThresholds.platinum.min) {
      newLevel = 'platinum';
    } else if (totalPoints >= LevelThresholds.gold.min) {
      newLevel = 'gold';
    } else if (totalPoints >= LevelThresholds.silver.min) {
      newLevel = 'silver';
    }
    
    const userProgress = getUserProgression(userId);
    const oldLevel = userProgress.level;
    
    if (newLevel !== oldLevel) {
      userProgress.level = newLevel;
      
      // Level up notification
      NotificationSystem.showLevelUp(oldLevel, newLevel);
      
      // Emit event
      EventBus.emit('gamification:level_up', {
        userId,
        oldLevel,
        newLevel,
        totalPoints
      });
    }
  },
  
  calculateProgress: (userId, achievementId) => {
    const achievement = this.achievements.find(a => a.id === achievementId);
    const metrics = getLatestMetrics();
    
    switch (achievement.criteria.type) {
      case 'savings':
        return Math.min(100, (metrics.totalSaved / achievement.criteria.threshold) * 100);
        
      case 'streak':
        return Math.min(100, (metrics.currentStreak / achievement.criteria.threshold) * 100);
        
      case 'days_active':
        return Math.min(100, (metrics.daysActive / achievement.criteria.threshold) * 100);
        
      default:
        return 0;
    }
  }
};
```

### 2. Streak System

```javascript
const StreakSystem = {
  checkDailyStreak: (userId) => {
    const userProgress = getUserProgression(userId);
    const today = new Date().toDateString();
    const lastActive = new Date(userProgress.lastActiveDate).toDateString();
    
    // First time user or same day - no update
    if (!userProgress.lastActiveDate || lastActive === today) {
      return userProgress.currentStreak;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    // Check if it was yesterday (streak continues)
    if (lastActive === yesterdayStr) {
      // Check if yesterday was zero waste
      const yesterdayMetrics = getDailyMetrics(yesterday);
      
      if (yesterdayMetrics.wasteRate === 0) {
        userProgress.currentStreak += 1;
        userProgress.zeroWasteDays += 1;
        
        // Award streak points
        this.awardStreakPoints(userId, userProgress.currentStreak);
        
        // Update longest streak if needed
        if (userProgress.currentStreak > userProgress.longestStreak) {
          userProgress.longestStreak = userProgress.currentStreak;
        }
        
        // Check streak achievements
        AchievementSystem.checkAchievement(userId, 'week_streak', { currentStreak: userProgress.currentStreak });
        AchievementSystem.checkAchievement(userId, 'month_streak', { currentStreak: userProgress.currentStreak });
        
      } else {
        // Streak broken
        this.breakStreak(userId, userProgress);
      }
    } else {
      // More than one day gap - streak broken
      this.breakStreak(userId, userProgress);
    }
    
    userProgress.lastActiveDate = new Date();
    saveUserProgression(userId, userProgress);
    
    return userProgress.currentStreak;
  },
  
  awardStreakPoints: (userId, streakDays) => {
    const userProgress = getUserProgression(userId);
    let points = PointsConfig.streakDay;
    
    // Bonus points for milestones
    if (streakDays === 7) {
      points += PointsConfig.weekStreak;
      NotificationSystem.showStreakMilestone(7);
    } else if (streakDays === 30) {
      points += PointsConfig.monthStreak;
      NotificationSystem.showStreakMilestone(30);
    }
    
    userProgress.totalPoints += points;
    saveUserProgression(userId, userProgress);
    
    // Update level
    AchievementSystem.updateLevel(userId, userProgress.totalPoints);
  },
  
  breakStreak: (userId, userProgress) => {
    if (userProgress.currentStreak > 0) {
      NotificationSystem.showStreakBroken(userProgress.currentStreak);
      
      EventBus.emit('gamification:streak_broken', {
        userId,
        previousStreak: userProgress.currentStreak,
        longestStreak: userProgress.longestStreak
      });
    }
    
    userProgress.currentStreak = 0;
  },
  
  getStreakCalendar: (userId, days = 30) => {
    const calendar = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayMetrics = getDailyMetrics(date);
      
      calendar.push({
        date: date,
        isZeroWaste: dayMetrics.wasteRate === 0,
        wasteRate: dayMetrics.wasteRate,
        itemsSaved: dayMetrics.itemsConsumed
      });
    }
    
    return calendar;
  }
};
```

### 3. Challenge System

```javascript
const ChallengeSystem = {
  // Seasonal challenge templates
  seasonalChallenges: [
    // New Year Challenge
    {
      id: 'new_year_2025',
      type: 'seasonal',
      title: 'New Year, Zero Waste',
      description: 'Start 2025 strong with a 30-day zero waste challenge',
      icon: '🎆',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
      goal: { type: 'waste_rate', target: 5 },
      points: 1000,
      badge: { id: 'new_year_champion', name: 'New Year Champion' }
    },
    
    // Easter Challenge
    {
      id: 'easter_2025',
      type: 'seasonal',
      title: 'Easter Egg-cellent Challenge',
      description: 'Minimize waste during Easter celebrations',
      icon: '🐰',
      startDate: new Date('2025-04-13'),
      endDate: new Date('2025-04-20'),
      goal: { type: 'waste_rate', target: 10 },
      points: 400,
      badge: { id: 'easter_champion', name: 'Easter Champion' }
    },
    
    // Earth Day Challenge
    {
      id: 'earth_day_2025',
      type: 'community',
      title: 'Earth Day: Save 1M lbs Together',
      description: 'Community goal to collectively save 1 million pounds of food',
      icon: '🌍',
      startDate: new Date('2025-04-15'),
      endDate: new Date('2025-04-30'),
      goal: { type: 'items_saved', target: 1000000 },  // Community total
      points: 500,
      badge: { id: 'earth_champion', name: 'Earth Champion' },
      isPublic: true
    },
    
    // Summer Challenge
    {
      id: 'summer_2025',
      type: 'seasonal',
      title: 'Summer Harvest Challenge',
      description: 'Optimize fresh summer produce - waste less than 10%',
      icon: '🍉',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-08-31'),
      goal: { type: 'waste_rate', target: 10 },
      points: 750,
      badge: { id: 'summer_saver', name: 'Summer Saver' }
    },
    
    // Thanksgiving Challenge
    {
      id: 'thanksgiving_2025',
      type: 'seasonal',
      title: 'Zero Waste Thanksgiving',
      description: 'Master holiday meal planning and minimize leftovers waste',
      icon: '🦃',
      startDate: new Date('2025-11-20'),
      endDate: new Date('2025-11-30'),
      goal: { type: 'waste_rate', target: 5 },
      points: 600,
      badge: { id: 'thanksgiving_hero', name: 'Thanksgiving Hero' }
    },
    
    // Holiday Challenge
    {
      id: 'holidays_2025',
      type: 'seasonal',
      title: 'Sustainable Holidays',
      description: 'Zero waste during the festive season',
      icon: '🎄',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-31'),
      goal: { type: 'waste_rate', target: 8 },
      points: 800,
      badge: { id: 'holiday_hero', name: 'Holiday Hero' }
    }
  ],
  
  createPersonalChallenge: (userId, challengeData) => {
    const challenge = {
      id: `personal_${Date.now()}`,
      type: 'personal',
      title: challengeData.title,
      description: challengeData.description,
      startDate: challengeData.startDate,
      endDate: challengeData.endDate,
      goal: challengeData.goal,
      points: this.calculateChallengePoints(challengeData),
      status: 'active',
      progress: 0
    };
    
    const userProgress = getUserProgression(userId);
    userProgress.activeChallenges.push(challenge);
    saveUserProgression(userId, userProgress);
    
    return challenge;
  },
  
  joinCommunityChallenge: (userId, challengeId) => {
    const challenge = this.seasonalChallenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      return null;
    }
    
    const userProgress = getUserProgression(userId);
    
    // Check if already joined
    if (userProgress.activeChallenges.some(c => c.id === challengeId)) {
      return challenge;
    }
    
    // Add to user's active challenges
    userProgress.activeChallenges.push({
      ...challenge,
      status: 'active',
      progress: 0
    });
    
    // Award join points
    userProgress.totalPoints += PointsConfig.challengeJoin;
    
    saveUserProgression(userId, userProgress);
    
    // Update community stats
    this.updateCommunityChallenge(challengeId, 'join', userId);
    
    return challenge;
  },
  
  updateChallengeProgress: (userId, challengeId) => {
    const userProgress = getUserProgression(userId);
    const challenge = userProgress.activeChallenges.find(c => c.id === challengeId);
    
    if (!challenge || challenge.status !== 'active') {
      return;
    }
    
    // Calculate current progress
    const metrics = getLatestMetrics();
    const progress = this.calculateChallengeProgress(challenge, metrics);
    
    challenge.progress = progress;
    challenge.goal.current = this.getCurrentValue(challenge.goal.type, metrics);
    
    // Check if completed
    if (progress >= 100) {
      this.completeChallenge(userId, challenge);
    }
    
    saveUserProgression(userId, userProgress);
  },
  
  calculateChallengeProgress: (challenge, metrics) => {
    const current = this.getCurrentValue(challenge.goal.type, metrics);
    
    switch (challenge.goal.type) {
      case 'waste_rate':
        // Lower is better, so invert progress
        const wasteProgress = Math.max(0, 100 - (current / challenge.goal.target * 100));
        return Math.min(100, wasteProgress);
        
      case 'savings':
      case 'items_saved':
        return Math.min(100, (current / challenge.goal.target) * 100);
        
      case 'streak':
        return Math.min(100, (current / challenge.goal.target) * 100);
        
      default:
        return 0;
    }
  },
  
  getCurrentValue: (type, metrics) => {
    switch (type) {
      case 'waste_rate':
        return metrics.summary.wasteRate;
      case 'savings':
        return metrics.summary.totalValueConsumed;
      case 'items_saved':
        return metrics.summary.totalItemsConsumed;
      case 'streak':
        return metrics.achievements.currentStreak;
      default:
        return 0;
    }
  },
  
  completeChallenge: (userId, challenge) => {
    challenge.status = 'completed';
    
    const userProgress = getUserProgression(userId);
    
    // Award points
    userProgress.totalPoints += challenge.points + PointsConfig.challengeComplete;
    userProgress.completedChallenges += 1;
    
    // Unlock badge if available
    if (challenge.badge) {
      AchievementSystem.unlockAchievement(userId, challenge.badge);
    }
    
    // Update level
    AchievementSystem.updateLevel(userId, userProgress.totalPoints);
    
    // Remove from active, add to completed
    userProgress.activeChallenges = userProgress.activeChallenges.filter(c => c.id !== challenge.id);
    
    saveUserProgression(userId, userProgress);
    
    // Notification
    NotificationSystem.showChallengeComplete(challenge);
    
    // Event
    EventBus.emit('gamification:challenge_completed', {
      userId,
      challenge,
      totalPoints: userProgress.totalPoints
    });
  },
  
  updateCommunityChallenge: (challengeId, action, userId = null) => {
    const communityData = getCommunityChallenge(challengeId);
    
    if (action === 'join') {
      communityData.participantCount += 1;
    } else if (action === 'progress') {
      // Aggregate all participants' progress
      const allParticipants = getAllParticipants(challengeId);
      communityData.collectiveProgress = allParticipants.reduce((sum, user) => {
        const userChallenge = user.activeChallenges.find(c => c.id === challengeId);
        return sum + (userChallenge?.goal.current || 0);
      }, 0);
    }
    
    saveCommunityChallenge(challengeId, communityData);
    
    // Check if community goal reached
    const challenge = this.seasonalChallenges.find(c => c.id === challengeId);
    if (communityData.collectiveProgress >= challenge.goal.target) {
      this.completeCommunityChallenge(challengeId);
    }
  },
  
  completeCommunityChallenge: (challengeId) => {
    const allParticipants = getAllParticipants(challengeId);
    
    // Award all participants
    allParticipants.forEach(user => {
      const challenge = user.activeChallenges.find(c => c.id === challengeId);
      if (challenge) {
        this.completeChallenge(user.id, challenge);
      }
    });
    
    // Community celebration notification
    NotificationSystem.showCommunityChallengeComplete(challengeId);
  }
};
```

### 4. Social & Leaderboard System

```javascript
const SocialSystem = {
  shareAchievement: (userId, achievementId, platform) => {
    const achievement = AchievementSystem.achievements.find(a => a.id === achievementId);
    const userProgress = getUserProgression(userId);
    
    const shareData = {
      text: achievement.shareText,
      image: generateAchievementImage(achievement, userProgress),
      url: `https://wastewarrior.app/user/${userId}`,
      hashtags: ['WasteWarrior', 'ZeroWaste', 'FoodWaste']
    };
    
    // Platform-specific sharing
    switch (platform) {
      case 'twitter':
        shareToTwitter(shareData);
        break;
      case 'facebook':
        shareToFacebook(shareData);
        break;
      case 'instagram':
        shareToInstagram(shareData);
        break;
    }
    
    // Award points for sharing
    userProgress.totalPoints += PointsConfig.shareAchievement;
    saveUserProgression(userId, userProgress);
  },
  
  getLeaderboard: (type = 'global', period = 'week') => {
    // Types: 'global', 'friends', 'local'
    // Periods: 'week', 'month', 'all-time'
    
    const users = this.getUsersForLeaderboard(type);
    
    return users
      .map(user => ({
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        totalPoints: user.totalPoints,
        level: user.level,
        rank: 0,  // Will be assigned after sorting
        stats: {
          wasteRate: this.getWasteRateForPeriod(user.id, period),
          savings: this.getSavingsForPeriod(user.id, period),
          streak: user.currentStreak
        }
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((user, index) => ({ ...user, rank: index + 1 }))
      .slice(0, 100);  // Top 100
  },
  
  getUsersForLeaderboard: (type) => {
    switch (type) {
      case 'friends':
        return getFriends(getCurrentUserId());
      case 'local':
        return getUsersByLocation(getCurrentUserLocation());
      case 'global':
      default:
        return getAllUsers();
    }
  },
  
  inviteFriend: (userId, friendEmail) => {
    // Send invitation
    sendInvitationEmail(friendEmail, userId);
    
    // Award points
    const userProgress = getUserProgression(userId);
    userProgress.totalPoints += PointsConfig.inviteFriend;
    saveUserProgression(userId, userProgress);
    
    return true;
  }
};
```

---

## UI Components

### Achievement Showcase
```javascript
const AchievementShowcase = ({ userId }) => {
  const [achievements, setAchievements] = useState([]);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const userAchievements = AchievementSystem.achievements.map(achievement => {
      const userProgress = getUserProgression(userId);
      const unlocked = userProgress.achievements.find(a => a.id === achievement.id);
      
      return {
        ...achievement,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt,
        progress: unlocked ? 100 : AchievementSystem.calculateProgress(userId, achievement.id)
      };
    });
    
    setAchievements(userAchievements);
  }, [userId]);
  
  const filteredAchievements = filter === 'all' 
    ? achievements 
    : filter === 'unlocked'
    ? achievements.filter(a => a.unlocked)
    : achievements.filter(a => !a.unlocked);
  
  return (
    <div className="achievement-showcase">
      <header>
        <h2>Achievements</h2>
        <div className="filter-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            All ({achievements.length})
          </button>
          <button className={filter === 'unlocked' ? 'active' : ''} onClick={() => setFilter('unlocked')}>
            Unlocked ({achievements.filter(a => a.unlocked).length})
          </button>
          <button className={filter === 'locked' ? 'active' : ''} onClick={() => setFilter('locked')}>
            Locked ({achievements.filter(a => !a.unlocked).length})
          </button>
        </div>
      </header>
      
      <div className="achievement-grid">
        {filteredAchievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
};

const AchievementCard = ({ achievement }) => {
  const rarityColors = {
    common: '#9E9E9E',
    rare: '#2196F3',
    epic: '#9C27B0',
    legendary: '#FF9800'
  };
  
  return (
    <div 
      className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
      style={{ borderColor: rarityColors[achievement.rarity] }}
    >
      <div className="achievement-icon">
        <span className={achievement.unlocked ? '' : 'grayscale'}>
          {achievement.icon}
        </span>
      </div>
      
      <div className="achievement-info">
        <h3>{achievement.name}</h3>
        <p className="description">{achievement.description}</p>
        
        {achievement.unlocked ? (
          <div className="unlocked-info">
            <span className="badge">✓ Unlocked</span>
            <span className="date">{formatDate(achievement.unlockedAt)}</span>
            <span className="points">+{achievement.points} pts</span>
          </div>
        ) : (
          <div className="progress-info">
            <ProgressBar 
              current={achievement.progress} 
              target={100}
              showPercentage={true}
            />
            <span className="points">{achievement.points} pts</span>
          </div>
        )}
        
        <span className={`rarity ${achievement.rarity}`}>
          {achievement.rarity.toUpperCase()}
        </span>
      </div>
      
      {achievement.unlocked && (
        <button 
          className="share-button"
          onClick={() => SocialSystem.shareAchievement(achievement.id, 'twitter')}
        >
          Share
        </button>
      )}
    </div>
  );
};
```

### Streak Calendar
```javascript
const StreakCalendar = ({ userId }) => {
  const [calendar, setCalendar] = useState([]);
  const userProgress = getUserProgression(userId);
  
  useEffect(() => {
    const calendarData = StreakSystem.getStreakCalendar(userId, 30);
    setCalendar(calendarData);
  }, [userId]);
  
  return (
    <div className="streak-calendar">
      <div className="streak-header">
        <div className="current-streak">
          <span className="icon">🔥</span>
          <div>
            <h3>{userProgress.currentStreak} Days</h3>
            <p>Current Streak</p>
          </div>
        </div>
        
        <div className="longest-streak">
          <span className="icon">🏆</span>
          <div>
            <h3>{userProgress.longestStreak} Days</h3>
            <p>Longest Streak</p>
          </div>
        </div>
        
        <div className="zero-waste-days">
          <span className="icon">🌟</span>
          <div>
            <h3>{userProgress.zeroWasteDays} Days</h3>
            <p>Zero Waste Days</p>
          </div>
        </div>
      </div>
      
      <div className="calendar-grid">
        {calendar.map((day, index) => (
          <div 
            key={index}
            className={`calendar-day ${day.isZeroWaste ? 'zero-waste' : ''}`}
            title={`${formatDate(day.date)}: ${day.wasteRate}% waste`}
          >
            <div className="day-number">{day.date.getDate()}</div>
            {day.isZeroWaste && <span className="checkmark">✓</span>}
          </div>
        ))}
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="color-box zero-waste"></div>
          <span>Zero Waste Day</span>
        </div>
        <div className="legend-item">
          <div className="color-box normal"></div>
          <span>Normal Day</span>
        </div>
      </div>
    </div>
  );
};
```

### Challenge Dashboard
```javascript
const ChallengeDashboard = ({ userId }) => {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [availableChallenges, setAvailableChallenges] = useState([]);
  const [view, setView] = useState('active');
  
  useEffect(() => {
    const userProgress = getUserProgression(userId);
    setActiveChallenges(userProgress.activeChallenges);
    
    // Get seasonal challenges
    const now = new Date();
    const available = ChallengeSystem.seasonalChallenges.filter(challenge => {
      const isActive = now >= challenge.startDate && now <= challenge.endDate;
      const notJoined = !userProgress.activeChallenges.some(c => c.id === challenge.id);
      return isActive && notJoined;
    });
    
    setAvailableChallenges(available);
  }, [userId]);
  
  const handleJoinChallenge = (challengeId) => {
    ChallengeSystem.joinCommunityChallenge(userId, challengeId);
    // Refresh
    const userProgress = getUserProgression(userId);
    setActiveChallenges(userProgress.activeChallenges);
  };
  
  const handleCreateChallenge = () => {
    // Open create challenge modal
  };
  
  return (
    <div className="challenge-dashboard">
      <header>
        <h2>Challenges</h2>
        <div className="view-selector">
          <button 
            className={view === 'active' ? 'active' : ''}
            onClick={() => setView('active')}
          >
            Active ({activeChallenges.length})
          </button>
          <button 
            className={view === 'available' ? 'active' : ''}
            onClick={() => setView('available')}
          >
            Available ({availableChallenges.length})
          </button>
        </div>
      </header>
      
      {view === 'active' ? (
        <div className="active-challenges">
          {activeChallenges.length === 0 ? (
            <div className="empty-state">
              <p>No active challenges</p>
              <button onClick={() => setView('available')}>Browse Challenges</button>
            </div>
          ) : (
            activeChallenges.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                userId={userId}
              />
            ))
          )}
        </div>
      ) : (
        <div className="available-challenges">
          <button className="create-challenge-btn" onClick={handleCreateChallenge}>
            + Create Personal Challenge
          </button>
          
          {availableChallenges.map(challenge => (
            <AvailableChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={() => handleJoinChallenge(challenge.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ChallengeCard = ({ challenge, userId }) => {
  useEffect(() => {
    // Update progress when component mounts
    ChallengeSystem.updateChallengeProgress(userId, challenge.id);
  }, [userId, challenge.id]);
  
  const daysRemaining = Math.ceil((new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className={`challenge-card ${challenge.type}`}>
      <div className="challenge-header">
        <span className="icon">{challenge.icon}</span>
        <div>
          <h3>{challenge.title}</h3>
          <p className="description">{challenge.description}</p>
        </div>
        <span className={`type-badge ${challenge.type}`}>
          {challenge.type}
        </span>
      </div>
      
      <div className="challenge-progress">
        <div className="progress-header">
          <span>Progress: {challenge.progress.toFixed(1)}%</span>
          <span>{daysRemaining} days left</span>
        </div>
        <ProgressBar 
          current={challenge.progress}
          target={100}
          color="blue"
        />
      </div>
      
      <div className="challenge-goal">
        <span className="label">Goal:</span>
        <span className="target">
          {challenge.goal.type === 'waste_rate' && `Waste < ${challenge.goal.target}%`}
          {challenge.goal.type === 'savings' && `Save ${challenge.goal.target}`}
          {challenge.goal.type === 'items_saved' && `Save ${challenge.goal.target} items`}
          {challenge.goal.type === 'streak' && `${challenge.goal.target} day streak`}
        </span>
        <span className="current">
          Current: {challenge.goal.current?.toFixed(1) || 0}
        </span>
      </div>
      
      <div className="challenge-reward">
        <span className="points">🏆 {challenge.points} pts</span>
        {challenge.badge && (
          <span className="badge-reward">+ {challenge.badge.name} Badge</span>
        )}
      </div>
      
      {challenge.type === 'community' && (
        <div className="community-stats">
          <span>{challenge.participantCount} participants</span>
          <span>Collective: {challenge.collectiveProgress?.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

const AvailableChallengeCard = ({ challenge, onJoin }) => {
  const daysUntilStart = Math.ceil((new Date(challenge.startDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isUpcoming = daysUntilStart > 0;
  
  return (
    <div className="available-challenge-card">
      <div className="challenge-header">
        <span className="icon">{challenge.icon}</span>
        <div>
          <h3>{challenge.title}</h3>
          <p>{challenge.description}</p>
        </div>
      </div>
      
      <div className="challenge-details">
        <div className="detail-item">
          <span className="label">Duration:</span>
          <span>{formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}</span>
        </div>
        <div className="detail-item">
          <span className="label">Reward:</span>
          <span>{challenge.points} points</span>
        </div>
        {challenge.badge && (
          <div className="detail-item">
            <span className="label">Badge:</span>
            <span>{challenge.badge.name}</span>
          </div>
        )}
      </div>
      
      <button 
        className="join-button"
        onClick={onJoin}
        disabled={isUpcoming}
      >
        {isUpcoming ? `Starts in ${daysUntilStart} days` : 'Join Challenge'}
      </button>
    </div>
  );
};
```

### Leaderboard Component
```javascript
const Leaderboard = ({ userId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [type, setType] = useState('global');
  const [period, setPeriod] = useState('week');
  
  useEffect(() => {
    const data = SocialSystem.getLeaderboard(type, period);
    setLeaderboard(data);
  }, [type, period]);
  
  const currentUserRank = leaderboard.find(user => user.userId === userId);
  
  return (
    <div className="leaderboard">
      <header>
        <h2>Leaderboard</h2>
        <div className="controls">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="global">Global</option>
            <option value="friends">Friends</option>
            <option value="local">Local</option>
          </select>
          
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all-time">All Time</option>
          </select>
        </div>
      </header>
      
      {currentUserRank && (
        <div className="current-user-rank">
          <span className="label">Your Rank:</span>
          <span className="rank">#{currentUserRank.rank}</span>
          <span className="points">{currentUserRank.totalPoints} pts</span>
        </div>
      )}
      
      <div className="leaderboard-list">
        {leaderboard.slice(0, 10).map((user, index) => (
          <LeaderboardEntry 
            key={user.userId}
            user={user}
            rank={index + 1}
            isCurrentUser={user.userId === userId}
          />
        ))}
      </div>
    </div>
  );
};

const LeaderboardEntry = ({ user, rank, isCurrentUser }) => {
  const medalEmojis = { 1: '🥇', 2: '🥈', 3: '🥉' };
  
  return (
    <div className={`leaderboard-entry ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="rank">
        {rank <= 3 ? medalEmojis[rank] : `#${rank}`}
      </div>
      
      <img src={user.avatar} alt={user.username} className="avatar" />
      
      <div className="user-info">
        <h4>{user.username}</h4>
        <div className="stats">
          <span>{user.stats.wasteRate.toFixed(1)}% waste</span>
          <span>${user.stats.savings.toFixed(2)} saved</span>
          <span>{user.stats.streak} day streak</span>
        </div>
      </div>
      
      <div className="points">
        <span className="total">{user.totalPoints}</span>
        <span className="label">pts</span>
      </div>
      
      <span className={`level-badge ${user.level}`}>
        {user.level}
      </span>
    </div>
  );
};
```

### Profile & Progress Dashboard
```javascript
const ProfileDashboard = ({ userId }) => {
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const progress = getUserProgression(userId);
    setUserProgress(progress);
    setLoading(false);
  }, [userId]);
  
  if (loading || !userProgress) {
    return <LoadingState />;
  }
  
  const nextLevel = getNextLevel(userProgress.level);
  const pointsToNext = nextLevel ? LevelThresholds[nextLevel].min - userProgress.totalPoints : 0;
  
  return (
    <div className="profile-dashboard">
      <div className="profile-header">
        <div className="user-info">
          <img src={userProgress.avatar} alt="Profile" className="profile-avatar" />
          <div>
            <h2>{userProgress.username}</h2>
            <span className={`level-badge ${userProgress.level}`}>
              {userProgress.level.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="level-progress">
          <h3>Level Progress</h3>
          <ProgressBar
            current={userProgress.totalPoints}
            target={nextLevel ? LevelThresholds[nextLevel].min : userProgress.totalPoints}
            color={LevelThresholds[userProgress.level].color}
          />
          <p>{nextLevel ? `${pointsToNext} pts to ${nextLevel}` : 'Max level reached!'}</p>
        </div>
      </div>
      
      <div className="stats-grid">
        <StatCard
          icon="🏆"
          value={userProgress.totalPoints}
          label="Total Points"
        />
        <StatCard
          icon="🎯"
          value={userProgress.unlockedCount}
          label={`Achievements (${userProgress.totalAchievements} total)`}
        />
        <StatCard
          icon="🔥"
          value={userProgress.currentStreak}
          label="Current Streak"
        />
        <StatCard
          icon="⭐"
          value={userProgress.longestStreak}
          label="Longest Streak"
        />
        <StatCard
          icon="✅"
          value={userProgress.completedChallenges}
          label="Challenges Completed"
        />
        <StatCard
          icon="🌟"
          value={userProgress.zeroWasteDays}
          label="Zero Waste Days"
        />
      </div>
      
      <div className="recent-achievements">
        <h3>Recent Achievements</h3>
        <div className="achievement-list">
          {userProgress.achievements
            .filter(a => a.unlocked)
            .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
            .slice(0, 5)
            .map(achievement => (
              <div key={achievement.id} className="achievement-item">
                <span className="icon">{achievement.icon}</span>
                <div>
                  <h4>{achievement.name}</h4>
                  <p>{formatDate(achievement.unlockedAt)}</p>
                </div>
                <span className="points">+{achievement.points}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
```

---

## Integration Architecture

### Analytics Integration
```javascript
const GamificationAnalyticsIntegration = {
  initialize: () => {
    // Subscribe to analytics events
    EventBus.on('analytics:metrics_updated', this.checkAchievements);
    EventBus.on('analytics:zero_waste_day', this.handleZeroWasteDay);
  },
  
  checkAchievements: (metrics) => {
    const userId = getCurrentUserId();
    
    // Check all achievement criteria
    AchievementSystem.achievements.forEach(achievement => {
      AchievementSystem.checkAchievement(userId, achievement.id, metrics);
    });
    
    // Update active challenges
    const userProgress = getUserProgression(userId);
    userProgress.activeChallenges.forEach(challenge => {
      ChallengeSystem.updateChallengeProgress(userId, challenge.id);
    });
  },
  
  handleZeroWasteDay: (data) => {
    const userId = getCurrentUserId();
    
    // Update streak
    StreakSystem.checkDailyStreak(userId);
    
    // Check zero waste achievements
    AchievementSystem.checkAchievement(userId, 'zero_waste_day', data);
  }
};
```

### Expiry System Integration
```javascript
const GamificationExpiryIntegration = {
  initialize: () => {
    EventBus.on('expiry:item_consumed', this.awardConsumptionPoints);
    EventBus.on('expiry:item_wasted', this.penalizeWaste);
  },
  
  awardConsumptionPoints: (data) => {
    const userId = getCurrentUserId();
    const userProgress = getUserProgression(userId);
    
    let points = PointsConfig.itemConsumed;
    
    // Bonus for saving from expiry (consumed within last 24h)
    const hoursUntilExpiry = (new Date(data.expiryDate) - new Date()) / (1000 * 60 * 60);
    if (hoursUntilExpiry <= 24) {
      points += PointsConfig.itemSavedFromExpiry;
    }
    
    userProgress.totalPoints += points;
    saveUserProgression(userId, userProgress);
    
    // Update level
    AchievementSystem.updateLevel(userId, userProgress.totalPoints);
  },
  
  penalizeWaste: (data) => {
    // Optional: Could deduct points for waste, but positive reinforcement is better
    // For now, just track for achievements
  }
};
```

---

## Notification System

```javascript
const GamificationNotifications = {
  // IN-APP NOTIFICATIONS ONLY (No Push Notifications)
  
  showAchievementUnlocked: (achievement) => {
    // Add to in-app notification center
    addInAppNotification({
      id: `achievement_${Date.now()}`,
      type: 'achievement',
      icon: '🏆',
      title: 'Achievement Unlocked!',
      message: `${achievement.name} (+${achievement.points} pts)`,
      timestamp: new Date(),
      read: false,
      action: {
        label: 'View',
        route: '/achievements'
      }
    });
    
    // Show celebration toast (5 seconds)
    showCelebrationToast({
      icon: achievement.icon,
      title: 'Achievement Unlocked!',
      message: `${achievement.name} (+${achievement.points} pts)`,
      duration: 5000
    });
    
    // Update notification badge count
    incrementBadgeCount();
  },
  
  showLevelUp: (oldLevel, newLevel) => {
    // Add to in-app notification center
    addInAppNotification({
      id: `levelup_${Date.now()}`,
      type: 'levelup',
      icon: '📈',
      title: 'Level Up!',
      message: `You're now ${newLevel.toUpperCase()}!`,
      timestamp: new Date(),
      read: false,
      action: {
        label: 'View Profile',
        route: '/profile'
      }
    });
    
    // Show celebration toast
    showCelebrationToast({
      icon: '🎊',
      title: 'Level Up!',
      message: `${oldLevel.toUpperCase()} → ${newLevel.toUpperCase()} 