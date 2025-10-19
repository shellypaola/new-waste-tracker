# Expiry & Alert System - Implementation & Architecture

## Module Overview
The Expiry & Alert System provides visual status indicators and timely notifications to help users consume food before it expires. It monitors inventory status, triggers daily alerts, and surfaces critical items through an intelligent prioritization system.

**Core Purpose:** Notify users about expiring items through visual cues and daily alerts, enabling them to take action before food goes to waste.

---

## Core Features

### 1. **Visual Color Coding**
- Green (fresh items - 3+ days)
- Yellow (warning - expires in 3 days)
- Red (critical - expires in 24 hours)
- Grey (expired items)

### 2. **Push Notifications**
- Daily alert at 7:00 AM for expiring items
- Weekly summary on Sunday at 9:00 AM
- User-customizable notification preferences

### 3. **Items at Risk Dashboard**
- Risk-based prioritization of expiring items
- Quick action buttons (Mark as Used, Edit)
- Real-time status indicators

### 4. **Consumption Tracking**
- Percentage-based usage tracking (0-100%)
- Automatic waste calculation
- Event-driven dashboard updates

---

## Data Architecture

### Expiry Status Model
```javascript
const ExpiryStatus = {
  status: 'expired' | 'critical' | 'warning' | 'fresh',
  severity: 'critical' | 'high' | 'medium' | 'low',
  priority: 1 | 2 | 3 | 4,
  visualTreatment: 'EXPIRED_STYLE' | 'RED_BACKGROUND' | 'YELLOW_BACKGROUND' | 'NORMAL_STYLE',
  timeDisplay: string // "2d remaining", "5h remaining", "Expired"
};
```

### Risk Score Model
```javascript
const ItemRiskScore = {
  itemId: string,
  riskScore: number,          // Calculated priority value
  expiryStatus: ExpiryStatus,
  item: InventoryItem
};
```

### Notification Preferences
```javascript
const NotificationPreferences = {
  dailyAlert: {
    enabled: true,
    time: '07:00',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    }
  },
  weeklySummary: {
    enabled: true,
    day: 'sunday',
    time: '09:00'
  },
  onlyAlertWhenNeeded: true,
  push: true,
  sound: true,
  vibration: true
};
```

---

## Core Component Architecture

### 1. Expiry Status Engine

```javascript
const ExpiryStatusEngine = {
  evaluateStatus: (item) => {
    const now = new Date();
    const expiry = new Date(item.expiryDate);
    const hoursUntilExpiry = (expiry - now) / (1000 * 60 * 60);
    
    // Expired items
    if (hoursUntilExpiry < 0) {
      return {
        status: 'expired',
        severity: 'critical',
        priority: 4,
        visualTreatment: 'EXPIRED_STYLE',
        timeDisplay: 'Expired'
      };
    }
    
    // Critical: 24 hours or less (RED)
    if (hoursUntilExpiry <= 24) {
      return {
        status: 'critical',
        severity: 'high',
        priority: 3,
        visualTreatment: 'RED_BACKGROUND',
        timeDisplay: `${Math.floor(hoursUntilExpiry)}h remaining`
      };
    }
    
    // Warning: 72 hours or less (YELLOW)
    if (hoursUntilExpiry <= 72) {
      return {
        status: 'warning',
        severity: 'medium',
        priority: 2,
        visualTreatment: 'YELLOW_BACKGROUND',
        timeDisplay: `${Math.floor(hoursUntilExpiry / 24)}d remaining`
      };
    }
    
    // Fresh: More than 3 days (GREEN/NORMAL)
    return {
      status: 'fresh',
      severity: 'low',
      priority: 1,
      visualTreatment: 'NORMAL_STYLE',
      timeDisplay: `${Math.floor(hoursUntilExpiry / 24)}d remaining`
    };
  },
  
  // Batch evaluate multiple items
  evaluateAll: (items) => {
    return items.map(item => ({
      ...item,
      expiryStatus: this.evaluateStatus(item)
    }));
  }
};
```

### 2. Visual Treatment System

