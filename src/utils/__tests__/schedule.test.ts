import { checkConflict, checkSelfConflict } from '../schedule';
import { Course, Schedule } from '../../types';

describe('Schedule Utils', () => {
  // Helper function to create test courses
  const createTestCourse = (overrides: Partial<Course> = {}): Course => ({
    id: '1',
    name: 'Test Course',
    credits: 3,
    semester: 1,
    group: 'A',
    timeSlot: 'day',
    schedule: [
      {
        day: 'monday',
        startTime: '09:00',
        endTime: '10:30',
      },
    ],
    isInCalendar: false,
    ...overrides,
  });

  describe('checkConflict', () => {
    it('should return null when no conflicts exist', () => {
      const existingCourses: Course[] = [
        createTestCourse({
          id: '1',
          schedule: [{ day: 'monday', startTime: '08:00', endTime: '09:00' }],
        }),
      ];

      const newCourse = createTestCourse({
        id: '2',
        schedule: [{ day: 'monday', startTime: '10:00', endTime: '11:00' }],
      });

      const result = checkConflict(existingCourses, newCourse);
      expect(result).toBeNull();
    });

    it('should detect time overlap on the same day', () => {
      const existingCourses: Course[] = [
        createTestCourse({
          id: '1',
          name: 'Existing Course',
          schedule: [{ day: 'monday', startTime: '09:00', endTime: '10:30' }],
        }),
      ];

      const newCourse = createTestCourse({
        id: '2',
        name: 'New Course',
        schedule: [{ day: 'monday', startTime: '10:00', endTime: '11:30' }],
      });

      const result = checkConflict(existingCourses, newCourse);
      expect(result).not.toBeNull();
      expect(result?.conflictingCourse.name).toBe('Existing Course');
      expect(result?.newSlot.day).toBe('monday');
    });

    it('should not detect conflicts on different days', () => {
      const existingCourses: Course[] = [
        createTestCourse({
          id: '1',
          schedule: [{ day: 'monday', startTime: '09:00', endTime: '10:30' }],
        }),
      ];

      const newCourse = createTestCourse({
        id: '2',
        schedule: [{ day: 'tuesday', startTime: '09:00', endTime: '10:30' }],
      });

      const result = checkConflict(existingCourses, newCourse);
      expect(result).toBeNull();
    });

    it('should detect exact time matches', () => {
      const existingCourses: Course[] = [
        createTestCourse({
          id: '1',
          schedule: [{ day: 'wednesday', startTime: '14:00', endTime: '15:30' }],
        }),
      ];

      const newCourse = createTestCourse({
        id: '2',
        schedule: [{ day: 'wednesday', startTime: '14:00', endTime: '15:30' }],
      });

      const result = checkConflict(existingCourses, newCourse);
      expect(result).not.toBeNull();
    });

    it('should handle multiple schedule slots', () => {
      const existingCourses: Course[] = [
        createTestCourse({
          id: '1',
          schedule: [
            { day: 'monday', startTime: '09:00', endTime: '10:30' },
            { day: 'wednesday', startTime: '09:00', endTime: '10:30' },
          ],
        }),
      ];

      const newCourse = createTestCourse({
        id: '2',
        schedule: [
          { day: 'tuesday', startTime: '09:00', endTime: '10:30' },
          { day: 'wednesday', startTime: '09:30', endTime: '11:00' },
        ],
      });

      const result = checkConflict(existingCourses, newCourse);
      expect(result).not.toBeNull();
      expect(result?.newSlot.day).toBe('wednesday');
    });
  });

  describe('checkSelfConflict', () => {
    it('should return false when no self-conflicts exist', () => {
      const schedule: Schedule[] = [
        { day: 'monday', startTime: '08:00', endTime: '09:00' },
        { day: 'tuesday', startTime: '10:00', endTime: '11:00' },
      ];

      const result = checkSelfConflict(schedule);
      expect(result).toBe(false);
    });

    it('should detect self-conflicts within the same course', () => {
      const schedule: Schedule[] = [
        { day: 'monday', startTime: '09:00', endTime: '10:30' },
        { day: 'monday', startTime: '10:00', endTime: '11:30' },
      ];

      const result = checkSelfConflict(schedule);
      expect(result).toBe(true);
    });

    it('should not detect conflicts on different days', () => {
      const schedule: Schedule[] = [
        { day: 'monday', startTime: '09:00', endTime: '10:30' },
        { day: 'tuesday', startTime: '09:00', endTime: '10:30' },
        { day: 'wednesday', startTime: '09:00', endTime: '10:30' },
      ];

      const result = checkSelfConflict(schedule);
      expect(result).toBe(false);
    });

    it('should handle exact same time slots as conflicts', () => {
      const schedule: Schedule[] = [
        { day: 'friday', startTime: '16:00', endTime: '17:30' },
        { day: 'friday', startTime: '16:00', endTime: '17:30' },
      ];

      const result = checkSelfConflict(schedule);
      expect(result).toBe(true);
    });
  });
}); 