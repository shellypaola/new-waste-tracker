import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import WasteWarriorMVP from './components/WasteWarriorMVP';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Remove splash screen after fade completes
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {showSplash && (
        <div 
          className={fadeOut ? 'animate-fadeOut' : ''}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
          }}
        >
          <SplashScreen />
        </div>
      )}
      
      {/* Main app - only renders after splash starts fading */}
      {!showSplash && <WasteWarriorMVP />}
    </>
  );
}

export default App;
```

---

## **Key Changes:**

1. **Higher z-index** - Splash screen now sits on top of everything (`zIndex: 9999`)
2. **Fade-out animation** - Smooth transition before removing splash
3. **Delayed main app render** - Main app only renders AFTER splash is completely gone
4. **Fixed positioning** - Prevents any content from showing through

---

## **The Timeline:**
```
0s           → Splash appears
2.5s         → Fade-out starts (0.5s duration)
3.0s         → Splash removed, main app renders
