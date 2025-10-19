# Core Inventory Management - User Stories

## Epic: Food Inventory Management
*As a user, I want to easily track my food items so that I can reduce waste and save money.*

---

## Theme 1: Adding Items to Inventory

### Story 1.1: Manual Item Entry
**As a** user  
**I want to** manually add food items to my inventory  
**So that I can** track what I have at home  

**Acceptance Criteria:**
- I can enter item name, quantity, and cost
- The app automatically suggests expiry date based on category I select
- I can choose between Fridge (7 days), Freezer (3 months), or Pantry (12 months)
- I can override the default expiry date if needed
- The item appears in my inventory immediately after saving

**Priority:** HIGH  
**Story Points:** 5

---

### Story 1.2: Barcode Scanning
**As a** user  
**I want to** scan barcodes to add items quickly  
**So that I can** save time and avoid typing mistakes  

**Acceptance Criteria:**
- I can open camera to scan a barcode
- The app recognizes the product and pre-fills item details
- I can edit the auto-filled information before saving
- If barcode isn't recognized, I get a clear validation message and can add the item manually
- The scanning process is fast and intuitive

**Priority:** MEDIUM  
**Story Points:** 8

---

### Story 1.3: Bulk Item Addition
**As a** user  
**I want to** add multiple quantities of the same item at once  
**So that I can** quickly log my grocery haul  

**Acceptance Criteria:**
- I can specify quantity when adding an item
- I can add multiple different items in one session
- The app shows a running total of items being added
- I can review all items before finalizing the additions

**Priority:** MEDIUM  
**Story Points:** 3

---

## Theme 2: Viewing and Organizing Inventory

### Story 2.1: Category-Based Viewing
**As a** user  
**I want to** view my items organized by storage location  
**So that I can** easily see what's in my fridge, freezer, or pantry  

**Acceptance Criteria:**
- I can switch between "All Items", "Fridge", "Freezer", and "Pantry" tabs
- Each category shows only relevant items
- Items are visually distinguished by category with colors/icons
- The active tab is clearly highlighted

**Priority:** HIGH  
**Story Points:** 3

---

### Story 2.2: Visual Expiry Indicators
**As a** user  
**I want to** see at a glance which items are expiring soon  
**So that I can** prioritize what to use first  

**Acceptance Criteria:**
- Items expiring in 3 days have yellow background
- Items expiring in 1 day have red background
- Fresh items display normally
- Expired items are greyed out and clearly marked as 'expired'
- The visual treatment is consistent across all views

**Priority:** HIGH  
**Story Points:** 5

---

### Story 2.3: Search Functionality
**As a** user  
**I want to** search for specific items by name  
**So that I can** quickly find what I'm looking for  

**Acceptance Criteria:**
- I can type in a search box to filter items
- Results update in real-time as I type
- Search works across all categories
- I can clear the search to see all items again
- Search is case-insensitive and works with partial matches

**Priority:** MEDIUM  
**Story Points:** 3

---

## Theme 3: Managing Item Status and Consumption

### Story 3.1: Marking Items as Opened
**As a** user  
**I want to** mark pantry items as "opened" when I start using them  
**So that I can** track their freshness more accurately  

**Acceptance Criteria:**
- I can mark sealed pantry items as "opened" with a simple action
- Only items in the 'pantry' category can be marked as opened
- Opened items are visually distinguished from sealed ones
- The app may adjust expiry expectations for opened items
- I can see the date when I opened the item

**Priority:** MEDIUM  
**Story Points:** 3

---

### Story 3.2: Tracking Consumption
**As a** user  
**I want to** track how much of an item I've consumed  
**So that I can** accurately record waste and consumption  

**Acceptance Criteria:**
- I can mark items as partially consumed using percentages
- I can mark items as completely finished/consumed
- Both finished and partially consumed items are removed from active inventory
- The waste cost is updated based on percentage consumed for partial consumption
- Consumption data is tracked for analytics purposes

**Priority:** MEDIUM  
**Story Points:** 5

---

### Story 3.3: Managing Multiple Quantities
**As a** user  
**I want to** manage items when I have multiple of the same thing  
**So that I can** track each one accurately  

**Acceptance Criteria:**
- When marking items as finished, I can specify how many
- If I have 3 apples and eat 1, the count updates to 2
- Each quantity can have different expiry dates if needed
- The app asks for clarification when quantities are involved
- I can select "consume all" to finish all quantities at once

**Priority:** MEDIUM  
**Story Points:** 5

---

## Theme 4: Editing and Maintaining Inventory

### Story 4.1: Editing Item Details
**As a** user  
**I want to** edit item information after adding it  
**So that I can** correct mistakes or update details  

**Acceptance Criteria:**
- I can tap on any item to edit its details
- I can modify name, quantity, cost, expiry date, and category
- Changes are saved immediately
- I can cancel edits without saving changes

**Priority:** HIGH  
**Story Points:** 3

---

### Story 4.2: Immediate Data Correction (1-Hour Undo)
**As a** user  
**I want to** undo recently added items within 1 hour  
**So that** I can quickly correct immediate data entry mistakes  

**Acceptance Criteria:**
- I can "undo" items added within the last hour
- Undo removes the item completely with no analytics impact
- After 1 hour, undo option disappears automatically
- Items older than 1 hour must be resolved through consumption tracking
- Bulk undo available for multiple recent items within the 1-hour window
- Clear visual indicator shows time remaining for undo option