```javascript
const VisualTreatments = {
  EXPIRED_STYLE: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF5350',
    textColor: '#B71C1C',
    opacity: 0.85,
    badge: {
      text: 'EXPIRED',
      color: '#FFFFFF',
      bgColor: '#D32F2F'
    },
    icon: '⚠️'
  },
  
  RED_BACKGROUND: {
    backgroundColor: '#FFCDD2',
    borderColor: '#EF5350',
    textColor: '#1A1A1A',
    badge: {
      text: 'EXPIRES TODAY',
      color: '#FFFFFF',
      bgColor: '#F44336'
    },
    icon: '🔴'
  },
  
  YELLOW_BACKGROUND: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FBC02D',
    textColor: '#1A1A1A',
    badge: {
      text: 'EXPIRES SOON',
      color: '#1A1A1A',
      bgColor: '#FFEB3B'
    },
    icon: '🟡'
  },
  
  NORMAL_STYLE: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    textColor: '#1A1A1A',
    badge: null,
    icon: '🟢'
  }
};

// UI Component
const ExpiryVisualIndicator = ({ item }) => {
  const status = ExpiryStatusEngine.evaluateStatus(item);
  const treatment = VisualTreatments[status.visualTreatment];
  
  return (
    <div 
      className={`item-card ${status.status}`}
      style={{
        backgroundColor: treatment.backgroundColor,
        borderLeft: `4px solid ${treatment.borderColor}`,
        color: treatment.textColor,
        opacity: treatment.opacity || 1
      }}
    >
      <div className="status-indicator">
        <span className="icon">{treatment.icon}</span>
        {treatment.badge && (
          <span 
            className="badge"
            style={{
              backgroundColor: treatment.badge.bgColor,
              color: treatment.badge.color
            }}
          >
            {treatment.badge.text}
          </span>
        )}
      </div>
      
      <div className="item-details">
        <h3>{item.name}</h3>
        <p className="time-remaining">{status.timeDisplay}</p>
      </div>
    </div>
  );
};
```

### 3. Risk Prioritization Engine

**Purpose:** Determines the ORDER items appear in "Items at Risk" list. Higher risk score = appears first.

```javascript
const RiskPrioritizationEngine = {
  calculateRiskScore: (item) => {
    const status = ExpiryStatusEngine.evaluateStatus(item);
    let riskScore = 0;
    
    // Base score from expiry status (time urgency)
    const statusScores = {
      expired: 1000,    // Already expired - highest priority
      critical: 800,    // Expires today
      warning: 400,     // Expires in 3 days
      fresh: 0          // Not at risk
    };
    riskScore += statusScores[status.status];
    
    // Value multiplier (higher cost = higher priority to save)
    riskScore += item.cost * 10;
    
    // Quantity factor (more items = more potential waste)
    riskScore += item.quantity * 50;
    
    // Category urgency (fresh items are more urgent)
    const categoryMultipliers = {
      fridge: 1.5,   // More urgent (perishable)
      freezer: 0.8,  // Less urgent (preserved)
      pantry: 1.0    // Medium urgency
    };
    riskScore *= categoryMultipliers[item.category];
    
    // Opened items are higher risk
    if (item.status === 'opened') {
      riskScore *= 1.3;
    }
    
    return Math.floor(riskScore);
  },
  
  prioritizeItems: (items) => {
    return items
      .map(item => ({
        ...item,
        riskScore: this.calculateRiskScore(item),
        expiryStatus: ExpiryStatusEngine.evaluateStatus(item)
      }))
      .filter(item => item.expiryStatus.status !== 'fresh')
      .sort((a, b) => b.riskScore - a.riskScore); // Highest risk first
  }
};
```

**Example Risk Scores:**
- Steak ($15) expires today → Score: ~950 (appears first)
- Milk ($4.50) expires today → Score: ~845 (appears second)
- Yogurt ($2) expires today → Score: ~820 (appears third)

---

## Push Notification System

### Daily Notification (7:00 AM)

