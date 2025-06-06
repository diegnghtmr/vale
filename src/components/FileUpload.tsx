import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Course, Schedule } from '../types';

interface FileUploadProps {
  onUpload: (data: Course[]) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const { t } = useTranslation();

  const parseCSV = (text: string): Course[] => {
    const rows = text.split('\n').filter(row => row.trim());
    const headers = rows[0].split(',').map(h => h.trim());
    
    const requiredHeaders = ['name', 'credits', 'semester', 'timeSlot', 'group', 'day', 'startTime', 'endTime'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(t('fileUpload.missingColumns', { columns: missingHeaders.join(', ') }));
    }

    const courses = new Map<string, Course>();

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) continue;

      const row = Object.fromEntries(headers.map((h, i) => [h, values[i]]));
      
      if (!row.name || !row.credits || !row.semester || !row.timeSlot || !row.group ||
          !row.day || !row.startTime || !row.endTime) {
        toast.error(t('fileUpload.missingData', { row: i + 1 }));
        continue;
      }

      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      if (!validDays.includes(row.day.toLowerCase())) {
        toast.error(t('fileUpload.invalidDay', { row: i + 1, day: row.day }));
        continue;
      }

      if (!['day', 'night'].includes(row.timeSlot.toLowerCase())) {
        toast.error(t('fileUpload.invalidTimeSlot', { row: i + 1, timeSlot: row.timeSlot }));
        continue;
      }

      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(row.startTime) || !timeRegex.test(row.endTime)) {
        toast.error(t('fileUpload.invalidTimeFormat', { row: i + 1 }));
        continue;
      }

      const schedule: Schedule = {
        day: row.day.toLowerCase() as Schedule['day'],
        startTime: row.startTime,
        endTime: row.endTime
      };

      if (courses.has(row.name)) {
        const course = courses.get(row.name)!;
        course.schedule.push(schedule);
      } else {
        courses.set(row.name, {
          name: row.name,
          credits: Number(row.credits),
          semester: Number(row.semester),
          timeSlot: row.timeSlot.toLowerCase() as 'day' | 'night',
          group: row.group,
          schedule: [schedule]
        });
      }
    }

    return Array.from(courses.values());
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onabort = () => toast.error(t('fileUpload.readAborted'));
    reader.onerror = () => toast.error(t('fileUpload.readError'));
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const rawData = file.name.endsWith('.csv') 
          ? parseCSV(text)
          : JSON.parse(text);
        
        const data = Array.isArray(rawData) ? rawData : rawData.courses;
        
        if (!Array.isArray(data)) {
          throw new Error(t('fileUpload.invalidFormat'));
        }

        onUpload(data);
        toast.success(t('fileUpload.success'));
      } catch (error: unknown) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : t('fileUpload.unknownError');
        toast.error(t('fileUpload.processingError', { error: errorMessage }));
      }
    };

    reader.readAsText(file);
  }, [onUpload, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      style={{
        padding: 'var(--space-12)',
        border: `2px dashed ${isDragActive ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
        borderRadius: '16px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all var(--duration-normal) var(--ease-in-out)',
        backgroundColor: isDragActive ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (!isDragActive) {
          e.currentTarget.style.borderColor = 'var(--accent-secondary)';
          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragActive) {
          e.currentTarget.style.borderColor = 'var(--border-primary)';
          e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <input {...getInputProps()} />
      
      {/* Icono de upload con animación */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px',
        backgroundColor: isDragActive ? 'var(--accent-primary)' : 'var(--bg-secondary)',
        borderRadius: '50%',
        marginBottom: 'var(--space-6)',
        transition: 'all var(--duration-normal) var(--ease-in-out)',
        transform: isDragActive ? 'scale(1.1)' : 'scale(1)'
      }}>
        <Upload 
          style={{ 
            height: '32px', 
            width: '32px', 
            color: isDragActive ? 'var(--bg-primary)' : 'var(--accent-primary)',
            transition: 'color var(--duration-normal) var(--ease-in-out)'
          }} 
        />
      </div>

      {/* Texto principal */}
      <p style={{
        margin: '0 0 var(--space-3) 0',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-primary)',
        lineHeight: 'var(--leading-snug)'
      }}>
        {isDragActive
          ? t('fileUpload.dropHere')
          : t('fileUpload.dragAndDrop')}
      </p>

      {/* Texto secundario */}
      <p style={{
        margin: '0',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        lineHeight: 'var(--leading-normal)'
      }}>
        {t('fileUpload.supportedFormats')}
      </p>

      {/* Decoración de fondo */}
      {isDragActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, transparent 30%, var(--accent-tertiary) 50%, transparent 70%)`,
          opacity: 0.1,
          pointerEvents: 'none',
          animation: 'slideInLeft var(--duration-slow) var(--ease-out)'
        }} />
      )}
    </div>
  );
}