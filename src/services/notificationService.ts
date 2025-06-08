import toast from 'react-hot-toast';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  style?: React.CSSProperties;
  className?: string;
  icon?: string;
  id?: string;
}

export interface ErrorLogEntry {
  timestamp: Date;
  message: string;
  stack?: string;
  context?: any;
  level: 'error' | 'warning' | 'info';
}

class NotificationService {
  private errorLog: ErrorLogEntry[] = [];
  private maxLogEntries = 100;

  // Basic notification methods
  success(message: string, options?: NotificationOptions) {
    return toast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      style: {
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--success)',
        borderRadius: '12px',
        padding: 'var(--space-4) var(--space-5)',
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-snug)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon,
      id: options?.id,
    });
  }

  error(message: string, options?: NotificationOptions) {
    this.logError({
      timestamp: new Date(),
      message,
      level: 'error',
      context: options,
    });

    return toast.error(message, {
      duration: options?.duration || 6000,
      position: options?.position || 'top-right',
      style: {
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--error)',
        borderRadius: '12px',
        padding: 'var(--space-4) var(--space-5)',
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-snug)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon,
      id: options?.id,
    });
  }

  warning(message: string, options?: NotificationOptions) {
    this.logError({
      timestamp: new Date(),
      message,
      level: 'warning',
      context: options,
    });

    return toast(message, {
      duration: options?.duration || 5000,
      position: options?.position || 'top-right',
      style: {
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--accent-secondary)',
        borderRadius: '12px',
        padding: 'var(--space-4) var(--space-5)',
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-snug)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon || '!',
      id: options?.id,
    });
  }

  info(message: string, options?: NotificationOptions) {
    return toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      style: {
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        padding: 'var(--space-4) var(--space-5)',
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-snug)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon || 'i',
      id: options?.id,
    });
  }

  loading(message: string, options?: NotificationOptions) {
    return toast.loading(message, {
      position: options?.position || 'top-right',
      style: {
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        padding: 'var(--space-4) var(--space-5)',
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-snug)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        ...options?.style,
      },
      className: options?.className,
      id: options?.id,
    });
  }

  // Promise-based notifications
  async promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: NotificationOptions
  ): Promise<T> {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        position: options?.position || 'top-right',
        style: options?.style,
        className: options?.className,
      }
    );
  }

  // Dismiss notifications
  dismiss(toastId?: string) {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }

  // Error logging
  private logError(entry: ErrorLogEntry) {
    this.errorLog.unshift(entry);
    
    // Keep only the most recent entries
    if (this.errorLog.length > this.maxLogEntries) {
      this.errorLog = this.errorLog.slice(0, this.maxLogEntries);
    }

    // In production, you might want to send this to a logging service
    if (import.meta.env.PROD) {
      this.sendToLoggingService(entry);
    } else {
      console.error('[NotificationService]', entry);
    }
  }

  private async sendToLoggingService(entry: ErrorLogEntry) {
    // Implement your logging service integration here
    // For example: Sentry, LogRocket, or custom API
    try {
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // });
    } catch (error) {
      console.error('Failed to send log to service:', error);
    }
  }

  // Get error logs (useful for debugging)
  getErrorLogs(): ErrorLogEntry[] {
    return [...this.errorLog];
  }

  // Clear error logs
  clearErrorLogs() {
    this.errorLog = [];
  }

  // API error handler
  handleApiError(error: any, context?: string): void {
    let message = 'An unexpected error occurred';
    
    if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    if (context) {
      message = `${context}: ${message}`;
    }

    this.error(message, {
      duration: 6000,
    });
  }

  // File upload error handler
  handleFileUploadError(errors: string[]): void {
    if (errors.length === 1) {
      this.error(errors[0]);
    } else {
      this.error(`Multiple validation errors occurred (${errors.length} errors)`);
      // Log all errors for debugging
      errors.forEach(error => {
        this.logError({
          timestamp: new Date(),
          message: error,
          level: 'error',
          context: 'file-upload',
        });
      });
    }
  }

  // Validation error handler
  handleValidationErrors(errors: Record<string, string>): void {
    const errorMessages = Object.values(errors);
    if (errorMessages.length === 1) {
      this.error(errorMessages[0]);
    } else {
      this.error(`Please fix ${errorMessages.length} validation errors`);
      errorMessages.forEach(error => {
        this.logError({
          timestamp: new Date(),
          message: error,
          level: 'warning',
          context: 'validation',
        });
      });
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export convenience methods for direct use
export const {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  promise: showPromise,
  dismiss: dismissNotification,
} = notificationService; 