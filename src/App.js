import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import WasteWarriorMVP from './components/WasteWarriorMVP';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show ONLY splash screen while loading
  if (isLoading) {
    return <SplashScreen />;
  }

  // Show main app after loading
  return <WasteWarriorMVP />;
}

export default App;