```javascript
const DailyNotificationSystem = {
  scheduleDailyAlert: () => {
    scheduleRecurringNotification({
      id: 'daily_expiry_alert',
      time: '07:00',
      frequency: 'daily',
      generator: () => this.generateDailyNotification()
    });
  },
  
  generateDailyNotification: () => {
    const items = getInventoryItems();
    const criticalItems = items.filter(item => {
      const status = ExpiryStatusEngine.evaluateStatus(item);
      return status.status === 'critical'; // Expires within 24 hours
    });
    
    const warningItems = items.filter(item => {
      const status = ExpiryStatusEngine.evaluateStatus(item);
      return status.status === 'warning'; // Expires within 3 days
    });
    
    // Only notify if there are items at risk
    if (criticalItems.length === 0 && warningItems.length === 0) {
      return null; // No notification sent
    }
    
    // Build notification based on what's expiring
    if (criticalItems.length > 0) {
      const totalValue = criticalItems.reduce((sum, item) => sum + item.cost, 0);
      const topItems = criticalItems.slice(0, 3).map(i => i.name).join(', ');
      
      return {
        title: `🔴 ${criticalItems.length} item${criticalItems.length > 1 ? 's' : ''} expire today!`,
        body: `${topItems}${criticalItems.length > 3 ? '...' : ''} ($${totalValue.toFixed(2)})`,
        data: {
          type: 'DAILY_ALERT',
          criticalCount: criticalItems.length,
          warningCount: warningItems.length
        },
        actions: [
          { action: 'view_dashboard', title: 'View Items' },
          { action: 'dismiss', title: 'Dismiss' }
        ],
        priority: 'high'
      };
    } else {
      // Only warning items
      return {
        title: `🟡 ${warningItems.length} item${warningItems.length > 1 ? 's' : ''} expire soon`,
        body: `Expiring in the next 3 days`,
        data: {
          type: 'DAILY_ALERT',
          criticalCount: 0,
          warningCount: warningItems.length
        },
        actions: [
          { action: 'view_dashboard', title: 'View Items' }
        ],
        priority: 'medium'
      };
    }
  }
};
```

### Weekly Summary (Sunday 9:00 AM)

```javascript
const WeeklySummarySystem = {
  scheduleWeeklySummary: () => {
    scheduleRecurringNotification({
      id: 'weekly_summary',
      day: 'sunday',
      time: '09:00',
      frequency: 'weekly',
      generator: () => this.generateWeeklySummary()
    });
  },
  
  generateWeeklySummary: () => {
    const weekStart = getWeekStart();
    const weekEnd = new Date();
    
    const consumed = getItemsConsumedInRange(weekStart, weekEnd);
    const wasted = getItemsWastedInRange(weekStart, weekEnd);
    
    const consumedValue = consumed.reduce((sum, item) => 
      sum + (item.cost * item.percentageUsed / 100), 0
    );
    const wastedValue = wasted.reduce((sum, item) => 
      sum + (item.cost * (1 - item.percentageUsed / 100)), 0
    );
    
    const totalValue = consumedValue + wastedValue;
    const wasteRate = totalValue > 0 ? (wastedValue / totalValue * 100) : 0;
    
    return {
      title: `📊 Weekly Summary`,
      body: `Saved: $${consumedValue.toFixed(2)} | Wasted: $${wastedValue.toFixed(2)} | Waste rate: ${wasteRate.toFixed(1)}%`,
      data: {
        type: 'WEEKLY_SUMMARY',
        consumed: consumed.length,
        wasted: wasted.length,
        consumedValue,
        wastedValue,
        wasteRate
      },
      actions: [
        { action: 'view_analytics', title: 'View Details' }
      ]
    };
  }
};
```

### Notification Action Handler

```javascript
const NotificationActionHandler = {
  handleAction: async (action, notificationData) => {
    switch (action) {
      case 'view_dashboard':
        navigateToDashboard();
        break;
        
      case 'view_analytics':
        navigateToAnalytics();
        break;
        
      case 'dismiss':
        dismissNotification(notificationData.id);
        break;
    }
  }
};
```

---

## Items at Risk Dashboard

### Dashboard Component

