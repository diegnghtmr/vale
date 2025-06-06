import React, { useState, useEffect, useRef } from 'react';

interface CustomTimePickerProps {
  value: string;
  onChange: (newTime: string) => void;
  onClose: () => void;
}

const hours = Array.from({ length: 16 }, (_, i) => (i + 7).toString().padStart(2, '0'));
const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

export function CustomTimePicker({ value, onChange, onClose }: CustomTimePickerProps) {
  const [selectedHour, setSelectedHour] = useState('07');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      if (hours.includes(h)) {
        setSelectedHour(h);
      }
      if (m && minutes.includes(m)) {
        setSelectedMinute(m);
      }
    }
  }, [value]);

  useEffect(() => {
    // Cerrar si se hace clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSetTime = () => {
    onChange(`${selectedHour}:${selectedMinute}`);
    onClose();
  };

  return (
    <div ref={pickerRef} className="time-picker-popover">
      <div className="time-picker-columns">
        <div className="time-picker-column">
          {hours.map(hour => (
            <div
              key={hour}
              className={`time-picker-item ${selectedHour === hour ? 'selected' : ''}`}
              onClick={() => setSelectedHour(hour)}
            >
              {hour}
            </div>
          ))}
        </div>
        <div className="time-picker-column">
          {minutes.map(minute => (
            <div
              key={minute}
              className={`time-picker-item ${selectedMinute === minute ? 'selected' : ''}`}
              onClick={() => setSelectedMinute(minute)}
            >
              {minute}
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleSetTime} className="time-picker-button">
        Set Time
      </button>
    </div>
  );
} 