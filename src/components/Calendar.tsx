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
      className="btn btn-secondary btn-sm"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--text-xs)',
        minWidth: 'auto'
      }}
    >
      <Download style={{ width: 'var(--space-4)', height: 'var(--space-4)' }} />
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '650px',
      backgroundColor: 'var(--bg-primary)',
      padding: 'var(--space-4)',
      borderRadius: '12px',
      border: '1px solid var(--border-secondary)',
      transition: 'all var(--duration-normal) var(--ease-out)',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-4)',
        paddingBottom: 'var(--space-3)',
        borderBottom: '1px solid var(--border-secondary)'
      }}>
        <h2 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-primary)',
          margin: '0'
        }}>
          {t('calendar.title')}
        </h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)'
        }}>
          <ExportButton onClick={handleExportICS} text="iCal" />
          <ExportButton onClick={handleExportCSV} text="CSV" />
        </div>
      </div>
      <div style={{ flex: '1', minHeight: '0' }}>
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
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: 'var(--space-1)',
                overflow: 'hidden'
              }}>
                <div style={{
                  fontWeight: 'var(--font-semibold)',
                  fontSize: 'var(--text-xs)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {eventInfo.event.title}
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  opacity: '0.9',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {eventInfo.event.extendedProps.description}
                </div>
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