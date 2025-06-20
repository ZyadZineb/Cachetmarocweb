
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4" />
        <select 
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="appearance-none bg-transparent border-none cursor-pointer text-sm font-medium focus:outline-none"
          aria-label={t('languages.selectLanguage')}
        >
          <option value="en">{t('languages.en')}</option>
          <option value="fr">{t('languages.fr')}</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
