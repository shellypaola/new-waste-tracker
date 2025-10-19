# Analytics & Reporting Module - Implementation & Architecture

## Module Overview
The Analytics & Reporting module transforms raw consumption and waste data into actionable insights, helping users understand their food management patterns, track progress toward goals, and quantify the financial and environmental impact of their behavior changes.

**Core Purpose:** Provide meaningful analytics that drive behavior change through visual insights, trend analysis, and goal tracking.

---

## Core Features

### 1. **Waste Metrics**
- Items expired vs consumed tracking
- Cost analysis of wasted food
- Waste trends over time (daily, weekly, monthly)
- Category-based waste breakdown

### 2. **KPI Dashboard**
- Real-time performance indicators
- Goals vs actual performance tracking
- Waste reduction percentage
- Consumption efficiency metrics

### 3. **Cost Analysis**
- Total inventory value tracking
- Potential savings calculations
- ROI (Return on Investment) tracking
- Financial impact visualization

### 4. **Historical Trends**
- Long-term consumption patterns
- Seasonal waste analysis
- Behavioral improvement tracking
- Comparative period analysis

---

## Data Architecture

### Analytics Data Model
```javascript
const AnalyticsDataModel = {
  // Core metrics
  metrics: {
    totalItemsAdded: number,
    totalItemsConsumed: number,
    totalItemsWasted: number,
    
    totalValueAdded: number,
    totalValueConsumed: number,
    totalValueWasted: number,
    
    wasteRate: number,              // Percentage (0-100)
    consumptionRate: number,        // Percentage (0-100)
    averageItemLifespan: number,    // Days
    
    // Time-based
    periodStart: Date,
    periodEnd: Date,
    lastCalculated: Date
  },
  
  // Category breakdown
  categoryMetrics: {
    fridge: CategoryStats,
    freezer: CategoryStats,
    pantry: CategoryStats
  },
  
  // Historical data
  historicalData: {
    daily: DailyMetrics[],
    weekly: WeeklyMetrics[],
    monthly: MonthlyMetrics[]
  },
  
  // Goals
  goals: {
    wasteReductionTarget: number,   // Percentage
    savingsTarget: number,          // Dollar amount
    consumptionTarget: number,      // Percentage
    streakGoal: number             // Days
  },
  
  // Achievements
  achievements: {
    zeroWasteDays: number,
    currentStreak: number,
    longestStreak: number,
    totalSaved: number,
    milestonesReached: Milestone[]
  }
};

const CategoryStats = {
  itemsAdded: number,
  itemsConsumed: number,
  itemsWasted: number,
  valueAdded: number,
  valueConsumed: number,
  valueWasted: number,
  wasteRate: number
};

const DailyMetrics = {
  date: Date,
  itemsConsumed: number,
  itemsWasted: number,
  valueConsumed: number,
  valueWasted: number,
  wasteRate: number,
  isZeroWasteDay: boolean
};

const WeeklyMetrics = {
  weekStart: Date,
  weekEnd: Date,
  itemsConsumed: number,
  itemsWasted: number,
  valueConsumed: number,
  valueWasted: number,
  wasteRate: number,
  zeroWasteDays: number,
  averageDailyWaste: number
};

const MonthlyMetrics = {
  month: string,              // "2025-01"
  year: number,
  itemsConsumed: number,
  itemsWasted: number,
  valueConsumed: number,
  valueWasted: number,
  wasteRate: number,
  topWastedCategories: string[],
  improvementVsPrevious: number  // Percentage
};
```

### Event-Driven Data Collection
```javascript
const AnalyticsEventCollector = {
  // Listen to inventory events
  subscribeToEvents: () => {
    InventoryEventEmitter.on('item_added', (item) => {
      updateMetrics({
        totalItemsAdded: +1,
        totalValueAdded: +item.cost,
        categoryMetrics: {
          [item.category]: {
            itemsAdded: +1,
            valueAdded: +item.cost
          }
        }
      });
    });
    
    InventoryEventEmitter.on('item_consumed', (item) => {
      const consumedValue = item.cost * (item.percentageUsed / 100);
      const wastedValue = item.cost * (1 - item.percentageUsed / 100);
      
      updateMetrics({
        totalItemsConsumed: +1,
        totalValueConsumed: +consumedValue,
        totalValueWasted: +wastedValue,
        categoryMetrics: {
          [item.category]: {
            itemsConsumed: +1,
            valueConsumed: +consumedValue,
            valueWasted: +wastedValue
          }
        }
      });
      
      // Record daily data
      recordDailyMetric({
        date: new Date(),
        itemsConsumed: 1,
        valueConsumed: consumedValue,
        valueWasted: wastedValue
      });
      
      // Check for zero waste day
      checkZeroWasteDay();
    });
    
    InventoryEventEmitter.on('item_expired', (item) => {
      updateMetrics({
        totalItemsWasted: +1,
        totalValueWasted: +item.cost,
        categoryMetrics: {
          [item.category]: {
            itemsWasted: +1,
            valueWasted: +item.cost
          }
        }
      });
    });
  }
};
```

---

## Core Component Architecture

### 1. Analytics Dashboard

```javascript
const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState('week'); // 'week', 'month', 'year', 'all-time'
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadAnalytics(period);
  }, [period]);
  
  const loadAnalytics = async (timePeriod) => {
    setLoading(true);
    const data = await AnalyticsEngine.calculateMetrics(timePeriod);
    setMetrics(data);
    setLoading(false);
  };
  
  return (
    <div className="analytics-dashboard">
      <header>
        <h1>Analytics</h1>
        <PeriodSelector 
          value={period}
          onChange={setPeriod}
          options={['week', 'month', 'year', 'all-time']}
        />
      </header>
      
      {loading ? (
        <LoadingState />
      ) : (
        <>
          <KPISummaryCards metrics={metrics} />
          <WasteMetricsSection metrics={metrics} />
          <CostAnalysisSection metrics={metrics} />
          <TrendsSection metrics={metrics} period={period} />
          <CategoryBreakdownSection metrics={metrics} />
          <GoalsProgressSection metrics={metrics} />
        </>
      )}
    </div>
  );
};
```

