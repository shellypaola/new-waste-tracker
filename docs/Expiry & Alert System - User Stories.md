# Expiry & Alert System - User Stories

## Epic: Proactive Food Waste Prevention
*As a user, I want to be alerted about expiring food items so that I can consume them before they go to waste and save money.*

---

## Theme 1: Visual Status Indicators

### Story 1.1: Color-Coded Expiry Status
**As a** user  
**I want to** see color-coded indicators on my food items  
**So that I can** immediately identify which items need attention  

**Acceptance Criteria:**
- Items expiring in 3+ days show green indicator (fresh)
- Items expiring within 3 days show yellow background (warning)
- Items expiring within 24 hours show red background (critical)
- Expired items show grey/faded appearance with "EXPIRED" badge
- Color coding is consistent across all views (inventory, dashboard, item details)

**Priority:** HIGH  
**Story Points:** 3

---

### Story 1.2: Expiry Time Display
**As a** user  
**I want to** see how long until items expire  
**So that I can** plan when to use them  

**Acceptance Criteria:**
- Fresh items show "Xd remaining" (e.g., "5d remaining")
- Critical items show "Xh remaining" (e.g., "18h remaining")
- Expired items show "Expired" text
- Time display updates when I reopen the app
- Time is accurate based on current date/time

**Priority:** HIGH  
**Story Points:** 2

---

### Story 1.3: Visual Badges and Icons
**As a** user  
**I want to** see clear badges on items at risk  
**So that I can** quickly scan my inventory for problems  

**Acceptance Criteria:**
- Critical items show "EXPIRES TODAY" badge in red
- Warning items show "EXPIRES SOON" badge in yellow
- Expired items show "EXPIRED" badge
- Badge colors match background treatment
- Icons (🔴🟡🟢⚠️) provide additional visual cues

**Priority:** MEDIUM  
**Story Points:** 2

---

## Theme 2: Daily Notifications

### Story 2.1: Morning Expiry Alert
**As a** user  
**I want to** receive a notification each morning about expiring items  
**So that I can** plan my meals around items that need to be used  

**Acceptance Criteria:**
- I receive a notification at 7:00 AM daily (customizable)
- Notification only appears if I have items expiring today or soon
- Notification shows count of critical items (expiring today)
- Notification displays total value at risk
- I see top 3 item names in the notification body
- Tapping notification opens the Items at Risk dashboard

**Priority:** HIGH  
**Story Points:** 8

---

### Story 2.2: Notification Customization
**As a** user  
**I want to** customize my notification preferences  
**So that** alerts work with my schedule  

**Acceptance Criteria:**
- I can enable/disable daily notifications
- I can set my preferred notification time
- I can enable quiet hours to prevent notifications at night
- I can choose to only get notified when items are actually at risk
- I can control sound and vibration settings
- Changes save immediately and persist across app restarts

**Priority:** MEDIUM  
**Story Points:** 5

---

### Story 2.3: Notification Actions
**As a** user  
**I want to** take action directly from notifications  
**So that I can** quickly respond to alerts  

**Acceptance Criteria:**
- I can tap "View Items" to see items at risk
- I can dismiss the notification
- App opens to the correct screen when tapping actions
- Dismissed notifications don't reappear until next scheduled time

**Priority:** MEDIUM  
**Story Points:** 3

---

## Theme 3: Items at Risk Dashboard

### Story 3.1: Prioritized Risk List
**As a** user  
**I want to** see my expiring items in priority order  
**So that I can** focus on the most important items first  

**Acceptance Criteria:**
- Items are sorted by risk score (highest priority first)
- More expensive items appear before cheaper items (when expiry is same)
- Items expiring sooner appear before items with more time
- I can see the risk priority is logical and helpful
- List updates immediately when I consume or update items

**Priority:** HIGH  
**Story Points:** 5

---

### Story 3.2: Dashboard Filtering
**As a** user  
**I want to** filter items at risk by urgency  
**So that I can** focus on specific priority levels  

**Acceptance Criteria:**
- I can view "All" items at risk
- I can filter to show only "Critical" items (expires today)
- I can filter to show only "Warning" items (expires in 3 days)
- Filter tabs show count of items in each category
- Active filter is clearly highlighted
- Filters work instantly without loading

**Priority:** MEDIUM  
**Story Points:** 3

---

### Story 3.3: Risk Summary Cards
**As a** user  
**I want to** see a summary of items at risk  
**So that I can** understand my overall situation at a glance  

**Acceptance Criteria:**
- I see total count of items at risk
- I see total value of items at risk
- I see breakdown by category (Critical vs Warning)
- Summary updates when items are consumed or expire
- Summary is displayed prominently at top of dashboard

**Priority:** MEDIUM  
**Story Points:** 3

---

### Story 3.4: Empty State Celebration
**As a** user  
**I want to** see a positive message when no items are at risk  
**So that I feel** good about my food management  

**Acceptance Criteria:**
- When all items are fresh, I see "No items at risk! 🎉"
- Empty state is encouraging and positive
- I can still access my full inventory from this screen
- Empty state appears after I successfully consume all at-risk items

