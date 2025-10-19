import React from 'react';

const SplashScreen = () => {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center animate-fadeIn"
      style={{
        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div className="text-center animate-slideUp">
        {/* Logo Placeholder - W with leaf */}
        <div className="mb-8 flex justify-center">
          <div 
            className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
              border: '4px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <div className="relative">
              <span className="text-7xl font-bold text-white">W</span>
              <span 
                className="absolute -top-2 -right-3 text-3xl"
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              >
                🌱
              </span>
            </div>
          </div>
        </div>
        
        {/* App Name */}
        <h1 className="text-4xl font-bold text-white mb-3 tracking-wide">
          WASTE WARRIOR
        </h1>
        
        {/* Tagline */}
        <p className="text-lg text-blue-100 font-medium tracking-wider">
          Track. Reduce. Give Back
        </p>
        
        {/* Loading Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
