import React from 'react';
import { DownloadIcon as AnimatedDownloadIcon } from './AnimatedIcons';
import { useHoverAnimation } from '../hooks';

interface ExportButtonProps {
  onClick: () => void;
  text: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function ExportButton({ 
  onClick, 
  text, 
  icon,
  variant = 'secondary',
  size = 'sm'
}: ExportButtonProps) {
  const buttonRef = useHoverAnimation<HTMLButtonElement>({
    scale: 1.05,
    duration: 0.2,
  });

  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--text-xs)',
        minWidth: 'auto'
      }}
    >
      {icon || <AnimatedDownloadIcon size={16} isActive={false} />}
      <span>{text}</span>
    </button>
  );
} 