**Priority:** LOW  
**Story Points:** 1

---

## Theme 4: Consumption Tracking

### Story 4.1: Mark Item as Used
**As a** user  
**I want to** quickly mark items as consumed  
**So that I can** track what I've used and update my inventory  

**Acceptance Criteria:**
- I can tap "Mark as Used" button on any item
- A dialog opens asking how much I used
- I can select percentage used (0%, 25%, 50%, 75%, 100%)
- I can fine-tune with a slider (0-100% in 5% increments)
- Confirming removes the item from active inventory
- Consumption data is tracked for analytics

**Priority:** HIGH  
**Story Points:** 5

---

### Story 4.2: Percentage-Based Waste Calculation
**As a** user  
**I want** the app to calculate waste based on how much I used  
**So that I can** accurately track my consumption and waste  

**Acceptance Criteria:**
- If I use 100%, $0 is wasted
- If I use 50%, half the cost is wasted
- If I use 0%, full cost is wasted
- Calculations are accurate for all percentages
- Warning appears when selecting 0% ("⚠️ All wasted")
- Success message appears when selecting 100% ("✅ Fully consumed!")

**Priority:** HIGH  
**Story Points:** 3

---

### Story 4.3: Quick Consumption Options
**As a** user  
**I want** preset percentage options  
**So that I can** quickly mark common usage amounts  

**Acceptance Criteria:**
- I can tap buttons for 0%, 25%, 50%, 75%, 100%
- Selected percentage is visually highlighted
- Tapping a button updates the slider position
- Moving the slider updates the percentage display
- I can use either buttons or slider - whichever is faster

**Priority:** MEDIUM  
**Story Points:** 2

---

## Theme 5: Weekly Summary

### Story 5.1: Sunday Morning Summary
**As a** user  
**I want to** receive a weekly summary of my food management  
**So that I can** see my progress and identify patterns  

**Acceptance Criteria:**
- I receive a notification on Sunday at 9:00 AM (customizable)
- Notification shows total value saved this week
- Notification shows total value wasted this week
- Notification displays my waste rate percentage
- I can tap to see full details in analytics view
- Summary only includes data from the past 7 days

**Priority:** HIGH  
**Story Points:** 5

---

### Story 5.2: Summary Customization
**As a** user  
**I want to** customize my weekly summary preferences  
**So that** it fits my schedule  

**Acceptance Criteria:**
- I can enable/disable weekly summaries
- I can choose which day to receive summary (any day of week)
- I can set preferred time for summary
- I can view past summaries in the app
- Settings are accessible from notification preferences

**Priority:** MEDIUM  
**Story Points:** 3

---

### Story 5.3: Summary Data Accuracy
**As a** user  
**I want** accurate weekly summary data  
**So that I can** trust the insights I'm receiving  

**Acceptance Criteria:**
- Consumed value accurately reflects items marked as used
- Wasted value accurately reflects partial/full waste
- Waste rate calculation is correct (wasted ÷ total)
- Summary includes all items consumed/wasted in the week
- Numbers match if I manually calculate from my history

**Priority:** HIGH  
**Story Points:** 3

---

## Theme 6: Real-Time Updates

### Story 6.1: Event-Driven Dashboard Updates
**As a** user  
**I want** the dashboard to update immediately when I take actions  
**So that I** always see current, accurate information  

**Acceptance Criteria:**
- Dashboard updates when I add new items
- Dashboard updates when I mark items as consumed
- Dashboard updates when I edit item expiry dates
- Dashboard updates when items expire (on app open)
- Updates happen without page refresh or manual reload
- No noticeable delay between action and update

**Priority:** HIGH  
**Story Points:** 5

---

### Story 6.2: KPI Updates on Consumption
**As a** user  
**I want** my waste and savings metrics to update when I consume items  
**So that I can** see immediate impact of my actions  

**Acceptance Criteria:**
- Consumed value increases when I mark items as used
- Wasted value increases based on percentage wasted
- Waste rate recalculates automatically
- Updates happen immediately after confirming consumption
- All related metrics update together (no partial updates)

**Priority:** HIGH  
**Story Points:** 3

---

## Theme 7: App Lifecycle Management

### Story 7.1: Expired Item Detection on App Open
**As a** user  
**I want** newly expired items to be identified when I open the app  
**So that I can** resolve them promptly  

**Acceptance Criteria:**
- App checks for expired items every time I open it
- Items that expired since last session move to "Recently Expired"
- I see updated counts on dashboard immediately
- Expired items trigger the resolution workflow
- Check happens in background without blocking app

**Priority:** HIGH  
**Story Points:** 3

---

### Story 7.2: Background Notification Scheduling
**As a** user  
**I want** notifications to be scheduled reliably  
**So that I** never miss important alerts  

**Acceptance Criteria:**
- Notifications are scheduled when I close the app
- Scheduled notifications persist across app restarts
- System delivers notifications even when app is closed
- Notification schedule updates when I change preferences
- Failed notifications are retried appropriately