```javascript
const ItemsAtRiskDashboard = () => {
  const [atRiskItems, setAtRiskItems] = useState([]);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // Initial load
    updateDashboard();
    
    // Listen to inventory events for updates
    InventoryEventEmitter.on('item_added', updateDashboard);
    InventoryEventEmitter.on('item_consumed', updateDashboard);
    InventoryEventEmitter.on('item_updated', updateDashboard);
    InventoryEventEmitter.on('item_expired', updateDashboard);
    
    return () => {
      InventoryEventEmitter.off('item_added', updateDashboard);
      InventoryEventEmitter.off('item_consumed', updateDashboard);
      InventoryEventEmitter.off('item_updated', updateDashboard);
      InventoryEventEmitter.off('item_expired', updateDashboard);
    };
  }, []);
  
  const updateDashboard = () => {
    const allItems = getInventoryItems();
    const prioritized = RiskPrioritizationEngine.prioritizeItems(allItems);
    setAtRiskItems(prioritized);
  };
  
  const filteredItems = filter === 'all' 
    ? atRiskItems 
    : atRiskItems.filter(item => item.expiryStatus.status === filter);
  
  return (
    <div className="items-at-risk-dashboard">
      <header>
        <h2>Items at Risk</h2>
        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({atRiskItems.length})
          </button>
          <button 
            className={filter === 'critical' ? 'active' : ''}
            onClick={() => setFilter('critical')}
          >
            🔴 Critical ({atRiskItems.filter(i => i.expiryStatus.status === 'critical').length})
          </button>
          <button 
            className={filter === 'warning' ? 'active' : ''}
            onClick={() => setFilter('warning')}
          >
            🟡 Soon ({atRiskItems.filter(i => i.expiryStatus.status === 'warning').length})
          </button>
        </div>
      </header>
      
      <div className="risk-summary">
        <RiskSummaryCards items={atRiskItems} />
      </div>
      
      <div className="risk-items-list">
        {filteredItems.length === 0 ? (
          <EmptyState message="No items at risk! 🎉" />
        ) : (
          filteredItems.map(item => (
            <PrioritizedItemCard 
              key={item.id} 
              item={item}
            />
          ))
        )}
      </div>
    </div>
  );
};
```

### Event-Driven Updates

```javascript
const DashboardUpdateSystem = {
  // Initialize event listeners
  initializeListeners: () => {
    InventoryEventEmitter.on('item_added', () => {
      updateDashboard();
    });
    
    InventoryEventEmitter.on('item_consumed', (item) => {
      updateDashboard();
      updateKPIs({
        consumedValue: item.cost * item.percentageUsed / 100,
        wastedValue: item.cost * (1 - item.percentageUsed / 100)
      });
    });
    
    InventoryEventEmitter.on('item_updated', () => {
      updateDashboard();
    });
    
    InventoryEventEmitter.on('item_expired', (item) => {
      updateDashboard();
      moveToRecentlyExpired(item);
    });
  },
  
  // Check for expired items on app open
  checkOnAppOpen: () => {
    const items = getInventoryItems();
    
    items.forEach(item => {
      const status = ExpiryStatusEngine.evaluateStatus(item);
      if (status.status === 'expired' && !item.isInRecentlyExpired) {
        InventoryEventEmitter.emit('item_expired', item);
      }
    });
    
    updateDashboard();
  }
};
```

---

## Consumption Tracking

### Quick Action Menu

```javascript
const QuickActionMenu = ({ item }) => {
  const [showConsumptionDialog, setShowConsumptionDialog] = useState(false);
  
  return (
    <>
      <div className="quick-actions">
        <button
          onClick={() => setShowConsumptionDialog(true)}
          className="action-btn primary"
        >
          <span className="icon">✓</span>
          <span>Mark as Used</span>
        </button>
        
        <button
          onClick={() => openEditDialog(item)}
          className="action-btn"
        >
          <span className="icon">✏️</span>
          <span>Edit</span>
        </button>
      </div>
      
      {showConsumptionDialog && (
        <ConsumptionDialog 
          item={item}
          onClose={() => setShowConsumptionDialog(false)}
        />
      )}
    </>
  );
};
```

### Consumption Dialog with Percentage

