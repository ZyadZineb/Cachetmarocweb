
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AccessibilitySettingsProps {
  highContrast: boolean;
  largeControls: boolean;
  onHighContrastChange: (enabled: boolean) => void;
  onLargeControlsChange: (enabled: boolean) => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  highContrast,
  largeControls,
  onHighContrastChange,
  onLargeControlsChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">{t('accessibility.title', 'Accessibility Settings')}</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="high-contrast">{t('accessibility.highContrast', 'High Contrast Mode')}</Label>
            <p className="text-sm text-gray-500">{t('accessibility.highContrastDesc', 'Increases contrast for better visibility')}</p>
          </div>
          <Switch 
            id="high-contrast" 
            checked={highContrast}
            onCheckedChange={onHighContrastChange}
            aria-label={t('accessibility.toggleHighContrast', 'Toggle high contrast mode')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="large-controls">{t('accessibility.largeControls', 'Large Controls')}</Label>
            <p className="text-sm text-gray-500">{t('accessibility.largeControlsDesc', 'Increases size of buttons and controls')}</p>
          </div>
          <Switch 
            id="large-controls" 
            checked={largeControls}
            onCheckedChange={onLargeControlsChange}
            aria-label={t('accessibility.toggleLargeControls', 'Toggle large controls')}
          />
        </div>
      </div>
      
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-700">
          {t('accessibility.keyboardTip', 'Tip: Use arrow keys to move selected elements when focused on the preview area')}
        </p>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
