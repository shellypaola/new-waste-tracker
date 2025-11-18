import React from 'react';

const TrialStatusBanner = ({ daysRemaining, onChoosePlan }) => {
  return (
    <div className="bg-blue-50/50 border-b border-blue-100 px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
        <span className="text-blue-600">✨</span>
        <span>Premium trial · {daysRemaining} days remaining</span>
        <button 
          onClick={onChoosePlan}
          className="text-blue-600 hover:text-blue-700 underline font-medium ml-1"
        >
          Choose plan
        </button>
      </div>
    </div>
  );
};

export default TrialStatusBanner;
