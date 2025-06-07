import { useTheme } from '../context/ThemeContext';
import { ThemeIcon } from './AnimatedIcons';
import { useEffect, useRef } from 'react';
import { animations } from '../utils/animations';
import { useTranslation } from 'react-i18next';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      const hoverAnimation = animations.hoverScale(buttonRef.current);
      
      const handleMouseEnter = () => hoverAnimation.play();
      const handleMouseLeave = () => hoverAnimation.reverse();
      
      const button = buttonRef.current;
      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const handleClick = () => {
    toggleTheme();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
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
      aria-label="Toggle theme"
    >
      <ThemeIcon 
        size={16} 
        isDark={theme === 'dark'}
        color="var(--text-primary)"
      />
      <span>
        {theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
      </span>
    </button>
  );
}