### 2. Analytics Calculation Engine

```javascript
const AnalyticsEngine = {
  calculateMetrics: (period) => {
    const startDate = getPeriodStartDate(period);
    const endDate = new Date();
    
    // Aggregate raw data
    const rawData = getItemsInDateRange(startDate, endDate);
    
    // Calculate core metrics
    const consumed = rawData.filter(item => item.status === 'finished');
    const wasted = rawData.filter(item => item.percentageUsed < 100);
    
    const totalItemsConsumed = consumed.length;
    const totalItemsWasted = wasted.length;
    
    const totalValueConsumed = consumed.reduce((sum, item) => 
      sum + (item.cost * item.percentageUsed / 100), 0
    );
    
    const totalValueWasted = rawData.reduce((sum, item) => 
      sum + (item.cost * (1 - item.percentageUsed / 100)), 0
    );
    
    const totalValue = totalValueConsumed + totalValueWasted;
    const wasteRate = totalValue > 0 ? (totalValueWasted / totalValue * 100) : 0;
    const consumptionRate = 100 - wasteRate;
    
    // Category breakdown
    const categoryMetrics = calculateCategoryMetrics(rawData);
    
    // Trends
    const trends = calculateTrends(rawData, period);
    
    // Goals progress
    const goalsProgress = calculateGoalsProgress({
      wasteRate,
      totalValueWasted,
      totalValueConsumed
    });
    
    return {
      summary: {
        totalItemsConsumed,
        totalItemsWasted,
        totalValueConsumed,
        totalValueWasted,
        wasteRate,
        consumptionRate,
        totalValue
      },
      categoryMetrics,
      trends,
      goalsProgress,
      period,
      startDate,
      endDate
    };
  },
  
  calculateCategoryMetrics: (items) => {
    const categories = ['fridge', 'freezer', 'pantry'];
    
    return categories.reduce((acc, category) => {
      const categoryItems = items.filter(item => item.category === category);
      
      const consumed = categoryItems.filter(item => item.status === 'finished');
      const totalValue = categoryItems.reduce((sum, item) => sum + item.cost, 0);
      const wastedValue = categoryItems.reduce((sum, item) => 
        sum + (item.cost * (1 - item.percentageUsed / 100)), 0
      );
      
      acc[category] = {
        itemsAdded: categoryItems.length,
        itemsConsumed: consumed.length,
        itemsWasted: categoryItems.length - consumed.length,
        valueAdded: totalValue,
        valueWasted: wastedValue,
        wasteRate: totalValue > 0 ? (wastedValue / totalValue * 100) : 0
      };
      
      return acc;
    }, {});
  },
  
  calculateTrends: (items, period) => {
    if (period === 'week') {
      return calculateDailyTrends(items, 7);
    } else if (period === 'month') {
      return calculateWeeklyTrends(items, 4);
    } else if (period === 'year') {
      return calculateMonthlyTrends(items, 12);
    } else {
      return calculateMonthlyTrends(items);
    }
  },
  
  calculateGoalsProgress: (currentMetrics) => {
    const goals = getUserGoals();
    
    return {
      wasteReduction: {
        target: goals.wasteReductionTarget,
        current: currentMetrics.wasteRate,
        progress: calculateProgress(currentMetrics.wasteRate, goals.wasteReductionTarget),
        status: currentMetrics.wasteRate <= goals.wasteReductionTarget ? 'achieved' : 'in-progress'
      },
      savings: {
        target: goals.savingsTarget,
        current: currentMetrics.totalValueConsumed,
        progress: (currentMetrics.totalValueConsumed / goals.savingsTarget) * 100,
        status: currentMetrics.totalValueConsumed >= goals.savingsTarget ? 'achieved' : 'in-progress'
      }
    };
  }
};
```

### 3. KPI Summary Cards

```javascript
const KPISummaryCards = ({ metrics }) => {
  const kpis = [
    {
      id: 'waste-rate',
      title: 'Waste Rate',
      value: `${metrics.summary.wasteRate.toFixed(1)}%`,
      trend: calculateTrend(metrics, 'wasteRate'),
      icon: '📉',
      target: getUserGoals().wasteReductionTarget,
      format: 'percentage',
      inverse: true  // Lower is better
    },
    {
      id: 'money-well-spent',
      title: 'Money Well Spent',
      value: `${metrics.summary.totalValueConsumed.toFixed(2)}`,
      trend: calculateTrend(metrics, 'totalValueConsumed'),
      icon: '💰',
      target: getUserGoals().consumptionTarget,
      format: 'currency',
      description: 'Value of food you successfully consumed'
    },
    {
      id: 'total-wasted',
      title: 'Money Wasted',
      value: `$${metrics.summary.totalValueWasted.toFixed(2)}`,
      trend: calculateTrend(metrics, 'totalValueWasted'),
      icon: '🗑️',
      format: 'currency',
      inverse: true  // Lower is better
    },
    {
      id: 'consumption-rate',
      title: 'Consumption Rate',
      value: `${metrics.summary.consumptionRate.toFixed(1)}%`,
      trend: calculateTrend(metrics, 'consumptionRate'),
      icon: '✅',
      target: getUserGoals().consumptionTarget,
      format: 'percentage'
    }
  ];
  
  return (
    <div className="kpi-summary-cards">
      {kpis.map(kpi => (
        <KPICard key={kpi.id} {...kpi} />
      ))}
    </div>
  );
};

const KPICard = ({ title, value, trend, icon, target, format, inverse }) => {
  const trendDirection = getTrendDirection(trend, inverse);
  const isOnTarget = checkIfOnTarget(value, target, format, inverse);
  
  return (
    <div className={`kpi-card ${isOnTarget ? 'on-target' : ''}`}>
      <div className="kpi-header">
        <span className="icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      
      <div className="kpi-value">
        <span className="value">{value}</span>
        {trend && (
          <span className={`trend ${trendDirection}`}>
            {trendDirection === 'up' ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      
      {target && (
        <div className="kpi-target">
          <span>Target: {formatTarget(target, format)}</span>
          <ProgressBar 
            current={parseValue(value, format)}
            target={target}
            inverse={inverse}
          />
        </div>
      )}
    </div>
  );
};
```

