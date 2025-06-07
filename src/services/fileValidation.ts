import { Course } from '@/types';

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  data?: Course[];
}

export interface FileValidationOptions {
  maxFileSize: number; // in bytes
  allowedExtensions: string[];
  maxCourses: number;
}

const DEFAULT_OPTIONS: FileValidationOptions = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedExtensions: ['.json', '.csv'],
  maxCourses: 1000,
};

export class FileValidationService {
  private options: FileValidationOptions;

  constructor(options: Partial<FileValidationOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  validateFile(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check file size
    if (file.size > this.options.maxFileSize) {
      errors.push(`File size exceeds maximum allowed size of ${this.options.maxFileSize / (1024 * 1024)}MB`);
    }

    // Check file extension
    const extension = this.getFileExtension(file.name);
    if (!this.options.allowedExtensions.includes(extension)) {
      errors.push(`File type not allowed. Allowed types: ${this.options.allowedExtensions.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async validateAndParseFile(file: File): Promise<FileValidationResult> {
    const fileValidation = this.validateFile(file);
    if (!fileValidation.isValid) {
      return {
        isValid: false,
        errors: fileValidation.errors,
      };
    }

    try {
      const extension = this.getFileExtension(file.name);
      let rawData: any[];

      if (extension === '.json') {
        rawData = await this.parseJsonFile(file);
      } else if (extension === '.csv') {
        rawData = await this.parseCsvFile(file);
      } else {
        return {
          isValid: false,
          errors: ['Unsupported file format'],
        };
      }

      const validationResult = this.validateCourseData(rawData);
      return validationResult;
    } catch (error) {
      return {
        isValid: false,
        errors: [`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`],
      };
    }
  }

  private async parseJsonFile(file: File): Promise<any[]> {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of courses');
    }
    
    return data;
  }

  private async parseCsvFile(file: File): Promise<any[]> {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      if (values.length !== headers.length) {
        throw new Error(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}`);
      }

      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }

    return data;
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  private validateCourseData(rawData: any[]): FileValidationResult {
    const errors: string[] = [];
    const validCourses: Course[] = [];

    if (rawData.length > this.options.maxCourses) {
      errors.push(`Too many courses. Maximum allowed: ${this.options.maxCourses}`);
      return { isValid: false, errors };
    }

    rawData.forEach((item, index) => {
      const courseValidation = this.validateSingleCourse(item, index + 1);
      if (courseValidation.isValid && courseValidation.course) {
        validCourses.push(courseValidation.course);
      } else {
        errors.push(...courseValidation.errors);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      data: validCourses,
    };
  }

  private validateSingleCourse(item: any, rowNumber: number): { isValid: boolean; errors: string[]; course?: Course } {
    const errors: string[] = [];

    // Required fields validation
    if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
      errors.push(`Row ${rowNumber}: Course name is required and must be a non-empty string`);
    }

    if (item.credits === null || item.credits === undefined || item.credits === '') {
      errors.push(`Row ${rowNumber}: Credits field is required`);
    }

    const credits = Number(item.credits);
    if (isNaN(credits) || credits < 0 || credits > 20) {
      errors.push(`Row ${rowNumber}: Credits must be a number between 0 and 20`);
    }

    const semester = Number(item.semester);
    if (isNaN(semester) || semester < 1 || semester > 12) {
      errors.push(`Row ${rowNumber}: Semester must be a number between 1 and 12`);
    }

    if (!item.timeSlot || !['day', 'night'].includes(item.timeSlot)) {
      errors.push(`Row ${rowNumber}: Time slot must be either 'day' or 'night'`);
    }

    if (!item.group || typeof item.group !== 'string' || item.group.trim() === '') {
      errors.push(`Row ${rowNumber}: Group is required and must be a non-empty string`);
    }

    // Schedule validation
    if (!item.schedule || !Array.isArray(item.schedule) || item.schedule.length === 0) {
      errors.push(`Row ${rowNumber}: Schedule is required and must be a non-empty array`);
    } else {
      item.schedule.forEach((scheduleItem: any, scheduleIndex: number) => {
        if (!scheduleItem.day || !['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].includes(scheduleItem.day)) {
          errors.push(`Row ${rowNumber}, Schedule ${scheduleIndex + 1}: Day must be a valid weekday`);
        }

        if (!this.isValidTimeFormat(scheduleItem.startTime)) {
          errors.push(`Row ${rowNumber}, Schedule ${scheduleIndex + 1}: Start time must be in HH:MM format`);
        }

        if (!this.isValidTimeFormat(scheduleItem.endTime)) {
          errors.push(`Row ${rowNumber}, Schedule ${scheduleIndex + 1}: End time must be in HH:MM format`);
        }

        if (scheduleItem.startTime && scheduleItem.endTime && scheduleItem.startTime >= scheduleItem.endTime) {
          errors.push(`Row ${rowNumber}, Schedule ${scheduleIndex + 1}: Start time must be before end time`);
        }
      });
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    const course: Course = {
      id: crypto.randomUUID(),
      name: item.name.trim(),
      credits,
      semester,
      timeSlot: item.timeSlot,
      group: item.group.trim(),
      classroom: item.classroom?.trim() || undefined,
      details: item.details?.trim() || undefined,
      schedule: item.schedule,
      isInCalendar: false,
    };

    return { isValid: true, errors: [], course };
  }

  private isValidTimeFormat(time: string): boolean {
    if (!time || typeof time !== 'string') return false;
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  private getFileExtension(filename: string): string {
    return filename.toLowerCase().substring(filename.lastIndexOf('.'));
  }
}

// Export a default instance
export const fileValidationService = new FileValidationService(); 