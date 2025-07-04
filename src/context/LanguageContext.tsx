import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import * as api from '../services/api';

type LanguageContextType = {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  changeLanguage: async () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const fetchAndSetLanguage = async () => {
      try {
        const prefs = await api.getUserPreferences();
        if (prefs.language) {
          await i18nInstance.changeLanguage(prefs.language);
        } else {
          const savedLanguage = localStorage.getItem('i18nextLng') || i18n.language;
          if (savedLanguage) {
            await i18nInstance.changeLanguage(savedLanguage);
          }
        }
      } catch (error) {
        console.error("Failed to fetch language preferences, using fallback.", error);
        const savedLanguage = localStorage.getItem('i18nextLng') || i18n.language;
        if (savedLanguage) {
          await i18nInstance.changeLanguage(savedLanguage);
        }
      }
    };
    fetchAndSetLanguage();
  }, []);

  const changeLanguage = async (lang: string) => {
    try {
      await i18nInstance.changeLanguage(lang);
      setCurrentLanguage(lang);
      localStorage.setItem('i18nextLng', lang);
      // Sync with backend
      if (lang === 'en' || lang === 'es') {
        api.updateUserPreferences({ language: lang }).catch(err => {
          console.error("Failed to sync language preference.", err);
        });
      }
      // Force a re-render of components using translations
      window.dispatchEvent(new Event('languageChanged'));
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(i18nInstance.language);
    };

    i18nInstance.on('languageChanged', handleLanguageChanged);
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChanged);
    };
  }, [i18nInstance]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}