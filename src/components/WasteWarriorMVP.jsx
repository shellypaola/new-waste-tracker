import React, { useState, useEffect } from 'react';
import AnalyticsScreen from './AnalyticsScreen';
import SignUpScreen from './SignUpScreen'; // Adjust path if needed
import RewardsScreenProd from './RewardsScreenProd';
import FoodTipsDisplay from './FoodTipsDisplay';
import OverLimitBanner from './OverLimitBanner';
import TrialStatusBanner from './TrialStatusBanner';
import TrialEndingModal from './TrialEndingModal';
import PlanSelectionModal from './PlanSelectionModal';
import { Search, Plus, Bell, Flame, Trophy, Edit2, TrendingDown, Package, Heart, TrendingUp, Home, BarChart3, Filter, Trash2, Award, Zap, Star, Camera, FileText, Lock, Share2, DollarSign, X} from 'lucide-react';

const colors = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#DBEAFE',
  secondary: '#FBBF24',
  secondaryLight: '#FEF3C7',
  critical: '#EF4444',
  criticalBg: '#FEF2F2',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  fresh: '#10B981',
  freshBg: '#E6FBF0',
  text: '#374151',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  bg: '#F9FAFB',
  bgGray: '#F9FAFB',
  border: '#E5E7EB',
};

const initialInventory = [
  { id: 1, name: 'Milk', emoji: '🥛', category: 'fridge', daysUntilExpiry: 0.5, cost: 4.99, status: 'sealed', quantity: 2 },
  { id: 2, name: 'Strawberries', emoji: '🍓', category: 'fridge', daysUntilExpiry: 2, cost: 5.99, status: 'sealed', quantity: 1 },
  { id: 3, name: 'Carrots', emoji: '🥕', category: 'fridge', daysUntilExpiry: 7, cost: 3.49, status: 'sealed', quantity: 3 },
  { id: 4, name: 'Chicken', emoji: '🍗', category: 'fridge', daysUntilExpiry: 1, cost: 12.99, status: 'sealed', quantity: 1 },
  { id: 5, name: 'Ice Cream', emoji: '🍨', category: 'freezer', daysUntilExpiry: 90, cost: 6.99, status: 'sealed', quantity: 2 },
  { id: 6, name: 'Frozen Pizza', emoji: '🍕', category: 'freezer', daysUntilExpiry: 120, cost: 8.99, status: 'sealed', quantity: 4 },
  { id: 7, name: 'Pasta', emoji: '🍝', category: 'pantry', daysUntilExpiry: 180, cost: 2.99, status: 'sealed', quantity: 5 },
  { id: 8, name: 'Rice', emoji: '🍚', category: 'pantry', daysUntilExpiry: 365, cost: 9.99, status: 'sealed', quantity: 1 },
];

const expiredItems = [
  { id: 101, name: 'Lettuce', emoji: '🥬', cost: 3.99, expiredDays: 2 },
  { id: 102, name: 'Yogurt', emoji: '🥛', cost: 4.49, expiredDays: 1 },
];

const sampleConsumedItems = [
  {
    id: 1001,
    name: 'Bananas',
    emoji: '🍌',
    consumedAmount: 3.50,
    wastedAmount: 0.50,
    totalCost: 4.00,
    consumedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    daysUntilExpiryAtConsumption: 1,
    percentageConsumed: 87
  },
  {
    id: 1002,
    name: 'Bread',
    emoji: '🍞',
    consumedAmount: 4.50,
    wastedAmount: 0,
    totalCost: 4.50,
    consumedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    daysUntilExpiryAtConsumption: 3,
    percentageConsumed: 100
  }
];

