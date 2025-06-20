
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BorderStyleSelectorProps {
  borderStyle: 'single' | 'double' | 'triple' | 'none';
  onBorderStyleChange: (style: 'single' | 'double' | 'triple' | 'none') => void;
  largeControls?: boolean;
}

const BorderStyleSelector: React.FC<BorderStyleSelectorProps> = ({ 
  borderStyle, 
  onBorderStyleChange,
  largeControls = false
}) => {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <h3 className={`font-medium text-gray-800 mb-3 ${largeControls ? "text-lg" : ""}`}>
          {t('borderStyle.title', 'Border Style')}
        </h3>
        
        <RadioGroup
          value={borderStyle}
          onValueChange={(value) => onBorderStyleChange(value as 'single' | 'double' | 'triple' | 'none')}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <div className="border rounded-md p-3 flex flex-col items-center gap-2 hover:bg-slate-50 cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 border-2 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none" className={largeControls ? "text-base" : ""}>
                {t('borderStyle.none', 'No Border')}
              </Label>
            </div>
          </div>
          
          <div className="border rounded-md p-3 flex flex-col items-center gap-2 hover:bg-slate-50 cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 border-2 rounded-full border-black"></div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single" className={largeControls ? "text-base" : ""}>
                {t('borderStyle.single', 'Single')}
              </Label>
            </div>
          </div>
          
          <div className="border rounded-md p-3 flex flex-col items-center gap-2 hover:bg-slate-50 cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 border-2 rounded-full border-black relative">
                <div className="absolute inset-1 border-2 border-black rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="double" id="double" />
              <Label htmlFor="double" className={largeControls ? "text-base" : ""}>
                {t('borderStyle.double', 'Double')}
              </Label>
            </div>
          </div>
          
          <div className="border rounded-md p-3 flex flex-col items-center gap-2 hover:bg-slate-50 cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 border-2 rounded-full border-black relative">
                <div className="absolute inset-1 border-2 border-black rounded-full">
                  <div className="absolute inset-1 border-2 border-black rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="triple" id="triple" />
              <Label htmlFor="triple" className={largeControls ? "text-base" : ""}>
                {t('borderStyle.triple', 'Triple')}
              </Label>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default BorderStyleSelector;
