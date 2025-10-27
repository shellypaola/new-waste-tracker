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

export default function FinalizedStatsPreview() {
  const [analyticsPeriod, setAnalyticsPeriod] = useState('Month');

  // Chart data calculation
  const getChartLabels = () => {
    if (analyticsPeriod === 'Week') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (analyticsPeriod === 'Month') {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
  };

  const getDataPoints = () => {
    // Y-axis range: y=0 is TOP, y=192 is BOTTOM
    // Formula: y = 192 - (value/max * 192)
    
    if (analyticsPeriod === 'Week') {
      // Total: $98 spent, $12 wasted over 7 days
      // Daily spent: ~$14/day (46.7% of $30 scale = y≈102)
      // Daily wasted: ~$1.71/day (5.7% of $30 scale = y≈181)
      // Max scale: $30
      return {
        spent: '0,102 16.67,98 33.33,100 50,104 66.67,106 83.33,103 100,102', // ~$13-15/day
        wasted: '0,181 16.67,180 33.33,182 50,181 66.67,183 83.33,182 100,181'  // ~$1-2/day
      };
    } else if (analyticsPeriod === 'Month') {
      // Total: $680 spent, $163 wasted over 4 weeks
      // Weekly spent: ~$170/week (85% of $200 scale = y≈29)
      // Weekly wasted: ~$41/week (20.5% of $200 scale = y≈153)
      // Max scale: $200
      return {
        spent: '0,29 33.33,26 66.67,28 100,25',  // ~$165-175/week
        wasted: '0,153 33.33,150 66.67,152 100,153'  // ~$38-44/week
      };
    } else {
      // Total: $8,160 spent, $1,956 wasted over 12 months
      // Monthly spent: ~$680/month (68% of $1000 = y≈61)
      // Monthly wasted: ~$163/month (16.3% of $1000 = y≈161)
      // Max scale: $1000
      const xPositions = [0, 9.09, 18.18, 27.27, 36.36, 45.45, 54.55, 63.64, 72.73, 81.82, 90.91, 100];
      const spentY = [64, 61, 66, 68, 71, 74, 68, 66, 61, 58, 56, 54]; // ~$650-700/month
      const wastedY = [163, 161, 165, 167, 169, 171, 167, 165, 161, 159, 157, 155]; // ~$150-170/month
      
      const spentPoints = xPositions.map((x, i) => `${x},${spentY[i]}`).join(' ');
      const wastedPoints = xPositions.map((x, i) => `${x},${wastedY[i]}`).join(' ');
      
      return {
        spent: spentPoints,
        wasted: wastedPoints
      };
    }
  };

  const chartLabels = getChartLabels();
  const dataPoints = getDataPoints();

  // Pie chart data for most wasted items (dynamic by period) - using orange/yellow warm tones
  const getTopItemsData = () => {
    let topItems, totalWaste;
    
    if (analyticsPeriod === 'Week') {
      totalWaste = 18.50;  // Increased total so top 3 don't equal 100%
      topItems = [
        { name: 'Strawberries', emoji: '🍓', value: 5.99, color: '#EA580C', opacity: 1 },   // Dark orange
        { name: 'Milk', emoji: '🥛', value: 4.99, color: '#FB923C', opacity: 1 },           // Medium orange
        { name: 'Bread', emoji: '🍞', value: 3.49, color: '#FCD34D', opacity: 1 }           // Yellow
      ];
    } else if (analyticsPeriod === 'Month') {
      totalWaste = 38.00;  // Increased total so top 3 don't equal 100%
      topItems = [
        { name: 'Lettuce', emoji: '🥬', value: 11.97, color: '#EA580C', opacity: 1 },
        { name: 'Milk', emoji: '🥛', value: 9.98, color: '#FB923C', opacity: 1 },
        { name: 'Berries', emoji: '🍓', value: 7.98, color: '#FCD34D', opacity: 1 }
      ];
    } else {
      totalWaste = 400.00;  // Increased total so top 3 don't equal 100%
      topItems = [
        { name: 'Milk', emoji: '🥛', value: 119.76, color: '#EA580C', opacity: 1 },
        { name: 'Lettuce', emoji: '🥬', value: 111.72, color: '#FB923C', opacity: 1 },
        { name: 'Berries', emoji: '🍓', value: 107.82, color: '#FCD34D', opacity: 1 }
      ];
    }
    
    // Calculate "Other" items
    const topItemsTotal = topItems.reduce((sum, item) => sum + item.value, 0);
    const otherValue = totalWaste - topItemsTotal;
    
    // Add "Other" item if there's remaining waste
    if (otherValue > 0.01) {
      topItems.push({
        name: 'Other',
        emoji: '',
        value: otherValue,
        color: '#D1D5DB',  // Light grey
        opacity: 1
      });
    }
    
    // Calculate percentages
    return topItems.map(item => ({
      ...item,
      percentage: Math.round((item.value / totalWaste) * 100)
    }));
  };

  const topItemsData = getTopItemsData();

  // Calculate angles for top items pie chart
  currentAngle = 0;
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
    <div className="min-h-screen" style={{ backgroundColor: colors.bgGray, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <div className="max-w-md mx-auto">
        <div className="h-screen overflow-y-auto pb-8" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="px-4 pt-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>Analytics</h1>
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
                    {analyticsPeriod === 'Week' ? '$12' : analyticsPeriod === 'Month' ? '$163' : '$1,956'}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.bgGray, color: colors.textSecondary }}>
                      {analyticsPeriod === 'Week' ? '↓ $2' : analyticsPeriod === 'Month' ? '↓ $18' : '↓ $125'}
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
                    {analyticsPeriod === 'Week' ? '$86' : analyticsPeriod === 'Month' ? '$517' : '$6,204'}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.bgGray, color: colors.textSecondary }}>
                      {analyticsPeriod === 'Week' ? '↑ $8' : analyticsPeriod === 'Month' ? '↑ $45' : '↑ $380'}
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
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs font-medium" style={{ color: colors.textLight }}>
                    {analyticsPeriod === 'Week' ? (
                      <>
                        <span>$30</span>
                        <span>$20</span>
                        <span>$10</span>
                        <span>$0</span>
                      </>
                    ) : analyticsPeriod === 'Month' ? (
                      <>
                        <span>$200</span>
                        <span>$100</span>
                        <span>$0</span>
                      </>
                    ) : (
                      <>
                        <span>$1000</span>
                        <span>$750</span>
                        <span>$500</span>
                        <span>$250</span>
                        <span>$0</span>
                      </>
                    )}
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
                          className={idx === chartLabels.length - 1 ? 'font-bold' : ''}
                          style={{ 
                            color: idx === chartLabels.length - 1 ? colors.primary : colors.textSecondary,
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
                        {analyticsPeriod === 'Week' ? '$98' : analyticsPeriod === 'Month' ? '$680' : '$8,160'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-1 rounded-full" style={{ backgroundColor: colors.critical, opacity: 0.8 }} />
                        <span className="text-xs font-semibold" style={{ color: colors.text }}>Wasted</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: colors.text }}>
                        {analyticsPeriod === 'Week' ? '$12' : analyticsPeriod === 'Month' ? '$163' : '$1,956'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs" style={{ color: colors.textSecondary }}>
                    {analyticsPeriod === 'Week' && 'Daily average: $14 spent, $1.71 wasted'}
                    {analyticsPeriod === 'Month' && 'Weekly average: $170 spent, $41 wasted'}
                    {analyticsPeriod === 'Year' && 'Monthly average: $680 spent, $163 wasted'}
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Analysis - Two Improved Pie Charts */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4" style={{ color: colors.text }}>Waste Analysis</h2>
              
              {/* Your Progress - Full Width Comparison Chart */}
              <div className="bg-white p-4 rounded-2xl shadow-sm mb-3" style={{ border: `1px solid ${colors.border}` }}>
                <div className="mb-4">
                  <h3 className="text-sm font-bold" style={{ color: colors.text }}>Your Progress</h3>
                </div>
                
                {/* Mini Bar Chart */}
                <div className="space-y-3">
                  {(() => {
                    const getTrendData = () => {
                      if (analyticsPeriod === 'Week') {
                        return [
                          { period: '3 weeks ago', amount: 14, current: false },
                          { period: '2 weeks ago', amount: 14, current: false },
                          { period: 'This week', amount: 12, current: true }
                        ];
                      } else if (analyticsPeriod === 'Month') {
                        return [
                          { period: '3 months ago', amount: 181, current: false },
                          { period: '2 months ago', amount: 172, current: false },
                          { period: 'This month', amount: 163, current: true }
                        ];
                      } else {
                        return [
                          { period: '2022', amount: 2150, current: false },
                          { period: '2023', amount: 2080, current: false },
                          { period: '2024', amount: 1956, current: true }
                        ];
                      }
                    };
                    
                    const trendData = getTrendData();
                    
                    // Filter out periods with no data (amount = 0)
                    const dataWithValues = trendData.filter(item => item.amount > 0);
                    
                    // If no data at all, show empty state
                    if (dataWithValues.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-8 px-4">
                          <div className="text-4xl mb-3">📊</div>
                          <p className="text-sm font-medium text-center mb-1" style={{ color: colors.text }}>
                            Start logging waste to see your progress!
                          </p>
                          <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
                            Track your waste to visualize trends over time
                          </p>
                        </div>
                      );
                    }
                    
                    const maxAmount = Math.max(...dataWithValues.map(d => d.amount));
                    
                    return dataWithValues.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs font-medium w-24 text-right" style={{ color: item.current ? colors.text : colors.textSecondary }}>
                          {item.period}
                        </span>
                        <div className="flex-1 relative h-8 rounded-lg overflow-hidden" style={{ backgroundColor: colors.bgGray }}>
                          <div 
                            className="absolute left-0 top-0 h-full rounded-lg transition-all duration-500"
                            style={{ 
                              width: `${(item.amount / maxAmount) * 100}%`,
                              backgroundColor: item.current ? colors.primary : '#E5E7EB',  // Solid blue for current, light grey for past
                              opacity: 1
                            }}
                          />
                          <div className="absolute inset-0 flex items-center px-3">
                            <span className="text-sm font-bold" style={{ color: item.current ? 'white' : colors.text }}>
                              ${item.amount}
                            </span>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Top Items - Full Width */}
              <div className="bg-white p-4 rounded-2xl shadow-sm" style={{ border: `1px solid ${colors.border}` }}>
                <div className="mb-4">
                  <h3 className="text-sm font-bold" style={{ color: colors.text }}>Top Wasted Items</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Donut Chart */}
                  <div className="flex items-center justify-center">
                    <svg width="140" height="140" viewBox="0 0 140 140" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }}>
                      {/* Background circle */}
                      <circle cx="70" cy="70" r="60" fill={colors.bgGray} />
                      
                      {/* Pie slices */}
                      {topItemsSlices.map((slice, idx) => (
                        <path
                          key={idx}
                          d={createPieSlice(70, 70, 60, slice.startAngle, slice.endAngle)}
                          fill={slice.color}
                          opacity={slice.opacity}
                          style={{ transition: 'opacity 0.2s' }}
                        />
                      ))}
                      
                      {/* Center white circle */}
                      <circle cx="70" cy="70" r="38" fill="white" />
                    </svg>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-col justify-center space-y-3">
                    {topItemsSlices.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ 
                              backgroundColor: item.color
                            }} 
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
      </div>
    </div>
  );
}

export default AnalyticsScreen;
