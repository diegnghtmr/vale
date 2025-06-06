import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface FormErrorProps {
  message: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div style={{
      padding: 'var(--space-6)',
      borderLeft: `4px solid var(--error)`,
      borderRadius: '0 12px 12px 0',
      backgroundColor: 'var(--bg-secondary)',
      margin: 'var(--space-2) 0'
    }}>
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <div style={{ flexShrink: 0 }}>
          <AlertTriangle style={{ height: 'var(--space-5)', width: 'var(--space-5)', color: 'var(--error)' }} />
        </div>
        <div>
          <p className="text-body-sm" style={{
            color: 'var(--error)',
            whiteSpace: 'pre-line',
            margin: '0'
          }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
} 