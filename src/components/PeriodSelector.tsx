import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AcademicPeriod, getAcademicPeriods } from '../utils/loadAcademicPeriods';
import { Course } from '../types';

interface Props {
  onUpload: (data: Course[]) => void;
}

export function PeriodSelector({ onUpload }: Props) {
  const { t } = useTranslation();
  const periods = getAcademicPeriods();
  const [selected, setSelected] = useState<AcademicPeriod | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setSelected(null);
      onUpload([]); // Clear all courses when returning to "-- Select period --"
      return;
    }

    const period = periods[Number(value)];
    setSelected(period);
    setLoading(true);
    
    try {
      const module = await period.load();
      const data = Array.isArray(module) ? module : module.courses;
      
      // Transform the data to match the expected Course interface
      const transformedData = data.map((course: any) => ({
        ...course,
        timeSlot: course.timeSlot === 'Nocturno' ? 'night' : 'day',
        schedule: course.schedule.map((slot: any) => ({
          ...slot,
          day: slot.day.toLowerCase()
            .replace('lunes', 'monday')
            .replace('martes', 'tuesday')
            .replace('miércoles', 'wednesday')
            .replace('jueves', 'thursday')
            .replace('viernes', 'friday')
            .replace('sábado', 'saturday')
        }))
      }));
      
      onUpload(transformedData);
    } catch (error) {
      console.error('Error loading academic period:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      marginBottom: 'var(--space-6)',
      background: 'var(--bg-secondary)',
      padding: 'var(--space-5)',
      borderRadius: '12px',
      border: '1px solid var(--border-secondary)',
      transition: 'all var(--duration-normal) var(--ease-out)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 80%, var(--accent-tertiary) 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, var(--accent-tertiary) 0%, transparent 50%),
                     radial-gradient(circle at 40% 40%, var(--accent-tertiary) 0%, transparent 50%)`,
        opacity: 0.1,
        pointerEvents: 'none'
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-3)'
        }}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ 
              color: 'var(--accent-primary)',
              animation: loading ? 'pulse 2s ease-in-out infinite' : 'none'
            }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
          </svg>
          <label style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em'
          }}>
            {t('periodSelector.title')}
          </label>
          {loading && (
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid var(--border-primary)',
              borderTop: '2px solid var(--accent-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          )}
        </div>
        
        <div style={{ position: 'relative' }}>
          {/* Icon indicator for period type */}
          <div style={{
            position: 'absolute',
            left: 'var(--space-4)',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            {selected ? (
              <>
                {selected.label.includes('preview') ? (
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ color: 'var(--accent-secondary)' }}
                  >
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                ) : (
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                )}
              </>
            ) : (
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            )}
          </div>
          
          <select 
            onChange={handleChange} 
            value={selected ? periods.indexOf(selected) : ''} 
            disabled={loading}
            className="form-input form-select"
            style={{
              width: '100%',
              padding: 'var(--space-4) var(--space-12) var(--space-4) var(--space-12)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-medium)',
              border: loading ? '2px solid var(--accent-secondary)' : '2px solid var(--border-primary)',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
              transition: 'all var(--duration-normal) var(--ease-out)',
              boxShadow: loading ? '0 0 20px rgba(197, 119, 91, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
              outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23c5775b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right var(--space-4) center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '16px 12px',
              paddingRight: 'var(--space-12)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(197, 119, 91, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-primary)';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
            }}
          >
            <option value="" style={{ 
              color: 'var(--text-tertiary)',
              fontStyle: loading ? 'italic' : 'normal'
            }}>
              {loading ? t('periodSelector.loading') : t('periodSelector.selectPeriod')}
            </option>
            {periods.map((p, i) => (
              <option key={p.path} value={i} style={{ 
                color: 'var(--text-primary)',
                padding: 'var(--space-2)'
              }}>
                {p.label}
              </option>
            ))}
          </select>
          
          {/* Success indicator */}
          {selected && !loading && (
            <div style={{
              position: 'absolute',
              right: 'var(--space-12)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--success)',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              ✓
            </div>
          )}
        </div>
        
        {/* Info text */}
                 <p style={{
           marginTop: 'var(--space-3)',
           fontSize: 'var(--text-xs)',
           color: 'var(--text-tertiary)',
           fontStyle: 'italic',
           display: 'flex',
           alignItems: 'center',
           gap: 'var(--space-2)'
         }}>
           <svg 
             width="14" 
             height="14" 
             viewBox="0 0 24 24" 
             fill="none" 
             stroke="currentColor" 
             strokeWidth="2"
             style={{ 
               color: 'var(--accent-tertiary)',
               flexShrink: 0 
             }}
           >
             <circle cx="12" cy="12" r="10"/>
             <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
             <line x1="12" y1="17" x2="12.01" y2="17"/>
           </svg>
           {loading ? 
             t('periodSelector.loadingData') : 
             t('periodSelector.helpText')
           }
         </p>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-50%) scale(0.8); }
          to { opacity: 1; transform: translateY(-50%) scale(1); }
        }
      `}</style>
    </div>
  );
} 