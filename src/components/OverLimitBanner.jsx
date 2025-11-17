import React from 'react';
import { AlertCircle } from 'lucide-react';

const OverLimitBanner = ({ itemCount, tierLimit = 50, onUpgrade }) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4 rounded-r-lg shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold text-amber-900 mb-1">
            Item Limit Reached
          </div>
          <p className="text-sm text-amber-800 mb-2">
            You have {itemCount} items (Free limit: {tierLimit}). 
            To add new items, delete some items to get under {tierLimit} or upgrade to Premium for unlimited tracking.
          </p>
          <button
            onClick={onUpgrade}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverLimitBanner;
