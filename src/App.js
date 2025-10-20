import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import SignUpScreen from './components/SignUpScreen';
import WasteWarriorMVP from './components/WasteWarriorMVP';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    // Show splash for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Check if user has signed up before
      const savedName = localStorage.getItem('userName');
      if (savedName) {
        setUserName(savedName);
      } else {
        setShowSignUp(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSignUpComplete = (name) => {
    setUserName(name);
    setShowSignUp(false);
  };

  // Show splash screen
  if (isLoading) {
    return <SplashScreen />;
  }

  // Show sign up if new user
  if (showSignUp) {
    return <SignUpScreen onComplete={handleSignUpComplete} />;
  }

  // Show main app with user name
  return <WasteWarriorMVP userName={userName} />;
}

export default App;
