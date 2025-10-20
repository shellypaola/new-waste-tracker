import React, { useState } from 'react';
import { Search, Plus, Bell, Flame, Trophy, Edit2, TrendingDown, Package, Heart, TrendingUp, Home, BarChart3, Filter, Trash2, Award, Zap, Star, Camera, FileText, Lock, Share2, DollarSign } from 'lucide-react';

const colors = {
  primary: '#60A5FA',
  primaryDark: '#3B82F6',
  primaryLight: '#DBEAFE',
  secondary: '#FBBF24',
  secondaryLight: '#FEF3C7',
  critical: '#EF4444',
  criticalBg: '#FEF2F2',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  fresh: '#10B981',
  freshBg: '#DCFCE7',
  text: '#374151',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  bg: '#FFFFFF',
  bgGray: '#F9FAFB',
  border: '#E5E7EB',
};

const initialInventory = [
  { id: 1, name: 'Milk', emoji: '🥛', category: 'fridge', daysUntilExpiry: 0.5, cost: 4.99, status: 'sealed' },
  { id: 2, name: 'Strawberries', emoji: '🍓', category: 'fridge', daysUntilExpiry: 2, cost: 5.99, status: 'sealed' },
  { id: 3, name: 'Carrots', emoji: '🥕', category: 'fridge', daysUntilExpiry: 7, cost: 3.49, status: 'sealed' },
  { id: 4, name: 'Chicken', emoji: '🍗', category: 'fridge', daysUntilExpiry: 1, cost: 12.99, status: 'sealed' },
  { id: 5, name: 'Ice Cream', emoji: '🍨', category: 'freezer', daysUntilExpiry: 90, cost: 6.99, status: 'sealed' },
  { id: 6, name: 'Frozen Pizza', emoji: '🍕', category: 'freezer', daysUntilExpiry: 120, cost: 8.99, status: 'sealed' },
  { id: 7, name: 'Pasta', emoji: '🍝', category: 'pantry', daysUntilExpiry: 180, cost: 2.99, status: 'sealed' },
  { id: 8, name: 'Rice', emoji: '🍚', category: 'pantry', daysUntilExpiry: 365, cost: 9.99, status: 'sealed' },
];

const expiredItems = [
  { id: 101, name: 'Lettuce', emoji: '🥬', cost: 3.99, expiredDays: 2 },
  { id: 102, name: 'Yogurt', emoji: '🥛', cost: 4.49, expiredDays: 1 },
];

