import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Github, Heart, ArrowUpRight, X } from 'lucide-react';

interface GitHubPromotionProps {
  onDismiss?: () => void;
}

export const GitHubPromotion: React.FC<GitHubPromotionProps> = ({ onDismiss }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animate in after a short delay
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenGitHub = () => {
    window.open('https://github.com/diegnghtmr/vale', '_blank', 'noopener,noreferrer');
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`github-promotion ${isAnimating ? 'animate-in' : ''}`}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
        padding: 'var(--space-6)',
        borderRadius: '16px',
        color: 'white',
        overflow: 'hidden',
        transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        opacity: isAnimating ? 1 : 0,
        transition: 'all var(--duration-slow) var(--ease-out)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(197, 119, 91, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite alternate'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 3s ease-in-out infinite alternate-reverse'
      }} />

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer',
          transition: 'all var(--duration-fast) var(--ease-out)',
          zIndex: 2
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <X size={16} />
      </button>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: 'var(--space-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Github size={24} />
          </div>
          <div>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              {t('github.title')}
              <Heart size={16} style={{ color: '#ff6b6b', animation: 'heartbeat 2s ease-in-out infinite' }} />
            </h3>
            <p style={{
              fontSize: 'var(--text-sm)',
              margin: 0,
              opacity: 0.9,
              fontWeight: 'var(--font-medium)'
            }}>
              {t('github.subtitle')}
            </p>
          </div>
        </div>

        <p style={{
          fontSize: 'var(--text-base)',
          lineHeight: 'var(--leading-relaxed)',
          margin: '0 0 var(--space-5) 0',
          opacity: 0.95
        }}>
          {t('github.description')}
        </p>

        <button
          onClick={handleOpenGitHub}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: 'var(--space-3) var(--space-5)',
            color: 'white',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            cursor: 'pointer',
            transition: 'all var(--duration-fast) var(--ease-out)',
            transform: 'translateY(0)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
          }}
        >
          <Star size={18} style={{ animation: 'sparkle 2s ease-in-out infinite' }} />
          {t('github.starButton')}
          <ArrowUpRight size={16} />
        </button>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.3; }
            100% { transform: scale(1.1); opacity: 0.1; }
          }
          
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          
          @keyframes sparkle {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(-10deg) scale(1.1); }
            75% { transform: rotate(10deg) scale(1.1); }
          }
          
          .github-promotion {
            animation: slideInFromBottom 0.6s var(--ease-out) forwards;
          }
          
          @keyframes slideInFromBottom {
            from {
              transform: translateY(30px) scale(0.9);
              opacity: 0;
            }
            to {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}; 