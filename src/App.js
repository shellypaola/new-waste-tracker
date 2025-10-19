import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import WasteWarriorMVP from './components/WasteWarriorMVP';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return <WasteWarriorMVP />;
}

export default App;