```javascript
const ConsumptionDialog = ({ item, onClose }) => {
  const [percentageUsed, setPercentageUsed] = useState(100);
  
  const consumedValue = item.cost * (percentageUsed / 100);
  const wastedValue = item.cost * (1 - percentageUsed / 100);
  
  const handleMarkAsUsed = () => {
    // Update item with consumption data
    markItemAsConsumed({
      itemId: item.id,
      percentageUsed: percentageUsed,
      consumedValue: consumedValue,
      wasteValue: wastedValue
    });
    
    // This triggers 'item_consumed' event which updates dashboard and KPIs
    onClose();
  };
  
  return (
    <Dialog title={`How much of ${item.name} did you use?`}>
      <div className="percentage-selector">
        <div className="percentage-options">
          {[0, 25, 50, 75, 100].map(pct => (
            <button
              key={pct}
              className={percentageUsed === pct ? 'active' : ''}
              onClick={() => setPercentageUsed(pct)}
            >
              {pct}%
            </button>
          ))}
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={percentageUsed}
          onChange={(e) => setPercentageUsed(Number(e.target.value))}
        />
        
        <div className="percentage-display">
          <h3>{percentageUsed}%</h3>
          {percentageUsed === 0 && (
            <p className="waste-warning">⚠️ All wasted</p>
          )}
          {percentageUsed === 100 && (
            <p className="success">✅ Fully consumed!</p>
          )}
        </div>
      </div>
      
      <div className="consumption-summary">
        <div className="consumed">
          <span>Consumed:</span>
          <strong className="green">${consumedValue.toFixed(2)}</strong>
        </div>
        <div className="wasted">
          <span>Wasted:</span>
          <strong className="red">${wastedValue.toFixed(2)}</strong>
        </div>
      </div>
      
      <div className="actions">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleMarkAsUsed} className="primary">
          Confirm
        </button>
      </div>
    </Dialog>
  );
};
```

---

## User Preferences

### Notification Settings Component

```javascript
const NotificationSettings = () => {
  const [preferences, setPreferences] = useState(loadPreferences());
  
  const updatePreference = (path, value) => {
    const updated = { ...preferences };
    setNestedProperty(updated, path, value);
    setPreferences(updated);
    savePreferences(updated);
  };
  
  return (
    <div className="notification-settings">
      <section>
        <h3>Daily Alert</h3>
        <Toggle
          label="Enable Daily Expiry Alert"
          checked={preferences.dailyAlert.enabled}
          onChange={(val) => updatePreference('dailyAlert.enabled', val)}
        />
        
        <TimePicker
          label="Alert Time"
          value={preferences.dailyAlert.time}
          onChange={(val) => updatePreference('dailyAlert.time', val)}
          disabled={!preferences.dailyAlert.enabled}
        />
        
        <Toggle
          label="Quiet Hours"
          checked={preferences.dailyAlert.quietHours.enabled}
          onChange={(val) => updatePreference('dailyAlert.quietHours.enabled', val)}
        />
        
        {preferences.dailyAlert.quietHours.enabled && (
          <div className="quiet-hours-picker">
            <TimePicker
              label="Start"
              value={preferences.dailyAlert.quietHours.start}
              onChange={(val) => updatePreference('dailyAlert.quietHours.start', val)}
            />
            <TimePicker
              label="End"
              value={preferences.dailyAlert.quietHours.end}
              onChange={(val) => updatePreference('dailyAlert.quietHours.end', val)}
            />
          </div>
        )}
      </section>
      
      <section>
        <h3>Weekly Summary</h3>
        <Toggle
          label="Enable Weekly Summary"
          checked={preferences.weeklySummary.enabled}
          onChange={(val) => updatePreference('weeklySummary.enabled', val)}
        />
        
        <DayPicker
          label="Summary Day"
          value={preferences.weeklySummary.day}
          onChange={(val) => updatePreference('weeklySummary.day', val)}
          disabled={!preferences.weeklySummary.enabled}
        />
        
        <TimePicker
          label="Summary Time"
          value={preferences.weeklySummary.time}
          onChange={(val) => updatePreference('weeklySummary.time', val)}
          disabled={!preferences.weeklySummary.enabled}
        />
      </section>
      
      <section>
        <h3>Notification Options</h3>
        <Toggle
          label="Only alert when items are at risk"
          checked={preferences.onlyAlertWhenNeeded}
          onChange={(val) => updatePreference('onlyAlertWhenNeeded', val)}
          description="Don't send notifications when all items are fresh"
        />
        
        <Toggle
          label="Sound"
          checked={preferences.sound}
          onChange={(val) => updatePreference('sound', val)}
        />
        
        <Toggle
          label="Vibration"
          checked={preferences.vibration}
          onChange={(val) => updatePreference('vibration', val)}
        />
      </section>
    </div>
  );
};
```

---

## Integration Architecture

### Module Integration Interface

