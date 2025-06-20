
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

type WizardStepType = 'shape' | 'text' | 'effects' | 'color' | 'logo' | 'advanced' | 'preview';

interface WizardStep {
  id: WizardStepType;
  label: string;
  description: string;
}

interface WizardControlsProps {
  steps: WizardStep[];
  currentStep: WizardStepType;
  onPrev: () => void;
  onNext: () => void;
  onJump: (step: WizardStepType) => void;
  largeControls?: boolean;
}

const WizardControls: React.FC<WizardControlsProps> = ({
  steps,
  currentStep,
  onPrev,
  onNext,
  onJump,
  largeControls = false
}) => {
  const { t } = useTranslation();
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;
  
  // Determine button sizes based on largeControls prop
  const buttonSize = largeControls ? "lg" : "default";
  const iconSize = largeControls ? 24 : 18;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isFirstStep}
          size={buttonSize}
          className={`${isFirstStep ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ChevronLeft size={iconSize} className="mr-1" />
          {t('wizard.back', 'Back')}
        </Button>
        
        <div className="text-center">
          <div className={`text-sm text-gray-500 ${largeControls ? 'text-base' : ''}`}>
            {currentIndex + 1} / {steps.length}
          </div>
        </div>
        
        <Button
          variant={isLastStep ? "default" : "outline"}
          onClick={onNext}
          size={buttonSize}
          className={isLastStep ? "bg-brand-blue hover:bg-brand-blue-dark" : ""}
        >
          {isLastStep 
            ? t('wizard.finish', 'Finish') 
            : t('wizard.next', 'Next')}
          {!isLastStep && <ChevronRight size={iconSize} className="ml-1" />}
        </Button>
      </div>
      
      {/* Step dots for quick navigation */}
      <div className="flex justify-center space-x-2">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onJump(step.id)}
            title={step.label}
            className={`w-${largeControls ? '4' : '3'} h-${largeControls ? '4' : '3'} rounded-full transition-colors ${
              currentIndex === index 
                ? 'bg-brand-blue' 
                : index < currentIndex 
                  ? 'bg-brand-blue/30'
                  : 'bg-gray-300'
            }`}
            aria-label={`${t('wizard.goToStep', 'Go to step')} ${index + 1}: ${step.label}`}
          />
        ))}
      </div>
    </div>
  );
};

export default WizardControls;
