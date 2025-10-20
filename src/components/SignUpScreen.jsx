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
      {/* Progress indicator */}
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

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-20">
        {step === 1 && (
          <div className="animate-slideUp">
            <div className="text-6xl mb-6 text-center">👋</div>
            <h1 className="text-4xl font-bold text-white mb-4 text-center">
              Welcome to<br />Waste Warrior
            </h1>
            <p className="text-lg text-blue-100 text-center mb-12">
              Track. Reduce. G
