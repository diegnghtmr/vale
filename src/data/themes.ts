import { Theme } from '@/types';

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryHover: string;
  primaryActive: string;
  
  // Secondary colors
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // Border colors
  border: string;
  borderHover: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Calendar event colors
  eventColors: Array<{
    bg: string;
    border: string;
    text: string;
  }>;
}

export interface ThemeConfig {
  name: Theme;
  colors: ThemeColors;
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

const lightTheme: ThemeConfig = {
  name: 'light',
  colors: {
    primary: '#c5775b',
    primaryHover: '#b86a4e',
    primaryActive: '#a55d41',
    
    secondary: '#cb9a88',
    secondaryHover: '#be8d7a',
    secondaryActive: '#b1806c',
    
    background: '#ffffff',
    backgroundSecondary: '#f8f9fa',
    backgroundTertiary: '#e9ecef',
    
    textPrimary: '#212529',
    textSecondary: '#6c757d',
    textMuted: '#adb5bd',
    
    border: '#dee2e6',
    borderHover: '#adb5bd',
    
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    
    eventColors: [
      { bg: '#f5ebe8', border: '#c5775b', text: '#8b4513' },
      { bg: '#f7ede9', border: '#cb9a88', text: '#a0755e' },
      { bg: '#eef4f6', border: '#698aa2', text: '#4a6b7a' },
      { bg: '#f8f2ed', border: '#eac5a7', text: '#c49a7a' },
      { bg: '#f4e7e4', border: '#b8746b', text: '#8d5550' },
      { bg: '#f0edea', border: '#877070', text: '#6b5656' },
      { bg: '#f2e9e4', border: '#a67c5a', text: '#6b4423' },
      { bg: '#f6ebe9', border: '#c5877c', text: '#9a675e' },
      { bg: '#f2f4f0', border: '#8fa785', text: '#6d7d63' },
      { bg: '#f3f0f4', border: '#a497a3', text: '#7d7279' },
    ],
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
};

const darkTheme: ThemeConfig = {
  name: 'dark',
  colors: {
    primary: '#d1968c',
    primaryHover: '#dca399',
    primaryActive: '#e7b0a6',
    
    secondary: '#cb9a88',
    secondaryHover: '#d6a795',
    secondaryActive: '#e1b4a2',
    
    background: '#1a1a1a',
    backgroundSecondary: '#2d2d2d',
    backgroundTertiary: '#404040',
    
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3',
    textMuted: '#666666',
    
    border: '#404040',
    borderHover: '#666666',
    
    success: '#4ade80',
    warning: '#facc15',
    error: '#f87171',
    info: '#38bdf8',
    
    eventColors: [
      { bg: '#d1968c', border: '#e7beac', text: '#262624' },
      { bg: '#cb9a88', border: '#e7beac', text: '#262624' },
      { bg: '#9db3b7', border: '#b5c8cc', text: '#262624' },
      { bg: '#eac5a7', border: '#f2d7c0', text: '#262624' },
      { bg: '#b8746b', border: '#d1968c', text: '#262624' },
      { bg: '#877070', border: '#a08989', text: '#262624' },
      { bg: '#a67c5a', border: '#c5977a', text: '#262624' },
      { bg: '#c5877c', border: '#dea195', text: '#262624' },
      { bg: '#8fa785', border: '#a8c09e', text: '#262624' },
      { bg: '#a497a3', border: '#bdb0bc', text: '#262624' },
    ],
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
};

export const themes: Record<Theme, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
};

export const getTheme = (themeName: Theme): ThemeConfig => {
  return themes[themeName];
};

export const getEventColor = (theme: Theme, index: number) => {
  const themeConfig = getTheme(theme);
  const colors = themeConfig.colors.eventColors;
  return colors[index % colors.length];
}; 