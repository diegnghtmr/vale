import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary btn-md"
      style={{
        padding: 'var(--space-3)',
        width: '52px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        transition: 'all var(--duration-normal) var(--ease-out)'
      }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon style={{ height: 'var(--space-5)', width: 'var(--space-5)', color: 'var(--text-primary)' }} />
      ) : (
        <Sun style={{ height: 'var(--space-5)', width: 'var(--space-5)', color: 'var(--text-primary)' }} />
      )}
    </button>
  );
}