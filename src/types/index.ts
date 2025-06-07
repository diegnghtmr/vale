export type TimeSlot = 'day' | 'night';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'es';

export interface Course {
  id: string;
  name: string;
  credits: number;
  semester: number;
  timeSlot: TimeSlot;
  group: string;
  classroom?: string;
  details?: string;
  schedule: Schedule[];
  isInCalendar: boolean;
  isCompleted: boolean;
}

export interface CourseInput extends Omit<Course, 'id' | 'isInCalendar' | 'credits' | 'semester'> {
  credits: string | number;
  semester: string | number;
}

export interface Schedule {
  day: DayOfWeek;
  startTime: string; // Format: HH:MM
  endTime: string;   // Format: HH:MM
}

export interface CourseEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO datetime string
  end: string;   // ISO datetime string
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    credits: number;
    semester: number;
    group: string;
    classroom?: string;
    details?: string;
    description?: string;
    dayKey: string;
  };
}

export interface UserPreferences {
  theme?: Theme;
  language?: Language;
}

// Event handler interfaces
export interface ClickInfo {
  event: CourseEvent;
  el: HTMLElement;
  jsEvent: MouseEvent;
  view: any; // FullCalendar view type
}

// Filter interfaces
export interface CourseFilters {
  semester: string;
  timeSlot: string;
  name: string;
  credits: string;
}

// API response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}