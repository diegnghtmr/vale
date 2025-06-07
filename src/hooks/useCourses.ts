import { useState, useEffect, useCallback } from 'react';
import { Course, CourseInput } from '@/types';
import * as api from '@/services/api';
import { notificationService } from '@/services/notificationService';
import { useTranslation } from 'react-i18next';

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  addCourse: (course: CourseInput) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

export function useCourses(): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();



  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCourses = await api.getCourses();
      setCourses(fetchedCourses);
    } catch (err) {
      const errorMessage = 'Failed to fetch courses';
      setError(errorMessage);
      notificationService.handleApiError(err, 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const addCourse = useCallback(async (course: CourseInput) => {
    try {
      const newCourse = await api.addCourse(course);
      setCourses((prev) => [...prev, newCourse]);
      notificationService.success(t('courseForm.addSuccess'));
    } catch (err) {
      notificationService.handleApiError(err, 'Failed to add course');
      throw err;
    }
  }, [t]);

  const updateCourse = useCallback(async (id: string, updates: Partial<Course>) => {
    try {
      const course = courses.find(c => c.id === id);
      if (!course) throw new Error('Course not found');
      
      const updatedCourse = await api.updateCourse(id, { ...course, ...updates });
      setCourses(prev => prev.map(c => c.id === id ? updatedCourse : c));
      notificationService.success(t('courseForm.updateSuccess'));
    } catch (err) {
      notificationService.handleApiError(err, 'Failed to update course');
      throw err;
    }
  }, [t, courses]);

  const deleteCourse = useCallback(async (id: string) => {
    try {
      await api.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      notificationService.success('Course deleted successfully');
    } catch (err) {
      notificationService.handleApiError(err, 'Failed to delete course');
      throw err;
    }
  }, []);

  return {
    courses,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    setCourses,
  };
} 