### 4. Waste Metrics Visualization

```javascript
const WasteMetricsSection = ({ metrics }) => {
  const wasteData = {
    consumed: {
      count: metrics.summary.totalItemsConsumed,
      value: metrics.summary.totalValueConsumed,
      percentage: metrics.summary.consumptionRate
    },
    wasted: {
      count: metrics.summary.totalItemsWasted,
      value: metrics.summary.totalValueWasted,
      percentage: metrics.summary.wasteRate
    }
  };
  
  return (
    <section className="waste-metrics-section">
      <h2>Waste vs Consumption</h2>
      
      <div className="metrics-grid">
        {/* Pie Chart - Visual Breakdown */}
        <div className="chart-container">
          <PieChart
            data={[
              { name: 'Consumed', value: wasteData.consumed.value, color: '#4CAF50' },
              { name: 'Wasted', value: wasteData.wasted.value, color: '#F44336' }
            ]}
          />
        </div>
        
        {/* Detailed Breakdown */}
        <div className="metrics-breakdown">
          <MetricRow
            label="Consumed"
            count={wasteData.consumed.count}
            value={wasteData.consumed.value}
            percentage={wasteData.consumed.percentage}
            color="green"
          />
          <MetricRow
            label="Wasted"
            count={wasteData.wasted.count}
            value={wasteData.wasted.value}
            percentage={wasteData.wasted.percentage}
            color="red"
          />
        </div>
      </div>
      
      {/* Waste Rate Indicator */}
      <div className="waste-rate-indicator">
        <h3>Current Waste Rate</h3>
        <CircularProgress
          percentage={metrics.summary.wasteRate}
          target={getUserGoals().wasteReductionTarget}
          size={120}
          strokeWidth={12}
        />
        <p className="waste-rate-description">
          {getWasteRateDescription(metrics.summary.wasteRate)}
        </p>
      </div>
    </section>
  );
};

const getWasteRateDescription = (wasteRate) => {
  if (wasteRate < 5) return "🌟 Excellent! You're wasting very little food.";
  if (wasteRate < 15) return "👍 Good job! Keep up the great work.";
  if (wasteRate < 25) return "📈 Room for improvement. Try using items faster.";
  return "⚠️ High waste rate. Focus on consuming items before they expire.";
};
```

### 5. Cost Analysis Section

```javascript
const CostAnalysisSection = ({ metrics }) => {
  const monthlyProjection = calculateMonthlyProjection(metrics);
  const yearlyProjection = calculateYearlyProjection(metrics);
  const potentialSavings = calculatePotentialSavings(metrics);
  
  return (
    <section className="cost-analysis-section">
      <h2>Cost Analysis</h2>
      
      <div className="cost-cards-grid">
        {/* Total Inventory Value */}
        <CostCard
          title="Current Inventory Value"
          value={getCurrentInventoryValue()}
          description="Total value of items you currently have"
          icon="📦"
        />
        
        {/* Money Saved */}
        <CostCard
          title="Money Saved"
          value={metrics.summary.totalValueConsumed}
          description="Value of food you successfully consumed"
          icon="💰"
          trend={calculateTrend(metrics, 'totalValueConsumed')}
        />
        
        {/* Money Wasted */}
        <CostCard
          title="Money Wasted"
          value={metrics.summary.totalValueWasted}
          description="Value of food that went to waste"
          icon="🗑️"
          trend={calculateTrend(metrics, 'totalValueWasted')}
          inverse={true}
        />
        
        {/* Potential Savings */}
        <CostCard
          title="Potential Savings"
          value={potentialSavings}
          description="How much you could save by eliminating all waste"
          icon="🎯"
        />
      </div>
      
      {/* Projections */}
      <div className="projections">
        <h3>Projections</h3>
        <ProjectionCard
          title="Monthly Projection"
          saved={monthlyProjection.saved}
          wasted={monthlyProjection.wasted}
          total={monthlyProjection.total}
        />
        <ProjectionCard
          title="Yearly Projection"
          saved={yearlyProjection.saved}
          wasted={yearlyProjection.wasted}
          total={yearlyProjection.total}
        />
      </div>
      
      {/* ROI Tracking */}
      <div className="roi-tracking">
        <h3>Return on Investment</h3>
        <ROIMetrics
          appCost={0}  // Free for now
          moneySaved={metrics.summary.totalValueConsumed}
          wasteReduced={metrics.summary.totalValueWasted}
          period={metrics.period}
        />
      </div>
    </section>
  );
};

const calculateMonthlyProjection = (metrics) => {
  const daysInPeriod = getDaysInPeriod(metrics.period);
  const dailyAverage = {
    saved: metrics.summary.totalValueConsumed / daysInPeriod,
    wasted: metrics.summary.totalValueWasted / daysInPeriod
  };
  
  return {
    saved: dailyAverage.saved * 30,
    wasted: dailyAverage.wasted * 30,
    total: (dailyAverage.saved + dailyAverage.wasted) * 30
  };
};

const calculateYearlyProjection = (metrics) => {
  const monthlyProjection = calculateMonthlyProjection(metrics);
  return {
    saved: monthlyProjection.saved * 12,
    wasted: monthlyProjection.wasted * 12,
    total: monthlyProjection.total * 12
  };
};

const calculatePotentialSavings = (metrics) => {
  // If user eliminated all waste, they would save this much
  return metrics.summary.totalValueWasted;
};
```

