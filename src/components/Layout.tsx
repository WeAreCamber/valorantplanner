
import React from 'react';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';
import { ChevronRight, Map, Users, Shield, Crosshair } from 'lucide-react';

const steps = [
  { id: 0, name: 'Map', icon: Map },
  { id: 1, name: 'Agent', icon: Users },
  { id: 2, name: 'Side', icon: Shield },
  { id: 3, name: 'Tactics', icon: Crosshair },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentStep, goToStep, selectedMap, selectedAgent, selectedSide } = useStore();

  const handleStepClick = (stepId: number) => {
    // Only allow going back or staying on current step, or going forward if previous step is completed
    if (stepId <= currentStep) {
      goToStep(stepId);
      return;
    }
    
    // Validation for jumping forward
    if (stepId === 1 && selectedMap) goToStep(1);
    if (stepId === 2 && selectedMap && selectedAgent) goToStep(2);
    if (stepId === 3 && selectedMap && selectedAgent && selectedSide) goToStep(3);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-sm flex items-center justify-center font-bold text-xl">V</div>
            <span className="text-xl font-bold tracking-tight">VALORANT<span className="text-red-500">PLANNER</span></span>
          </div>
          
          {/* Progress Steps - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isClickable = step.id <= currentStep || 
                (step.id === 1 && !!selectedMap) ||
                (step.id === 2 && !!selectedMap && !!selectedAgent) ||
                (step.id === 3 && !!selectedMap && !!selectedAgent && !!selectedSide);

              return (
                <div key={step.name} className="flex items-center">
                  <button
                    onClick={() => isClickable && handleStepClick(step.id)}
                    disabled={!isClickable}
                    className={clsx(
                      "flex items-center space-x-2 px-3 py-2 rounded-md transition-all",
                      isActive ? "bg-red-500/10 text-red-500" : isCompleted ? "text-slate-300 hover:text-white" : "text-slate-600 cursor-not-allowed"
                    )}
                  >
                    <Icon size={18} />
                    <span className="font-medium text-sm uppercase tracking-wider">{step.name}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight size={16} className="text-slate-700 mx-2" />
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