```javascript
const ExpirySystemIntegration = {
  // Initialize the system
  initialize: () => {
    DashboardUpdateSystem.initializeListeners();
    DailyNotificationSystem.scheduleDailyAlert();
    WeeklySummarySystem.scheduleWeeklySummary();
  },
  
  // Emit events for other modules
  emitExpiryEvent: (eventType, data) => {
    switch (eventType) {
      case 'ITEM_CONSUMED':
        EventBus.emit('expiry:item_consumed', {
          itemId: data.itemId,
          percentageUsed: data.percentageUsed,
          consumedValue: data.consumedValue,
          wasteValue: data.wasteValue,
          timestamp: new Date()
        });
        break;
        
      case 'ITEM_WASTED':
        EventBus.emit('expiry:item_wasted', {
          itemId: data.itemId,
          wasteValue: data.wasteValue,
          timestamp: new Date()
        });
        break;
        
      case 'ZERO_WASTE_DAY':
        EventBus.emit('expiry:zero_waste_day', {
          date: data.date,
          itemsConsumed: data.itemsConsumed
        });
        break;
    }
  },
  
  // Provide data to other modules
  getExpiryData: () => ({
    itemsAtRisk: RiskPrioritizationEngine.prioritizeItems(getInventoryItems()),
    criticalItems: getCriticalItems(),
    warningItems: getWarningItems(),
    weeklyStats: WeeklySummarySystem.generateWeeklySummary()
  }),
  
  // Check on app open
  onAppOpen: () => {
    DashboardUpdateSystem.checkOnAppOpen();
  }
};
```

### Core Inventory Integration

```javascript
const CoreInventoryIntegration = {
  // Listen to Core Inventory events
  subscribeToInventoryEvents: () => {
    InventoryEventEmitter.on('item_added', (item) => {
      // No immediate notification - wait for daily alert
      updateDashboard();
    });
    
    InventoryEventEmitter.on('item_updated', (item) => {
      updateDashboard();
    });
    
    InventoryEventEmitter.on('item_consumed', (item) => {
      updateDashboard();
      ExpirySystemIntegration.emitExpiryEvent('ITEM_CONSUMED', item);
      
      // Check for zero waste day achievement
      checkZeroWasteDay();
    });
    
    InventoryEventEmitter.on('item_expired', (item) => {
      moveToRecentlyExpired(item);
      updateDashboard();
    });
  }
};
```

---

## Performance Optimizations

### Status Calculation Caching

```javascript
const PerformanceOptimizations = {
  // Cache expiry status calculations
  statusCache: new Map(),
  
  getCachedStatus: (item) => {
    const cacheKey = `${item.id}_${item.expiryDate}`;
    
    if (this.statusCache.has(cacheKey)) {
      const cached = this.statusCache.get(cacheKey);
      // Cache valid for 1 minute
      if (Date.now() - cached.timestamp < 60000) {
        return cached.status;
      }
    }
    
    const status = ExpiryStatusEngine.evaluateStatus(item);
    this.statusCache.set(cacheKey, {
      status,
      timestamp: Date.now()
    });
    
    return status;
  },
  
  // Clear cache when items change
  invalidateCache: (itemId) => {
    for (const [key, value] of this.statusCache.entries()) {
      if (key.startsWith(itemId)) {
        this.statusCache.delete(key);
      }
    }
  }
};
```

### Memoized Components

```javascript
const MemoizedItemCard = React.memo(({ item }) => {
  const status = ExpiryStatusEngine.evaluateStatus(item);
  const treatment = VisualTreatments[status.visualTreatment];
  
  return <ExpiryVisualIndicator item={item} />;
}, (prevProps, nextProps) => {
  // Only re-render if item data changed
  return prevProps.item.id === nextProps.item.id &&
         prevProps.item.expiryDate === nextProps.item.expiryDate &&
         prevProps.item.status === nextProps.item.status;
});
```

---

## Implementation Phases

### Phase 1: MVP - Visual & Dashboard (Weeks 1-2)
**Core Expiry Features**
- ✅ Expiry status calculation engine
- ✅ Visual color coding (Red/Yellow/Green)
- ✅ Basic "Items at Risk" dashboard
- ✅ Risk prioritization algorithm
- ✅ Consumption dialog with percentage tracking