### 6. Trends Visualization

```javascript
const TrendsSection = ({ metrics, period }) => {
  const [chartType, setChartType] = useState('line'); // 'line', 'bar', 'area'
  const trendsData = prepareTrendsData(metrics.trends, period);
  
  return (
    <section className="trends-section">
      <div className="section-header">
        <h2>Trends Over Time</h2>
        <ChartTypeSelector
          value={chartType}
          onChange={setChartType}
          options={['line', 'bar', 'area']}
        />
      </div>
      
      {/* Main Trends Chart */}
      <div className="trends-chart">
        {chartType === 'line' && (
          <LineChart
            data={trendsData}
            xKey="date"
            lines={[
              { key: 'consumed', color: '#4CAF50', name: 'Consumed' },
              { key: 'wasted', color: '#F44336', name: 'Wasted' }
            ]}
          />
        )}
        {chartType === 'bar' && (
          <BarChart
            data={trendsData}
            xKey="date"
            bars={[
              { key: 'consumed', color: '#4CAF50', name: 'Consumed' },
              { key: 'wasted', color: '#F44336', name: 'Wasted' }
            ]}
            stacked={true}
          />
        )}
        {chartType === 'area' && (
          <AreaChart
            data={trendsData}
            xKey="date"
            areas={[
              { key: 'consumed', color: '#4CAF50', name: 'Consumed' },
              { key: 'wasted', color: '#F44336', name: 'Wasted' }
            ]}
          />
        )}
      </div>
      
      {/* Waste Rate Trend */}
      <div className="waste-rate-trend">
        <h3>Waste Rate Trend</h3>
        <LineChart
          data={trendsData}
          xKey="date"
          lines={[
            { key: 'wasteRate', color: '#FF9800', name: 'Waste Rate (%)' }
          ]}
          targetLine={getUserGoals().wasteReductionTarget}
        />
      </div>
      
      {/* Insights */}
      <div className="trend-insights">
        <h3>Insights</h3>
        <InsightsList trends={trendsData} />
      </div>
    </section>
  );
};

const prepareTrendsData = (trends, period) => {
  return trends.map(dataPoint => ({
    date: formatDate(dataPoint.date, period),
    consumed: dataPoint.valueConsumed,
    wasted: dataPoint.valueWasted,
    wasteRate: dataPoint.wasteRate,
    itemsConsumed: dataPoint.itemsConsumed,
    itemsWasted: dataPoint.itemsWasted
  }));
};

const InsightsList = ({ trends }) => {
  const insights = generateInsights(trends);
  
  return (
    <ul className="insights-list">
      {insights.map((insight, index) => (
        <li key={index} className={`insight ${insight.type}`}>
          <span className="icon">{insight.icon}</span>
          <span className="text">{insight.message}</span>
        </li>
      ))}
    </ul>
  );
};

const generateInsights = (trends) => {
  const insights = [];
  
  // Trend direction
  const wasteRateTrend = calculateOverallTrend(trends.map(t => t.wasteRate));
  if (wasteRateTrend < -5) {
    insights.push({
      type: 'positive',
      icon: '📉',
      message: 'Your waste rate is decreasing! Great progress.'
    });
  } else if (wasteRateTrend > 5) {
    insights.push({
      type: 'warning',
      icon: '📈',
      message: 'Your waste rate is increasing. Try to use items faster.'
    });
  }
  
  // Best/Worst days
  const bestDay = trends.reduce((best, day) => 
    day.wasteRate < best.wasteRate ? day : best
  );
  const worstDay = trends.reduce((worst, day) => 
    day.wasteRate > worst.wasteRate ? day : worst
  );
  
  insights.push({
    type: 'info',
    icon: '🌟',
    message: `Best day: ${formatDate(bestDay.date)} with ${bestDay.wasteRate.toFixed(1)}% waste rate`
  });
  
  if (worstDay.wasteRate > 30) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      message: `Highest waste on ${formatDate(worstDay.date)} (${worstDay.wasteRate.toFixed(1)}%)`
    });
  }
  
  // Zero waste days
  const zeroWasteDays = trends.filter(t => t.wasteRate === 0).length;
  if (zeroWasteDays > 0) {
    insights.push({
      type: 'positive',
      icon: '🎉',
      message: `You had ${zeroWasteDays} zero-waste day${zeroWasteDays > 1 ? 's' : ''}!`
    });
  }
  
  return insights;
};
```

### 7. Category Breakdown

