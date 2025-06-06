import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isTransitioning: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    // Solo aplicar el tema si no estamos en transición
    if (!isTransitioning) {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      
      // Sync with backend, but don't block
      api.updateUserPreferences({ theme }).catch(err => {
        console.error("Failed to sync theme preference.", err);
      });
    }
  }, [theme, isTransitioning]);

  const toggleTheme = async () => {
    if (isTransitioning) return; // Prevenir múltiples cambios simultáneos
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Iniciar transición
    setIsTransitioning(true);
    
    // Pequeño delay para mostrar la animación
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Cambiar el tema
    setTheme(newTheme);
    
    // Aplicar el tema inmediatamente para sincronizar todo
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    // Sync con backend
    try {
      await api.updateUserPreferences({ theme: newTheme });
    } catch (err) {
      console.error("Failed to sync theme preference.", err);
    }
    
    // Esperar un poco más para que la transición sea visible y suave
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Terminar transición
    setIsTransitioning(false);
  };

  return (
    <ThemeContext.Provider value={{ theme, isTransitioning, toggleTheme }}>
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