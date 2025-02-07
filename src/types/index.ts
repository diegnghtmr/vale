export type TimeSlot = 'day' | 'night';

export interface Course {
  id?: string;
  name: string;
  credits: string | number;
  semester: string | number;
  timeSlot: TimeSlot;
  group: string;
  schedule: Schedule[];
  isInCalendar?: boolean;
}

export interface Schedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  startTime: string;
  endTime: string;
}

export interface CourseEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    credits: string | number;
    description?: string;
  };
}