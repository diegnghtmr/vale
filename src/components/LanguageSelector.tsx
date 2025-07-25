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
      // toast.success(t('common.languageChanged'));
    } catch (error) {
      toast.error(t('common.languageChangeError'));
      console.error("Failed to change language", error);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="btn btn-secondary btn-md"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-5)',
        minWidth: '120px',
        height: '52px',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        borderRadius: '10px',
        transition: 'all var(--duration-normal) var(--ease-out)',
      }}
      aria-label={t('common.language')}
    >
      <Globe size={16} color="var(--text-primary)" />
      <span style={{ whiteSpace: 'nowrap' }}>
        {currentLanguage === 'en' ? t('common.spanish') : t('common.english')}
      </span>
    </button>
  );
}