**Deliverables:**
- Items show correct colors based on expiry
- "Items at Risk" section displays on dashboard
- Items sorted by risk score
- Mark as used with percentage selection (0-100%)
- Waste/consumption values calculated correctly

### Phase 2: Notifications (Weeks 3-4)
**Push Notification System**
- ✅ Daily notification at 7:00 AM
- ✅ Show count and value of expiring items
- ✅ Tap to open dashboard
- ✅ Notification action handlers
- ✅ User preferences UI
- ✅ Quiet hours setting

**Deliverables:**
- Working daily push notifications
- Notifications only sent when items at risk
- Notification preferences screen
- Proper notification tap handling
- Quiet hours respected

### Phase 3: Weekly Summary (Weeks 5-6)
**Summary & Reporting**
- ✅ Weekly summary notification (Sunday 9:00 AM)
- ✅ Consumed vs Wasted breakdown
- ✅ Waste rate calculation
- ✅ Summary data aggregation
- ✅ Link to analytics view

**Deliverables:**
- Weekly summary notifications working
- Accurate consumption/waste calculations
- Summary shows meaningful insights
- User can customize summary timing

### Phase 4: Polish & Optimization (Weeks 7-8)
**Refinement & Integration**
- ✅ Performance optimizations (caching, memoization)
- ✅ Event-driven updates
- ✅ Edge case handling
- ✅ Integration testing
- ✅ User testing and feedback

**Deliverables:**
- Optimized performance
- Smooth event-driven updates
- All edge cases handled
- Production-ready module

---

## Success Metrics

### Technical KPIs
- **Status calculation**: < 50ms for 100+ items
- **Dashboard update**: < 100ms after user action
- **Notification delivery**: 100% on-time delivery
- **Cache hit rate**: > 80% for status calculations
- **Event handling**: < 10ms response time

### User Experience KPIs
- **Notification relevance**: > 90% accuracy (items actually at risk)
- **Action completion rate**: > 75% of users mark items as used from notifications
- **Dashboard usage**: > 60% of users check dashboard daily
- **Preference adoption**: > 40% customize notification times
- **Zero false positives**: 0% notifications for fresh items

### Business Impact KPIs
- **Waste reduction**: Measurable decrease in expired items
- **User engagement**: Daily active usage increase
- **Notification opt-in**: > 85% keep notifications enabled
- **Feature satisfaction**: > 4.5/5 rating
- **Retention impact**: Correlation with user retention

---

## Error Handling

### Notification Failures

```javascript
const NotificationErrorHandler = {
  handleNotificationError: (error, notification) => {
    // Log error
    logError('notification_failed', {
      error: error.message,
      notificationType: notification.type,
      timestamp: new Date()
    });
    
    // Retry logic
    if (error.type === 'PERMISSION_DENIED') {
      // Prompt user to enable notifications
      showPermissionPrompt();
    } else if (error.type === 'DELIVERY_FAILED') {
      // Retry after 5 minutes
      retryNotification(notification, 300000);
    }
  },
  
  checkPermissions: async () => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      // Show in-app message instead
      showInAppAlert();
    }
  }
};
```

### Status Calculation Failures

```javascript
const StatusErrorHandler = {
  handleStatusError: (error, item) => {
    logError('status_calculation_failed', {
      itemId: item.id,
      error: error.message
    });
    
    // Return safe default
    return {
      status: 'fresh',
      severity: 'low',
      priority: 1,
      visualTreatment: 'NORMAL_STYLE',
      timeDisplay: 'Unknown',
      error: true
    };
  }
};
```

---

## Security & Privacy

### Data Protection
- **Local-first**: All expiry calculations done locally
- **No external calls**: Status evaluation doesn't require network
- **Privacy**: No expiry data sent to servers
- **User control**: Full control over notification timing and content

### Notification Security
- **No sensitive data**: Notifications don't expose full item details
- **Local processing**: All notification generation happens on device
- **User privacy**: Notifications respect user preferences and quiet hours

---

## Testing Strategy

