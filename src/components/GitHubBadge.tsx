import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Github } from 'lucide-react';

export const GitHubBadge: React.FC = () => {
  const { t } = useTranslation();

  const handleOpenGitHub = () => {
    window.open('https://github.com/diegnghtmr/vale', '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 'var(--space-6)',
      right: 'var(--space-6)',
      zIndex: 50,
      opacity: 0.9
    }}>
      <button
        onClick={handleOpenGitHub}
        style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50px',
          padding: 'var(--space-3) var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-semibold)',
          cursor: 'pointer',
          transition: 'all var(--duration-fast) var(--ease-out)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(197, 119, 91, 0.3)',
          backdropFilter: 'blur(10px)',
          transform: 'translateY(0) scale(1)',
          animation: 'floatIn 0.6s var(--ease-out) forwards, glow 3s ease-in-out infinite'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(197, 119, 91, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(197, 119, 91, 0.3)';
        }}
      >
        <Github size={16} />
        <Star size={14} style={{ animation: 'twinkle 2s ease-in-out infinite' }} />
        <span>{t('github.badgeText', 'Star us!')}</span>
      </button>

      <style>
        {`
          @keyframes floatIn {
            from {
              transform: translateY(60px) scale(0.8);
              opacity: 0;
            }
            to {
              transform: translateY(0) scale(1);
              opacity: 0.9;
            }
          }
          
          @keyframes glow {
            0%, 100% { 
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(197, 119, 91, 0.3);
            }
            50% { 
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2), 0 3px 12px rgba(197, 119, 91, 0.5);
            }
          }
          
          @keyframes twinkle {
            0%, 100% { 
              transform: rotate(0deg) scale(1);
              opacity: 1;
            }
            25% { 
              transform: rotate(-15deg) scale(1.2);
              opacity: 0.8;
            }
            75% { 
              transform: rotate(15deg) scale(1.2);
              opacity: 0.8;
            }
          }
          
          @media (max-width: 768px) {
            div[style*="position: fixed"] {
              bottom: var(--space-4) !important;
              right: var(--space-4) !important;
            }
            
            button[style*="padding"] {
              padding: var(--space-2) var(--space-3) !important;
              font-size: var(--text-xs) !important;
            }
          }
        `}
      </style>
    </div>
  );
}; 