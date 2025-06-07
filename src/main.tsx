import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SubjectCompletionProvider } from './context/SubjectCompletionContext';
import App from './App';
import { i18nInstance } from './i18n';
import './styles/tokens.css';
import './index.css';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

// Make sure i18n is initialized before rendering
i18nInstance.then(() => {
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <ThemeProvider>
          <SubjectCompletionProvider>
            <Toaster 
            position="top-center"
            containerStyle={{
              top: 20,
              zIndex: 9999,
            }}
            toastOptions={{
              // Configuración global para todos los toasts
              duration: 4000,
              style: {
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 'var(--font-medium)',
                padding: 'var(--space-4) var(--space-5)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px',
                minWidth: '280px',
              },
              // Estilos específicos para toast de éxito
              success: {
                duration: 3000,
                style: {
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--accent-primary)',
                  borderLeft: '4px solid var(--accent-primary)',
                },
                iconTheme: {
                  primary: '#c5775b',
                  secondary: '#ffffff',
                },
              },
              // Estilos específicos para toast de error
              error: {
                duration: 5000,
                style: {
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--error)',
                  borderLeft: '4px solid var(--error)',
                  whiteSpace: 'pre-line',
                },
                iconTheme: {
                  primary: '#c9574d',
                  secondary: '#ffffff',
                },
              },
              // Estilos específicos para toast de loading
              loading: {
                style: {
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--accent-primary)',
                  borderLeft: '4px solid var(--accent-primary)',
                },
                iconTheme: {
                  primary: '#c5775b',
                  secondary: '#ffffff',
                },
              },
            }} 
          />
          <App />
          </SubjectCompletionProvider>
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