**Priority:** MEDIUM  
**Story Points:** 3

---

### Story 4.3: Long-term Item Management
**As a** user  
**I want to** manage items I've had for a while  
**So that** I can track my actual consumption patterns  

**Acceptance Criteria:**
- Items older than 1 hour show consumption tracking options only
- I can mark items as consumed at any time
- I can edit item details (name, quantity, cost, expiry, category)
- Items cannot be deleted after 1 hour - only consumption tracking available
- All long-term items contribute to waste/consumption analytics

**Priority:** MEDIUM  
**Story Points:** 2

---

### Story 4.4: Expired Item Resolution
**As a** user  
**I want to** resolve what happened to expired items  
**So that** I can maintain accurate waste and consumption tracking  

**Acceptance Criteria:**
- Expired items move to a "Recently Expired" review section
- I can mark expired items as "consumed" or "wasted"  
- Items marked as consumed count toward positive consumption metrics
- Items marked as wasted count toward waste cost calculations
- I can batch-resolve multiple expired items at once
- Resolved items are removed from active inventory but tracked in analytics

**Priority:** HIGH  
**Story Points:** 5

### Story 4.5: Moving Items Between Categories
**As a** user  
**I want to** move items between fridge, freezer, and pantry  
**So that I can** update their location when I reorganize  

**Acceptance Criteria:**
- I can change an item's category from the edit screen
- Moving items updates their default expiry expectations
- The item appears in the new category tab immediately
- I can move multiple items at once if needed
- Category changes are available for items regardless of age

---

## Theme 5: Understanding My Inventory Status

### Story 5.1: Items at Risk Dashboard
**As a** user  
**I want to** see which items need my attention first  
**So that I can** prevent food from going to waste  

**Acceptance Criteria:**
- I see a "Items at Risk" section on my dashboard
- Items are prioritized by urgency (expiring soonest first)
- I can take quick actions from this view (mark as consumed, etc.)
- Item status updates automatically as items expire
- Consumed items are removed from the at-risk list immediately

**Priority:** HIGH  
**Story Points:** 5

---

### Story 5.2: Recently Expired Items Management
**As a** user  
**I want to** easily review and resolve expired items  
**So that** I can maintain accurate tracking without cluttering my active inventory  

**Acceptance Criteria:**
- I see a "Recently Expired" section separate from active inventory
- Items automatically move here when they expire
- I can quickly resolve items as "consumed" or "wasted"
- I get periodic reminders to review expired items
- Bulk resolution options for multiple expired items
- Items remain in this section until manually resolved

**Priority:** HIGH  
**Story Points:** 5

---

### Story 5.3: Inventory Overview
**As a** user  
**I want to** see a summary of my total inventory  
**So that I can** understand my overall food situation  

**Acceptance Criteria:**
- I can see total number of items in each category
- I can see total value of my inventory
- I can see how many items are at risk
- The overview updates in real-time as I make changes

**Priority:** MEDIUM  
**Story Points:** 3

---

### Story 5.4: Recently Added Items
**As a** user  
**I want to** quickly access items I just added  
**So that I can** easily make corrections or updates  

**Acceptance Criteria:**
- I see a "Recently Added" section showing my latest items
- Recent items are shown for the past 24-48 hours
- I can quickly edit or manage these items
- The section updates automatically when I add new items

**Priority:** LOW  
**Story Points:** 2

---

## Non-Functional Requirements

### Performance Stories

**As a** user  
**I want** the app to respond quickly  
**So that** tracking my food doesn't feel like a chore  

- Item lists load in under 1 second
- Search results appear instantly as I type
- Adding items completes in under 30 seconds
- The app works smoothly even with 100+ items

### Usability Stories

**As a** user  
**I want** the interface to be intuitive  
**So that** I don't need instructions to use basic features  

- Category tabs are clearly labeled and easy to understand
- Visual expiry indicators are immediately recognizable
- Important actions are easily accessible
- Error messages are helpful and clear

### Reliability Stories

**As a** user  
**I want** my data to be safe  
**So that** I don't lose my inventory information  

- My data persists when I close and reopen the app
- Items don't disappear unexpectedly
- The app handles network connectivity issues gracefully
- I can recover from accidental deletions

---

## Story Dependencies and Flow

```
Adding Items (1.1) → Viewing Items (2.1, 2.2) → Managing Status (3.1, 3.2) → Dashboard Overview (5.1)
     ↓
Search (2.3) ← → Editing (4.1) ← → Understanding Status (5.2, 5.3)
     ↓
Advanced Features (1.2, 1.3, 3.3, 4.2, 4.3)
```

## Implementation Priority
1. **Sprint 1**: Stories 1.1, 2.1, 2.2, 4.1 (Core CRUD + Visual System)
2. **Sprint 2**: Stories 2.3, 3.1, 3.2, 5.1, 4.4 (Search + Status Management + Expiry Resolution)
3. **Sprint 3**: Stories 1.2, 1.3, 3.3, 5.2, 4.2 (Enhanced Features + Undo System)
4. **Sprint 4**: Stories 4.3, 4.5, 5.3, 5.4 (Polish + Advanced Features)