```javascript
const CategoryBreakdownSection = ({ metrics }) => {
  const [sortBy, setSortBy] = useState('wasteRate'); // 'wasteRate', 'value', 'items'
  
  const categories = Object.entries(metrics.categoryMetrics)
    .map(([name, stats]) => ({
      name,
      ...stats,
      color: getCategoryColor(name)
    }))
    .sort((a, b) => b[sortBy] - a[sortBy]);
  
  return (
    <section className="category-breakdown-section">
      <div className="section-header">
        <h2>Category Breakdown</h2>
        <SortSelector
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'wasteRate', label: 'Waste Rate' },
            { value: 'valueWasted', label: 'Money Wasted' },
            { value: 'itemsWasted', label: 'Items Wasted' }
          ]}
        />
      </div>
      
      {/* Category Cards */}
      <div className="category-cards">
        {categories.map(category => (
          <CategoryCard key={category.name} {...category} />
        ))}
      </div>
      
      {/* Comparative Chart */}
      <div className="category-comparison-chart">
        <h3>Category Comparison</h3>
        <BarChart
          data={categories}
          xKey="name"
          bars={[
            { key: 'valueConsumed', color: '#4CAF50', name: 'Consumed' },
            { key: 'valueWasted', color: '#F44336', name: 'Wasted' }
          ]}
          stacked={true}
        />
      </div>
    </section>
  );
};

const CategoryCard = ({ name, itemsAdded, itemsConsumed, itemsWasted, valueWasted, wasteRate, color }) => {
  return (
    <div className="category-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="category-header">
        <h3>{getCategoryLabel(name)}</h3>
        <span className="category-icon">{getCategoryIcon(name)}</span>
      </div>
      
      <div className="category-stats">
        <StatRow label="Items Added" value={itemsAdded} />
        <StatRow label="Items Consumed" value={itemsConsumed} color="green" />
        <StatRow label="Items Wasted" value={itemsWasted} color="red" />
        <StatRow label="Money Wasted" value={`$${valueWasted.toFixed(2)}`} color="red" />
      </div>
      
      <div className="category-waste-rate">
        <span>Waste Rate</span>
        <ProgressBar
          current={wasteRate}
          target={100}
          color={wasteRate < 15 ? 'green' : wasteRate < 30 ? 'orange' : 'red'}
          showPercentage={true}
        />
      </div>
    </div>
  );
};
```

### 8. Goals Progress Tracking

```javascript
const GoalsProgressSection = ({ metrics }) => {
  const goals = getUserGoals();
  const progress = metrics.goalsProgress;
  
  return (
    <section className="goals-progress-section">
      <h2>Goals Progress</h2>
      
      <div className="goals-grid">
        {/* Waste Reduction Goal */}
        <GoalCard
          title="Waste Reduction"
          icon="📉"
          current={metrics.summary.wasteRate}
          target={goals.wasteReductionTarget}
          unit="%"
          inverse={true}
          description="Target waste rate"
          status={progress.wasteReduction.status}
        />
        
        {/* Savings Goal */}
        <GoalCard
          title="Money Saved"
          icon="💰"
          current={metrics.summary.totalValueConsumed}
          target={goals.savingsTarget}
          unit="$"
          description="Target savings"
          status={progress.savings.status}
        />
        
        {/* Consumption Goal */}
        <GoalCard
          title="Consumption Rate"
          icon="✅"
          current={metrics.summary.consumptionRate}
          target={goals.consumptionTarget}
          unit="%"
          description="Target consumption rate"
          status={metrics.summary.consumptionRate >= goals.consumptionTarget ? 'achieved' : 'in-progress'}
        />
      </div>
      
      {/* Goal Setting */}
      <div className="goal-setting">
        <h3>Adjust Your Goals</h3>
        <GoalSettingForm
          currentGoals={goals}
          onUpdate={updateUserGoals}
        />
      </div>
    </section>
  );
};

const GoalCard = ({ title, icon, current, target, unit, inverse, description, status }) => {
  const progress = inverse 
    ? ((target - current) / target * 100)  // For goals where lower is better
    : (current / target * 100);            // For goals where higher is better
  
  const isAchieved = status === 'achieved';
  const progressClamped = Math.max(0, Math.min(100, progress));
  
  return (
    <div className={`goal-card ${isAchieved ? 'achieved' : ''}`}>
      <div className="goal-header">
        <span className="icon">{icon}</span>
        <h3>{title}</h3>
        {isAchieved && <span className="badge">✓ Achieved</span>}
      </div>
      
      <div className="goal-metrics">
        <div className="current-value">
          <span className="label">Current</span>
          <span className="value">{unit === ' ? unit : ''}{current.toFixed(unit === ' ? 2 : 1)}{unit !== ' ? unit : ''}</span>
        </div>
        <div className="target-value">
          <span className="label">Target</span>
          <span className="value">{unit === ' ? unit : ''}{target.toFixed(unit === ' ? 2 : 1)}{unit !== ' ? unit : ''}</span>
        </div>
      </div>
      
      <div className="goal-progress">
        <ProgressBar
          current={progressClamped}
          target={100}
          color={isAchieved ? 'green' : 'blue'}
          showPercentage={true}
        />
        <p className="description">{description}</p>
      </div>
    </div>
  );
};

const GoalSettingForm = ({ currentGoals, onUpdate }) => {
  const [goals, setGoals] = useState(currentGoals);
  const [hasChanges, setHasChanges] = useState(false);
  
  const handleChange = (key, value) => {
    setGoals(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };
  
  const handleSave = () => {
    onUpdate(goals);
    setHasChanges(false);
  };
  
  return (
    <form className="goal-setting-form">
      <div className="form-group">
        <label>Waste Rate Target (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={goals.wasteReductionTarget}
          onChange={(e) => handleChange('wasteReductionTarget', Number(e.target.value))}
        />
        <span className="helper-text">Lower is better</span>
      </div>
      
      <div className="form-group">
        <label>Monthly Savings Target ($)</label>
        <input
          type="number"
          min="0"
          step="10"
          value={goals.savingsTarget}
          onChange={(e) => handleChange('savingsTarget', Number(e.target.value))}
        />
        <span className="helper-text">Money you want to save per month</span>
      </div>
      
      <div className="form-group">
        <label>Consumption Rate Target (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={goals.consumptionTarget}
          onChange={(e) => handleChange('consumptionTarget', Number(e.target.value))}
        />
        <span className="helper-text">Percentage of food you want to consume</span>
      </div>
      
      {hasChanges && (
        <button type="button" onClick={handleSave} className="save-button">
          Save Goals
        </button>
      )}
    </form>
  );
};
```

---

## Performance Optimizations

