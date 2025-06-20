
import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslatedTextProps {
  i18nKey: string;
  values?: Record<string, unknown>;
  children?: React.ReactNode;
  className?: string;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  i18nKey, 
  values, 
  children,
  className = "" 
}) => {
  const { t } = useTranslation();
  
  const translated = t(i18nKey, values);
  
  // If translation is not found, fallback to children
  if (translated === i18nKey && children) {
    return <span className={className}>{children}</span>;
  }
  
  return <span className={className}>{translated}</span>;
};

export default TranslatedText;