**Priority:** HIGH  
**Story Points:** 5

---

## Theme 8: Error Handling & Edge Cases

### Story 8.1: Notification Permission Handling
**As a** user  
**I want** clear guidance if notifications are disabled  
**So that I can** enable them if I choose  

**Acceptance Criteria:**
- App checks notification permissions on first launch
- If denied, app shows in-app alerts as alternative
- I can see a prompt to enable notifications in settings
- App explains benefits of enabling notifications
- I can use all features even with notifications disabled

**Priority:** MEDIUM  
**Story Points:** 3

---

### Story 8.2: Status Calculation Failures
**As a** user  
**I want** the app to handle errors gracefully  
**So that** one broken item doesn't crash my experience  

**Acceptance Criteria:**
- If expiry calculation fails, item shows as "fresh" (safe default)
- Error is logged for debugging but not shown to user
- Other items continue to work normally
- I can still edit the problematic item to fix it
- App doesn't crash or freeze due to calculation errors

**Priority:** MEDIUM  
**Story Points:** 3

---

### Story 8.3: Quiet Hours Enforcement
**As a** user  
**I want** quiet hours to be respected  
**So that I'm** not disturbed at night  

**Acceptance Criteria:**
- Notifications don't appear during quiet hours
- Missed notifications are delivered when quiet hours end
- I can see that quiet hours are active in settings
- Quiet hours work across time zones
- Emergency notifications (if any) can override quiet hours

**Priority:** MEDIUM  
**Story Points:** 3

---

## Non-Functional Requirements

### Performance Stories

**As a** user  
**I want** the expiry system to be fast and responsive  
**So that** it doesn't slow down my app experience  

**Acceptance Criteria:**
- Status calculations complete in under 50ms for 100+ items
- Dashboard updates appear within 100ms of action
- Notifications are delivered on time (within 1 minute of scheduled time)
- Cache prevents redundant calculations
- No lag when opening Items at Risk dashboard

**Priority:** HIGH  
**Story Points:** 5

---

### Reliability Stories

**As a** user  
**I want** notifications to be reliable  
**So that I** don't miss important expiry alerts  

**Acceptance Criteria:**
- 100% of scheduled notifications are delivered (barring system issues)
- Notification content is always accurate
- Failed deliveries are retried appropriately
- Notifications work across different device states (locked, background, etc.)
- System handles low battery and data saver modes

**Priority:** HIGH  
**Story Points:** 5

---

### Accessibility Stories

**As a** user with accessibility needs  
**I want** expiry indicators to be accessible  
**So that I can** use the app regardless of my abilities  

**Acceptance Criteria:**
- Color is not the only indicator (text badges also present)
- Screen readers announce expiry status clearly
- High contrast mode is supported
- Touch targets are adequately sized (44x44px minimum)
- Notification text is clear and descriptive

**Priority:** MEDIUM  
**Story Points:** 3

---

## Story Dependencies and Flow

```
Visual Indicators (1.1, 1.2, 1.3) 
    ↓
Dashboard (3.1, 3.2, 3.3) → Consumption (4.1, 4.2, 4.3) → Updates (6.1, 6.2)
    ↓
Daily Notifications (2.1, 2.2, 2.3)
    ↓
Weekly Summary (5.1, 5.2, 5.3)
    ↓
Lifecycle & Error Handling (7.1, 7.2, 8.1, 8.2, 8.3)
```

## Implementation Priority

### Sprint 1: Visual Foundation (Week 1-2)
- Stories 1.1, 1.2, 1.3, 3.1, 4.1, 4.2 (Visual indicators, basic dashboard, consumption tracking)

### Sprint 2: Notifications (Week 3-4)
- Stories 2.1, 2.2, 2.3, 7.2 (Daily notifications, preferences, scheduling)

### Sprint 3: Summary & Updates (Week 5-6)
- Stories 5.1, 5.2, 5.3, 6.1, 6.2, 7.1 (Weekly summary, real-time updates)

### Sprint 4: Polish & Reliability (Week 7-8)
- Stories 3.4, 4.3, 8.1, 8.2, 8.3 (Error handling, edge cases, refinement)

---

## Success Metrics

### User Engagement
- **Daily dashboard views:** > 60% of active users
- **Notification interaction rate:** > 75% tap to view items
- **Consumption tracking:** > 80% of users mark items as used
- **Preferences adoption:** > 40% customize notification settings

### Behavioral Impact
- **Items consumed vs expired:** > 3:1 ratio
- **Response time to alerts:** < 4 hours average from notification to action
- **Weekly summary views:** > 50% tap to see details
- **Waste reduction:** Measurable decrease week-over-week

### Technical Performance
- **Notification delivery:** > 99% success rate
- **Dashboard load time:** < 1 second
- **Status accuracy:** 100% (correct expiry status)
- **Update responsiveness:** < 100ms for all updates

### User Satisfaction
- **Feature rating:** > 4.5/5 stars
- **Notification opt-in:** > 85% keep enabled
- **Support tickets:** < 5% related to expiry system
- **User retention:** Positive correlation with expiry feature usage