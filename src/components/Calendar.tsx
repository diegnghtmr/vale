import { useState, memo } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { CourseEvent } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { EventDetailsModal } from './EventDetailsModal';

// Explicitly import esLocale to ensure it's included in the build
const locales = [esLocale];

interface CalendarProps {
  events: CourseEvent[];
}

export const Calendar = memo(function Calendar({ events }: CalendarProps) {
  const { currentLanguage } = useLanguage();
  
  const [selectedEvent, setSelectedEvent] = useState<CourseEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (clickInfo: any) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <div style={{ height: '650px' }}>
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          locales={locales}
          locale={currentLanguage === 'es' ? 'es' : 'en'}
          firstDay={0}
          allDaySlot={false}
          slotMinTime="06:00:00"
          slotMaxTime="24:00:00"
          weekends={true}
          events={events}
          height="100%"
          slotDuration="00:30:00"
          expandRows={true}
          eventClick={handleEventClick}
          eventContent={(eventInfo) => {
            // Extract course name from title (everything before the first " - ")
            const titleParts = eventInfo.event.title.split(' - ');
            const courseName = titleParts[0] || eventInfo.event.title;
            
            return (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'var(--space-1)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-out)'
              }}>
                <div style={{
                  fontWeight: 'var(--font-semibold)',
                  fontSize: 'var(--text-xs)',
                  lineHeight: 'var(--leading-tight)',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  textAlign: 'center'
                }}>
                  {courseName}
                </div>
              </div>
            );
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          titleFormat={{ month: 'long', year: 'numeric' }}
          nowIndicator={true}
          scrollTime="07:00:00"
        />
      </div>
      
      <EventDetailsModal 
        event={selectedEvent} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
});