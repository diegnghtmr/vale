import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ThemeTransitionProps {
  isTransitioning: boolean;
  targetTheme: 'light' | 'dark';
}

export function ThemeTransition({ isTransitioning, targetTheme }: ThemeTransitionProps) {
  const { t } = useTranslation();
  
  if (!isTransitioning) return null;

  const isDarkTarget = targetTheme === 'dark';
  
  // Colores adaptativos según el tema objetivo
  const overlayBg = isDarkTarget 
    ? 'radial-gradient(circle, rgba(38,38,36,0.95) 0%, rgba(38,38,36,0.98) 100%)'
    : 'radial-gradient(circle, rgba(250,245,244,0.95) 0%, rgba(250,245,244,0.98) 100%)';
    
  const cardBg = isDarkTarget 
    ? 'rgba(28, 28, 27, 0.9)' 
    : 'rgba(255, 255, 255, 0.9)';
    
  const borderColor = isDarkTarget 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)';
    
  const textColor = isDarkTarget 
    ? '#faf5f4' 
    : '#1c1c1b';

  return (
    <div className="theme-transition-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: overlayBg,
      backdropFilter: 'blur(12px)',
      animation: 'themeTransitionIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-6)',
        padding: 'var(--space-8)',
        borderRadius: '24px',
        background: cardBg,
        border: `1px solid ${borderColor}`,
        boxShadow: isDarkTarget 
          ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
          : '0 20px 40px rgba(0, 0, 0, 0.1)',
        animation: 'themeTransitionContent 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both',
        minWidth: '200px',
        maxWidth: '90vw'
      }}>
        <div style={{
          position: 'relative',
          width: '72px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Outer spinning ring */}
          <div style={{
            position: 'absolute',
            width: '68px',
            height: '68px',
            border: `3px solid ${isDarkTarget ? '#2a2a2a' : '#f3f3f3'}`,
            borderTop: `3px solid ${isDarkTarget ? '#d1968c' : '#c5775b'}`,
            borderRadius: '50%',
            animation: 'spin 1.2s linear infinite'
          }} />
          
          {/* Inner pulsing ring */}
          <div style={{
            position: 'absolute',
            width: '52px',
            height: '52px',
            border: `2px solid ${isDarkTarget ? '#d1968c' : '#c5775b'}`,
            borderRadius: '50%',
            opacity: 0.3,
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          
          {/* Theme icon */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            animation: 'iconFloat 2s ease-in-out infinite',
            color: isDarkTarget ? '#d1968c' : '#c5775b'
          }}>
            {isDarkTarget ? (
              <Moon style={{ 
                width: '32px', 
                height: '32px'
              }} />
            ) : (
              <Sun style={{ 
                width: '32px', 
                height: '32px'
              }} />
            )}
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          color: textColor,
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-medium)',
          opacity: 0.9,
          lineHeight: 'var(--leading-snug)'
        }}>
          {t('common.changingTheme', { 
            theme: isDarkTarget ? t('common.darkMode') : t('common.lightMode') 
          })}
        </div>
        
        {/* Progress indicator */}
        <div style={{
          width: '120px',
          height: '3px',
          background: isDarkTarget ? '#2a2a2a' : '#e5e0dd',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '40px',
            height: '100%',
            background: `linear-gradient(90deg, ${isDarkTarget ? '#d1968c' : '#c5775b'}, ${isDarkTarget ? '#e7beac' : '#cb9a88'})`,
            borderRadius: '2px',
            animation: 'progressSlide 0.8s ease-in-out infinite'
          }} />
        </div>
      </div>

      <style>{`
        @keyframes themeTransitionIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes themeTransitionOut {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.1);
          }
        }
        
        @keyframes themeTransitionContent {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1); 
          }
          50% { 
            opacity: 0.7;
            transform: scale(1.05); 
          }
        }
        
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.05); }
        }
        
        @keyframes progressSlide {
          0% {
            transform: translateX(-100px);
          }
          50% {
            transform: translateX(80px);
          }
          100% {
            transform: translateX(-100px);
          }
        }
        
        .theme-transition-overlay.exiting {
          animation: themeTransitionOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @media (max-width: 480px) {
          .theme-transition-overlay > div {
            padding: var(--space-6) !important;
            min-width: 180px !important;
            border-radius: 20px !important;
          }
          
          .theme-transition-overlay > div > div:first-child {
            width: 60px !important;
            height: 60px !important;
          }
          
          .theme-transition-overlay > div > div:first-child > div:first-child {
            width: 56px !important;
            height: 56px !important;
          }
          
          .theme-transition-overlay > div > div:first-child > div:nth-child(2) {
            width: 42px !important;
            height: 42px !important;
          }
          
          .theme-transition-overlay svg {
            width: 28px !important;
            height: 28px !important;
          }
        }
      `}</style>
    </div>
  );
} 