### Data Aggregation Caching
```javascript
const AnalyticsCaching = {
  cache: new Map(),
  
  getCachedMetrics: (period) => {
    const cacheKey = `metrics_${period}_${getToday()}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      // Cache valid for 5 minutes
      if (Date.now() - cached.timestamp < 300000) {
        return cached.data;
      }
    }
    
    const metrics = AnalyticsEngine.calculateMetrics(period);
    this.cache.set(cacheKey, {
      data: metrics,
      timestamp: Date.now()
    });
    
    return metrics;
  },
  
  invalidateCache: () => {
    this.cache.clear();
  },
  
  // Clear cache when new data arrives
  onDataChange: () => {
    this.invalidateCache();
  }
};

// Listen for data changes
InventoryEventEmitter.on('item_consumed', AnalyticsCaching.onDataChange);
InventoryEventEmitter.on('item_added', AnalyticsCaching.onDataChange);
```

### Lazy Loading & Code Splitting
```javascript
const AnalyticsDashboardLazy = React.lazy(() => import('./AnalyticsDashboard'));

const AnalyticsPage = () => {
  return (
    <Suspense fallback={<AnalyticsLoadingState />}>
      <AnalyticsDashboardLazy />
    </Suspense>
  );
};
```

### Memoization for Expensive Calculations
```javascript
const useMemoizedMetrics = (period) => {
  return useMemo(() => {
    return AnalyticsCaching.getCachedMetrics(period);
  }, [period]);
};

const useMemoizedTrends = (trends, period) => {
  return useMemo(() => {
    return prepareTrendsData(trends, period);
  }, [trends, period]);
};
```

---

## Integration Architecture

### Event-Driven Updates
```javascript
const AnalyticsIntegration = {
  initialize: () => {
    // Subscribe to inventory events
    InventoryEventEmitter.on('item_consumed', this.handleItemConsumed);
    InventoryEventEmitter.on('item_added', this.handleItemAdded);
    InventoryEventEmitter.on('item_expired', this.handleItemExpired);
    
    // Subscribe to expiry events
    EventBus.on('expiry:item_consumed', this.updateConsumptionMetrics);
    EventBus.on('expiry:item_wasted', this.updateWasteMetrics);
    EventBus.on('expiry:zero_waste_day', this.recordZeroWasteDay);
  },
  
  handleItemConsumed: (item) => {
    const consumedValue = item.cost * (item.percentageUsed / 100);
    const wastedValue = item.cost * (1 - item.percentageUsed / 100);
    
    // Update real-time metrics
    updateMetrics({
      totalValueConsumed: consumedValue,
      totalValueWasted: wastedValue
    });
    
    // Record daily data point
    recordDailyMetric({
      date: new Date(),
      itemsConsumed: 1,
      valueConsumed: consumedValue,
      valueWasted: wastedValue
    });
    
    // Check achievements
    checkAchievements('item_consumed', item);
    
    // Invalidate cache
    AnalyticsCaching.invalidateCache();
    
    // Emit analytics event for other modules
    EventBus.emit('analytics:metrics_updated', getLatestMetrics());
  },
  
  handleItemAdded: (item) => {
    updateMetrics({
      totalItemsAdded: 1,
      totalValueAdded: item.cost
    });
    
    AnalyticsCaching.invalidateCache();
  },
  
  handleItemExpired: (item) => {
    updateMetrics({
      totalItemsWasted: 1,
      totalValueWasted: item.cost
    });
    
    recordDailyMetric({
      date: new Date(),
      itemsWasted: 1,
      valueWasted: item.cost
    });
    
    AnalyticsCaching.invalidateCache();
  },
  
  recordZeroWasteDay: (data) => {
    updateAchievements({
      zeroWasteDays: +1,
      currentStreak: data.itemsConsumed > 0 ? updateStreak() : 0
    });
    
    // Emit event for gamification
    EventBus.emit('analytics:zero_waste_day', data);
  }
};
```

### Gamification Integration
```javascript
const AnalyticsGamificationIntegration = {
  checkAchievements: (action, data) => {
    const metrics = getLatestMetrics();
    
    // Waste reduction achievements
    if (metrics.summary.wasteRate < 5) {
      unlockAchievement('waste_warrior');
    }
    
    // Savings achievements
    if (metrics.summary.totalValueConsumed >= 50) {
      unlockAchievement('fifty_saver');
    }
    if (metrics.summary.totalValueConsumed >= 100) {
      unlockAchievement('hundred_saver');
    }
    
    // Streak achievements
    const streakDays = metrics.achievements.currentStreak;
    if (streakDays >= 7) {
      unlockAchievement('week_streak');
    }
    if (streakDays >= 30) {
      unlockAchievement('month_streak');
    }
    
    // Zero waste achievements
    if (metrics.achievements.zeroWasteDays >= 10) {
      unlockAchievement('zero_waste_champion');
    }
  },
  
  // Provide data to gamification module
  getGamificationData: () => ({
    totalSaved: getLatestMetrics().summary.totalValueConsumed,
    wasteRate: getLatestMetrics().summary.wasteRate,
    currentStreak: getLatestMetrics().achievements.currentStreak,
    zeroWasteDays: getLatestMetrics().achievements.zeroWasteDays
  })
};
```

---

## Data Export & Sharing

### Export Functionality
```javascript
const DataExportService = {
  exportToCSV: (period) => {
    const metrics = AnalyticsEngine.calculateMetrics(period);
    const csvData = convertToCSV(metrics);
    
    downloadFile(csvData, `waste-warrior-analytics-${period}.csv`, 'text/csv');
  },
  
  exportToPDF: async (period) => {
    const metrics = AnalyticsEngine.calculateMetrics(period);
    const pdfData = await generatePDFReport(metrics);
    
    downloadFile(pdfData, `waste-warrior-report-${period}.pdf`, 'application/pdf');
  },
  
  exportToJSON: (period) => {
    const metrics = AnalyticsEngine.calculateMetrics(period);
    const jsonData = JSON.stringify(metrics, null, 2);
    
    downloadFile(jsonData, `waste-warrior-data-${period}.json`, 'application/json');
  },
  
  shareToSocial: (platform, period) => {
    const metrics = AnalyticsEngine.calculateMetrics(period);
    const shareData = generateShareData(metrics, period);
    
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
  }
};