### Unit Tests
```javascript
describe('ExpiryStatusEngine', () => {
  test('should mark items as critical within 24 hours', () => {
    const item = createItemWithExpiry(23); // 23 hours from now
    const status = ExpiryStatusEngine.evaluateStatus(item);
    expect(status.status).toBe('critical');
  });
  
  test('should mark items as warning within 72 hours', () => {
    const item = createItemWithExpiry(50); // 50 hours from now
    const status = ExpiryStatusEngine.evaluateStatus(item);
    expect(status.status).toBe('warning');
  });
  
  test('should mark expired items correctly', () => {
    const item = createItemWithExpiry(-5); // 5 hours ago
    const status = ExpiryStatusEngine.evaluateStatus(item);
    expect(status.status).toBe('expired');
  });
});

describe('RiskPrioritizationEngine', () => {
  test('should prioritize higher value items', () => {
    const items = [
      createItem({ cost: 5, expiryHours: 10 }),
      createItem({ cost: 15, expiryHours: 10 })
    ];
    const prioritized = RiskPrioritizationEngine.prioritizeItems(items);
    expect(prioritized[0].cost).toBe(15);
  });
  
  test('should prioritize more urgent items', () => {
    const items = [
      createItem({ cost: 10, expiryHours: 50 }),
      createItem({ cost: 10, expiryHours: 5 })
    ];
    const prioritized = RiskPrioritizationEngine.prioritizeItems(items);
    expect(prioritized[0].expiryHours).toBe(5);
  });
});
```

### Integration Tests
```javascript
describe('Expiry System Integration', () => {
  test('should update dashboard when item consumed', () => {
    const dashboard = renderDashboard();
    const item = createAtRiskItem();
    
    // Consume item
    consumeItem(item.id, 100);
    
    // Dashboard should update
    expect(dashboard.getAtRiskItems()).not.toContain(item);
  });
  
  test('should emit events on consumption', () => {
    const eventSpy = jest.fn();
    EventBus.on('expiry:item_consumed', eventSpy);
    
    consumeItem('item-123', 75);
    
    expect(eventSpy).toHaveBeenCalledWith({
      itemId: 'item-123',
      percentageUsed: 75,
      consumedValue: expect.any(Number),
      wasteValue: expect.any(Number)
    });
  });
});
```

---

## Future Enhancements (Post-MVP)

### Advanced Features
- **Smart notification timing**: ML-based optimal notification times per user
- **Predictive alerts**: "Based on your habits, you won't use this in time"
- **Recipe suggestions**: Link expiring items to recipes (integration point)
- **Donation integration**: Connect with food sharing apps for excess items
- **Calendar integration**: Block time to cook expiring items

### Gamification Integration (Future Module)
- **Achievements**: "Zero Waste Week", "Quick Consumer", "Streak Master"
- **Social sharing**: Share weekly summaries to social media
- **Challenges**: Community challenges around waste reduction
- **Leaderboards**: Compare waste rates with friends

### Analytics Integration (Future Module)
- **Trend analysis**: Track waste reduction over time
- **Category insights**: Which categories waste most
- **Cost impact**: Monthly/yearly savings from reduced waste
- **Behavior patterns**: When items most likely to expire

---

## Architecture Benefits

### Scalability
- Event-driven design supports adding new features
- Modular structure allows independent updates
- Cache system handles large inventories efficiently

### Maintainability
- Clear separation between calculation, UI, and notifications
- Well-defined integration points with other modules
- Comprehensive error handling

### User Experience
- Visual feedback is immediate and intuitive
- Notifications are timely and actionable
- Percentage tracking provides accurate waste calculations
- Event-driven updates feel responsive

### Performance
- Efficient status calculations with caching
- Memoized components prevent unnecessary renders
- Event-driven updates only when needed
- Background processing doesn't block UI

---

## Summary

The Expiry & Alert System provides a robust, user-friendly solution for food waste prevention through:

1. **Clear Visual Indicators**: Color-coded status (Red/Yellow/Green) makes expiry status immediately obvious
2. **Timely Notifications**: Daily 7:00 AM alerts and Sunday 9:00 AM summaries keep users informed
3. **Smart Prioritization**: Risk-based ordering ensures most important items get attention first
4. **Accurate Tracking**: Percentage-based consumption tracking captures true waste/consumption
5. **Event-Driven Architecture**: Efficient updates triggered by user actions, not polling

This module integrates seamlessly with Core Inventory Management and provides clear integration points for future Analytics and Gamification modules.