function WasteWarriorMVP() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [inventory, setInventory] = useState(initialInventory);
  const [expired, setExpired] = useState(expiredItems);
  const [activeCategory, setActiveCategory] = useState('all');
  const [totalWasted, setTotalWasted] = useState(8.48);
  const [showConsumeModal, setShowConsumeModal] = useState(false);
  const [showOpenPantryModal, setShowOpenPantryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [consumePercentage, setConsumePercentage] = useState(100);
  const [openItemCategory, setOpenItemCategory] = useState('fridge');
  const [openItemDays, setOpenItemDays] = useState(7);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [addMethod, setAddMethod] = useState(null);
  const [dailyScans, setDailyScans] = useState(12);
  const [isPremium, setIsPremium] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    emoji: '🍎',
    category: 'fridge',
    cost: '',
    daysUntilExpiry: 7
  });
  
  const atRiskItems = inventory.filter(item => item.daysUntilExpiry <= 3).sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  
  const handleMarkAsOpen = (item) => {
    setSelectedItem(item);
    setOpenItemCategory('fridge');
    setOpenItemDays(7);
    setShowOpenPantryModal(true);
  };
  
  const confirmOpenPantry = () => {
    setInventory(inventory.map(item => 
      item.id === selectedItem.id 
        ? { ...item, status: 'opened', category: openItemCategory, daysUntilExpiry: openItemDays } 
        : item
    ));
    setShowOpenPantryModal(false);
    setSelectedItem(null);
  };
  
  const handleMarkAsFinished = (item) => {
    setSelectedItem(item);
    setConsumePercentage(100);
    setShowConsumeModal(true);
  };
  
  const confirmConsume = () => {
    const wastedAmount = (selectedItem.cost * (100 - consumePercentage)) / 100;
    setTotalWasted(totalWasted + wastedAmount);
    setInventory(inventory.filter(item => item.id !== selectedItem.id));
    setShowConsumeModal(false);
    setSelectedItem(null);
    setConsumePercentage(100);
  };
  
  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };
  
  const saveEdit = () => {
    setInventory(inventory.map(item => 
      item.id === selectedItem.id ? selectedItem : item
    ));
    setShowEditModal(false);
    setSelectedItem(null);
  };
  
  const handleAddNewItem = () => {
    const item = {
      id: Date.now(),
      name: newItem.name,
      emoji: newItem.emoji,
      category: newItem.category,
      cost: parseFloat(newItem.cost) || 0,
      daysUntilExpiry: parseInt(newItem.daysUntilExpiry) || 7,
      status: 'sealed'
    };
    setInventory([...inventory, item]);
    setAddMethod(null);
    setNewItem({ name: '', emoji: '🍎', category: 'fridge', cost: '', daysUntilExpiry: 7 });
  };
  
  const handleScanBarcode = () => {
    const scannedItem = {
      name: 'Organic Milk',
      emoji: '🥛',
      category: 'fridge',
      cost: 4.99,
      daysUntilExpiry: 7
    };
    setNewItem(scannedItem);
    setDailyScans(dailyScans + 1);
    alert('Barcode scanned! Product details loaded.');
  };

  const filteredInventory = activeCategory === 'all' 
    ? inventory 
    : inventory.filter(item => item.category === activeCategory);

  const ItemCard = ({ item }) => {
    const getStatusText = () => {
      if (item.daysUntilExpiry <= 0) return 'EXPIRED';
      if (item.daysUntilExpiry < 1) return `${Math.round(item.daysUntilExpiry * 24)}h left`;
      return `${Math.round(item.daysUntilExpiry)}d left`;
    };

    const getStatusColor = () => {
      if (item.daysUntilExpiry <= 0) return { bg: 'rgba(156, 163, 175, 0.2)', text: colors.textLight };
      if (item.daysUntilExpiry <= 1) return { bg: 'rgba(239, 68, 68, 0.15)', text: colors.critical };
      if (item.daysUntilExpiry <= 3) return { bg: 'rgba(245, 158, 11, 0.15)', text: colors.warning };
      return { bg: 'rgba(16, 185, 129, 0.15)', text: colors.fresh };
    };

    const statusColor = getStatusColor();

    return (
      <div className="p-4 rounded-xl mb-3 mx-4 bg-white" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{item.emoji}</span>
            <div>
              <div className="font-semibold text-base" style={{ color: colors.text }}>{item.name}</div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>${item.cost.toFixed(2)}</div>
            </div>
          </div>
          <button onClick={() => handleEdit(item)}>
            <Edit2 size={18} style={{ color: colors.textLight }} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ 
            backgroundColor: statusColor.bg,
            color: statusColor.text
          }}>
            {getStatusText()}
          </span>
          <div className="flex gap-2">
            {item.category === 'pantry' && item.status !== 'opened' && (
              <button onClick={() => handleMarkAsOpen(item)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: colors.primaryLight, color: colors.primary }}>
                Mark as Open
              </button>
            )}
            <button onClick={() => handleMarkAsFinished(item)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: colors.primary, color: 'white' }}>
              Finished
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DashboardScreen = () => (
    <div className="h-full overflow-y-auto pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
            Hi {props.userName || 'there'}! 👋
          </h1>
          <p className="text-base" style={{ color: colors.textSecondary }}>
            Here's your week at a glance
          </p>
        </div>         
          <button className="p-2 rounded-full" style={{ backgroundColor: colors.bgGray }}>
            <Bell size={20} style={{ color: colors.text }} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl" style={{ backgroundColor: '#EFF6FF' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: colors.primaryLight }}>
              <Package size={20} style={{ color: colors.primary }} />
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: colors.primary }}>Inventory</div>
            <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>${inventory.reduce((sum, item) => sum + item.cost, 0).toFixed(0)}</div>
            <div className="text-xs" style={{ color: colors.primary }}>{inventory.length} items</div>
          </div>
          <div className="p-4 rounded-2xl" style={{ backgroundColor: colors.criticalBg }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#FEE2E2' }}>
              <TrendingDown size={20} style={{ color: colors.critical }} />
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: colors.critical }}>Wasted</div>
            <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>${totalWasted.toFixed(0)}</div>
            <div className="text-xs" style={{ color: colors.critical }}>This week</div>
          </div>
          <div className="p-4 rounded-2xl" style={{ backgroundColor: '#FEF3C7' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: colors.secondaryLight }}>
              <Heart size={20} style={{ color: colors.secondary }} />
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: colors.secondary }}>Donated</div>
            <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>$12</div>
            <div className="text-xs" style={{ color: colors.secondary }}>2 meals</div>
          </div>
        </div>
      </div>
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3" style={{ color: colors.text }}>Items Expiring Soon ({atRiskItems.length})</h2>
        {atRiskItems.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl" style={{ backgroundColor: colors.bgGray }}>
            <div className="text-4xl mb-2">🎉</div>
            <div className="font-semibold mb-1" style={{ color: colors.text }}>No items at risk!</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Great job managing your food</div>
          </div>
        ) : (
          atRiskItems.map(item => <ItemCard key={item.id} item={item} />)
        )}
      </div>
      {expired.length > 0 && (
        <div className="px-4">
          <h2 className="text-lg font-bold mb-3" style={{ color: colors.text }}>Recently Expired</h2>
          {expired.map(item => (
            <div key={item.id} className="p-4 rounded-xl mb-3" style={{ backgroundColor: colors.bgGray, border: `1px solid ${colors.border}` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl opacity-50">{item.emoji}</span>
                  <div>
                    <div className="font-semibold" style={{ color: colors.textSecondary }}>{item.name}</div>
                    <div className="text-xs" style={{ color: colors.textLight }}>Expired {item.expiredDays}d ago • ${item.cost.toFixed(2)}</div>
                  </div>
                </div>
                <Trash2 size={18} style={{ color: colors.textLight }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const InventoryScreen = () => (
    <div className="h-full flex flex-col" style={{ minHeight: 0 }}>
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>Inventory</h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>{inventory.length} items tracked</p>
      </div>
      <div className="px-4 py-3 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textLight }} />
          <input type="text" placeholder="Search items..." className="w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm" style={{ borderColor: colors.border, backgroundColor: colors.bg, height: '44px' }} />
        </div>
        <button className="px-4 rounded-xl border-2 font-medium text-sm flex items-center gap-2" style={{ borderColor: colors.border, color: colors.text, height: '44px' }}>
          <Filter size={18} />
          Filter
        </button>
      </div>
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {['all', 'fridge', 'freezer', 'pantry'].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className="px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all" style={{ backgroundColor: activeCategory === cat ? colors.primary : colors.bgGray, color: activeCategory === cat ? 'white' : colors.text }}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto py-3" style={{ minHeight: 0, WebkitOverflowScrolling: 'touch' }}>
        {filteredInventory.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-4xl mb-3">📦</div>
            <div className="font-semibold mb-1" style={{ color: colors.text }}>No items yet</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Add your first item to get started</div>
          </div>
        ) : (
          filteredInventory.map(item => <ItemCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );

  const RewardsScreen = () => {
    // Level configuration
    const levels = {
      bronze: { name: 'Bronze', color: '#CD7F32', lightColor: '#E6C9A8', gradient: 'linear-gradient(135deg, #CD7F32 0%, #B8732E 100%)', next: 'Silver', pointsNeeded: 2000 },
      silver: { name: 'Silver', color: '#C0C0C0', lightColor: '#E8E8E8', gradient: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)', next: 'Gold', pointsNeeded: 5000 },
      gold: { name: 'Gold', color: '#FFD700', lightColor: '#FFF4CC', gradient: 'linear-gradient(135deg, #FFD700 0%, #FFC700 100%)', next: 'Platinum', pointsNeeded: 10000 },
      platinum: { name: 'Platinum', color: '#E5E4E2', lightColor: '#F5F5F5', gradient: 'linear-gradient(135deg, #E5E4E2 0%, #D3D3D3 100%)', next: 'Diamond', pointsNeeded: 20000 }
    };
    
    const currentLevel = 'silver';
    const currentPoints = 3450;
    const level = levels[currentLevel];
    
    return (
    <div className="h-full overflow-y-auto pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Rewards</h1>

        <div className="p-6 rounded-2xl mb-6 relative overflow-hidden" style={{ background: level.gradient }}>
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
            <Trophy size={32} color="white" />
          </div>
          <div className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>Current Level</div>
          <div className="text-4xl font-bold mb-4 text-white">{level.name}</div>
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Progress to {level.next}</span>
              <span className="text-sm font-bold text-white">{currentPoints.toLocaleString()} / {level.pointsNeeded.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
              <div className="h-2 rounded-full" style={{ width: `${(currentPoints / level.pointsNeeded) * 100}%`, backgroundColor: 'rgba(255,255,255,0.9)' }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl border text-center" style={{ borderColor: colors.border }}>
            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl" style={{ backgroundColor: colors.secondaryLight }}>
              🎯
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>12</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Earned</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border text-center" style={{ borderColor: colors.border }}>
            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl" style={{ backgroundColor: '#FEE2E2' }}>
              🔥
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>7</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Streak</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border text-center" style={{ borderColor: colors.border }}>
            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl" style={{ backgroundColor: colors.primaryLight }}>
              ⭐
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>23</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Challenges</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: colors.text }}>Achievements</h2>
          <button className="p-2">
            <Filter size={20} style={{ color: colors.textSecondary }} />
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['All', 'Milestone', 'Performance', 'Consistency'].map((cat, idx) => (
            <button key={cat} className="px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap" style={{ backgroundColor: idx === 0 ? colors.primary : 'white', color: idx === 0 ? 'white' : colors.text, border: idx === 0 ? 'none' : `1px solid ${colors.border}` }}>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-white p-4 rounded-2xl border" style={{ borderColor: colors.primary, borderWidth: '2px' }}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: colors.freshBg }}>
                🌱
              </div>
              <div className="flex-1">
                <div className="font-bold text-base mb-1" style={{ color: colors.text }}>First Week</div>
                <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>7 days active</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.bgGray, color: colors.textSecondary }}>common</span>
                  <span className="text-sm font-bold" style={{ color: colors.secondary }}>+100 pts</span>
                </div>
              </div>
              <button className="p-2 rounded-full" style={{ backgroundColor: colors.primaryLight }}>
                <Share2 size={18} style={{ color: colors.primary }} />
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border" style={{ borderColor: colors.border }}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: colors.secondaryLight }}>
                🎯
              </div>
              <div className="flex-1">
                <div className="font-bold text-base mb-1" style={{ color: colors.text }}>Goal Setter</div>
                <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>Set your first waste reduction goal</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.secondaryLight, color: colors.secondary }}>rare</span>
                  <span className="text-sm font-bold" style={{ color: colors.secondary }}>+250 pts</span>
                </div>
              </div>
              <button className="p-2 rounded-full" style={{ backgroundColor: colors.primaryLight }}>
                <Share2 size={18} style={{ color: colors.primary }} />
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border" style={{ borderColor: colors.border }}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: colors.primaryLight }}>
                ⚡
              </div>
              <div className="flex-1">
                <div className="font-bold text-base mb-1" style={{ color: colors.text }}>Quick Start</div>
                <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>Add 10 items in your first day</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.bgGray, color: colors.textSecondary }}>common</span>
                  <span className="text-sm font-bold" style={{ color: colors.primary }}>+50 pts</span>
                </div>
              </div>
              <button className="p-2 rounded-full" style={{ backgroundColor: colors.primaryLight }}>
                <Share2 size={18} style={{ color: colors.primary }} />
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border opacity-60" style={{ borderColor: colors.border }}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: colors.bgGray }}>
                🔒
              </div>
              <div className="flex-1">
                <div className="font-bold text-base mb-1" style={{ color: colors.textSecondary }}>Zero Waste Week</div>
                <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>Consume all items before expiry for 7 days</div>
                <div className="w-full h-2 rounded-full mt-2" style={{ backgroundColor: colors.bgGray }}>
                  <div className="h-2 rounded-full" style={{ width: '40%', backgroundColor: colors.primary }} />
                </div>
                <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>3/7 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const AnalyticsScreen = () => (
    <div className="h-full overflow-y-auto pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>Analytics</h1>
        <p className="text-sm mb-6" style={{ color: colors.textSecondary }}>Your waste reduction journey</p>

        {/* Time Period Selector */}
        <div className="flex gap-2 mb-6">
          {['Week', 'Month', 'Year'].map(period => (
            <button key={period} className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all" style={{ backgroundColor: period === 'Month' ? colors.primary : colors.bgGray, color: period === 'Month' ? 'white' : colors.text }}>
              {period}
            </button>
          ))}
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)' }}>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <TrendingDown size={80} style={{ color: colors.critical }} />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <TrendingDown size={16} style={{ color: colors.critical }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: colors.critical }}>WASTE RATE</span>
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: colors.critical }}>12%</div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium" style={{ color: colors.fresh }}>↓ 5%</span>
                <span className="text-xs" style={{ color: colors.textSecondary }}>vs last month</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)' }}>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <DollarSign size={80} style={{ color: colors.fresh }} />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>
                  <TrendingUp size={16} style={{ color: colors.fresh }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: colors.fresh }}>SAVED</span>
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: colors.fresh }}>$45</div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium" style={{ color: colors.fresh }}>↑ $12</span>
                <span className="text-xs" style={{ color: colors.textSecondary }}>vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold" style={{ color: colors.text }}>Spending & Waste Trend</h2>
            <div className="flex gap-2">
              {['3M', '6M', 'Year'].map((period, idx) => (
                <button key={period} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ 
                  backgroundColor: idx === 0 ? colors.primary : colors.bgGray,
                  color: idx === 0 ? 'white' : colors.textSecondary
                }}>
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border" style={{ borderColor: colors.border }}>
            {/* Chart Area */}
            <div className="relative h-48 mb-4">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs" style={{ color: colors.textLight }}>
                <span>$300</span>
                <span>$200</span>
                <span>$100</span>
                <span>$0</span>
              </div>
              
              {/* Chart content */}
              <div className="ml-10 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="border-t" style={{ borderColor: colors.border, opacity: 0.3 }} />
                  ))}
                </div>
                
                {/* Data lines */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  {/* Spent line (blue) */}
                  <polyline
                    points="0,80 25,65 50,70 75,60 100,50"
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="3"
                    style={{ vectorEffect: 'non-scaling-stroke' }}
                  />
                  
                  {/* Wasted line (red) */}
                  <polyline
                    points="0,140 25,125 50,130 75,115 100,95"
                    fill="none"
                    stroke={colors.critical}
                    strokeWidth="3"
                    style={{ vectorEffect: 'non-scaling-stroke' }}
                  />
                  
                  {/* Future projection (dashed) */}
                  <polyline
                    points="100,50 120,45 140,40"
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    style={{ vectorEffect: 'non-scaling-stroke', opacity: 0.5 }}
                  />
                  <polyline
                    points="100,95 120,85 140,75"
                    fill="none"
                    stroke={colors.fresh}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    style={{ vectorEffect: 'non-scaling-stroke', opacity: 0.7 }}
                  />
                  
                  {/* Current month indicator */}
                  <line x1="100" y1="0" x2="100" y2="192" stroke={colors.textLight} strokeWidth="1" strokeDasharray="2 2" style={{ vectorEffect: 'non-scaling-stroke', opacity: 0.3 }} />
                </svg>
                
                {/* Month labels */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs" style={{ color: colors.textSecondary }}>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span className="font-semibold" style={{ color: colors.primary }}>Oct</span>
                  <span style={{ color: colors.textLight }}>Nov</span>
                  <span style={{ color: colors.textLight }}>Dec</span>
                </div>
              </div>
            </div>
            
            {/* Legend and stats */}
            <div className="mt-8 pt-4 border-t" style={{ borderColor: colors.border }}>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-0.5" style={{ backgroundColor: colors.primary }} />
                    <span className="text-xs font-medium" style={{ color: colors.text }}>Spent</span>
                  </div>
                  <span className="text-xs" style={{ color: colors.textSecondary }}>$680/mo avg</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-0.5" style={{ backgroundColor: colors.critical }} />
                    <span className="text-xs font-medium" style={{ color: colors.text }}>Wasted</span>
                  </div>
                  <span className="text-xs" style={{ color: colors.textSecondary }}>$163/mo avg</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.freshBg }}>
                <div className="flex items-start gap-2">
                  <span className="text-base">📈</span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold mb-1" style={{ color: colors.fresh }}>Projected Savings</div>
                    <div className="text-xs" style={{ color: colors.text }}>
                      At your current rate, you'll save <strong>$120 over the next 3 months</strong> compared to July's waste rate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Waste by Category */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold" style={{ color: colors.text }}>Waste by Category</h2>
            <span className="text-sm font-semibold" style={{ color: colors.critical }}>$8.48 total</span>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: colors.primaryLight }}>
                    🥗
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: colors.text }}>Fridge</div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>61% of total waste</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg" style={{ color: colors.critical }}>$5.20</div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>4 items</div>
                </div>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.bgGray }}>
                <div className="h-2 rounded-full transition-all" style={{ width: '61%', backgroundColor: colors.primary }} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: colors.primaryLight }}>
                    ❄️
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: colors.text }}>Freezer</div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>25% of total waste</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg" style={{ color: colors.critical }}>$2.15</div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>2 items</div>
                </div>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.bgGray }}>
                <div className="h-2 rounded-full transition-all" style={{ width: '25%', backgroundColor: colors.primary }} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: colors.secondaryLight }}>
                    🥫
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: colors.text }}>Pantry</div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>13% of total waste</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg" style={{ color: colors.critical }}>$1.13</div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>1 item</div>
                </div>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.bgGray }}>
                <div className="h-2 rounded-full transition-all" style={{ width: '13%', backgroundColor: colors.primary }} />
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3" style={{ color: colors.text }}>Insights</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl border-2" style={{ backgroundColor: colors.freshBg, borderColor: colors.fresh }}>
              <div className="flex gap-3">
                <div className="text-2xl">🎉</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1" style={{ color: colors.fresh }}>Great progress!</div>
                  <div className="text-sm" style={{ color: colors.text }}>You've reduced waste by 5% this month. Keep it up!</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-xl">🔍</div>
                  <h3 className="font-semibold" style={{ color: colors.text }}>Most Wasted Items</h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: colors.bgGray }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🥬</span>
                    <div>
                      <div className="text-sm font-medium" style={{ color: colors.text }}>Lettuce</div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>Wasted 3 times</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: colors.critical }}>$11.97</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: colors.bgGray }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🥛</span>
                    <div>
                      <div className="text-sm font-medium" style={{ color: colors.text }}>Milk</div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>Wasted 2 times</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: colors.critical }}>$9.98</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: colors.bgGray }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍓</span>
                    <div>
                      <div className="text-sm font-medium" style={{ color: colors.text }}>Berries</div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>Wasted 2 times</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: colors.critical }}>$7.98</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
                <div className="text-xs" style={{ color: colors.textSecondary }}>💡 Consider buying smaller quantities of these items</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border" style={{ backgroundColor: colors.secondaryLight, borderColor: colors.secondary }}>
              <div className="flex gap-3">
                <div className="text-2xl">💡</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1" style={{ color: colors.secondary }}>Pro tip</div>
                  <div className="text-sm" style={{ color: colors.text }}>Most waste happens in your fridge. Try meal planning to reduce it.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: colors.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxHeight: '100vh', overflow: 'hidden' }}>
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {activeScreen === 'dashboard' && <DashboardScreen />}
        {activeScreen === 'inventory' && <InventoryScreen />}
        {activeScreen === 'rewards' && <RewardsScreen />}
        {activeScreen === 'analytics' && <AnalyticsScreen />}
      </div>
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-7 z-10">
          <button onClick={() => setShowAddItemModal(true)} className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
            <Plus size={28} strokeWidth={2.5} color="white" />
          </button>
        </div>
        <div className="border-t" style={{ borderColor: colors.border, backgroundColor: colors.bg }}>
          <div className="flex items-center justify-around px-4 pt-2 pb-1">
            <button onClick={() => setActiveScreen('dashboard')} className="flex flex-col items-center gap-0.5 py-1" style={{ minWidth: '48px' }}>
              <Home size={22} strokeWidth={2} style={{ color: activeScreen === 'dashboard' ? colors.primary : '#9CA3AF' }} />
              <span className="text-[9px] font-medium" style={{ color: activeScreen === 'dashboard' ? colors.primary : '#9CA3AF' }}>Home</span>
            </button>
            <button onClick={() => setActiveScreen('inventory')} className="flex flex-col items-center gap-0.5 py-1" style={{ minWidth: '48px' }}>
              <Package size={22} strokeWidth={2} style={{ color: activeScreen === 'inventory' ? colors.primary : '#9CA3AF' }} />
              <span className="text-[9px] font-medium" style={{ color: activeScreen === 'inventory' ? colors.primary : '#9CA3AF' }}>Inventory</span>
            </button>
            <div className="w-8" />
            <button onClick={() => setActiveScreen('rewards')} className="flex flex-col items-center gap-0.5 py-1" style={{ minWidth: '48px' }}>
              <Trophy size={22} strokeWidth={2} style={{ color: activeScreen === 'rewards' ? colors.primary : '#9CA3AF' }} />
              <span className="text-[9px] font-medium" style={{ color: activeScreen === 'rewards' ? colors.primary : '#9CA3AF' }}>Rewards</span>
            </button>
            <button onClick={() => setActiveScreen('analytics')} className="flex flex-col items-center gap-0.5 py-1" style={{ minWidth: '48px' }}>
              <BarChart3 size={22} strokeWidth={2} style={{ color: activeScreen === 'analytics' ? colors.primary : '#9CA3AF' }} />
              <span className="text-[9px] font-medium" style={{ color: activeScreen === 'analytics' ? colors.primary : '#9CA3AF' }}>Stats</span>
            </button>
          </div>
        </div>
      </div>

      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: colors.text }}>Add Item</h3>
              <button onClick={() => setShowAddItemModal(false)}>
                <span className="text-2xl" style={{ color: colors.textLight }}>×</span>
              </button>
            </div>
            <div className="space-y-3">
              <button onClick={() => { setAddMethod('manual'); setShowAddItemModal(false); }} className="w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all hover:border-blue-300" style={{ borderColor: colors.border }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondaryLight }}>
                  <FileText size={24} style={{ color: colors.secondary }} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-base" style={{ color: colors.text }}>Manual Entry</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>Add item details manually</div>
                </div>
              </button>
              <button onClick={() => { if (dailyScans >= 50) { alert('Daily scan limit reached (50/50). Upgrade to Premium for unlimited scans!'); } else { setAddMethod('scan'); setShowAddItemModal(false); } }} className="w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all hover:border-blue-300" style={{ borderColor: colors.border }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primaryLight }}>
                  <Camera size={24} style={{ color: colors.primary }} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-base" style={{ color: colors.text }}>Scan Barcode</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>Quick add with barcode • {dailyScans}/50 today</div>
                </div>
              </button>
              <button onClick={() => { if (!isPremium) { alert('Receipt scanning is a Premium feature. Upgrade to unlock!'); } else { setAddMethod('receipt'); setShowAddItemModal(false); } }} className="w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all hover:border-purple-300 relative" style={{ borderColor: colors.border, opacity: isPremium ? 1 : 0.7 }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondaryLight }}>
                  <Camera size={24} style={{ color: colors.secondary }} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-base flex items-center gap-2" style={{ color: colors.text }}>
                    Scan Receipt
                    {!isPremium && <Lock size={16} style={{ color: colors.secondary }} />}
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>{isPremium ? 'Add multiple items at once' : 'Premium feature'}</div>
                </div>
              </button>
            </div>
            {!isPremium && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: colors.primaryLight }}>
                <div className="text-xs font-medium" style={{ color: colors.primary }}>💎 Upgrade to Premium for unlimited scans & receipt scanning</div>
              </div>
            )}
          </div>
        </div>
      )}

      {showOpenPantryModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">{selectedItem.emoji}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>Mark as Opened?</h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>Configure where to move <strong>{selectedItem.name}</strong> and set its new expiry date.</p>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Move to</label>
                <select value={openItemCategory} onChange={(e) => setOpenItemCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 text-base" style={{ borderColor: colors.border }}>
                  <option value="fridge">Fridge</option>
                  <option value="freezer">Freezer</option>
                  <option value="pantry">Keep in Pantry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Days until expiry</label>
                <input type="number" min="1" value={openItemDays} onChange={(e) => setOpenItemDays(parseInt(e.target.value) || 1)} className="w-full px-4 py-3 rounded-xl border-2 text-base" style={{ borderColor: colors.border }} />
                <p className="text-xs mt-1" style={{ color: colors.textLight }}>Expires on {new Date(Date.now() + openItemDays * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowOpenPantryModal(false); setSelectedItem(null); }} className="flex-1 py-3 rounded-xl font-medium" style={{ backgroundColor: colors.bgGray, color: colors.text }}>Cancel</button>
              <button onClick={confirmOpenPantry} className="flex-1 py-3 rounded-xl font-medium text-white" style={{ backgroundColor: colors.primary }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {showConsumeModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{selectedItem.emoji}</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>How much did you use?</h3>
              <p className="text-base" style={{ color: colors.textSecondary }}>{selectedItem.name}</p>
            </div>
            <div className="mb-8">
              <div className="mb-4">
                <span className="text-lg font-semibold" style={{ color: colors.text }}>Used: {consumePercentage}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" value={consumePercentage} onChange={(e) => setConsumePercentage(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${consumePercentage}%, #E5E7EB ${consumePercentage}%, #E5E7EB 100%)`, outline: 'none', border: 'none' }} />
              <div className="flex justify-between mt-4">
                {[0, 25, 50, 75, 100].map(val => (
                  <button key={val} onClick={() => setConsumePercentage(val)} className="text-sm px-3 py-2 rounded-lg font-medium transition-all" style={{ backgroundColor: consumePercentage === val ? colors.primaryLight : 'transparent', color: consumePercentage === val ? colors.primary : colors.textLight, border: 'none' }}>
                    {val}%
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowConsumeModal(false); setSelectedItem(null); setConsumePercentage(100); }} className="flex-1 py-3.5 rounded-xl font-semibold text-base" style={{ backgroundColor: colors.bgGray, color: colors.text, border: 'none' }}>Cancel</button>
              <button onClick={confirmConsume} className="flex-1 py-3.5 rounded-xl font-semibold text-white text-base" style={{ backgroundColor: colors.fresh, border: 'none' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.text }}>Edit Item</h3>
              <button onClick={() => { setShowEditModal(false); setSelectedItem(null); }}>
                <span className="text-2xl" style={{ color: colors.textLight }}>×</span>
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Item Name</label>
                <input type="text" value={selectedItem.name} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2" style={{ borderColor: colors.border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Cost ($)</label>
                <input type="number" step="0.01" value={selectedItem.cost} onChange={(e) => setSelectedItem({ ...selectedItem, cost: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border-2" style={{ borderColor: colors.border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Days Until Expiry</label>
                <input type="number" value={Math.round(selectedItem.daysUntilExpiry)} onChange={(e) => setSelectedItem({ ...selectedItem, daysUntilExpiry: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border-2" style={{ borderColor: colors.border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Category</label>
                <select value={selectedItem.category} onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2" style={{ borderColor: colors.border }}>
                  <option value="fridge">Fridge</option>
                  <option value="freezer">Freezer</option>
                  <option value="pantry">Pantry</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowEditModal(false); setSelectedItem(null); }} className="flex-1 py-3 rounded-xl font-medium" style={{ backgroundColor: colors.bgGray, color: colors.text }}>Cancel</button>
              <button onClick={saveEdit} className="flex-1 py-3 rounded-xl font-medium text-white" style={{ backgroundColor: colors.primary }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {addMethod === 'manual' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setAddMethod(null)} className="p-2 -ml-2">
                <span className="text-2xl">←</span>
              </button>
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>Manual Entry</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Item Name</label>
                <input type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g., Milk, Bread, Apples" className="w-full px-4 py-3 rounded-xl border-2 text-base" style={{ borderColor: colors.border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Emoji</label>
                <input type="text" value={newItem.emoji} onChange={(e) => setNewItem({ ...newItem, emoji: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 text-2xl text-center" style={{ borderColor: colors.border }} maxLength={2} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Category</label>
                <select value={newItem.category} onChange={(e) => { const cat = e.target.value; const defaultDays = cat === 'fridge' ? 7 : cat === 'freezer' ? 90 : 365; setNewItem({ ...newItem, category: cat, daysUntilExpiry: defaultDays }); }} className="w-full px-4 py-3 rounded-xl border-2 text-base" style={{ borderColor: colors.border }}>
                  <option value="fridge">Fridge (7 days default)</option>
                  <option value="freezer">Freezer (90 days default)</option>
                  <option value="pantry">Pantry (365 days default)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Cost ($)</label>
                <input type="number" step="0.01" value={newItem.cost} onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })} placeholder="0.00" className="w-full px-4 py-3 rounded-xl border-2 text-base" style={{ borderColor: colors.border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Days Until Expiry</label>
                <input type="number" value={newItem.daysUntilExpiry} onChange={(e) => setNewItem({ ...newItem, daysUntilExpiry: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 text-base" style={{ borderColor: colors.border }} />
                <p className="text-xs mt-1" style={{ color: colors.textLight }}>Expires on {new Date(Date.now() + newItem.daysUntilExpiry * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t" style={{ borderColor: colors.border }}>
            <button onClick={handleAddNewItem} disabled={!newItem.name || !newItem.cost} className="w-full py-3.5 rounded-xl font-semibold text-white text-base" style={{ backgroundColor: (!newItem.name || !newItem.cost) ? colors.textLight : colors.fresh, opacity: (!newItem.name || !newItem.cost) ? 0.5 : 1 }}>
              Add Item
            </button>
          </div>
        </div>
      )}

      {addMethod === 'scan' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setAddMethod(null)} className="p-2 -ml-2">
                <span className="text-2xl">←</span>
              </button>
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>Scan Barcode</h2>
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Scans today: {dailyScans}/50</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <div className="aspect-square rounded-2xl mb-6 flex items-center justify-center" style={{ backgroundColor: colors.bgGray, border: `2px dashed ${colors.border}` }}>
                <div className="text-center">
                  <Camera size={64} style={{ color: colors.textLight, margin: '0 auto 16px' }} />
                  <div className="font-semibold mb-2" style={{ color: colors.text }}>Camera View</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>Point camera at barcode</div>
                </div>
              </div>
              <button onClick={handleScanBarcode} className="w-full py-3.5 rounded-xl font-semibold text-white text-base mb-3" style={{ backgroundColor: colors.fresh }}>Simulate Scan</button>
              <button onClick={() => setAddMethod('manual')} className="w-full py-3.5 rounded-xl font-semibold text-base" style={{ backgroundColor: colors.bgGray, color: colors.text }}>Enter Manually Instead</button>
            </div>
          </div>
        </div>
      )}

      {addMethod === 'receipt' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setAddMethod(null)} className="p-2 -ml-2">
                <span className="text-2xl">←</span>
              </button>
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>Scan Receipt</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: colors.secondaryLight, color: colors.secondary }}>PREMIUM</div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>Add multiple items at once</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <div className="aspect-[3/4] rounded-2xl mb-6 flex items-center justify-center" style={{ backgroundColor: colors.bgGray, border: `2px dashed ${colors.border}` }}>
                <div className="text-center p-6">
                  <FileText size={64} style={{ color: colors.textLight, margin: '0 auto 16px' }} />
                  <div className="font-semibold mb-2" style={{ color: colors.text }}>Receipt Scanner</div>
                  <div className="text-sm mb-4" style={{ color: colors.textSecondary }}>Point camera at receipt to extract items, prices, and dates</div>
                  <div className="text-xs p-3 rounded-lg" style={{ backgroundColor: colors.primaryLight, color: colors.primary }}>Uses Google ML Kit for accurate OCR</div>
                </div>
              </div>
              <button className="w-full py-3.5 rounded-xl font-semibold text-white text-base mb-3" style={{ backgroundColor: colors.secondary }}>
                <Camera size={20} style={{ display: 'inline', marginRight: '8px' }} />
                Scan Receipt
              </button>
              <button onClick={() => setAddMethod(null)} className="w-full py-3.5 rounded-xl font-semibold text-base" style={{ backgroundColor: colors.bgGray, color: colors.text }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WasteWarriorMVP;