const generateShareData = (metrics, period) => {
  const wasteReduction = 100 - metrics.summary.wasteRate;
  const moneySaved = metrics.summary.totalValueConsumed;
  
  return {
    text: `🌱 I saved ${moneySaved.toFixed(2)} this ${period} using Waste Warrior! My waste rate is ${metrics.summary.wasteRate.toFixed(1)}% 📉 #WasteWarrior #ZeroWaste #FoodWaste`,
    image: generateShareImage(metrics),
    url: 'https://wastewarrior.app'
  };
};
```

### Report Generation
```javascript
const ReportGenerator = {
  generateMonthlyReport: async (month, year) => {
    const metrics = AnalyticsEngine.calculateMetrics('month');
    
    return {
      title: `Monthly Report - ${month} ${year}`,
      summary: {
        totalSaved: metrics.summary.totalValueConsumed,
        totalWasted: metrics.summary.totalValueWasted,
        wasteRate: metrics.summary.wasteRate,
        improvement: calculateImprovementVsPrevious(metrics)
      },
      categoryBreakdown: metrics.categoryMetrics,
      trends: metrics.trends,
      achievements: metrics.achievements,
      recommendations: generateRecommendations(metrics),
      charts: [
        generateWasteVsConsumptionChart(metrics),
        generateTrendsChart(metrics),
        generateCategoryChart(metrics)
      ]
    };
  },
  
  generateRecommendations: (metrics) => {
    const recommendations = [];
    
    // High waste rate recommendation
    if (metrics.summary.wasteRate > 25) {
      recommendations.push({
        type: 'warning',
        title: 'High Waste Rate',
        message: 'Your waste rate is above 25%. Try to plan meals better and check expiry dates more frequently.',
        action: 'Set a daily reminder to check items at risk'
      });
    }
    
    // Category-specific recommendations
    Object.entries(metrics.categoryMetrics).forEach(([category, stats]) => {
      if (stats.wasteRate > 30) {
        recommendations.push({
          type: 'tip',
          title: `${getCategoryLabel(category)} Waste`,
          message: `You're wasting ${stats.wasteRate.toFixed(1)}% of ${getCategoryLabel(category)} items. Consider buying smaller quantities.`,
          action: `Review ${getCategoryLabel(category)} items more frequently`
        });
      }
    });
    
    // Positive reinforcement
    if (metrics.summary.wasteRate < 10) {
      recommendations.push({
        type: 'success',
        title: 'Excellent Performance!',
        message: 'You have a very low waste rate. Keep up the great work!',
        action: 'Share your success with friends'
      });
    }
    
    return recommendations;
  }
};
```

---

## Implementation Phases

### Phase 1: Core Analytics (Weeks 1-2)
**Foundation Metrics & Dashboard**
- ✅ Basic metrics calculation engine
- ✅ KPI summary cards (waste rate, money saved/wasted)
- ✅ Simple data aggregation
- ✅ Event-driven data collection
- ✅ Category breakdown

**Deliverables:**
- Working analytics dashboard with core KPIs
- Real-time metrics updates
- Basic category analysis
- Simple period selection (week/month/year)

### Phase 2: Visualizations (Weeks 3-4)
**Charts & Trends**
- ✅ Waste vs consumption pie chart
- ✅ Trends over time (line/bar/area charts)
- ✅ Category comparison charts
- ✅ Waste rate visualization
- ✅ Insights generation

**Deliverables:**
- Complete visualization suite
- Multiple chart types
- Automated insights
- Comparative analysis

### Phase 3: Goals & Projections (Weeks 5-6)
**Goal Tracking & Forecasting**
- ✅ Goal setting interface
- ✅ Progress tracking
- ✅ Monthly/yearly projections
- ✅ ROI calculations
- ✅ Achievement tracking

**Deliverables:**
- Goals management system
- Projection calculations
- Achievement integration
- Performance recommendations

### Phase 4: Export & Polish (Weeks 7-8)
**Data Export & Refinement**
- ✅ CSV/PDF/JSON export
- ✅ Report generation
- ✅ Social sharing
- ✅ UI/UX refinement
- ✅ Performance optimization

**Deliverables:**
- Complete export functionality
- Monthly report generation
- Social sharing features
- Production-ready module

---

## Success Metrics

### Technical KPIs
- **Calculation speed**: < 100ms for all period calculations
- **Cache hit rate**: > 70% for repeat queries
- **Chart render time**: < 500ms for all visualizations
- **Data accuracy**: 100% (matches raw data)
- **Update latency**: < 50ms from event to UI update

### User Engagement KPIs
- **Dashboard visits**: > 50% of users check weekly
- **Period exploration**: Users view multiple time periods
- **Goal setting**: > 40% of users set custom goals
- **Export usage**: > 20% export data monthly
- **Insight engagement**: > 60% read generated insights

### Behavioral Impact KPIs
- **Waste reduction**: Measurable decrease week-over-week
- **Goal achievement**: > 50% of users reach goals
- **Improvement correlation**: Analytics usage correlates with waste reduction
- **Retention**: Users who view analytics have 30%+ higher retention

### Business Metrics
- **Feature satisfaction**: > 4.5/5 rating
- **Premium conversion**: Analytics drives upgrade decisions
- **Sharing rate**: > 15% share achievements
- **Support tickets**: < 3% related to analytics

---

## Error Handling & Edge Cases

### Data Validation
```javascript
const AnalyticsValidation = {
  validateMetrics: (metrics) => {
    // Ensure percentages are valid
    if (metrics.wasteRate < 0 || metrics.wasteRate > 100) {
      logError('Invalid waste rate', metrics);
      return getDefaultMetrics();
    }
    
    // Ensure values are non-negative
    if (metrics.totalValueWasted < 0 || metrics.totalValueConsumed < 0) {
      logError('Negative values detected', metrics);
      return getDefaultMetrics();
    }
    
    // Ensure data consistency
    const calculatedWasteRate = (metrics.totalValueWasted / 
      (metrics.totalValueWasted + metrics.totalValueConsumed)) * 100;
    
    if (Math.abs(calculatedWasteRate - metrics.wasteRate) > 1) {
      logWarning('Waste rate mismatch', { calculated: calculatedWasteRate, reported: metrics.wasteRate });
    }
    
    return metrics;
  },
  
  handleCalculationError: (error, period) => {
    logError('Analytics calculation failed', { error, period });
    
    // Return safe default
    return {
      summary: {
        totalItemsConsumed: 0,
        totalItemsWasted: 0,
        totalValueConsumed: 0,
        totalValueWasted: 0,
        wasteRate: 0,
        consumptionRate: 0
      },
      error: true,
      message: 'Unable to calculate analytics. Please try again.'
    };
  }
};
```

### Empty State Handling
```javascript
const EmptyStateHandler = {
  getEmptyStateMessage: (period, metrics) => {
    if (metrics.summary.totalItemsAdded === 0) {
      return {
        title: 'No Data Yet',
        message: 'Start adding items to your inventory to see analytics!',
        action: 'Add Your First Item',
        icon: '📊'
      };
    }
    
    if (metrics.summary.totalItemsConsumed === 0 && metrics.summary.totalItemsWasted === 0) {
      return {
        title: 'No Activity This Period',
        message: `You haven't consumed or wasted any items this ${period}. Your food is still fresh!`,
        icon: '🌱'
      };
    }
    
    return null;  // Has data, show normal analytics
  }
};
```

---

## Testing Strategy

### Unit Tests
```javascript
describe('AnalyticsEngine', () => {
  test('should calculate waste rate correctly', () => {
    const items = [
      { cost: 10, percentageUsed: 100 },  // $10 consumed
      { cost: 10, percentageUsed: 50 },   // $5 consumed, $5 wasted
      { cost: 10, percentageUsed: 0 }     // $10 wasted
    ];
    
    const metrics = AnalyticsEngine.calculateMetrics('week');
    expect(metrics.summary.totalValueConsumed).toBe(15);
    expect(metrics.summary.totalValueWasted).toBe(15);
    expect(metrics.summary.wasteRate).toBe(50);
  });
  
  test('should handle zero division gracefully', () => {
    const items = [];
    const metrics = AnalyticsEngine.calculateMetrics('week');
    expect(metrics.summary.wasteRate).toBe(0);
  });
  
  test('should calculate trends correctly', () => {
    const trends = AnalyticsEngine.calculateTrends(mockItems, 'week');
    expect(trends).toHaveLength(7);  // 7 days for week
    expect(trends[0]).toHaveProperty('date');
    expect(trends[0]).toHaveProperty('wasteRate');
  });
});

