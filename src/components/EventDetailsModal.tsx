import { useEffect } from 'react';
import { X, Clock, MapPin, GraduationCap, FileText, Calendar } from 'lucide-react';
import { CourseEvent } from '../types';
import { useTranslation } from 'react-i18next';

interface EventDetailsModalProps {
  event: CourseEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const startTime = new Date(event.start);
  const endTime = new Date(event.end);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('es-CO', { 
      weekday: 'long'
    });
  };

  // Extract course info from title and extendedProps
  const courseName = event.title.split(' - ')[0] || event.title;
  const semester = event.extendedProps?.semester;
  const group = event.extendedProps?.group;
  const courseInfo = semester && group ? `S${semester} G${group}` : (event.title.split(' - ')[1] || '');

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
    >
      <div 
        className="modal modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh'
        }}
      >
        <div className="modal-header">
          <h3 className="modal-title" style={{ 
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 'var(--leading-snug)'
          }}>
            {t('calendar.eventDetails.title')}
          </h3>
          <button 
            className="modal-close"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 'var(--space-2)',
              borderRadius: '6px',
              transition: 'all var(--duration-normal) var(--ease-out)',
              color: 'var(--text-secondary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--space-5)' 
        }}>
          {/* Course Name */}
          <div style={{ 
            padding: 'var(--space-4)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-secondary)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-2)'
            }}>
              <div style={{
                padding: 'var(--space-2)',
                backgroundColor: 'var(--accent-primary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GraduationCap size={16} color="var(--bg-primary)" />
              </div>
              <span style={{ 
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--text-secondary)'
              }}>
                {t('calendar.eventDetails.course')}
              </span>
            </div>
            <h4 style={{ 
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 'var(--leading-snug)'
            }}>
              {courseName}
            </h4>
            {courseInfo && (
              <p style={{ 
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                margin: 'var(--space-1) 0 0 0',
                lineHeight: 'var(--leading-normal)'
              }}>
                {courseInfo}
              </p>
            )}
          </div>

          {/* Schedule */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--space-3)' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-2)' 
            }}>
              <Clock size={18} color="var(--accent-primary)" />
              <span style={{ 
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--text-primary)'
              }}>
                {t('calendar.eventDetails.schedule')}
              </span>
            </div>
            <div style={{ 
              padding: 'var(--space-3)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 'var(--space-2) var(--space-4)',
              alignItems: 'center'
            }}>
              <span style={{ 
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)'
              }}>
                {t('calendar.eventDetails.day')}:
              </span>
              <span style={{ 
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--text-primary)',
                textTransform: 'capitalize'
              }}>
                {formatDay(startTime)}
              </span>
              <span style={{ 
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)'
              }}>
                {t('calendar.eventDetails.time')}:
              </span>
              <span style={{ 
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--text-primary)'
              }}>
                {formatTime(startTime)} - {formatTime(endTime)}
              </span>
            </div>
          </div>

          {/* Additional Details */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--space-3)' 
          }}>
            {event.extendedProps?.classroom && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px'
              }}>
                <MapPin size={16} color="var(--accent-primary)" />
                <div>
                  <span style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    display: 'block'
                  }}>
                    {t('calendar.eventDetails.classroom')}
                  </span>
                  <span style={{ 
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--text-primary)'
                  }}>
                    {event.extendedProps.classroom}
                  </span>
                </div>
              </div>
            )}

            {event.extendedProps?.credits && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px'
              }}>
                <Calendar size={16} color="var(--accent-primary)" />
                <div>
                  <span style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    display: 'block'
                  }}>
                    {t('calendar.eventDetails.credits')}
                  </span>
                  <span style={{ 
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--text-primary)'
                  }}>
                    {event.extendedProps.credits}
                  </span>
                </div>
              </div>
            )}

            {event.extendedProps?.details && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px'
              }}>
                <FileText size={16} color="var(--accent-primary)" style={{ marginTop: '2px' }} />
                <div>
                  <span style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    display: 'block',
                    marginBottom: 'var(--space-1)'
                  }}>
                    {t('calendar.eventDetails.details')}
                  </span>
                  <p style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-primary)',
                    margin: 0,
                    lineHeight: 'var(--leading-normal)'
                  }}>
                    {event.extendedProps.details}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 