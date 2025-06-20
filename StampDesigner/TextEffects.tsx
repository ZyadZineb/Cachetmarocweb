
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TextEffectsProps {
  onApplyEffect: (effect: {
    type: 'bold' | 'italic' | 'none';
  }) => void;
  currentEffect: {
    type: 'bold' | 'italic' | 'none';
  };
  largeControls?: boolean;
}

// Simplified TextEffects component - only includes bold/italic formatting
const TextEffects: React.FC<TextEffectsProps> = ({ onApplyEffect, currentEffect, largeControls = false }) => {
  const { t } = useTranslation();
  const [effect, setEffect] = useState<'bold' | 'italic' | 'none'>(currentEffect.type || 'none');

  const handleEffectChange = (value: 'bold' | 'italic' | 'none') => {
    setEffect(value);
    onApplyEffect({
      type: value
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">{t('textEffects.title', 'Text Formatting')}</h3>

      <div className="space-y-3">
        <div className="grid gap-2">
          <Label htmlFor="effect-type">{t('textEffects.effectType', 'Text Style')}</Label>
          <Select value={effect} onValueChange={(value: any) => handleEffectChange(value)}>
            <SelectTrigger id="effect-type" className={largeControls ? "text-lg h-12" : ""}>
              <SelectValue placeholder={t('textEffects.selectEffect', 'Select style')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t('textEffects.none', 'Normal')}</SelectItem>
              <SelectItem value="bold">{t('textEffects.bold', 'Bold')}</SelectItem>
              <SelectItem value="italic">{t('textEffects.italic', 'Italic')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TextEffects;
