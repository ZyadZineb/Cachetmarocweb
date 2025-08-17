
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config.ts' // Import i18n configuration

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        // SW registered
      })
      .catch(registrationError => {
        // SW registration failed
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
