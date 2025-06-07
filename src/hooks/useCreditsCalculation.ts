import { useMemo } from 'react';
import { Course } from '@/types';

/**
 * Custom hook to calculate total credits from courses that are in the calendar
 * Uses memoization to optimize performance and only recalculates when courses change
 * @param courses - Array of courses to calculate credits from
 * @returns Total number of credits from courses that are in the calendar
 */
export function useCreditsCalculation(courses: Course[]): number {
  return useMemo(() => {
    const coursesInCalendar = courses.filter(course => course.isInCalendar);
    return coursesInCalendar.reduce((sum, course) => sum + Number(course.credits), 0);
  }, [courses]);
} 