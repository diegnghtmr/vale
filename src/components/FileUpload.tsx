import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Course } from '../types';
import { fileValidationService } from '../services/fileValidation';
import { notificationService } from '../services/notificationService';

interface FileUploadProps {
  onUpload: (data: Course[]) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const { t } = useTranslation();

  // File processing is now handled by the fileValidationService

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    try {
      const result = await fileValidationService.validateAndParseFile(file);
      
      if (result.isValid && result.data) {
        onUpload(result.data);
        notificationService.success(t('fileUpload.success'));
      } else {
        notificationService.handleFileUploadError(result.errors);
      }
    } catch (error) {
      notificationService.handleApiError(error, 'File upload failed');
    }
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