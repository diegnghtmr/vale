import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { CustomTimePicker } from './CustomTimePicker';

interface TimeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export function TimeInput({ value, onChange, required }: TimeInputProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  const handleTimeChange = (newTime: string) => {
    // Simular un evento de cambio para que CourseForm lo maneje igual
    const event = {
      target: { value: newTime },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text" // Cambiado a text para evitar conflictos de UI nativa
        readOnly
        required={required}
        value={value}
        onClick={() => setIsPickerOpen(true)}
        className="form-input"
        style={{ paddingRight: 'var(--space-10)', cursor: 'pointer' }}
      />
      <div
        style={{
          position: 'absolute',
          right: 'var(--space-3)',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          zIndex: 2,
          pointerEvents: 'none', // El clic se maneja en el input
        }}
      >
        <Clock style={{ height: 'var(--space-4)', width: 'var(--space-4)', color: 'var(--text-secondary)' }} />
      </div>

      {isPickerOpen && (
        <CustomTimePicker
          value={value}
          onChange={handleTimeChange}
          onClose={() => setIsPickerOpen(false)}
        />
      )}
    </div>
  );
} 