export default function WasteWarriorMVP() {
  // Function to get default expiry date
  const getDefaultExpiryDate = (days = 7) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };
  
  // Function to calculate days until expiry from date
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Function to auto-assign emoji based on item name
  const getEmojiForItem = (itemName, category) => {
    const name = itemName.toLowerCase().trim();

    const emojiMap = {
      'milk': '🥛', 'yogurt': '🥛', 'cheese': '🧀',
      'chicken': '🍗', 'meat': '🥩', 'beef': '🥩', 'lamb': '🥩',
      'fish': '🐟', 'salmon': '🐟', 'tuna': '🐟',
      'egg': '🥚', 'eggs': '🥚',
      'bread': '🍞', 'cucumber': '🥒', 'chilli': '🌶️', 'capsicum': '🫑',
      'corn': '🌽', 'avocado': '🥑', 'olives': '🫒', 'garlic': '🧄', 'onion': '🧅',
      'potato': '🥔', 'ginger': '🫚', 'sweet potato': '🍠', 'grapes': '🍇',
      'watermelon': '🍉', 'lime': '🍋', 'pear': '🍐', 'orange': '🍊', 'oranges': '🍊',
      'blueberry': '🫐', 'lemon': '🍋', 'pears': '🍐',
      'apple': '🍎', 'banana': '🍌', 'orange': '🍊',
      'strawberry': '🍓', 'strawberries': '🍓',
      'carrot': '🥕', 'carrots': '🥕',
      'lettuce': '🥬', 'salad': '🥬', 'spinach': '🥬', 'kale': '🥬',
      'tomato': '🍅', 'coriander': '🌱', 'parsley': '🌱', 'kiwi': '🥝',
      'pasta': '🍝', 'rice': '🍚', 'pizza': '🍕', 'broccoli': '🥦',
      'ice cream': '🍨'
    };
    
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (name.includes(key)) return emoji;
    }
    
    // Fall back to category emoji
    return category === 'fridge' ? '🧊' : category === 'freezer' ? '❄️' : '📦';
  };
  
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [expired, setExpired] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [totalWasted, setTotalWasted] = useState(0);
  const [showConsumeModal, setShowConsumeModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showOpenPantryModal, setShowOpenPantryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditExpiredModal, setShowEditExpiredModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [consumePercentage, setConsumePercentage] = useState(100);
  const [consumeQuantity, setConsumeQuantity] = useState(1);
  const [openItemCategory, setOpenItemCategory] = useState('fridge');
  const [openItemDays, setOpenItemDays] = useState(7);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [addMethod, setAddMethod] = useState(null);
  const [dailyScans, setDailyScans] = useState(12);
  const [isPremium, setIsPremium] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [showSignUp, setShowSignUp] = useState(!localStorage.getItem('userName'));
  const [userTier, setUserTier] = useState('premium-trial');
  const [trialStartDate, setTrialStartDate] = useState(new Date());
  const [showTrialEndingModal, setShowTrialEndingModal] = useState(false);
  const [showPlanSelectionModal, setShowPlanSelectionModal] = useState(false);
  const canAddNewItem = () => {
    if (userTier === 'free') {
      return inventory.length < 50;
    }
    return true;
  };

  const handleAddItemClick = () => {
    if (!canAddNewItem()) {
      setShowPlanSelectionModal(true);
      return;
    }
    setShowAddItemModal(true);
  };
  
  const isAtOrOverLimit = () => {
    return userTier === 'free' && inventory.length >= 50;
  };
  
  const handleTrialEndPlanSelection = (planId) => {
    setUserTier(planId);
    setShowTrialEndingModal(false);
    
    if (planId === 'free') {
      console.log('User downgraded to FREE');
      if (inventory.length > 50) {
        alert(`You have ${inventory.length} items. You won't be able to add new items until you're under 50.`);
      }
    } else if (planId === 'premium-monthly') {
      console.log('User chose Premium Monthly - $2.99/month');
    } else if (planId === 'premium-annual') {
      console.log('User chose Premium Annual - $24.99/year');
    }
  };
  
  const getDaysRemaining = () => {
    if (!trialStartDate || userTier !== 'premium-trial') return 0;
    const now = new Date();
    const daysPassed = Math.floor((now - trialStartDate) / (1000 * 60 * 60 * 24));
    const remaining = Math.max(0, 30 - daysPassed);
    return remaining;
  };

  const daysRemaining = getDaysRemaining();

  const calculateUserStats = () => {
    const itemsTracked = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.cost || 0), 0);
    const wastedValue = inventory.filter(item => item.status === 'wasted').reduce((sum, item) => sum + (item.cost || 0), 0);
    const consumedValue = inventory.filter(item => item.status === 'consumed').reduce((sum, item) => sum + (item.cost || 0), 0);
    return { itemsTracked, totalValue, wastedValue, consumedValue };
  };
  
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'fridge',
    cost: '',
    expiryDate: getDefaultExpiryDate(7),
    quantity: 1
  });
  const [consumedItems, setConsumedItems] = useState([]);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [showSampleBanner, setShowSampleBanner] = useState(false);

