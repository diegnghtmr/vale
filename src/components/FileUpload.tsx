import React, { useCallback } from 'react';
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
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400'
        } dark:bg-gray-800`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {isDragActive
          ? t('fileUpload.dropHere')
          : t('fileUpload.dragAndDrop')}
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
        {t('fileUpload.supportedFormats')}
      </p>
    </div>
  );
}