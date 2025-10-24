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
    <div style={{ background: '#F9FAFB', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '32px 24px 16px' }}>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ height: '4px', flex: 1, borderRadius: '9999px', backgroundColor: step >= 1 ? '#3B82F6' : '#E5E7EB', transition: 'all 0.3s' }}></div>
          <div style={{ height: '4px', flex: 1, borderRadius: '9999px', backgroundColor: step >= 2 ? '#3B82F6' : '#E5E7EB', transition: 'all 0.3s' }}></div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px 80px', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        {step === 1 ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)', 
                border: '4px solid rgba(59, 130, 246, 0.2)', 
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)', 
                position: 'relative',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <span style={{ fontSize: '56px', fontWeight: 'bold', color: 'white' }}>W</span>
                <span style={{ 
                  position: 'absolute', 
                  top: '-8px', 
                  right: '-8px', 
                  fontSize: '24px', 
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  animation: 'leafBounce 2s ease-in-out infinite'
                }}>🌱</span>
              </div>
            </div>
            <style>{`
              @keyframes float {
                0%, 100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-10px);
                }
              }
              
              @keyframes leafBounce {
                0%, 100% {
                  transform: rotate(0deg) scale(1);
                }
                25% {
                  transform: rotate(-10deg) scale(1.1);
                }
                75% {
                  transform: rotate(10deg) scale(1.1);
                }
              }
            `}</style>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', textAlign: 'center' }}>
              Welcome to Waste Warrior
            </h1>
            <p style={{ fontSize: '18px', color: '#6B7280', textAlign: 'center', marginBottom: '48px' }}>
              Track. Reduce. Give Back
            </p>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', color: '#111827', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                What is your name?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                style={{ 
                  width: '100%', 
                  padding: '16px 24px', 
                  borderRadius: '16px', 
                  fontSize: '18px', 
                  border: '2px solid #E5E7EB', 
                  outline: 'none', 
                  backgroundColor: '#FFFFFF',
                  transition: 'border 0.2s',
                  color: '#111827'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
              />
            </div>

            <button
              onClick={handleContinue}
              disabled={!name.trim()}
              style={{ 
                width: '100%', 
                padding: '20px', 
                borderRadius: '16px', 
                fontWeight: '600', 
                fontSize: '18px', 
                backgroundColor: name.trim() ? '#3B82F6' : '#E5E7EB', 
                color: name.trim() ? 'white' : '#9CA3AF', 
                cursor: name.trim() ? 'pointer' : 'not-allowed', 
                border: 'none', 
                transition: 'all 0.2s',
                minHeight: '60px',
                WebkitTapHighlightColor: 'transparent',
                textAlign: 'center'
              }}
            >
              Continue →
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '60px', marginBottom: '24px', textAlign: 'center' }}>👋</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', textAlign: 'center' }}>
              Nice to meet you, {name}!
            </h1>
            <p style={{ fontSize: '18px', color: '#6B7280', textAlign: 'center', marginBottom: '48px' }}>
              Ready to reduce your food waste and save money?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '28px' }}>🥬</div>
                  <div>
                    <h3 style={{ color: '#111827', fontWeight: '600', fontSize: '18px', marginBottom: '4px', margin: 0 }}>
                      Track Expiry Dates
                    </h3>
                    <p style={{ color: '#6B7280', fontSize: '14px', margin: '4px 0 0 0' }}>
                      Never forget what's expiring so you can use it before it goes to waste
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '28px' }}>💰</div>
                  <div>
                    <h3 style={{ color: '#111827', fontWeight: '600', fontSize: '18px', marginBottom: '4px', margin: 0 }}>
                      Save Money
                    </h3>
                    <p style={{ color: '#6B7280', fontSize: '14px', margin: '4px 0 0 0' }}>
                      See exactly how much you are wasting and start saving
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '28px' }}>❤️</div>
                  <div>
                    <h3 style={{ color: '#111827', fontWeight: '600', fontSize: '18px', marginBottom: '4px', margin: 0 }}>
                      Give Back
                    </h3>
                    <p style={{ color: '#6B7280', fontSize: '14px', margin: '4px 0 0 0' }}>
                      Premium subscriptions support global organizations fighting hunger
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              style={{ 
                width: '100%', 
                padding: '20px', 
                borderRadius: '16px', 
                fontWeight: '600', 
                fontSize: '18px', 
                backgroundColor: '#3B82F6', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                minHeight: '60px',
                WebkitTapHighlightColor: 'transparent',
                textAlign: 'center'
              }}
            >
              Get Started →
            </button>
            
            <button
              onClick={() => setStep(1)}
              style={{ width: '100%', padding: '12px', marginTop: '12px', borderRadius: '12px', fontWeight: '500', fontSize: '14px', backgroundColor: 'transparent', color: '#6B7280', border: '1px solid #E5E7EB', cursor: 'pointer' }}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpScreen;
