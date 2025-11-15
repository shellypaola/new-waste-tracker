import React from 'react';

const TipCard = ({ title, tip }) => {
  return (
    <div 
      className="rounded-2xl p-5 mb-4"
      style={{
        backgroundColor: '#FFFBEB',
        borderLeft: '4px solid #F59E0B',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
    >
      <div className="flex items-start gap-4">
        {/* Lightbulb emoji in white circle */}
        <div 
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          💡
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold text-base mb-2"
            style={{ color: '#111827' }}
          >
            {title}
          </h3>
          <p 
            className="text-sm leading-relaxed"
            style={{ color: '#4B5563' }}
          >
            {tip}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TipCard;
