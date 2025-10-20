import React from 'react';

const SplashScreen = () => {
  return (
    <>
      {/* Solid background layer to block everything */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          zIndex: 99998
        }}
      />
      
      {/* Splash content on top */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
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
