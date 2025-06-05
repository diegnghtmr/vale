import { Course, Schedule } from '../types';

export function checkConflict(
  coursesToCheck: Course[],
  newCourse: Course,
  ignoreCourseId?: string
): { conflictingCourse: Course; newSlot: Schedule; conflictingSlot: Schedule } | null {
  
  const relevantCourses = coursesToCheck.filter(c => c.id !== ignoreCourseId);

  for (const existingCourse of relevantCourses) {
    for (const newSlot of newCourse.schedule) {
      for (const existingSlot of existingCourse.schedule) {
        if (newSlot.day === existingSlot.day) {
          const newStart = new Date(`1970-01-01T${newSlot.startTime}`);
          const newEnd = new Date(`1970-01-01T${newSlot.endTime}`);
          const existingStart = new Date(`1970-01-01T${existingSlot.startTime}`);
          const existingEnd = new Date(`1970-01-01T${existingSlot.endTime}`);

          // Check for any overlap
          if (newStart < existingEnd && newEnd > existingStart) {
            return {
              conflictingCourse: existingCourse,
              newSlot,
              conflictingSlot: existingSlot,
            };
          }
        }
      }
    }
  }

  return null;
} 