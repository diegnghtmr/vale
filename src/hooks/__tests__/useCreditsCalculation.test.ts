import { renderHook } from '@testing-library/react';
import { useCreditsCalculation } from '../useCreditsCalculation';
import { Course } from '../../types';

describe('useCreditsCalculation', () => {
  const mockCourses: Course[] = [
    {
      id: '1',
      name: 'Course 1',
      credits: 3,
      semester: 1,
      group: 'A',
      timeSlot: 'day',
      schedule: [{ day: 'monday', startTime: '09:00', endTime: '10:30' }],
      isInCalendar: true,
    },
    {
      id: '2',
      name: 'Course 2',
      credits: 4,
      semester: 1,
      group: 'B',
      timeSlot: 'day',
      schedule: [{ day: 'tuesday', startTime: '10:00', endTime: '11:30' }],
      isInCalendar: true,
    },
    {
      id: '3',
      name: 'Course 3',
      credits: 2,
      semester: 2,
      group: 'A',
      timeSlot: 'night',
      schedule: [{ day: 'wednesday', startTime: '18:00', endTime: '19:30' }],
      isInCalendar: false,
    },
  ];

  it('should calculate total credits correctly', () => {
    const { result } = renderHook(() => useCreditsCalculation(mockCourses));
    expect(result.current).toBe(7); // 3 + 4 (only courses in calendar)
  });

  it('should return 0 for empty course list', () => {
    const { result } = renderHook(() => useCreditsCalculation([]));
    expect(result.current).toBe(0);
  });

  it('should handle courses with 0 credits', () => {
    const coursesWithZeroCredits: Course[] = [
      { ...mockCourses[0], credits: 0 },
      { ...mockCourses[1], credits: 5 },
    ];
    
    const { result } = renderHook(() => useCreditsCalculation(coursesWithZeroCredits));
    expect(result.current).toBe(5);
  });

  it('should recalculate when courses change', () => {
    const { result, rerender } = renderHook(
      ({ courses }) => useCreditsCalculation(courses),
      { initialProps: { courses: mockCourses.slice(0, 2) } }
    );

    expect(result.current).toBe(7); // 3 + 4

    rerender({ courses: mockCourses });
    expect(result.current).toBe(7); // 3 + 4 (only courses in calendar)
  });

  it('should memoize the result when courses do not change', () => {
    const { result, rerender } = renderHook(() => useCreditsCalculation(mockCourses));
    
    const firstResult = result.current;
    rerender();
    const secondResult = result.current;
    
    expect(firstResult).toBe(secondResult);
    expect(firstResult).toBe(7);
  });
}); 