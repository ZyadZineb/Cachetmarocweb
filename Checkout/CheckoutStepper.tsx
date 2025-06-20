
import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepperProps {
  currentStep: number;
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Shipping' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Review' },
  ];

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative flex-1 ${stepIdx === steps.length - 1 ? '' : ''}`}>
            {step.id < currentStep ? (
              <div className="group">
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue">
                    <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-gray-900">{step.name}</span>
                </span>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute right-0 top-4 hidden h-0.5 w-full md:flex -translate-y-1/2 bg-brand-blue" />
                )}
              </div>
            ) : step.id === currentStep ? (
              <div className="group" aria-current="step">
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-blue bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-brand-blue">{step.name}</span>
                </span>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute right-0 top-4 hidden h-0.5 w-full md:flex -translate-y-1/2 bg-gray-300" />
                )}
              </div>
            ) : (
              <div className="group">
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-gray-500">{step.name}</span>
                </span>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute right-0 top-4 hidden h-0.5 w-full md:flex -translate-y-1/2 bg-gray-300" />
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CheckoutStepper;
