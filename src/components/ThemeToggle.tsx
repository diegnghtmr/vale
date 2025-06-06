import { useTheme } from '../context/ThemeContext';
import { ThemeIcon } from './AnimatedIcons';
import { useEffect, useRef } from 'react';
import { animations } from '../utils/animations';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
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
        padding: 'var(--space-3)',
        width: '52px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        transition: 'all var(--duration-normal) var(--ease-out)',
        overflow: 'hidden',
      }}
      aria-label="Toggle theme"
    >
      <ThemeIcon 
        size={20} 
        isDark={theme === 'dark'}
        color="var(--text-primary)"
      />
    </button>
  );
}