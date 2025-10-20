import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const SignUpScreen = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);

  const handleContinue = () => {
    if (step === 1 && name.trim()) {
      setStep(2);
    }
  };

  const handleFinish = () => {
    if (name.trim()) {
      localStorage.setItem('userName', name.trim());
      onComplete(name.trim());
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '32px 24px 16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ height: '4px', flex: 1, borderRadius: '9999px', backgroundColor: step >= 1 ? 'white' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }}></div>
          <div style={{ height: '4px', flex: 1, borderRadius: '9999px', backgroundColor: step >= 2 ? 'white' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }}></div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px 80px' }}>
        {step === 1 ? (
          <div className="animate-slideUp">
            <div style={{ fontSize: '60px', marginBottom: '24px', textAlign: 'center' }}>👋</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '16px', textAlign: 'center' }}>
              Welcome to Waste Warrior
            </h1>
            <p style={{ fontSize: '18px', color: '#DBEAFE', textAlign: 'center', marginBottom: '48px' }}>
              Track. Reduce. Give Back
            </p>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                What is your name?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                style={{ width: '100%', padding: '16px 24px', borderRadius: '16px', fontSize: '18px', border: '2px solid transparent', outline: 'none', backgroundColor: 'rgba(255,255,255,0.95)' }}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
              />
            </div>

            <button
              onClick={handleContinue}
              disabled={!name.trim()}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', fontWeight: '600', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: name.trim() ? 'white' : 'rgba(255,255,255,0.3)', color: name.trim() ? '#3B82F6' : 'rgba(255,255,255,0.5)', cursor: name.trim() ? 'pointer' : 'not-allowed', border: 'none' }}
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <div className="animate-slideUp">
            <div style={{ fontSize: '60px', marginBottom: '24px', textAlign: 'center' }}>🎯</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '16px', textAlign: 'center' }}>
              Nice to meet you, {name}!
            </h1>
            <p style={{ fontSize: '18px', color: '#DBEAFE', textAlign: 'center', marginBottom: '48px' }}>
              Let us help you reduce food waste and save money
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '28px' }}>📊</div>
                  <div>
                    <h3 style={{ color: 'white', fontWeight: '600', fontSize: '18px', marginBottom: '4px' }}>
                      Track Your Food
                    </h3>
                    <p style={{ color: '#DBEAFE', fontSize: '14px' }}>
                      Keep tabs on everything in your fridge, freezer, and pantry
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '28px' }}>💰</div>
                  <div>
                    <h3 style={{ color: 'white', fontWeight: '600', fontSize: '18px', marginBottom: '4px' }}>
                      Save Money
                    </h3>
                    <p style={{ color: '#DBEAFE', fontSize: '14px' }}>
                      See exactly how much you are wasting and start saving
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '28px' }}>❤️</div>
                  <div>
                    <h3 style={{ color: 'white', fontWeight: '600', fontSize: '18px', marginBottom: '4px' }}>
                      Give Back
                    </h3>
                    <p style={{ color: '#DBEAFE', fontSize: '14px' }}>
                      Turn your savings into meals for families in need
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', fontWeight: '600', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'white', color: '#3B82F6', border: 'none', cursor: 'pointer' }}
            >
              Get Started
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpScreen;
