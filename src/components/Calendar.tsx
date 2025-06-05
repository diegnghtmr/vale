import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import * as ics from 'ics';
import { Download } from 'lucide-react';
import { CourseEvent } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

// Explicitly import esLocale to ensure it's included in the build
const locales = [esLocale];

interface CalendarProps {
  events: CourseEvent[];
}

interface ExportButtonProps {
  onClick: () => void;
  text: string;
}

function ExportButton({ onClick, text }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
    >
      <Download className="w-4 h-4" />
      <span>{text}</span>
    </button>
  );
}

export function Calendar({ events }: CalendarProps) {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const handleExportICS = () => {
    const icsEvents = events.map(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);

      return {
        title: event.title,
        description: event.extendedProps?.description || '',
        start: [start.getUTCFullYear(), start.getUTCMonth() + 1, start.getUTCDate(), start.getUTCHours(), start.getUTCMinutes()],
        end: [end.getUTCFullYear(), end.getUTCMonth() + 1, end.getUTCDate(), end.getUTCHours(), end.getUTCMinutes()],
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
      } as ics.EventAttributes;
    });

    const { error, value } = ics.createEvents(icsEvents);

    if (error) {
      console.error(error);
      return;
    }

    const blob = new Blob([value!], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'horario.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    const headers = ['Subject', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Description'];
    const rows = events.map(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return [
        `"${event.title}"`,
        start.toLocaleDateString(),
        start.toLocaleTimeString(),
        end.toLocaleDateString(),
        end.toLocaleTimeString(),
        `"${event.extendedProps?.description || ''}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'horario.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-[650px] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-colors border dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('calendar.title')}</h2>
        <div className="flex items-center gap-2">
          <ExportButton onClick={handleExportICS} text="iCal" />
          <ExportButton onClick={handleExportCSV} text="CSV" />
        </div>
      </div>
      <div className="flex-grow">
        <style>{`
        .fc {
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
        }
        
        /* Calendar header and text */
        .fc-toolbar-title {
          color: ${isDark ? '#f3f4f6' : '#111827'} !important;
          font-weight: 600 !important;
          font-size: 1.125rem !important;
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
          headerToolbar={false}
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
    </div>
  );
}