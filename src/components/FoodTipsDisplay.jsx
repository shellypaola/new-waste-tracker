import React, { useState, useEffect } from 'react';
import TipCard from './TipCard';
import { foodTips } from './foodTips';

const FoodTipsDisplay = ({ mostWastedItem, mostWastedCategory }) => {
  const [currentTip, setCurrentTip] = useState(null);

  useEffect(() => {
    findRelevantTip();
  }, [mostWastedItem, mostWastedCategory]);

  const findRelevantTip = () => {
    let tip = null;

    // STEP 1: Try to find tip for specific item
    if (mostWastedItem) {
      const itemName = mostWastedItem.toLowerCase();
      
      // Search all categories for matching item
      for (const category of Object.values(foodTips)) {
        const match = category.find(t => 
          t.item.toLowerCase() === itemName || 
          itemName.includes(t.item.toLowerCase())
        );
        if (match) {
          tip = match;
          break;
        }
      }
    }

    // STEP 2: If no item match, try category
    if (!tip && mostWastedCategory && foodTips[mostWastedCategory]) {
      const categoryTips = foodTips[mostWastedCategory];
      tip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
    }

    // STEP 3: If still no match, show general tip
    if (!tip) {
      const generalTips = foodTips.general;
      tip = generalTips[Math.floor(Math.random() * generalTips.length)];
    }

    setCurrentTip(tip);
  };

  if (!currentTip) return null;

  return (
    <TipCard 
      title={currentTip.title}
      tip={currentTip.tip}
      emoji={mostWastedItemEmoji}
    />
  );
};

export default FoodTipsDisplay;
