import React, { useState } from 'react';
import { Search, Plus, Bell, Flame, Trophy, Check, Edit2, TrendingDown, Package, ShoppingBag, Heart, TrendingUp, Home, BarChart3 } from 'lucide-react';

// ==================== FINAL COLOR SYSTEM ====================
const colors = {
  // Primary - Classic Blue
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#DBEAFE',
  primaryBg: '#EFF6FF',
  
  // Semantic - Alerts only
  critical: '#EF4444',
  criticalBg: '#FEF2F2',
  criticalLight: '#FEE2E2',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningLight: '#FEF3C7',
  fresh: '#10B981',
  freshBg: '#ECFDF5',
  
  // Neutrals
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  bg: '#FFFFFF',
  bgGray: '#F9FAFB',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
};

// ==================== BUTTONS ====================
const Button = ({ children, variant = 'primary', size = 'default', icon, onClick, className = '' }) => {
  const baseClasses = 'font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'text-white',
    secondary: 'border-2 active:bg-blue-50',
    ghost: 'text-gray-700 active:bg-gray-100',
  };
  
  const sizes = {
    default: 'min-h-[48px] px-6 text-base',
    large: 'min-h-[56px] px-8 text-lg',
    small: 'min-h-[40px] px-4 text-sm',
  };
  
  const getStyle = () => {
    if (variant === 'primary') {
      return {
        background: colors.primary
      };
    }
    if (variant === 'secondary') {
      return {
        borderColor: colors.primary,
        color: colors.primary
      };
    }
    return {};
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      style={getStyle()}
    >
      {icon && icon}
      {children}
    </button>
  );
};

