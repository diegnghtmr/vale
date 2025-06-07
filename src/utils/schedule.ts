import { Course, Schedule } from '../types';

/**
 * Checks if a new course conflicts with existing courses in the calendar
 * @param coursesToCheck - Array of existing courses to check against
 * @param newCourse - The new course to validate
 * @param ignoreCourseId - Optional course ID to ignore during conflict checking (useful for editing)
 * @returns Conflict details if found, null otherwise
 */
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

/**
 * Checks if a course has internal schedule conflicts (overlapping time slots on the same day)
 * @param schedule - Array of schedule slots for a single course
 * @returns true if conflicts are found, false otherwise
 */
export function checkSelfConflict(schedule: Schedule[]): boolean {
  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      const slotA = schedule[i];
      const slotB = schedule[j];

      if (slotA.day === slotB.day) {
        const startA = new Date(`1970-01-01T${slotA.startTime}`);
        const endA = new Date(`1970-01-01T${slotA.endTime}`);
        const startB = new Date(`1970-01-01T${slotB.startTime}`);
        const endB = new Date(`1970-01-01T${slotB.endTime}`);

        if (startA < endB && endA > startB) {
          return true; // Conflicto encontrado
        }
      }
    }
  }
  return false; // No hay conflictos internos
} 