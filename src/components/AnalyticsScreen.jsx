import React, { useState } from 'react';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

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

// Helper function to create accurate pie chart paths
const createPieSlice = (centerX, centerY, radius, startAngle, endAngle) => {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  
  return [
    `M ${centerX} ${centerY}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z'
  ].join(' ');
};

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

function AnalyticsScreen({ consumedItems = [], totalWasted = 0, totalConsumed = 0, totalSpent = 0 }) {
  const [analyticsPeriod, setAnalyticsPeriod] = useState('Week');

  // Helper to filter items by time period
  const getItemsForPeriod = () => {
    const now = new Date();
    const filtered = consumedItems.filter(item => {
      const itemDate = new Date(item.consumedDate);
      if (analyticsPeriod === 'Week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= oneWeekAgo;
      } else if (analyticsPeriod === 'Month') {
        // Current calendar month
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      } else {
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return itemDate >= oneYearAgo;
      }
    });
    return filtered;
  };

  const periodItems = getItemsForPeriod();
  const periodWasted = periodItems.reduce((sum, item) => sum + item.wastedAmount, 0);
  const periodConsumed = periodItems.reduce((sum, item) => sum + item.consumedAmount, 0);
  const periodSpent = periodWasted + periodConsumed;

  // Calculate previous period for comparison
  const getPreviousPeriodData = () => {
    const now = new Date();
    let previousStart, previousEnd, currentStart;
    
    if (analyticsPeriod === 'Week') {
      currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      previousStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      previousEnd = currentStart;
    } else if (analyticsPeriod === 'Month') {
      // Previous calendar month
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 1);
      currentStart = previousEnd;
    } else {
      currentStart = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      previousStart = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
      previousEnd = currentStart;
    }
    
    const previousItems = consumedItems.filter(item => {
      const itemDate = new Date(item.consumedDate);
      return itemDate >= previousStart && itemDate < previousEnd;
    });
    
    const previousWasted = previousItems.reduce((sum, item) => sum + item.wastedAmount, 0);
    const previousConsumed = previousItems.reduce((sum, item) => sum + item.consumedAmount, 0);
    
    return {
      wastedDiff: periodWasted - previousWasted,
      consumedDiff: periodConsumed - previousConsumed
    };
  };

  const periodComparison = getPreviousPeriodData();

  // Chart data calculation - generates labels AND data together
  const getChartData = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let periods = [];
    let maxScale = 30;
    
    if (analyticsPeriod === 'Week') {
  // Current week (Monday to Sunday)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Find the Monday of the current week
  const dayOfWeek = now.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now.getTime() - daysFromMonday * 24 * 60 * 60 * 1000);
  
  // Create 7 days starting from Monday
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000);
    periods.push({
      label: dayNames[date.getDay()],
      date: new Date(date),
      spent: 0,
      wasted: 0
    });
  }
} else if (analyticsPeriod === 'Month') {
  // Current calendar month by weeks
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  periods = [
    { label: 'Week 1', startDay: 1, endDay: 7, spent: 0, wasted: 0 },
    { label: 'Week 2', startDay: 8, endDay: 14, spent: 0, wasted: 0 },
    { label: 'Week 3', startDay: 15, endDay: 21, spent: 0, wasted: 0 },
    { label: 'Week 4', startDay: 22, endDay: lastDayOfMonth, spent: 0, wasted: 0 }
  ];
} else {
  // Current calendar year (Jan-Dec)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 12; i++) {
    periods.push({
      label: monthNames[i],
      monthIndex: i,
      year: now.getFullYear(),
      spent: 0,
      wasted: 0
    });
  }
}

// Populate with real data
periodItems.forEach(item => {
  const itemDate = new Date(item.consumedDate);
  itemDate.setHours(0, 0, 0, 0);
  let periodIndex = -1;
  
  if (analyticsPeriod === 'Week') {
    periodIndex = periods.findIndex(p => {
      const pDate = new Date(p.date);
      pDate.setHours(0, 0, 0, 0);
      return pDate.getTime() === itemDate.getTime();
    });
  } else if (analyticsPeriod === 'Month') {
    if (itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()) {
      const dayOfMonth = itemDate.getDate();
      if (dayOfMonth >= 1 && dayOfMonth <= 7) periodIndex = 0;
      else if (dayOfMonth >= 8 && dayOfMonth <= 14) periodIndex = 1;
      else if (dayOfMonth >= 15 && dayOfMonth <= 21) periodIndex = 2;
      else if (dayOfMonth >= 22) periodIndex = 3;
    }
  } else {
    periodIndex = periods.findIndex(p => 
      p.monthIndex === itemDate.getMonth() && p.year === itemDate.getFullYear()
    );
  }
  
  if (periodIndex >= 0 && periodIndex < periods.length) {
    periods[periodIndex].spent += item.totalCost;
    periods[periodIndex].wasted += item.wastedAmount;
  }
});

// Calculate dynamic maxScale for ALL views based on actual data
// Helper function to create nice round numbers
const getNiceNumber = (value) => {
  if (value === 0) return 0;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const fraction = value / magnitude;
  let niceFraction;
  if (fraction <= 1) niceFraction = 1;
  else if (fraction <= 2) niceFraction = 2;
  else if (fraction <= 5) niceFraction = 5;
  else niceFraction = 10;
  return niceFraction * magnitude;
};

// Calculate dynamic maxScale for ALL views based on actual data
const maxSpent = Math.max(...periods.map(p => p.spent), 0);
if (analyticsPeriod === 'Week') {
  maxScale = maxSpent > 0 ? getNiceNumber(maxSpent + 10) : 30;
} else if (analyticsPeriod === 'Month') {
  maxScale = maxSpent > 0 ? getNiceNumber(maxSpent + 50) : 200;
} else {
  maxScale = maxSpent > 0 ? getNiceNumber(maxSpent + 500) : 1000;
}
// DEBUG - ADD THESE LINES
console.log('=== CHART DEBUG ===');
console.log('Period:', analyticsPeriod);
console.log('Periods:', periods);
console.log('Max Spent:', maxSpent);
console.log('Max Scale:', maxScale);
console.log('PeriodItems count:', periodItems.length);
// END DEBUG
    // Convert to SVG coordinates
    const numPoints = periods.length;
    const xStep = 100 / (numPoints - 1);
    
    const spentPoints = periods.map((period, idx) => {
      const x = idx * xStep;
      const y = 192 - (period.spent / maxScale) * 192;
      return `${x.toFixed(2)},${Math.max(0, Math.min(192, y)).toFixed(2)}`;
    }).join(' ');
    
    const wastedPoints = periods.map((period, idx) => {
      const x = idx * xStep;
      const y = 192 - (period.wasted / maxScale) * 192;
      return `${x.toFixed(2)},${Math.max(0, Math.min(192, y)).toFixed(2)}`;
    }).join(' ');
    
    return {
      labels: periods.map(p => p.label),
      dataPoints: {
        spent: spentPoints,
        wasted: wastedPoints
      }
    };
  };

  const chartData = getChartData();
  const chartLabels = chartData.labels;
  const dataPoints = chartData.dataPoints;

  // Calculate Top Wasted Items from real data
  const getTopItemsData = () => {
    const wastedByItem = {};
    periodItems.forEach(item => {
      if (item.wastedAmount > 0) {
        if (!wastedByItem[item.name]) {
          wastedByItem[item.name] = {
            name: item.name,
            emoji: item.emoji,
            value: 0
          };
        }
        wastedByItem[item.name].value += item.wastedAmount;
      }
    });
    
    const items = Object.values(wastedByItem).sort((a, b) => b.value - a.value);
    const top3 = items.slice(0, 3);
    
    if (top3.length === 0) {
      return [];
    }
    
    const itemColors = ['#EA580C', '#FB923C', '#FCD34D'];
    top3.forEach((item, idx) => {
      item.color = itemColors[idx] || '#D1D5DB';
      item.opacity = 1;
    });
    
    const top3Total = top3.reduce((sum, item) => sum + item.value, 0);
    const otherValue = periodWasted - top3Total;
    
    if (otherValue > 0.01) {
      top3.push({
        name: 'Other',
        emoji: '',
        value: otherValue,
        color: '#D1D5DB',
        opacity: 1
      });
    }
    
    return top3.map(item => ({
      ...item,
      percentage: Math.round((item.value / periodWasted) * 100)
    }));
  };

  const topItemsData = getTopItemsData();

  let currentAngle = 0;
  const topItemsSlices = topItemsData.map((item) => {
    const angle = (item.percentage / 100) * 360;
    const slice = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return slice;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-20">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold" style={{ color: colors.text }}>Analytics</h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>Your waste reduction journey</p>
            </div>

            {/* Time Period Selector */}
            <div className="flex gap-2 mb-6">
              {['Week', 'Month', 'Year'].map(period => (
                <button 
                  key={period} 
                  onClick={() => setAnalyticsPeriod(period)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm" 
                  style={{ 
                    backgroundColor: analyticsPeriod === period ? colors.primary : colors.bg, 
                    color: analyticsPeriod === period ? 'white' : colors.text,
                    border: analyticsPeriod === period ? 'none' : `1px solid ${colors.border}`,
                    cursor: 'pointer'
                  }}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Hero Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Wasted Cost Card */}
              <div className="p-5 rounded-2xl relative overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)' }}>
                <div className="absolute" style={{ right: '-16px', bottom: '-16px', opacity: 0.1 }}>
                  <TrendingDown size={80} style={{ color: colors.critical }} />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
                      <TrendingDown size={16} style={{ color: colors.critical }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: colors.critical }}>WASTED</span>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: colors.critical }}>
                    ${periodWasted.toFixed(0)}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.bgGray, color: colors.textSecondary }}>
                      {periodComparison.wastedDiff >= 0 ? '↑' : '↓'} ${Math.abs(periodComparison.wastedDiff).toFixed(0)}
                    </span>
                    <span className="text-xs" style={{ color: colors.textSecondary }}>vs last {analyticsPeriod.toLowerCase()}</span>
                  </div>
                </div>
              </div>

              {/* Money Saved Card */}
              <div className="p-5 rounded-2xl relative overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)' }}>
                <div className="absolute" style={{ right: '-16px', bottom: '-16px', opacity: 0.1 }}>
                  <DollarSign size={80} style={{ color: colors.fresh }} />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>
                      <TrendingUp size={16} style={{ color: colors.fresh }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: colors.fresh }}>CONSUMED</span>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: colors.fresh }}>
                    ${periodConsumed.toFixed(0)}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.bgGray, color: colors.textSecondary }}>
                      {periodComparison.consumedDiff >= 0 ? '↑' : '↓'} ${Math.abs(periodComparison.consumedDiff).toFixed(0)}
                    </span>
                    <span className="text-xs" style={{ color: colors.textSecondary }}>vs last {analyticsPeriod.toLowerCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold" style={{ color: colors.text }}>Spending & Waste Trend</h2>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm" style={{ border: `1px solid ${colors.border}` }}>
                {/* Chart Area */}
                <div className="relative h-48 mb-4">
                  {/* Y-axis labels */}
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs font-medium" style={{ color: colors.textLight }}>
                    {(() => {
                      // Helper function to create nice round numbers
                      const getNiceNumber = (value) => {
                        if (value === 0) return 0;
                        
                        // Get magnitude (e.g., 15000 -> 10000, 500 -> 100)
                        const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
                        const fraction = value / magnitude;
                        
                        // Round to nice fractions (1, 2, 5, 10)
                        let niceFraction;
                        if (fraction <= 1) niceFraction = 1;
                        else if (fraction <= 2) niceFraction = 2;
                        else if (fraction <= 5) niceFraction = 5;
                        else niceFraction = 10;
                        
                        return niceFraction * magnitude;
                      };
                      
                      const getLabels = () => {
                        const maxValue = Math.max(periodSpent, periodWasted);
                        let dynamicMax;
                        
                        if (analyticsPeriod === 'Week') {
                          dynamicMax = maxValue > 0 ? getNiceNumber(maxValue + 10) : 30;
                        } else if (analyticsPeriod === 'Month') {
                          dynamicMax = maxValue > 0 ? getNiceNumber(maxValue + 50) : 200;
                        } else {
                          dynamicMax = maxValue > 0 ? getNiceNumber(maxValue + 500) : 1000;
                        }
                        
                        // Format currency nicely (no decimals, with commas for thousands)
                        const formatCurrency = (val) => {
                          return `$${Math.round(val).toLocaleString()}`;
                        };
                        
                        if (analyticsPeriod === 'Month') {
                          // 3 labels for month view
                          return [
                            <span key="max">{formatCurrency(dynamicMax)}</span>,
                            <span key="50">{formatCurrency(dynamicMax * 0.5)}</span>,
                            <span key="0">$0</span>
                          ];
                        } else {
                          // 5 labels for week and year view
                          return [
                            <span key="max">{formatCurrency(dynamicMax)}</span>,
                            <span key="75">{formatCurrency(dynamicMax * 0.75)}</span>,
                            <span key="50">{formatCurrency(dynamicMax * 0.5)}</span>,
                            <span key="25">{formatCurrency(dynamicMax * 0.25)}</span>,
                            <span key="0">$0</span>
                          ];
                        }
                      };
                      
                      return getLabels();
                    })()}
                  </div>
                  
                  {/* Chart content */}
                  <div className="ml-10 h-full relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {analyticsPeriod === 'Week' && [0, 1, 2, 3].map(i => (
                        <div key={i} className="border-t" style={{ borderColor: colors.border, opacity: 0.3 }} />
                      ))}
                      {analyticsPeriod === 'Month' && [0, 1, 2].map(i => (
                        <div key={i} className="border-t" style={{ borderColor: colors.border, opacity: 0.3 }} />
                      ))}
                      {analyticsPeriod === 'Year' && [0, 1, 2, 3, 4].map(i => (
                        <div key={i} className="border-t" style={{ borderColor: colors.border, opacity: 0.3 }} />
                      ))}
                    </div>
                    
                    {/* Data lines */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 192">
                      <defs>
                        <linearGradient id="spentGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.2" />
                          <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="wastedGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor={colors.critical} stopOpacity="0.15" />
                          <stop offset="100%" stopColor={colors.critical} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Area fills */}
                      <polygon points={`${dataPoints.spent} 100,192 0,192`} fill="url(#spentGradient)" />
                      <polygon points={`${dataPoints.wasted} 100,192 0,192`} fill="url(#wastedGradient)" />
                      
                      {/* Lines */}
                      <polyline points={dataPoints.spent} fill="none" stroke={colors.primary} strokeWidth="3" vectorEffect="non-scaling-stroke" />
                      <polyline points={dataPoints.wasted} fill="none" stroke={colors.critical} strokeWidth="3" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
                    </svg>
                    
                    {/* Period labels */}
                    <div className="absolute left-0 right-0 flex justify-between text-xs font-medium" style={{ color: colors.textSecondary, bottom: '-24px' }}>
                      {chartLabels.map((label, idx) => (
                        <span 
                          key={idx}
                          style={{ 
                            color: colors.textSecondary,
                            fontSize: analyticsPeriod === 'Year' ? '10px' : '12px'
                          }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Legend and stats */}
                <div className="mt-8 pt-4 border-t" style={{ borderColor: colors.border }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
                        <span className="text-xs font-semibold" style={{ color: colors.text }}>Spent</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: colors.text }}>
                        ${periodSpent.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-1 rounded-full" style={{ backgroundColor: colors.critical, opacity: 0.8 }} />
                        <span className="text-xs font-semibold" style={{ color: colors.text }}>Wasted</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: colors.text }}>
                        ${periodWasted.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs" style={{ color: colors.textSecondary }}>
                    {analyticsPeriod === 'Week' && `Daily average: $${(periodSpent / 7).toFixed(0)} spent, $${(periodWasted / 7).toFixed(0)} wasted`}
                    {analyticsPeriod === 'Month' && `Weekly average: $${(periodSpent / 4).toFixed(0)} spent, $${(periodWasted / 4).toFixed(0)} wasted`}
                    {analyticsPeriod === 'Year' && `Monthly average: $${(periodSpent / 12).toFixed(0)} spent, $${(periodWasted / 12).toFixed(0)} wasted`}
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Analysis */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3" style={{ color: colors.text }}>Waste Analysis</h2>

              {/* Consumption Timing Trends */}
              <div className="bg-white p-4 rounded-2xl shadow-sm mb-3" style={{ border: `1px solid ${colors.border}` }}>
                <div className="mb-4">
                  <h3 className="text-sm font-bold" style={{ color: colors.text }}>Consumption Timing Trends</h3>
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>When items are consumed relative to expiry</p>
                </div>
                
                <div className="space-y-3">
                  {(() => {
                    const timingColors = {
                      fresh: '#D1FAE5',
                      good: '#DBEAFE',
                      closeCall: '#FEF3C7',
                      expired: '#FEE2E2'
                    };
                    
                    const getTimingData = () => {
                      const now = new Date();
                      now.setHours(0, 0, 0, 0);
                      let periods = [];
                      
                      if (analyticsPeriod === 'Week') {
                      // Current week (Monday to Sunday) - matches Spending & Waste Trend
                      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                      
                      // Find the Monday of the current week
                      const dayOfWeek = now.getDay();
                      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                      const monday = new Date(now.getTime() - daysFromMonday * 24 * 60 * 60 * 1000);
                      
                      // Create 7 days starting from Monday
                      for (let i = 0; i < 7; i++) {
                        const date = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000);
                        periods.push({
                          label: dayNames[date.getDay()],
                          date: new Date(date),
                          fresh: 0,
                          good: 0,
                          closeCall: 0,
                          expired: 0
                          });
                        }
                      } else if (analyticsPeriod === 'Month') {
                        // Current calendar month by weeks
                        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                        periods = [
                          { label: 'Week 1', startDay: 1, endDay: 7, fresh: 0, good: 0, closeCall: 0, expired: 0 },
                          { label: 'Week 2', startDay: 8, endDay: 14, fresh: 0, good: 0, closeCall: 0, expired: 0 },
                          { label: 'Week 3', startDay: 15, endDay: 21, fresh: 0, good: 0, closeCall: 0, expired: 0 },
                          { label: 'Week 4', startDay: 22, endDay: lastDayOfMonth, fresh: 0, good: 0, closeCall: 0, expired: 0 }
                        ];
                      } else {
                        // Current calendar year (Jan-Dec)
                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        for (let i = 0; i < 12; i++) {
                          periods.push({
                            label: monthNames[i],
                            monthIndex: i,
                            year: now.getFullYear(),
                            fresh: 0,
                            good: 0,
                            closeCall: 0,
                            expired: 0
                          });
                        }
                      }
                      
                      periodItems.forEach(item => {
                        const itemDate = new Date(item.consumedDate);
                        itemDate.setHours(0, 0, 0, 0);
                        let periodIndex = -1;
                        
                        if (analyticsPeriod === 'Week') {
                          // Find exact day match
                          periodIndex = periods.findIndex(p => {
                            const pDate = new Date(p.date);
                            pDate.setHours(0, 0, 0, 0);
                            return pDate.getTime() === itemDate.getTime();
                          });
                        } else if (analyticsPeriod === 'Month') {
                          if (itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()) {
                            const dayOfMonth = itemDate.getDate();
                            if (dayOfMonth >= 1 && dayOfMonth <= 7) periodIndex = 0;
                            else if (dayOfMonth >= 8 && dayOfMonth <= 14) periodIndex = 1;
                            else if (dayOfMonth >= 15 && dayOfMonth <= 21) periodIndex = 2;
                            else if (dayOfMonth >= 22) periodIndex = 3;
                          }
                        } else {
                          // Find matching month and year
                          periodIndex = periods.findIndex(p => 
                            p.monthIndex === itemDate.getMonth() && p.year === itemDate.getFullYear()
                          );
                        }
                        
                        if (periodIndex >= 0 && periodIndex < periods.length) {
                          const days = item.daysUntilExpiryAtConsumption;
                          const amount = item.totalCost;
                          
                          if (days < 0) {
                            periods[periodIndex].expired += amount;
                          } else if (days <= 1) {
                            periods[periodIndex].closeCall += amount;
                          } else if (days <= 4) {
                            periods[periodIndex].good += amount;
                          } else {
                            periods[periodIndex].fresh += amount;
                          }
                        }
                      });
                      
                      return periods;
                    };
                    
                    const timingData = getTimingData();
                    
                    if (timingData.every(d => d.fresh === 0 && d.good === 0 && d.closeCall === 0 && d.expired === 0)) {
                      return (
                        <div className="flex flex-col items-center justify-center py-8 px-4">
                          <div className="text-4xl mb-3">📊</div>
                          <p className="text-sm font-medium text-center mb-1" style={{ color: colors.text }}>
                            Start consuming items to see timing patterns!
                          </p>
                          <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
                            Track when you use items to optimize freshness
                          </p>
                        </div>
                      );
                    }
                    
                    // Helper function for nice numbers
                    const getNiceNumber = (value) => {
                      if (value === 0) return 0;
                      const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
                      const fraction = value / magnitude;
                      let niceFraction;
                      if (fraction <= 1) niceFraction = 1;
                      else if (fraction <= 2) niceFraction = 2;
                      else if (fraction <= 5) niceFraction = 5;
                      else niceFraction = 10;
                      return niceFraction * magnitude;
                    };
                    
                    const maxDataValue = Math.max(...timingData.map(d => d.fresh + d.good + d.closeCall + d.expired));
                    let maxTotal;
                    if (analyticsPeriod === 'Week') {
                      maxTotal = maxDataValue > 0 ? getNiceNumber(maxDataValue + 10) : 30;
                    } else if (analyticsPeriod === 'Month') {
                      maxTotal = maxDataValue > 0 ? getNiceNumber(maxDataValue + 50) : 200;
                    } else {
                      maxTotal = maxDataValue > 0 ? getNiceNumber(maxDataValue + 500) : 1000;
                    }              
                    return (
                      <>
                        <div className="flex gap-3">
                        <div className="flex flex-col justify-between text-xs font-medium" style={{ color: colors.textLight, height: '160px' }}>
                          {(() => {
                            // Helper function to create nice round numbers
                            const getNiceNumber = (value) => {
                              if (value === 0) return 0;
                              
                              const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
                              const fraction = value / magnitude;
                              
                              let niceFraction;
                              if (fraction <= 1) niceFraction = 1;
                              else if (fraction <= 2) niceFraction = 2;
                              else if (fraction <= 5) niceFraction = 5;
                              else niceFraction = 10;
                              
                              return niceFraction * magnitude;
                            };
                            
                            // Format currency nicely
                            const formatCurrency = (val) => {
                              return `$${Math.round(val).toLocaleString()}`;
                            };
                            
                            // Get nice max value
                            const maxDataValue = Math.max(...timingData.map(d => d.fresh + d.good + d.closeCall + d.expired));
                            let niceMax;
                            
                            if (analyticsPeriod === 'Week') {
                              niceMax = maxDataValue > 0 ? getNiceNumber(maxDataValue + 10) : 30;
                            } else if (analyticsPeriod === 'Month') {
                              niceMax = maxDataValue > 0 ? getNiceNumber(maxDataValue + 50) : 200;
                            } else {
                              niceMax = maxDataValue > 0 ? getNiceNumber(maxDataValue + 500) : 1000;
                            }
                            
                            return (
                              <>
                                <span>{formatCurrency(niceMax)}</span>
                                <span>{formatCurrency(niceMax * 0.75)}</span>
                                <span>{formatCurrency(niceMax * 0.5)}</span>
                                <span>{formatCurrency(niceMax * 0.25)}</span>
                                <span>$0</span>
                              </>
                            );
                          })()}
                        </div>
                          
                          <div className="flex-1 flex items-end justify-between gap-2 h-40">
                            {timingData.map((item, idx) => {
                              const total = item.fresh + item.good + item.closeCall + item.expired;
                              const height = total > 0 ? (total / maxTotal) * 100 : 0;
                              
                              return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                  <div className="w-full flex flex-col-reverse" style={{ height: '128px' }}>
                                    {total > 0 && (
                                      <div className="w-full relative" style={{ height: `${height}%` }}>
                                        {item.expired > 0 && (
                                          <div 
                                            className="w-full absolute bottom-0 left-0 transition-all"
                                            style={{ 
                                              height: `${(item.expired / total) * 100}%`,
                                              backgroundColor: timingColors.expired
                                            }}
                                          />
                                        )}
                                        {item.closeCall > 0 && (
                                          <div 
                                            className="w-full absolute left-0 transition-all"
                                            style={{ 
                                              bottom: `${(item.expired / total) * 100}%`,
                                              height: `${(item.closeCall / total) * 100}%`,
                                              backgroundColor: timingColors.closeCall
                                            }}
                                          />
                                        )}
                                        {item.good > 0 && (
                                          <div 
                                            className="w-full absolute left-0 transition-all"
                                            style={{ 
                                              bottom: `${((item.expired + item.closeCall) / total) * 100}%`,
                                              height: `${(item.good / total) * 100}%`,
                                              backgroundColor: timingColors.good
                                            }}
                                          />
                                        )}
                                        {item.fresh > 0 && (
                                          <div 
                                            className="w-full absolute left-0 rounded-t-lg transition-all"
                                            style={{ 
                                              bottom: `${((item.expired + item.closeCall + item.good) / total) * 100}%`,
                                              height: `${(item.fresh / total) * 100}%`,
                                              backgroundColor: timingColors.fresh
                                            }}
                                          />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                    {item.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t" style={{ borderColor: colors.border }}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: timingColors.fresh }} />
                            <span className="text-xs font-medium" style={{ color: colors.text }}>Fresh (5+ days)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: timingColors.good }} />
                            <span className="text-xs font-medium" style={{ color: colors.text }}>Good (2-4 days)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: timingColors.closeCall }} />
                            <span className="text-xs font-medium" style={{ color: colors.text }}>Close Call (1 day)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: timingColors.expired }} />
                            <span className="text-xs font-medium" style={{ color: colors.text }}>Expired (wasted)</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Top Items */}
              <div className="bg-white p-4 rounded-2xl shadow-sm" style={{ border: `1px solid ${colors.border}` }}>
                <div className="mb-4">
                  <h3 className="text-sm font-bold" style={{ color: colors.text }}>Top Wasted Items</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center">
                    <svg width="140" height="140" viewBox="0 0 140 140" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }}>
                      <circle cx="70" cy="70" r="60" fill={colors.bgGray} />
                      {topItemsSlices.map((slice, idx) => (
                        <path
                          key={idx}
                          d={createPieSlice(70, 70, 60, slice.startAngle, slice.endAngle)}
                          fill={slice.color}
                          opacity={slice.opacity}
                          style={{ transition: 'opacity 0.2s' }}
                        />
                      ))}
                      <circle cx="70" cy="70" r="38" fill="white" />
                    </svg>
                  </div>
                  
                  <div className="flex flex-col justify-center space-y-3">
                    {topItemsSlices.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }} 
                          />
                          <span className="font-medium" style={{ color: colors.text }}>
                            {item.name}
                          </span>
                        </div>
                        <span className="font-bold" style={{ color: colors.text }}>${item.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
}

export default AnalyticsScreen;
