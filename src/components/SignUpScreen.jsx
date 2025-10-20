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
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
      }}
    >
      <div className="px-6 pt-8 pb-4">
        <div className="flex gap-2">
          <div 
            className="h-1 flex-1 rounded-full transition-all"
            style={{ backgroundColor: step >= 1 ? 'white' : 'rgba(255,255,255,0.3)' }}
          />
          <div 
            className="h-1 flex-1 rounded-full transition-all"
            style={{ backgroundColor: step >= 2 ? 'white' : 'rgba(255,255,255,0.3)' }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-20">
        {step === 1 && (
          <div className="animate-slideUp">
            <div className="text-6xl mb-6 text-center">👋</div>
            <h1 className="text-4xl font-bold text-white mb-4 text-center">
              Welcome to Waste Warrior
            </h1>
            <p className="text-lg text-blue-100 text-center mb-12">
              Track. Reduce. Give Back
            </p>

            <div className="mb-8">
              <label className="block text-white text-sm font-medium mb-3">
                What is your name?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-6 py-4 rounded-2xl text-lg border-2 border-transparent focus:border-white outline-none transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
              />
            </div>

            <button
              onClick={handleContinue}
              disabled={!name.trim()}
              className="w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: name.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                color: name.trim() ? '#3B82F6' : 'rgba(255,255,255,0.5)',
                cursor: name.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slideUp">
            <div className="text-6xl mb-6 text-center">🎯</div>
            <h1 className="text-3xl font-bold text-white mb-4 text-center">
              Nice to meet you, {name}!
            </h1>
            <p className="text-lg text-blue-100 text-center mb-12">
              Let us help you reduce food waste and save money
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-5 border border-white border-opacity-30">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📊</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      Track Your Food
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Keep tabs on everything in your fridge, freezer, and pantry
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-5 border border-white border-opacity-30">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💰</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      Save Money
                    </h3>
                    <p className="text-blue-100 text-sm">
                      See exactly how much you are wasting and start saving
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-5 border border-white border-opacity-30">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">❤️</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      Give Back
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Turn your savings into meals for families in need
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: 'white',
                color: '#3B82F6'
              }}
            >
              Get Started
