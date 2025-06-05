import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const fetchAndSetTheme = async () => {
      try {
        const prefs = await api.getUserPreferences();
        if (prefs.theme) {
          setTheme(prefs.theme);
        } else {
          const savedTheme = localStorage.getItem('theme');
          setTheme((savedTheme as Theme) || 'light');
        }
      } catch (error) {
        console.error("Failed to fetch theme preferences, using localStorage.", error);
        const savedTheme = localStorage.getItem('theme');
        setTheme((savedTheme as Theme) || 'light');
      }
    };
    fetchAndSetTheme();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Sync with backend, but don't block
    api.updateUserPreferences({ theme }).catch(err => {
      console.error("Failed to sync theme preference.", err);
    });

  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}