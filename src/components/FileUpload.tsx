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
    <>
      <style>
        {`
          @keyframes uploadPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes uploadIconBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          
          @keyframes shimmerBackground {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          .upload-container {
            padding: var(--space-12);
            border: 2px dashed var(--border-primary);
            border-radius: 16px;
            text-align: center;
            cursor: pointer;
            transition: all var(--duration-normal) var(--ease-out);
            backgroundColor: var(--bg-tertiary);
            position: relative;
            overflow: hidden;
          }
          
          .upload-container:hover:not(.drag-active) {
            border-color: var(--accent-secondary);
            background-color: var(--bg-secondary);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }
          
          .upload-container.drag-active {
            border-color: var(--accent-primary);
            background-color: var(--bg-secondary);
            animation: uploadPulse 2s ease-in-out infinite;
          }
          
          .upload-icon-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            background-color: var(--bg-secondary);
            border-radius: 50%;
            margin-bottom: var(--space-6);
            transition: all var(--duration-normal) var(--ease-out);
          }
          
          .upload-container.drag-active .upload-icon-container {
            background-color: var(--accent-primary);
            animation: uploadIconBounce 1s ease-in-out infinite;
          }
          
          .upload-icon {
            height: 32px;
            width: 32px;
            color: var(--accent-primary);
            transition: all var(--duration-normal) var(--ease-out);
          }
          
          .upload-container.drag-active .upload-icon {
            color: var(--bg-primary);
          }
          
          .upload-shimmer {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent,
              var(--accent-tertiary),
              transparent
            );
            background-size: 200% 100%;
            animation: shimmerBackground 2s ease-in-out infinite;
            pointer-events: none;
            opacity: 0;
            transition: opacity var(--duration-normal) var(--ease-out);
          }
          
          .upload-container.drag-active .upload-shimmer {
            opacity: 1;
          }
        `}
      </style>
      
      <div
        {...getRootProps()}
        className={`upload-container ${isDragActive ? 'drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        
        {/* Icono de upload con animación */}
        <div className="upload-icon-container">
          <Upload className="upload-icon" />
        </div>

        {/* Texto principal */}
        <p style={{
          margin: '0 0 var(--space-3) 0',
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-primary)',
          lineHeight: 'var(--leading-snug)',
          transition: 'all var(--duration-normal) var(--ease-out)'
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
          lineHeight: 'var(--leading-normal)',
          transition: 'all var(--duration-normal) var(--ease-out)'
        }}>
          {t('fileUpload.supportedFormats')}
        </p>

        {/* Efecto shimmer de fondo */}
        <div className="upload-shimmer" />
      </div>
    </>
  );
}