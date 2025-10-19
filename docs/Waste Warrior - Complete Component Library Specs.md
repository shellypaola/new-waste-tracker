# Waste Warrior - Complete Component Library Specifications
## Final Version 1.0 - Ready for Development

---

## 📋 Table of Contents
1. [Design System Foundation](#design-system-foundation)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Specifications](#component-specifications)
6. [Implementation Notes](#implementation-notes)

---

## Design System Foundation

### Philosophy
- **Mobile-First**: Every component optimized for mobile touch interfaces
- **Compact & Efficient**: Dense layouts to minimize scrolling
- **Semantic Colors**: Colors convey meaning (red=waste, blue=consumed, purple=community)
- **Modern iOS Aesthetic**: Frosted glass, clean lines, subtle shadows

### Browser Support
- iOS Safari 14+
- Chrome 90+
- Edge 90+
- Firefox 88+

---

## Color Palette

### Primary Brand Colors
```css
/* Lime Green - Primary Brand Color */
--primary: #84CC16;           /* lime-500 */
--primary-dark: #65A30D;       /* lime-600 */
--primary-light: #D9F99D;      /* lime-200 */

/* Why lime: Fresh, organic, food-appropriate. Less "traffic light" than standard green */
```

### Semantic Colors - KPI Cards
```css
/* Wasted (Negative) */
--wasted-bg: #FEE2E2;          /* red-100 */
--wasted-icon-bg: #FCA5A5;     /* red-300 */
--wasted-text: #B91C1C;        /* red-700 */
--wasted-subtitle: #DC2626;    /* red-600 */

/* Consumed (Positive) */
--consumed-bg: #DBEAFE;        /* blue-100 */
--consumed-icon-bg: #93C5FD;   /* blue-300 */
--consumed-text: #1D4ED8;      /* blue-700 */
--consumed-subtitle: #2563EB;  /* blue-600 */

/* Community (Impact) */
--community-gradient-start: #A855F7;  /* purple-500 */
--community-gradient-end: #EC4899;    /* pink-500 */
--community-text: #FFFFFF;
```

### Alert Colors - Item Cards
```css
/* Critical (Expires Today) */
--critical-border: #EF4444;    /* red-500, 4px left border */
--critical-text: #DC2626;      /* red-600 */

/* Warning (Expires Soon) */
--warning-border: #F59E0B;     /* amber-500, 3px left border */
--warning-text: #D97706;       /* amber-600 */

/* Fresh */
--fresh-border: #E5E7EB;       /* gray-200, 1px all border */
--fresh-text: #6B7280;         /* gray-500 */
```

### Category Colors
```css
--category-all: #00BCD4;       /* teal - achievement color */
--category-fridge: #84CC16;    /* lime - primary */
--category-freezer: #1976D2;   /* blue-700 */
--category-pantry: #6D4C41;    /* brown-600 */

/* Light backgrounds for item icons */
--fridge-light: #E8F5E9;       /* green-50 */
--freezer-light: #E3F2FD;      /* blue-50 */
--pantry-light: #EFEBE9;       /* brown-50 */
```

### Gamification Colors
```css
--achievement-gradient-start: #00BCD4;  /* teal-500 */
--achievement-gradient-end: #0097A7;    /* teal-700 */
--streak-fire: #FF6F00;        /* orange-700 */
```

### Neutral Colors
```css
--text-primary: #111827;       /* gray-900 */
--text-secondary: #6B7280;     /* gray-500 */
--text-tertiary: #9CA3AF;      /* gray-400 */

--border-default: #E5E7EB;     /* gray-200 */
--border-light: #F3F4F6;       /* gray-100 */

--bg-page: #F9FAFB;            /* gray-50 - page background */
--bg-white: #FFFFFF;           /* white - card backgrounds */
```

---

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Type Scale
```css
/* Display - Dashboard big numbers */
--text-display: 30px;          /* 3xl */
--weight-display: 700;         /* bold */
--line-height-display: 1.2;

/* Headings */
--text-h1: 24px;               /* 2xl - page titles */
--text-h2: 20px;               /* xl - section headers */
--text-h3: 18px;               /* lg - card titles */
--text-h4: 16px;               /* base - item names */

--weight-heading: 700;         /* bold for h1, h2 */
--weight-subheading: 600;      /* semibold for h3, h4 */

/* Body */
--text-body: 16px;             /* base */
--text-small: 14px;            /* sm */
--text-tiny: 12px;             /* xs */
--text-micro: 10px;            /* [10px] - iOS nav labels */

--weight-regular: 400;
--weight-medium: 500;
--weight-semibold: 600;

/* Line Heights */
--line-height-tight: 1.2;      /* headings */
--line-height-normal: 1.5;     /* body */
--line-height-relaxed: 1.6;    /* small text */
```

---

## Spacing & Layout

### Spacing Scale
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
```

### Border Radius
```css
--radius-sm: 8px;              /* small buttons, badges */
--radius-md: 12px;             /* medium buttons, inputs */
--radius-lg: 16px;             /* main cards */
--radius-xl: 24px;             /* hero cards, pills */
--radius-full: 9999px;         /* pills, icon circles */
```

### Shadows
```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);

/* Colored shadows for special elements */
--shadow-primary: 0 4px 12px rgba(132, 204, 22, 0.3);
--shadow-achievement: 0 4px 12px rgba(0, 188, 212, 0.3);
```

### Grid System
```css
/* 3-Column KPI Layout */
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 12px;

/* Mobile max-width */
max-width: 428px;  /* iPhone 14 Pro Max */
```

---

## Component Specifications

### 1. Page Background
```css
background-color: #F9FAFB;  /* gray-50 */
min-height: 100vh;
padding: 24px 24px 112px;  /* extra bottom for nav */
```

**Why this works:**
- Subtle depth without gradient
- White cards pop against it
- Less harsh than pure white
- Industry standard (Notion, Linear)

---

### 2. Section Header - "This Week's Impact"
```css
/* Title */
font-size: 24px;
font-weight: 700;
color: #111827;
margin-bottom: 4px;

/* Subtitle */
font-size: 14px;
font-weight: 400;
color: #6B7280;
```

**Usage:** Above KPI cards to provide context

---

### 3. KPI Cards (3-Card Layout)

#### Container
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 12px;
margin-bottom: 24px;
```

#### Card Structure (All 3 Cards)
```css
/* Container */
border-radius: 16px;
padding: 16px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
transition: box-shadow 200ms;

&:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Layout */
display: flex;
justify-content: space-between;
align-items: flex-start;

/* Content Area (left) */
.content {
  flex: 1;
  min-width: 0;  /* allows truncation */
}

/* Icon Circle (right) */
.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 24px;
  height: 24px;
}
```

#### 3A. Wasted Card (Red)
```css
background-color: #FEE2E2;  /* red-100 */

.label {
  font-size: 12px;
  font-weight: 600;
  color: #B91C1C;  /* red-700 */
  margin-bottom: 4px;
}

.value {
  font-size: 30px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subtitle {
  font-size: 12px;
  color: #DC2626;  /* red-600 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-circle {
  background-color: #FCA5A5;  /* red-300 */
}

.icon {
  color: #7F1D1D;  /* red-900 */
}
```

**Icon:** DollarSign (from lucide-react)
**Content Example:** "$127" • "8.2% of items"

#### 3B. Consumed Card (Blue)
```css
background-color: #DBEAFE;  /* blue-100 */

.label {
  font-size: 12px;
  font-weight: 600;
  color: #1D4ED8;  /* blue-700 */
  margin-bottom: 4px;
}

.value {
  font-size: 30px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subtitle {
  font-size: 12px;
  color: #2563EB;  /* blue-600 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-circle {
  background-color: #93C5FD;  /* blue-300 */
}

.icon {
  color: #1E3A8A;  /* blue-900 */
}
```

**Icon:** ShoppingBag (from lucide-react)
**Content Example:** "$1.4K" • "91.8% of items"

#### 3C. Community Impact Card (Purple/Pink Gradient)
```css
background: linear-gradient(135deg, #A855F7 0%, #EC4899 100%);

.label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.value {
  font-size: 30px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-circle {
  background-color: rgba(255, 255, 255, 0.3);
}

.icon {
  color: #FFFFFF;
}
```

**Icon:** Heart (from lucide-react)
**Content Example:** "$10K" • "Donated"

**Number Formatting Logic:**
```javascript
function formatCurrency(amount) {
  if (amount >= 1000000) return `$${(amount/1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount/1000).toFixed(1)}K`;
  return `$${amount}`;
}
```

---

### 4. Item Card - Compact (60px height)

#### Container
```css
background-color: #FFFFFF;
border-radius: 16px;
padding: 12px 16px;
margin-bottom: 8px;
transition: box-shadow 200ms;

&:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Border variants based on expiry */
&.critical {
  border-left: 4px solid #EF4444;  /* red-500 */
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
}

&.warning {
  border-left: 3px solid #F59E0B;  /* amber-500 */
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.1);
}

&.fresh {
  border: 1px solid #E5E7EB;  /* gray-200 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
```

#### Layout
```css
display: flex;
align-items: center;
gap: 12px;

/* Category Icon Circle */
.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;  /* emoji size */
  
  /* Backgrounds by category */
  &.fridge { background-color: #E8F5E9; }
  &.freezer { background-color: #E3F2FD; }
  &.pantry { background-color: #EFEBE9; }
}

/* Content Area */
.content {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metadata {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.category {
  font-size: 12px;
  color: #6B7280;
  text-transform: capitalize;
}

.separator {
  color: #E5E7EB;
  font-size: 12px;
}

.expiry {
  font-size: 12px;
  font-weight: 500;
  
  &.critical { color: #DC2626; }
  &.warning { color: #D97706; }
  &.fresh { color: #6B7280; }
}

/* Action Buttons (only for at-risk items) */
.actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.btn-use {
  height: 28px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 150ms;
  
  /* Critical items */
  &.critical {
    background: linear-gradient(135deg, #84CC16 0%, #65A30D 100%);
    color: #FFFFFF;
    
    &:hover { opacity: 0.9; }
  }
  
  /* Warning items */
  &.warning {
    background: #D9F99D;  /* lime-200 */
    color: #3F6212;  /* lime-800 */
    border: 1px solid #BEF264;  /* lime-300 */
    
    &:hover { background: #BEF264; }
  }
}

.btn-edit {
  height: 28px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  background: transparent;
  color: #6B7280;
  transition: background 150ms;
  
  &:hover { background: #F3F4F6; }
}

/* Status Dot (fresh items only) */
.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  
  &.critical { background: #EF4444; }
  &.warning { background: #F59E0B; }
  &.fresh { background: #84CC16; }
}
```

**Button Text Logic:**
- Pantry + Sealed → "Open"
- All other cases → "Use"

**Expiry Status Logic:**
```javascript
function getExpiryStatus(daysUntilExpiry) {
  if (daysUntilExpiry < 0) return { status: 'expired', text: 'Expired' };
  if (daysUntilExpiry <= 1) return { status: 'critical', text: 'Expires Today' };
  if (daysUntilExpiry <= 3) return { status: 'warning', text: 'Expires Soon' };
  return { status: 'fresh', text: `${Math.floor(daysUntilExpiry)}d remaining` };
}
```

---

### 5. Category Filter Pills

#### Container
```css
display: flex;
gap: 8px;
overflow-x: auto;
padding-bottom: 8px;
scrollbar-width: none;  /* hide scrollbar */

&::-webkit-scrollbar {
  display: none;
}
```

#### Pill Button
```css
height: 32px;
padding: 6px 12px;
border-radius: 9999px;  /* full pill */
font-size: 14px;
font-weight: 600;
white-space: nowrap;
transition: all 150ms;

/* Active State */
&.active {
  color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  
  /* Background colors by category */
  &.all { background-color: #00BCD4; }  /* teal */
  &.fridge { background-color: #84CC16; }  /* lime */
  &.freezer { background-color: #1976D2; }  /* blue */
  &.pantry { background-color: #6D4C41; }  /* brown */
}

/* Inactive State */
&.inactive {
  background-color: #FFFFFF;
  border: 1px solid #D1D5DB;
  color: #6B7280;
  
  &:hover {
    border-color: #9CA3AF;
  }
}
```

**Categories:**
- All Items (24) - Teal
- Fridge (12) - Lime
- Freezer (8) - Blue
- Pantry (4) - Brown

---

### 6. Gamification Card - Compact (80px)

```css
/* Container */
background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%);
border-radius: 16px;
padding: 12px 16px;
box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);
color: #FFFFFF;
height: ~80px;

/* Layout */
display: flex;
align-items: center;
justify-content: space-between;
gap: 16px;

/* Streak Section */
.streak {
  display: flex;
  align-items: center;
  gap: 8px;
}

.streak-icon {
  width: 20px;
  height: 20px;
}

.streak-text {
  font-size: 18px;
  font-weight: 700;
}

/* Divider */
.divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.3);
}

/* Points Section */
.points {
  display: flex;
  align-items: center;
  gap: 8px;
}

.points-icon {
  width: 20px;
  height: 20px;
}

.points-text {
  font-size: 18px;
  font-weight: 700;
}

/* Level Section */
.level {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}
```

**Icons:** Flame (streak), Trophy (points)
**Example:** "7 Days | 850 pts | Silver"

---

### 7. Search Bar

```css
/* Container */
position: relative;
width: 100%;

/* Icon */
.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9CA3AF;
}

/* Input */
input {
  width: 100%;
  height: 48px;
  padding-left: 48px;
  padding-right: 16px;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  font-size: 16px;
  background: #FFFFFF;
  
  &:focus {
    outline: none;
    border-color: #84CC16;
    box-shadow: 0 0 0 3px rgba(132, 204, 22, 0.1);
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
}
```

---

### 8. Bottom Navigation - iOS Style

```css
/* Container */
position: fixed;
bottom: 0;
left: 0;
right: 0;
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border-top: 1px solid rgba(229, 231, 235, 0.5);
padding: 8px 8px 24px;  /* extra bottom for home indicator */
z-index: 1000;

/* Inner Container */
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  max-width: 428px;
  margin: 0 auto;
}

/* Tab Button */
.tab-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 16px;
  min-width: 0;
  flex: 1;
  background: transparent;
  border: none;
  cursor: pointer;
}

.tab-icon {
  width: 24px;
  height: 24px;
  
  &.active { color: #84CC16; }  /* lime */
  &.inactive { color: #6B7280; }  /* gray */
}

.tab-label {
  font-size: 10px;
  font-weight: 500;
  
  &.active { color: #84CC16; }
  &.inactive { color: #6B7280; }
}

/* FAB (Center Button) */
.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84CC16 0%, #65A30D 100%);
  box-shadow: 0 4px 12px rgba(132, 204, 22, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -8px;  /* slightly raised */
  border: none;
  cursor: pointer;
}

.fab-icon {
  width: 28px;
  height: 28px;
  color: #FFFFFF;
}
```

**Tabs:** Dashboard, Inventory, Add (FAB), Rewards, Analytics

---

### 9. Status Badges

```css
/* Base */
display: inline-flex;
align-items: center;
justify-content: center;
padding: 4px 12px;
border-radius: 9999px;
font-size: 12px;
font-weight: 600;
white-space: nowrap;

/* Variants */
&.critical {
  background: #EF4444;
  color: #FFFFFF;
}

&.warning {
  background: #F59E0B;
  color: #FFFFFF;
}

&.fresh {
  background: #84CC16;
  color: #FFFFFF;
}

&.expired {
  background: #9CA3AF;
  color: #FFFFFF;
}
```

---

### 10. Status Dots

```css
width: 12px;
height: 12px;
border-radius: 50%;

&.critical { background: #EF4444; }
&.warning { background: #F59E0B; }
&.fresh { background: #84CC16; }
&.expired { background: #9CA3AF; }
```

---

## Implementation Notes

### React Component Structure
```
/components
  /ui
    Button.jsx
    Card.jsx
    StatusBadge.jsx
    StatusDot.jsx
  /kpi
    WastedCard.jsx
    ConsumedCard.jsx
    CommunityCard.jsx
  /inventory
    ItemCard.jsx
    CategoryFilter.jsx
    SearchBar.jsx
  /gamification
    GamificationCard.jsx
  /navigation
    BottomNav.jsx
```

### State Management
```javascript
// Example item state
const item = {
  id: string,
  name: string,
  category: 'fridge' | 'freezer' | 'pantry',
  daysUntilExpiry: number,
  icon: string (emoji),
  status: 'sealed' | 'opened',
  addedDate: Date,
  expiryDate: Date,
  cost: number
};
```

### Accessibility Requirements
- All interactive elements must have min 44px touch target
- Sufficient color contrast ratios (WCAG AA minimum)
- Keyboard navigation support
- Screen reader labels for all icons
- Focus indicators on all interactive elements

### Performance Considerations
- Lazy load images and heavy components
- Virtual scrolling for lists over 100 items
- Memoize expensive calculations
- Use CSS transforms for animations (GPU accelerated)
- Optimize re-renders with React.memo where appropriate

### Browser-Specific Notes
- iOS: Use `-webkit-backdrop-filter` for frosted glass effect
- Safari: Test border-radius on gradients
- Chrome: Optimize shadow rendering
- All: Test with device pixel ratios 1x, 2x, 3x

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Colors - Primary */
  --color-primary: #84CC16;
  --color-primary-dark: #65A30D;
  --color-primary-light: #D9F99D;
  
  /* Colors - Semantic */
  --color-wasted-bg: #FEE2E2;
  --color-wasted-icon: #FCA5A5;
  --color-wasted-text: #B91C1C;
  
  --color-consumed-bg: #DBEAFE;
  --color-consumed-icon: #93C5FD;
  --color-consumed-text: #1D4ED8;
  
  --color-community-start: #A855F7;
  --color-community-end: #EC4899;
  
  /* Colors - Alerts */
  --color-critical: #EF4444;
  --color-warning: #F59E0B;
  --color-fresh: #84CC16;
  
  /* Colors - Categories */
  --color-teal: #00BCD4;
  --color-freezer: #1976D2;
  --color-pantry: #6D4C41;
  
  /* Colors - Neutrals */
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-text-tertiary: #9CA3AF;
  --color-border: #E5E7EB;
  --color-bg-page: #F9FAFB;
  --color-bg-card: #FFFFFF;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
}
```

---

## Responsive Breakpoints

```css
/* Mobile First - Base styles are mobile */
@media (min-width: 375px) {  /* iPhone SE */
  /* Adjust for small screens */
}

@media (min-width: 428px) {  /* iPhone 14 Pro Max */
  /* Adjust for larger phones */
}

@media (min-width: 768px) {  /* iPad */
  /* Consider 2-column layouts */
  .kpi-grid {
    grid-template-columns: repeat(3, minmax(200px, 1fr));
  }
}

@media (min-width: 1024px) {  /* Desktop */
  /* Max-width container, centered layout */
  .container {
    max-width: 428px;
    margin: 0