describe('CategoryMetrics', () => {
  test('should break down by category accurately', () => {
    const items = [
      { category: 'fridge', cost: 10, percentageUsed: 100 },
      { category: 'freezer', cost: 20, percentageUsed: 50 }
    ];
    
    const categoryMetrics = AnalyticsEngine.calculateCategoryMetrics(items);
    expect(categoryMetrics.fridge.valueWasted).toBe(0);
    expect(categoryMetrics.freezer.valueWasted).toBe(10);
  });
});
```

### Integration Tests
```javascript
describe('Analytics Integration', () => {
  test('should update metrics when item consumed', () => {
    const initialMetrics = getLatestMetrics();
    
    consumeItem('item-123', 75);
    
    const updatedMetrics = getLatestMetrics();
    expect(updatedMetrics.summary.totalValueConsumed).toBeGreaterThan(
      initialMetrics.summary.totalValueConsumed
    );
  });
  
  test('should invalidate cache on data change', () => {
    const cachedMetrics = AnalyticsCaching.getCachedMetrics('week');
    
    addNewItem({ name: 'Test', cost: 10 });
    
    const newMetrics = AnalyticsCaching.getCachedMetrics('week');
    expect(newMetrics).not.toEqual(cachedMetrics);
  });
});
```

---

## Future Enhancements (Post-MVP)

### Advanced Analytics
- **Predictive Analytics**: ML-based waste prediction
- **Seasonal Patterns**: Identify seasonal waste trends
- **Comparative Analytics**: Compare with similar users
- **Custom Reports**: User-defined report templates

### Enhanced Visualizations
- **Interactive Charts**: Drill-down capabilities
- **Heat Maps**: Waste patterns by day/time
- **Correlation Analysis**: Find waste pattern correlations
- **3D Visualizations**: Multi-dimensional data views

### Integration Expansions
- **Recipe Integration**: Link wasted items to missed recipes
- **Shopping Integration**: Optimize purchasing based on waste patterns
- **Environmental Impact**: CO2 and environmental metrics
- **Community Benchmarks**: Compare with community averages

---

## Summary

The Analytics & Reporting module provides comprehensive insights into user behavior through:

1. **Real-Time Metrics**: Live KPI tracking with instant updates
2. **Visual Analytics**: Charts and graphs for easy data comprehension
3. **Goal Tracking**: Progress monitoring toward waste reduction targets
4. **Cost Analysis**: Financial impact visualization and projections
5. **Trend Analysis**: Historical patterns and insights
6. **Category Breakdown**: Detailed analysis by storage location
7. **Data Export**: CSV/PDF/JSON export and social sharing
8. **Actionable Insights**: Automated recommendations for improvement

This module transforms raw data into actionable insights that drive lasting behavioral change.