// foodTips.js
// HOW TO ADD NEW TIPS:
// 1. Copy the template at the bottom
// 2. Paste it in the appropriate category
// 3. Change the item name, title, and tip text
// 4. Save the file - done!

export const foodTips = {
  // VEGETABLES
  vegetables: [
    {
      item: "tomato",
      title: "Keep Tomatoes Fresh Longer",
      tip: "Store tomatoes at room temperature, stem-side down. Only refrigerate when fully ripe to extend life by a few days."
    },
    {
      item: "lettuce",
      title: "Crispy Lettuce Trick",
      tip: "Wrap lettuce in a paper towel and store in a plastic bag. The towel absorbs moisture and keeps leaves crisp for up to 2 weeks."
    },
    {
      item: "carrot",
      title: "Carrots Stay Crunchy",
      tip: "Store carrots in water in the fridge, changing water every 4-5 days. This keeps them fresh and crunchy for weeks!"
    },
    {
      item: "celery",
      title: "Revive Wilted Celery",
      tip: "Wrap celery in aluminum foil instead of plastic. It will stay crisp for weeks! Already wilted? Soak in ice water for 30 minutes."
    },
    {
      item: "cucumber",
      title: "Keep Cucumbers Crisp",
      tip: "Store cucumbers on the middle shelf (not the crisper). They're sensitive to cold and can get mushy in the coldest part of the fridge."
    },
    {
      item: "herbs",
      title: "Fresh Herbs Longer",
      tip: "Treat soft herbs like flowers - trim stems and place in water. Cover with a plastic bag and refrigerate. Change water every few days."
    }
    // ADD MORE VEGETABLE TIPS HERE
  ],

  // FRUITS
  fruits: [
    {
      item: "banana",
      title: "Slow Down Banana Ripening",
      tip: "Wrap banana stems in plastic wrap to slow ripening. Separate bananas from the bunch to make them last even longer."
    },
    {
      item: "strawberry",
      title: "Berry Storage Secret",
      tip: "Don't wash berries until you're ready to eat them. Store in a container lined with paper towels to absorb moisture."
    },
    {
      item: "apple",
      title: "Apple Storage",
      tip: "Store apples in the crisper drawer. Keep them away from other produce as they release ethylene gas that speeds up ripening."
    },
    {
      item: "avocado",
      title: "Ripen Avocados Faster",
      tip: "Put hard avocados in a paper bag with a banana or apple. The ethylene gas will ripen them in 1-2 days!"
    },
    {
      item: "citrus",
      title: "Citrus Fruit Freshness",
      tip: "Store citrus fruits at room temperature for up to a week, or refrigerate for up to 3 weeks. They'll keep their juice longer when cold."
    }
    // ADD MORE FRUIT TIPS HERE
  ],

  // DAIRY
  dairy: [
    {
      item: "milk",
      title: "Make Milk Last Longer",
      tip: "Store milk on a middle or lower shelf, not in the door. The door is the warmest part of your fridge."
    },
    {
      item: "cheese",
      title: "Cheese Storage Hack",
      tip: "Wrap cheese in wax paper (not plastic) before placing in a bag. This lets it breathe while preventing it from drying out."
    },
    {
      item: "yogurt",
      title: "Extend Yogurt Life",
      tip: "Store yogurt upside down in the fridge. This creates a vacuum seal that helps prevent spoilage bacteria from growing."
    },
    {
      item: "butter",
      title: "Butter Stays Fresh",
      tip: "Keep butter in its original wrapper and store in the coldest part of the fridge. It can also be frozen for up to 6 months!"
    }
    // ADD MORE DAIRY TIPS HERE
  ],

  // MEAT & FISH
  meat: [
    {
      item: "chicken",
      title: "Safe Chicken Storage",
      tip: "Use fresh chicken within 1-2 days. For longer storage, freeze immediately and use within 9 months for best quality."
    },
    {
      item: "beef",
      title: "Beef Storage Guide",
      tip: "Raw ground beef stays fresh 1-2 days in the fridge, steaks 3-5 days. Freeze in airtight packaging for 4-12 months."
    },
    {
      item: "fish",
      title: "Keep Fish Fresh",
      tip: "Store fish in the coldest part of your fridge and use within 1-2 days. For longer storage, freeze immediately in airtight packaging."
    }
    // ADD MORE MEAT TIPS HERE
  ],

  // BREAD & GRAINS
  bread: [
    {
      item: "bread",
      title: "Bread Storage Best Practice",
      tip: "Store bread at room temperature for 2-3 days. For longer storage, freeze it! Bread goes stale faster in the fridge."
    },
    {
      item: "rice",
      title: "Cooked Rice Storage",
      tip: "Cool cooked rice quickly and refrigerate within 1 hour. Use within 3-4 days or freeze for up to 6 months."
    },
    {
      item: "pasta",
      title: "Leftover Pasta",
      tip: "Toss cooked pasta with a little oil before refrigerating to prevent sticking. Use within 3-5 days or freeze for up to 2 months."
    }
    // ADD MORE BREAD/GRAIN TIPS HERE
  ],

  // GENERAL TIPS (shown when no specific item matches)
  general: [
    {
      item: "general",
      title: "First In, First Out",
      tip: "When unpacking groceries, move older items to the front and put new items in the back. This helps you use food before it expires!"
    },
    {
      item: "general",
      title: "Freezer is Your Friend",
      tip: "Freeze bread, herbs in oil, overripe bananas, and leftover meals. Most food can be frozen if you won't use it in time!"
    },
    {
      item: "general",
      title: "Meal Prep Day",
      tip: "Dedicate one day a week to wash and prep vegetables. Pre-cut produce gets used faster than whole produce in the back of the fridge."
    },
    {
      item: "general",
      title: "Check Temperature Settings",
      tip: "Keep your fridge at 37-40°F (3-4°C) and freezer at 0°F (-18°C). Use a thermometer to verify - proper temperature prevents spoilage!"
    },
    {
      item: "general",
      title: "Smart Shopping Prevents Waste",
      tip: "Make a shopping list and stick to it. Impulse buys are the #1 cause of food waste - buy only what you'll actually use!"
    },
    {
      item: "general",
      title: "Understand Date Labels",
      tip: "'Best by' dates are about quality, not safety. Many foods are safe to eat past these dates. Trust your senses - look, smell, taste!"
    }
  ]
};

// ═══════════════════════════════════════════════════════
// TEMPLATE TO COPY WHEN ADDING NEW TIPS:
// ═══════════════════════════════════════════════════════
// {
//   item: "YOUR_ITEM_NAME",
//   title: "Catchy Tip Title",
//   tip: "Your helpful tip text goes here. Keep it under 2-3 sentences for best display."
// }
export default foodTips;  // ← MUST HAVE THIS!