// ==================== 3 KPI CARDS - TONED DOWN WITH COLOR ====================
const KpiCardColored = ({ title, value, subtitle, icon, color = 'blue' }) => {
  const colorStyles = {
    blue: {
      bg: '#EFF6FF',
      border: '#DBEAFE',
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
      textColor: '#1E40AF'
    },
    red: {
      bg: '#FEF2F2',
      border: '#FEE2E2',
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      textColor: '#991B1B'
    },
    purple: {
      bg: '#FAF5FF',
      border: '#F3E8FF',
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
      textColor: '#7E22CE'
    }
  };
  
  const style = colorStyles[color];
  
  return (
    <div 
      className="rounded-xl p-2.5 border transition-all hover:shadow-md"
      style={{ 
        backgroundColor: style.bg,
        borderColor: style.border
      }}
    >
      <div className="flex flex-col items-center text-center gap-1.5">
        <div 
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: style.iconBg }}
        >
          {React.cloneElement(icon, { 
            size: 14, 
            style: { color: style.iconColor }
          })}
        </div>
        <div className="flex-1 min-w-0 w-full">
          <p className="text-[10px] font-semibold mb-0.5" style={{ color: style.textColor }}>
            {title}
          </p>
          <p className="text-xl font-bold text-gray-900 mb-0.5 truncate">{value}</p>
          {subtitle && (
            <p className="text-[9px] truncate" style={{ color: style.textColor }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== COMPACT STREAK CARD ====================
const CompactStreak = ({ days, nextMilestone }) => {
  return (
    <div 
      className="rounded-xl p-2.5 border transition-all hover:shadow-md flex items-center gap-2.5"
      style={{
        background: 'linear-gradient(to right, #FFFBEB 0%, #FEF3C7 100%)',
        borderColor: '#FDE68A'
      }}
    >
      <div 
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
        }}
      >
        <Flame className="text-white" size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-lg font-bold text-gray-900">{days}</span>
          <span className="text-xs font-medium text-gray-600">day streak</span>
        </div>
        {nextMilestone && (
          <p className="text-[10px] text-amber-700">{nextMilestone.remaining} days to {nextMilestone.name}</p>
        )}
      </div>
      <TrendingUp className="text-amber-600" size={16} />
    </div>
  );
};

// ==================== ITEM CARD ====================
const ItemCard = ({ item, onEdit, onConsume }) => {
  const getExpiryStatus = (daysUntilExpiry) => {
    if (daysUntilExpiry < 0) return { status: 'expired', text: 'Expired', color: 'gray' };
    if (daysUntilExpiry <= 1) return { status: 'critical', text: 'Expires today', color: 'red' };
    if (daysUntilExpiry <= 3) return { status: 'warning', text: `${Math.floor(daysUntilExpiry)}d left`, color: 'amber' };
    return { status: 'fresh', text: `${Math.floor(daysUntilExpiry)}d remaining`, color: 'green' };
  };
  
  const expiryInfo = getExpiryStatus(item.daysUntilExpiry);
  const isCritical = expiryInfo.status === 'critical' || expiryInfo.status === 'warning';
  
  const getBorderStyle = () => {
    if (expiryInfo.status === 'critical') return `border-l-4 shadow-md`;
    if (expiryInfo.status === 'warning') return `border-l-4 shadow-md`;
    return 'border';
  };
  
  const getBorderColor = () => {
    if (expiryInfo.status === 'critical') return colors.critical;
    if (expiryInfo.status === 'warning') return colors.warning;
    return colors.border;
  };
  
  const getTextColor = () => {
    if (expiryInfo.status === 'critical') return 'text-red-600';
    if (expiryInfo.status === 'warning') return 'text-amber-600';
    return 'text-emerald-600';
  };
  
  return (
    <div 
      className={`bg-white rounded-xl p-3 ${getBorderStyle()} hover:shadow-lg transition-all`}
      style={{ borderColor: getBorderColor() }}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">
          {item.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Top row: Name and buttons */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base text-gray-900 truncate flex-1">{item.name}</h3>
            {isCritical && (
              <>
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={() => onConsume(item.id)}
                  className="flex-shrink-0"
                >
                  Mark Used
                </Button>
                <button 
                  onClick={() => onEdit(item.id)}
                  className="min-h-[40px] w-10 rounded-xl border-2 flex items-center justify-center text-gray-600 active:bg-gray-50 flex-shrink-0"
                  style={{ borderColor: colors.border }}
                >
                  <Edit2 size={18} />
                </button>
              </>
            )}
          </div>
          
          {/* Bottom row: Category and expiry */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 capitalize">{item.category}</span>
            <span className="text-gray-300">•</span>
            <span className={`text-xs font-medium ${getTextColor()}`}>
              {expiryInfo.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== CATEGORY BADGE ====================
const CategoryBadge = ({ category, active = false }) => {
  const categories = {
    all: { label: 'All Items', emoji: '📋', count: '(24)' },
    fridge: { label: 'Fridge', emoji: '❄️', count: '(12)' },
    freezer: { label: 'Freezer', emoji: '🧊', count: '(8)' },
    pantry: { label: 'Pantry', emoji: '📦', count: '(4)' }
  };
  
  const cat = categories[category];
  
  return (
    <button 
      className="min-h-[54px] px-7 py-3 rounded-full font-medium transition-all text-base whitespace-nowrap flex-shrink-0"
      style={{
        backgroundColor: active ? colors.primary : colors.bgGray,
        color: active ? '#FFFFFF' : colors.text,
        border: active ? 'none' : `1px solid ${colors.border}`
      }}
    >
      <span className="mr-2">{cat.emoji}</span>
      {cat.label} {cat.count}
    </button>
  );
};

// ==================== SEARCH BAR ====================
const SearchBar = ({ placeholder = "Search items..." }) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full min-h-[58px] pl-6 pr-14 rounded-2xl text-base focus:outline-none transition-all"
        style={{
          backgroundColor: colors.bg,
          border: `1px solid ${focused ? colors.primary : colors.border}`,
          color: colors.text,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <Search 
        className="absolute right-6 top-1/2 -translate-y-1/2 transition-colors" 
        size={22} 
        style={{ color: focused ? colors.primary : colors.textLight }} 
      />
    </div>
  );
};

// ==================== BOTTOM NAV - ELEVATED CENTER STYLE ====================
const BottomNav = ({ active = 'home', onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'add', icon: Plus, label: '', isCenter: true },
    { id: 'rewards', icon: Trophy, label: 'Rewards' },
    { id: 'analytics', icon: BarChart3, label: 'Stats' }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 pb-4 pt-2 px-4">
      {/* Center FAB - Elevated */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-20">
        <button
          onClick={() => onNavigate('add')}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
          style={{
            background: colors.primary,
            boxShadow: `0 8px 20px ${colors.primary}40, 0 0 0 6px white`
          }}
        >
          <Plus className="text-white" size={26} strokeWidth={2.5} />
        </button>
      </div>
      
      {/* Nav Bar */}
      <div 
        className="bg-white rounded-full px-6 py-2 shadow-lg mx-auto"
        style={{ 
          maxWidth: '380px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="flex items-center justify-between">
          {navItems.map(item => {
            if (item.isCenter) {
              // Spacer for center button
              return <div key={item.id} className="w-8" />;
            }
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center gap-0.5 transition-all active:scale-95 py-1"
                style={{ minWidth: '48px' }}
              >
                <item.icon 
                  size={22} 
                  strokeWidth={2}
                  style={{ 
                    color: active === item.id ? colors.primary : '#9CA3AF',
                    transition: 'color 0.2s ease'
                  }}
                />
                {item.label && (
                  <span 
                    className="text-[9px] font-medium"
                    style={{ 
                      color: active === item.id ? colors.primary : '#9CA3AF',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ==================== DEMO ====================
export default function FinalComponentLibrary() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  
  const sampleItems = [
    { id: 1, name: 'Milk', icon: '🥛', category: 'fridge', daysUntilExpiry: 0.5 },
    { id: 2, name: 'Strawberries', icon: '🍓', category: 'fridge', daysUntilExpiry: 2 },
    { id: 3, name: 'Carrots', icon: '🥕', category: 'fridge', daysUntilExpiry: 7 },
    { id: 4, name: 'Pasta', icon: '🍝', category: 'pantry', daysUntilExpiry: 180 },
  ];
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bgGray }}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col" style={{ backgroundColor: colors.bgGray }}>
        {/* Header */}
        <div 
          className="text-white p-6 pb-8"
          style={{
            background: `linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)`
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {activeScreen === 'dashboard' && 'Dashboard'}
              {activeScreen === 'inventory' && 'Inventory'}
              {activeScreen === 'add' && 'Add Item'}
              {activeScreen === 'rewards' && 'Rewards'}
              {activeScreen === 'analytics' && 'Analytics'}
            </h1>
            <button className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center active:bg-white/30 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 pb-24 overflow-y-auto">
          {activeScreen === 'dashboard' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-5">This Week's Impact</h2>
              
              {/* 3 KPI Cards */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <KpiCardColored
                  title="Inventory"
                  value="$247"
                  subtitle="23 items"
                  icon={<ShoppingBag />}
                  color="blue"
                />
                <KpiCardColored
                  title="Wasted"
                  value="$12"
                  subtitle="3 items"
                  icon={<TrendingDown />}
                  color="red"
                />
                <KpiCardColored
                  title="Donated"
                  value="$8"
                  subtitle="2 items"
                  icon={<Heart />}
                  color="purple"
                />
              </div>
              
              {/* Compact Streak */}
              <CompactStreak 
                days={12} 
                nextMilestone={{ name: "2 Week Badge", remaining: 2 }}
              />
              
              {/* Items at Risk Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Items at Risk</h3>
                {sampleItems.slice(0, 2).map(item => (
                  <ItemCard 
                    key={item.id}
                    item={item}
                    onEdit={(id) => console.log('Edit', id)}
                    onConsume={(id) => console.log('Consume', id)}
                  />
                ))}
              </div>
            </>
          )}
          
          {activeScreen === 'inventory' && (
            <>
              <div className="mb-3">
                <SearchBar />
              </div>
              
              {/* Category Badges with All Items */}
              <div className="flex gap-3 overflow-x-auto pb-3 mb-3">
                <CategoryBadge category="all" active />
                <CategoryBadge category="fridge" />
                <CategoryBadge category="freezer" />
                <CategoryBadge category="pantry" />
              </div>
              
              {/* All Items */}
              <div className="space-y-3">
                {sampleItems.map(item => (
                  <ItemCard 
                    key={item.id}
                    item={item}
                    onEdit={(id) => console.log('Edit', id)}
                    onConsume={(id) => console.log('Consume', id)}
                  />
                ))}
              </div>
            </>
          )}
          
          {activeScreen === 'add' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Add New Item</h2>
              <p className="text-sm text-gray-600 mb-6">Scan barcode or enter manually</p>
              
              <div className="space-y-4">
                <Button variant="primary" size="large" className="w-full">
                  <Package size={20} />
                  Scan Barcode
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Milk"
                      className="w-full min-h-[48px] px-4 rounded-xl border-2 text-base"
                      style={{ borderColor: colors.border }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select 
                        className="w-full min-h-[48px] px-4 rounded-xl border-2 text-base"
                        style={{ borderColor: colors.border }}
                      >
                        <option>Fridge</option>
                        <option>Freezer</option>
                        <option>Pantry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                      <input
                        type="number"
                        placeholder="$0.00"
                        className="w-full min-h-[48px] px-4 rounded-xl border-2 text-base"
                        style={{ borderColor: colors.border }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      className="w-full min-h-[48px] px-4 rounded-xl border-2 text-base"
                      style={{ borderColor: colors.border }}
                    />
                  </div>
                  
                  <Button variant="primary" size="large" className="w-full">
                    Add Item
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {activeScreen === 'rewards' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Your Progress</h2>
              <p className="text-sm text-gray-600 mb-4">Achievements, streaks, and challenges</p>
              
              {/* Level Progress - Silver themed */}
              <div 
                className="rounded-2xl p-6 text-white mb-5"
                style={{
                  background: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-100 mb-1">Current Level</p>
                    <p className="text-3xl font-bold">Silver</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                    🥈
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-100">Progress to Gold</span>
                    <span className="font-semibold">3,450 / 5,000</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: '69%' }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white rounded-2xl p-4 border text-center" style={{ borderColor: colors.border }}>
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <div className="text-xs text-gray-500">Achievements</div>
                </div>
                <div className="bg-white rounded-2xl p-4 border text-center" style={{ borderColor: colors.border }}>
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-2xl font-bold text-gray-900">7</div>
                  <div className="text-xs text-gray-500">Day Streak</div>
                </div>
                <div className="bg-white rounded-2xl p-4 border text-center" style={{ borderColor: colors.border }}>
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="text-2xl font-bold text-gray-900">3,450</div>
                  <div className="text-xs text-gray-500">Total Points</div>
                </div>
              </div>
              
              {/* Recent Achievements */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Recent Achievements</h3>
                
                <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: colors.border }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
                      🎉
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Week Streak!</h4>
                      <p className="text-sm text-gray-600">7 days of zero waste</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">+100</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: colors.border }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl flex-shrink-0">
                      💰
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">$50 Saved</h4>
                      <p className="text-sm text-gray-600">Savings milestone reached</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">+200</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Active Challenges */}
              <div className="space-y-3 mt-5">
                <h3 className="font-semibold text-gray-900">Active Challenges</h3>
                
                <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: colors.border }}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Zero Waste Week</h4>
                    <span className="text-xs font-medium text-blue-600">4 days left</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">5 / 7 days completed</span>
                      <span className="font-semibold text-gray-900">71%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: '71%',
                          backgroundColor: colors.primary
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Reward: +500 points & Gold Badge</p>
                </div>
              </div>
            </>
          )}
          
          {activeScreen === 'analytics' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Analytics</h2>
              <p className="text-sm text-gray-600 mb-4">Track your progress and insights</p>
              
              {/* Time Period Selector */}
              <div className="flex gap-2 mb-6">
                {['Week', 'Month', 'Year'].map(period => (
                  <button
                    key={period}
                    className="flex-1 min-h-[40px] px-4 rounded-xl font-medium text-sm transition-all"
                    style={{
                      backgroundColor: period === 'Month' ? colors.primary : colors.bgGray,
                      color: period === 'Month' ? '#FFFFFF' : colors.text,
                      border: period === 'Month' ? 'none' : `1px solid ${colors.border}`
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
              
              {/* Analytics Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: colors.border }}>
                  <h3 className="font-semibold text-gray-900 mb-3">Waste Rate</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={colors.borderLight}
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={colors.primary}
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray="351.86"
                          strokeDashoffset="263.895"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">8.2%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600">Target: &lt;15%</p>
                </div>
                
                <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: colors.border }}>
                  <h3 className="font-semibold text-gray-900 mb-4">Monthly Trend</h3>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[45, 62, 38, 75, 52, 68, 42, 85, 58, 72, 48, 65].map((height, i) => (
                      <div key={i} className="flex-1 rounded-t-lg transition-all hover:opacity-80" style={{ 
                        height: `${height}%`,
                        backgroundColor: i === 11 ? colors.primary : colors.primaryLight
                      }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-gray-500">
                    <span>Jan</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Bottom Navigation */}
        <BottomNav active={activeScreen} onNavigate={setActiveScreen} />
      </div>
    </div>
  );
}
