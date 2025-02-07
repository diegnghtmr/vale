import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import App from './App';
import { i18nInstance } from './i18n';
import './index.css';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

// Make sure i18n is initialized before rendering
i18nInstance.then(() => {
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <ThemeProvider>
          <Toaster 
            position="top-right"
            containerStyle={{
              top: 60,
            }} 
          />
          <App />
        </ThemeProvider>
      </LanguageProvider>
    </React.StrictMode>
  );
}).catch((error) => {
  console.error('Failed to initialize i18n:', error);
  // Render error state or fallback UI
  root.render(
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
      color: '#666'
    }}>
      Failed to load the application. Please refresh the page.
    </div>
  );
});