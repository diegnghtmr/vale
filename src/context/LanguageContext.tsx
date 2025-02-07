import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

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
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get initial language from localStorage or browser
    const savedLanguage = localStorage.getItem('i18nextLng');
    return savedLanguage || i18n.language || 'en';
  });

  const changeLanguage = async (lang: string) => {
    try {
      await i18nInstance.changeLanguage(lang);
      setCurrentLanguage(lang);
      localStorage.setItem('i18nextLng', lang);
      // Force a re-render of components using translations
      window.dispatchEvent(new Event('languageChanged'));
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && savedLanguage !== currentLanguage) {
      changeLanguage(savedLanguage);
    }
  }, []);

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