// Load sample data on mount if user chose it during onboarding
  useEffect(() => {
    if (userTier === 'premium-trial' && daysRemaining === 0) {
      setShowTrialEndingModal(true);
    }
  }, [userTier, daysRemaining]);
  
  useEffect(() => {
  const useSampleData = localStorage.getItem('useSampleData') === 'true';
  const hasUserName = localStorage.getItem('userName');
  
  if (useSampleData && hasUserName) {
    setInventory(initialInventory);
    setExpired(expiredItems);
    setTotalWasted(8.48);
    setConsumedItems(sampleConsumedItems);
    setUsingSampleData(true);
    
    // Check if banner was dismissed
    const bannerDismissed = localStorage.getItem('sampleBannerDismissed') === 'true';
    setShowSampleBanner(!bannerDismissed);
  }
}, []);
  
  // Calculate total consumed value
  const totalConsumed = consumedItems.reduce((sum, item) => sum + item.consumedAmount, 0);

  // Calculate total spent (consumed + wasted)
  const totalSpent = totalConsumed + totalWasted;
  
  const atRiskItems = inventory.filter(item => item.daysUntilExpiry <= 3).sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  
  const handleSignUpComplete = (name, useSampleData) => {
  setUserName(name);
  setShowSignUp(false);
  
  if (useSampleData) {
    setInventory(initialInventory);
    setExpired(expiredItems);
    setTotalWasted(8.48);
    setConsumedItems(sampleConsumedItems);
    setUsingSampleData(true);
    setShowSampleBanner(true);
  } else {
    // Clear rewards data when starting fresh
    localStorage.removeItem('wasteWarrior_activeChallenge');
    localStorage.removeItem('wasteWarrior_challengeHistory');
  }
};
  
  const handleClearSampleData = () => {
  if (window.confirm('Clear all sample data and start fresh? This cannot be undone.')) {
    setInventory([]);
    setExpired([]);
    setTotalWasted(0);
    setConsumedItems([]);
    setUsingSampleData(false);
    setShowSampleBanner(false);
    localStorage.setItem('useSampleData', 'false');
    localStorage.removeItem('wasteWarrior_activeChallenge');
    localStorage.removeItem('wasteWarrior_challengeHistory');
  }
};

  const handleDismissBanner = () => {
    setShowSampleBanner(false);
    localStorage.setItem('sampleBannerDismissed', 'true');
  };
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
  setConsumeQuantity(1);
  setConsumePercentage(100);
  
  // Skip quantity modal if only 1 item
  if ((item.quantity || 1) > 1) {
    setShowQuantityModal(true);
  } else {
    setShowConsumeModal(true);
  }
};
  
  const confirmConsume = () => {
  // Calculate waste based on quantity and percentage
  const costPerUnit = selectedItem.cost / (selectedItem.quantity || 1);
  const wastedAmount = (costPerUnit * consumeQuantity * (100 - consumePercentage)) / 100;
  const consumedAmount = (costPerUnit * consumeQuantity * consumePercentage) / 100;
  setTotalWasted(totalWasted + wastedAmount);
  
  // Save consumption history
  const newConsumedItem = {
    id: Date.now(),
    name: selectedItem.name,
    emoji: selectedItem.emoji,
    consumedAmount: consumedAmount,
    wastedAmount: wastedAmount,
    totalCost: costPerUnit * consumeQuantity,
    consumedDate: new Date(),
    daysUntilExpiryAtConsumption: selectedItem.daysUntilExpiry,
    percentageConsumed: consumePercentage
  };
  setConsumedItems([...consumedItems, newConsumedItem]);
  
  // Update inventory - reduce quantity or remove item
  const remainingQuantity = (selectedItem.quantity || 1) - consumeQuantity;
  if (remainingQuantity <= 0) {
    setInventory(inventory.filter(item => item.id !== selectedItem.id));
  } else {
    setInventory(inventory.map(item => 
      item.id === selectedItem.id 
        ? { ...item, quantity: remainingQuantity }
        : item
    ));
  }
  
  setShowConsumeModal(false);
  setShowQuantityModal(false);
  setSelectedItem(null);
  setConsumePercentage(100);
  setConsumeQuantity(1);
};
  
  const proceedToPercentageModal = () => {
    setShowQuantityModal(false);
    setShowConsumeModal(true);
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
  
  const handleMarkExpiredAsWasted = (item) => {
  // Mark entire item as wasted (100% waste, 0% consumed)
  setTotalWasted(totalWasted + item.cost);
  
  // Save to consumed history as expired
  const expiredItem = {
    id: Date.now(),
    name: item.name,
    emoji: item.emoji,
    consumedAmount: 0,
    wastedAmount: item.cost,
    totalCost: item.cost,
    consumedDate: new Date(),
    daysUntilExpiryAtConsumption: -item.expiredDays, // Negative = days past expiry
    percentageConsumed: 0
  };
  setConsumedItems([...consumedItems, expiredItem]);
  
  setExpired(expired.filter(exp => exp.id !== item.id));
};
  
  const handleEditExpiredItem = (item) => {
    // For expired items, we'll add days to extend their life
    const itemWithExtensionDays = {
      ...item,
      extensionDays: 3 // Default: add 3 days
    };
    setSelectedItem(itemWithExtensionDays);
    setShowEditExpiredModal(true);
  };
  
  const saveExpiredItemEdit = () => {
    // Adding days always moves item back to active inventory
    const daysToAdd = selectedItem.extensionDays || 3;
    
    // Remove from expired list
    setExpired(expired.filter(item => item.id !== selectedItem.id));
    
    // Add back to inventory with new expiry date
    setInventory([...inventory, {
      id: selectedItem.id,
      name: selectedItem.name,
      emoji: selectedItem.emoji,
      category: selectedItem.category || 'fridge',
      cost: selectedItem.cost,
      daysUntilExpiry: daysToAdd,
      status: selectedItem.status || 'sealed',
      quantity: selectedItem.quantity || 1
    }]);
    
    setShowEditExpiredModal(false);
    setSelectedItem(null);
  };
  
  const handleAddNewItem = () => {
  const daysUntilExpiry = getDaysUntilExpiry(newItem.expiryDate);
  const autoEmoji = getEmojiForItem(newItem.name, newItem.category);
  
  const item = {
    id: Date.now(),
    name: newItem.name,
    emoji: autoEmoji,
    category: newItem.category,
    cost: parseFloat(newItem.cost) || 0,
    daysUntilExpiry: daysUntilExpiry,
    status: 'sealed',
    quantity: parseInt(newItem.quantity) || 1
    };
    setInventory([...inventory, item]);
    setAddMethod(null);
    setNewItem({ 
      name: '', 
      category: 'fridge', 
      cost: '', 
      expiryDate: getDefaultExpiryDate(7), 
      quantity: 1 
    });
  };  
  const handleScanBarcode = () => {
    const scannedItem = {
      name: 'Organic Milk',
      emoji: '🥛',
      category: 'fridge',
      cost: 4.99,
      daysUntilExpiry: 7,
      quantity: 1
    };
    setNewItem(scannedItem);
    setDailyScans(dailyScans + 1);
    alert('Barcode scanned! Product details loaded.');
  };

  const filteredInventory = (activeCategory === 'all' 
    ? inventory 
    : inventory.filter(item => item.category === activeCategory))
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry); // Sort by expiry: soonest first

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
              <div className="flex items-center gap-2">
                <div className="font-semibold text-base" style={{ color: colors.text }}>{item.name}</div>
                {(item.quantity && item.quantity > 1) && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: colors.primaryLight, color: colors.primary }}>
                    x{item.quantity}
                  </span>
                )}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>${item.cost.toFixed(2)}{item.quantity > 1 ? ` (${(item.cost / item.quantity).toFixed(2)}/unit)` : ''}</div>
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
      {isAtOrOverLimit() && (
        <OverLimitBanner
          itemCount={inventory.length}
          tierLimit={50}
          onUpgrade={() => {
            // Show upgrade modal or navigate to pricing
            setShowPlanSelectionModal(true);
          }}
        />
      )}
      <div className="pt-6 pb-4">
      <div className="px-4 mb-1">
        <h1 className="text-2xl font-bold" style={{ color: colors.text }}>Hello, {userName} 👋</h1>
      </div>
      <p className="text-sm mb-3 px-4" style={{ color: colors.textSecondary }}>Save food, save money</p>
      <div className="grid grid-cols-3 gap-3 mb-6 px-4">
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
          <div className="p-4 rounded-2xl" style={{ backgroundColor: '#E6FBF0' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
              <TrendingUp size={20} style={{ color: colors.fresh }} />
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: colors.fresh }}>Consumed</div>
            <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>${totalConsumed.toFixed(0)}</div>
            <div className="text-xs" style={{ color: colors.fresh }}>This week</div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 px-4" style={{ color: colors.text }}>Items Expiring Soon ({atRiskItems.length})</h2>
        {atRiskItems.length === 0 ? (
          <div className="text-center py-12 px-6 mx-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center" style={{ backgroundColor: colors.freshBg }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.fresh} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="text-xl font-bold mb-2" style={{ color: colors.text }}>All items are fresh!</div>
          <div className="text-base" style={{ color: colors.textSecondary }}>Great job managing your food.<br />Keep tracking to maintain this streak</div>
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
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEditExpiredItem(item)} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit2 size={18} style={{ color: colors.textLight }} />
                  </button>
                  <button onClick={() => handleMarkExpiredAsWasted(item)} className="p-2 rounded-lg hover:bg-red-100 transition-colors">
                    <Trash2 size={18} style={{ color: colors.textLight }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
   </div>
  );

  const InventoryScreen = () => (
    <div className="h-full flex flex-col" style={{ minHeight: 0 }}>
      {isAtOrOverLimit() && (
        <OverLimitBanner
          itemCount={inventory.length}
          tierLimit={50}
          onUpgrade={() => {
            // Show upgrade modal or navigate to pricing
            setShowPlanSelectionModal(true);
          }}
        />
      )}
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>Inventory</h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>{inventory.length} items tracked</p>
      </div>
      <div className="px-4 py-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textLight }} />
          <input type="text" placeholder="Search items..." className="w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm" style={{ borderColor: colors.border, backgroundColor: colors.bg, height: '44px' }} />
        </div>
      </div>
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {['all', 'fridge', 'freezer', 'pantry'].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className="px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all" style={{ backgroundColor: activeCategory === cat ? colors.primary : colors.bgGray, color: activeCategory === cat ? 'white' : colors.text }}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto py-3 pb-24" style={{ minHeight: 0, WebkitOverflowScrolling: 'touch' }}>
        {filteredInventory.length === 0 ? (
      <div className="text-center py-12 px-6 mx-4">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center" style={{ backgroundColor: colors.primaryLight }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <div className="text-xl font-bold mb-2" style={{ color: colors.text }}>No items yet</div>
        <div className="text-base" style={{ color: colors.textSecondary }}>
          Tap the <span style={{ color: colors.primary, fontWeight: '600' }}>+</span> button below to add<br />your first item and start tracking
        </div>
      </div>
    ) : (
          filteredInventory.map(item => <ItemCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );

  
  if (showSignUp) {
    return <SignUpScreen onComplete={handleSignUpComplete} />;
  }

  return (
    <>
    <style>{`
      /* Hide scrollbar for Chrome, Safari and Opera */
      *::-webkit-scrollbar {
        display: none;
      }
      
      /* Hide scrollbar for IE, Edge and Firefox */
      * {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
      
      /* Ensure proper bottom padding for iOS safe area */
      .bottom-nav-container {
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }
    `}</style>
      
    <div className="h-screen flex flex-col" style={{ backgroundColor: colors.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Trial Status Banner - Days 1-29 */}
      {userTier === 'premium-trial' && daysRemaining > 0 && (
        <TrialStatusBanner
          daysRemaining={daysRemaining}
          onChoosePlan={() => setShowPlanSelectionModal(true)}
        />
      )}
      {showSampleBanner && usingSampleData && (
        <div style={{
          backgroundColor: '#FFFBEB',
          borderBottom: `1px solid ${colors.warning}`,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <span style={{ fontSize: '18px' }}>📦</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: colors.warning }}>
                Viewing Sample Data
              </div>
              <div style={{ fontSize: '11px', color: colors.textSecondary }}>
                Explore the app with example items
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleClearSampleData}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: 'white',
                color: colors.warning,
                border: `1px solid ${colors.warning}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Clear & Start Fresh
            </button>
            <button
              onClick={handleDismissBanner}
              style={{
                padding: '4px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} style={{ color: colors.textSecondary }} />
            </button>
          </div>
        </div>
      )}
      {/* Main content area - screens handle their own bottom padding */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {activeScreen === 'dashboard' && <DashboardScreen />}
        {activeScreen === 'inventory' && <InventoryScreen />}
        {activeScreen === 'rewards' && (
        <RewardsScreenProd
          consumedItems={consumedItems}
          inventory={inventory}
          totalWasted={totalWasted}
          colors={colors}
        />
      )}
        {activeScreen === 'analytics' && (
        <AnalyticsScreen 
          inventory={inventory}
          consumedItems={consumedItems}
          totalWasted={totalWasted}
          totalConsumed={totalConsumed}
          totalSpent={totalSpent}
        />
      )}
      </div>
      
      {/* Fixed bottom navigation */}
      <div 
        className="bottom-nav-container"
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50
        }}
      >
        {/* FAB button positioned above nav */}
        <div 
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            top: 0,
            zIndex: 10
          }}
        >
          <button 
            onClick={handleAddItemClick} 
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
            style={{ 
              backgroundColor: colors.primary,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
            }}
          >
            <Plus size={28} strokeWidth={2.5} color="white" />
          </button>
        </div>
      
        {/* Navigation bar */}
        <div 
          className="border-t" 
          style={{ 
            borderColor: colors.border,
            backgroundColor: 'white'
          }}
        >
          <div className="flex items-center justify-around px-4 pt-2 pb-1" style={{ minHeight: '60px' }}>
            <button 
              onClick={() => setActiveScreen('dashboard')} 
              className="flex flex-col items-center gap-0.5 py-1 transition-all"
              style={{ minWidth: '60px', minHeight: '48px' }}
            >
              <Home 
                size={24} 
                strokeWidth={activeScreen === 'dashboard' ? 2.5 : 2} 
                style={{ color: activeScreen === 'dashboard' ? colors.primary : '#9CA3AF' }} 
              />
              <span 
                className="text-[10px] font-medium"
                style={{ 
                  color: activeScreen === 'dashboard' ? colors.primary : '#9CA3AF'
                }}
              >
                Home
              </span>
            </button>
      
            <button 
              onClick={() => setActiveScreen('inventory')} 
              className="flex flex-col items-center gap-0.5 py-1 transition-all"
              style={{ minWidth: '60px', minHeight: '48px' }}
            >
              <Package 
                size={24} 
                strokeWidth={activeScreen === 'inventory' ? 2.5 : 2} 
                style={{ color: activeScreen === 'inventory' ? colors.primary : '#9CA3AF' }} 
              />
              <span 
                className="text-[10px] font-medium"
                style={{ 
                  color: activeScreen === 'inventory' ? colors.primary : '#9CA3AF'
                }}
              >
                Inventory
              </span>
            </button>
      
            <div style={{ width: '32px' }} />
      
            <button 
              onClick={() => setActiveScreen('rewards')} 
              className="flex flex-col items-center gap-0.5 py-1 transition-all"
              style={{ minWidth: '60px', minHeight: '48px' }}
            >
              <Trophy 
                size={24} 
                strokeWidth={activeScreen === 'rewards' ? 2.5 : 2} 
                style={{ color: activeScreen === 'rewards' ? colors.primary : '#9CA3AF' }} 
              />
              <span 
                className="text-[10px] font-medium"
                style={{ 
                  color: activeScreen === 'rewards' ? colors.primary : '#9CA3AF'
                }}
              >
                Rewards
              </span>
            </button>
      
            <button 
              onClick={() => setActiveScreen('analytics')} 
              className="flex flex-col items-center gap-0.5 py-1 transition-all"
              style={{ minWidth: '60px', minHeight: '48px' }}
            >
              <BarChart3 
                size={24} 
                strokeWidth={activeScreen === 'analytics' ? 2.5 : 2} 
                style={{ color: activeScreen === 'analytics' ? colors.primary : '#9CA3AF' }} 
              />
              <span 
                className="text-[10px] font-medium"
                style={{ 
                  color: activeScreen === 'analytics' ? colors.primary : '#9CA3AF'
                }}
              >
                Stats
              </span>
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

      {showQuantityModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{selectedItem.emoji}</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>How many did you use?</h3>
              <p className="text-base" style={{ color: colors.textSecondary }}>
                {selectedItem.quantity > 1 && (
                <>
                You have {selectedItem.quantity} units of {selectedItem.name}
                </>
                )}
              </p>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => setConsumeQuantity(Math.max(1, consumeQuantity - 1))}
                  disabled={consumeQuantity <= 1}
                  className="w-[52px] h-[52px] rounded-xl font-bold text-2xl flex items-center justify-center transition-all"
                  style={{ 
                    backgroundColor: colors.bgGray,
                    color: colors.text,
                    opacity: consumeQuantity <= 1 ? 0.4 : 1,
                    cursor: consumeQuantity <= 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  −
                </button>
                <div 
                  className="min-w-[80px] px-6 h-14 rounded-xl flex items-center justify-center font-bold text-3xl"
                  style={{ 
                    backgroundColor: colors.primaryLight,
                    color: colors.primary
                  }}
                >
                  {consumeQuantity}
                </div>
                <button
                  onClick={() => setConsumeQuantity(Math.min(selectedItem.quantity || 1, consumeQuantity + 1))}
                  disabled={consumeQuantity >= (selectedItem.quantity || 1)}
                  className="w-[52px] h-[52px] rounded-xl font-bold text-2xl flex items-center justify-center transition-all"
                  style={{ 
                    backgroundColor: colors.bgGray,
                    color: colors.text,
                    opacity: consumeQuantity >= (selectedItem.quantity || 1) ? 0.4 : 1,
                    cursor: consumeQuantity >= (selectedItem.quantity || 1) ? 'not-allowed' : 'pointer'
                  }}
                >
                  +
                </button>
              </div>
              <p className="text-sm text-center font-medium mb-4" style={{ color: colors.textSecondary }}>
                {(selectedItem.quantity || 1) - consumeQuantity} {((selectedItem.quantity || 1) - consumeQuantity) === 1 ? 'unit' : 'units'} will remain
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => { 
                  setShowQuantityModal(false); 
                  setSelectedItem(null); 
                  setConsumeQuantity(1);
                  setConsumePercentage(100);
                }} 
                className="flex-1 py-3.5 rounded-xl font-semibold text-base" 
                style={{ backgroundColor: colors.bgGray, color: colors.text, border: 'none' }}
              >
                Cancel
              </button>
              <button 
                onClick={proceedToPercentageModal} 
                className="flex-1 py-3.5 rounded-xl font-semibold text-white text-base" 
                style={{ backgroundColor: colors.primary, border: 'none' }}
              >
                Next
              </button>
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
              <p className="text-base" style={{ color: colors.textSecondary }}>
                {consumeQuantity} {consumeQuantity === 1 ? 'unit' : 'units'} of {selectedItem.name}
              </p>
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
              <button onClick={() => { setShowConsumeModal(false); setShowQuantityModal(true); }} className="flex-1 py-3.5 rounded-xl font-semibold text-base" style={{ backgroundColor: colors.bgGray, color: colors.text, border: 'none' }}>Back</button>
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
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Quantity</label>
                <input type="number" min="1" value={selectedItem.quantity || 1} onChange={(e) => setSelectedItem({ ...selectedItem, quantity: parseInt(e.target.value) || 1 })} className="w-full px-4 py-3 rounded-xl border-2" style={{ borderColor: colors.border }} />
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

      {showEditExpiredModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{selectedItem.emoji}</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Extend expiry date?</h3>
              <p className="text-base" style={{ color: colors.textSecondary }}>
                Add more days for {selectedItem.name}
              </p>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => setSelectedItem({ ...selectedItem, extensionDays: Math.max(1, (selectedItem.extensionDays || 3) - 1) })}
                  className="w-[52px] h-[52px] rounded-xl font-bold text-2xl flex items-center justify-center transition-all"
                  style={{ 
                    backgroundColor: colors.bgGray,
                    color: colors.text,
                    cursor: 'pointer'
                  }}
                >
                  −
                </button>
                <div 
                  className="min-w-[80px] px-6 h-14 rounded-xl flex items-center justify-center font-bold text-3xl"
                  style={{ 
                    backgroundColor: colors.primaryLight,
                    color: colors.primary
                  }}
                >
                  {selectedItem.extensionDays || 3}
                </div>
                <button
                  onClick={() => setSelectedItem({ ...selectedItem, extensionDays: (selectedItem.extensionDays || 3) + 1 })}
                  className="w-[52px] h-[52px] rounded-xl font-bold text-2xl flex items-center justify-center transition-all"
                  style={{ 
                    backgroundColor: colors.bgGray,
                    color: colors.text,
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
              <p className="text-sm text-center font-medium mb-4" style={{ color: colors.textSecondary }}>
                New expiry: {new Date(Date.now() + (selectedItem.extensionDays || 3) * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowEditExpiredModal(false); setSelectedItem(null); }} className="flex-1 py-3.5 rounded-xl font-semibold text-base" style={{ backgroundColor: colors.bgGray, color: colors.text }}>Cancel</button>
              <button onClick={saveExpiredItemEdit} className="flex-1 py-3.5 rounded-xl font-semibold text-white text-base" style={{ backgroundColor: colors.primary }}>Confirm</button>
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
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>Add Item</h2>
            </div>
          </div>
          
      <div className="flex-1 overflow-y-auto p-4">
  <div className="space-y-5 max-w-md mx-auto">
    
    {/* Item Name & Cost - Side by Side */}
    <div>
      <label className="block text-base font-semibold mb-2" style={{ color: colors.text }}>
        Item Details
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="Item name"
          className="flex-1 px-4 py-4 rounded-xl border-2 text-base"
          style={{ borderColor: colors.border, minHeight: '56px' }}
        />
        <input
          type="text"
          inputMode="decimal"
          value={newItem.cost}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, '');
            setNewItem({ ...newItem, cost: value });
          }}
          placeholder="$0.00"
          className="px-4 py-4 rounded-xl border-2 text-base text-center"
          style={{ borderColor: colors.border, minHeight: '56px', width: '120px' }}
        />
      </div>
    </div>

    {/* Quantity */}
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
        Quantity
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setNewItem({ ...newItem, quantity: Math.max(1, (parseInt(newItem.quantity) || 1) - 1) })}
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor: colors.bgGray, color: colors.text, border: `1px solid ${colors.border}` }}
        >
          −
        </button>
        <div
          className="flex-1 px-4 py-3 rounded-xl text-lg text-center font-semibold"
          style={{ 
            backgroundColor: colors.bgGray, 
            color: colors.text,
            border: `1px solid ${colors.border}`,
            minHeight: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {newItem.quantity}
        </div>
        <button
          type="button"
          onClick={() => setNewItem({ ...newItem, quantity: (parseInt(newItem.quantity) || 1) + 1 })}
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor: colors.bgGray, color: colors.text, border: `1px solid ${colors.border}` }}
        >
          +
        </button>
      </div>
    </div>

    {/* Category */}
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
        Category
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={newItem.category}
          onChange={(e) => {
            const cat = e.target.value;
            const defaultDays = cat === 'fridge' ? 7 : cat === 'freezer' ? 90 : 365;
            setNewItem({ ...newItem, category: cat, expiryDate: getDefaultExpiryDate(defaultDays) });
          }}
          className="w-full px-4 py-3 rounded-xl text-base"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.bgGray,
            border: `1px solid ${colors.border}`,
            minHeight: '56px',
            appearance: 'none',
            paddingRight: '48px'
          }}
        >
          <option value="fridge">🧊 Fridge (7 days)</option>
          <option value="freezer">❄️ Freezer (90 days)</option>
          <option value="pantry">📦 Pantry (1 year)</option>
        </select>
        <div style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>

    {/* Expiry Date */}
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
        Expiry Date
      </label>
      <input
        type="date"
        value={newItem.expiryDate}
        onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
        className="w-full px-4 py-3 rounded-xl text-base"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.bgGray,
          border: `1px solid ${colors.border}`,
          minHeight: '56px'
        }}
      />
      <p className="text-xs mt-1" style={{ color: colors.textLight }}>
        {(() => {
          const daysLeft = getDaysUntilExpiry(newItem.expiryDate);
          if (daysLeft > 0) return `✓ ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} from now`;
          if (daysLeft === 0) return '⚠️ Expires today';
          return `⚠️ Expired ${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? 'day' : 'days'} ago`;
        })()}
      </p>
    </div>

  </div>
</div>

        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={handleAddNewItem}
            disabled={!newItem.name || !newItem.cost}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-base"
            style={{
              backgroundColor: (!newItem.name || !newItem.cost) ? colors.textLight : colors.fresh,
              opacity: (!newItem.name || !newItem.cost) ? 0.5 : 1
            }}
          >
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
      
      {/* ADD MODALS HERE - OUTSIDE all conditionals ⬇️ */}
      {showTrialEndingModal && (
        <TrialEndingModal
          itemsTracked={calculateUserStats().itemsTracked}
          totalValue={calculateUserStats().totalValue}
          wastedValue={calculateUserStats().wastedValue}
          consumedValue={calculateUserStats().consumedValue}
          onSelectPlan={handleTrialEndPlanSelection}
        />
      )}
      
      {showPlanSelectionModal && (
        <PlanSelectionModal
          practiceItemsCount={0}
          onSelectPlan={(planId) => {
            console.log('User selected:', planId);
            setShowPlanSelectionModal(false);
          }}
        />
      )}
      
    </div>
  </>
);
}
