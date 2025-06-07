import { useState, useEffect, useCallback } from 'react';
import { Course, CourseInput } from '../types';
import * as api from '../services/api';
import { notificationService } from '../services/notificationService';
import { useTranslation } from 'react-i18next';
import { createSubjectId } from '../utils/subjectId';
import { useSubjectCompletion } from '../context/SubjectCompletionContext';

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  addCourse: (course: CourseInput) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  toggleCompleted: (id: string) => Promise<void>;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

export function useCourses(): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const { setSubjectCompleted, isSubjectCompleted } = useSubjectCompletion();

  // Helper function to get localized messages with fallbacks
  const getLocalizedMessage = useCallback((key: string, params: any = {}): string => {
    const translated = String(t(key, params));
    if (translated === key) {
      // Translation failed, use language-appropriate fallback
      const isSpanish = i18n.language === 'es';
      
      switch (key) {
        case 'courseList.completed':
          return isSpanish 
            ? `"${params.name}" marcado como completado!`
            : `"${params.name}" marked as completed!`;
        case 'courseList.uncompleted':
          return isSpanish 
            ? `"${params.name}" marcado como incompleto!`
            : `"${params.name}" marked as incomplete!`;
        case 'courseList.completedMultiple':
          return isSpanish 
            ? `${params.count} cursos de "${params.name}" marcados como completados!`
            : `${params.count} courses of "${params.name}" marked as completed!`;
        case 'courseList.uncompletedMultiple':
          return isSpanish 
            ? `${params.count} cursos de "${params.name}" marcados como incompletos!`
            : `${params.count} courses of "${params.name}" marked as incomplete!`;
        default:
          return translated;
      }
    }
    return translated;
  }, [t, i18n]);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCourses = await api.getCourses();
      
      // Sync courses with subject completion state
      const syncedCourses = fetchedCourses.map(course => {
        // Generate subjectId if missing (for backward compatibility)
        const subjectId = course.subjectId || createSubjectId(course.name);
        const isCompleted = isSubjectCompleted(subjectId);
        
        return {
          ...course,
          subjectId,
          isCompleted
        };
      });
      
      setCourses(syncedCourses);
    } catch (err) {
      const errorMessage = 'Failed to fetch courses';
      setError(errorMessage);
      notificationService.handleApiError(err, 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, [isSubjectCompleted]);

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

  const toggleCompleted = useCallback(async (id: string) => {
    try {
      const course = courses.find(c => c.id === id);
      if (!course) throw new Error('Course not found');
      
      // Find all courses with the same subjectId
      const relatedCourses = courses.filter(c => c.subjectId === course.subjectId);
      const newCompletedStatus = !course.isCompleted;
      
      // Update all related courses
      const updatePromises = relatedCourses.map(relatedCourse => 
        api.toggleCompleted(relatedCourse.id, relatedCourse, newCompletedStatus)
      );
      
      const updatedCourses = await Promise.all(updatePromises);
      
      // Update local state for all affected courses
      setCourses(prev => prev.map(c => {
        const updated = updatedCourses.find(uc => uc.id === c.id);
        return updated || c;
      }));
      
      // Update subject completion state
      setSubjectCompleted(course.subjectId, newCompletedStatus);
      
      // Show notification with count of affected courses
      const affectedCount = relatedCourses.length;
      if (affectedCount > 1) {
        const message = newCompletedStatus 
          ? getLocalizedMessage('courseList.completedMultiple', { count: affectedCount, name: course.name })
          : getLocalizedMessage('courseList.uncompletedMultiple', { count: affectedCount, name: course.name });
        notificationService.success(message);
      } else {
        const message = newCompletedStatus 
          ? getLocalizedMessage('courseList.completed', { name: course.name })
          : getLocalizedMessage('courseList.uncompleted', { name: course.name });
        notificationService.success(message);
      }
    } catch (err) {
      notificationService.handleApiError(err, 'Failed to update course completion status');
      throw err;
    }
  }, [t, courses, getLocalizedMessage, setSubjectCompleted]);

  return {
    courses,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    toggleCompleted,
    setCourses,
  };
} 