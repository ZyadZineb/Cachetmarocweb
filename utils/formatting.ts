
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import i18next from 'i18next';

const locales = {
  en: enUS,
  fr: fr,
};

export const formatDate = (date: Date | string | number, formatString: string = 'PPP'): string => {
  const currentLocale = i18next.language.substring(0, 2);
  const locale = locales[currentLocale as keyof typeof locales] || enUS;
  
  return format(new Date(date), formatString, { locale });
};

export const formatCurrency = (amount: number): string => {
  const currentLocale = i18next.language.substring(0, 2);
  
  const formatter = new Intl.NumberFormat(currentLocale === 'fr' ? 'fr-MA' : 'en-MA', {
    style: 'currency',
    currency: 'MAD',
    currencyDisplay: 'symbol',
  });
  
  return formatter.format(amount);
};

export const formatNumber = (num: number): string => {
  const currentLocale = i18next.language.substring(0, 2);
  
  return new Intl.NumberFormat(currentLocale === 'fr' ? 'fr' : 'en').format(num);
};
