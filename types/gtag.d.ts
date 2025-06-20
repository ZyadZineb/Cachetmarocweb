
// Type definitions for Google Analytics gtag.js
interface Window {
  gtag?: (command: string, action: string, params: Record<string, any>) => void;
  dataLayer?: any[];
}
