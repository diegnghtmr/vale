import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const toggleLanguage = async () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    try {
      await changeLanguage(newLanguage);
      toast.success(t('common.languageChanged'), {
        duration: 2000,
        position: 'top-center',
      });
    } catch (error) {
      console.error('Failed to change language:', error);
      toast.error(t('common.languageChangeError'));
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
      aria-label={t('common.language')}
    >
      <Globe className="h-4 w-4 mr-2" />
      {currentLanguage === 'en' ? t('common.spanish') : t('common.english')}
    </button>
  );
}