import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { CourseEvent } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Explicitly import esLocale to ensure it's included in the build
const locales = [esLocale];

interface CalendarProps {
  events: CourseEvent[];
}

export function Calendar({ events }: CalendarProps) {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();
  const isDark = theme === 'dark';

  return (
    <div className="h-[600px] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-colors border dark:border-gray-700">
      <style>{`
        .fc {
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
        }
        
        /* Calendar header and text */
        .fc-toolbar-title {
          color: ${isDark ? '#f3f4f6' : '#111827'} !important;
          font-weight: 600 !important;
        }
        
        /* Grid lines and borders */
        .fc-timegrid-slot,
        .fc-timegrid-axis,
        .fc-col-header-cell {
          border-color: ${isDark ? '#374151' : '#e5e7eb'} !important;
        }
        
        /* Background colors */
        .fc-timegrid-axis,
        .fc-col-header-cell {
          background-color: ${isDark ? '#1f2937' : '#f9fafb'} !important;
        }
        
        /* Time labels */
        .fc-timegrid-axis-cushion,
        .fc-timegrid-slot-label-cushion {
          color: ${isDark ? '#9ca3af' : '#4b5563'} !important;
          font-weight: 500;
        }
        
        /* Day headers */
        .fc-col-header-cell-cushion {
          color: ${isDark ? '#e5e7eb' : '#111827'} !important;
          font-weight: 600;
          padding: 8px 0;
        }
        
        /* Current time indicator */
        .fc-timegrid-now-indicator-line {
          border-color: ${isDark ? '#ef4444' : '#dc2626'} !important;
        }
        
        .fc-timegrid-now-indicator-arrow {
          border-color: ${isDark ? '#ef4444' : '#dc2626'} !important;
        }
        
        /* Event styles */
        .fc-event {
          border-radius: 6px !important;
          padding: 2px 4px !important;
          margin: 1px 1px !important;
        }
        
        /* Time slots highlighting */
        .fc-timegrid-slot {
          height: 48px !important;
        }
        
        .fc-timegrid-slot:hover {
          background-color: ${isDark ? '#374151' : '#f3f4f6'} !important;
        }
        
        /* Event content container */
        .fc-event-main {
          padding: 2px !important;
        }
        
        /* Theme system overrides */
        .fc-theme-standard td, 
        .fc-theme-standard th {
          border-color: ${isDark ? '#374151' : '#e5e7eb'} !important;
        }
        
        /* Event selection state */
        .fc-event:hover {
          filter: brightness(${isDark ? '1.2' : '0.95'});
        }
        
        /* Time grid columns */
        .fc-timegrid-col.fc-day {
          background-color: ${isDark ? '#111827' : '#ffffff'} !important;
        }
      `}</style>
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: '',
          center: 'title',
          right: ''
        }}
        locales={locales}
        locale={currentLanguage === 'es' ? 'es' : 'en'}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        weekends={true}
        events={events}
        height="100%"
        slotDuration="00:30:00"
        expandRows={true}
        eventContent={(eventInfo) => {
          return (
            <div className="w-full h-full flex flex-col p-1 overflow-hidden">
              <div className="font-semibold truncate text-xs">{eventInfo.event.title}</div>
              <div className="truncate text-[11px] opacity-90">{eventInfo.event.extendedProps.description}</div>
            </div>
          );
        }}
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }}
        titleFormat={{ month: 'long', year: 'numeric' }}
        nowIndicator={true}
        scrollTime="07:00:00"
      />
    </div>
  );
}