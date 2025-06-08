import { Course, CourseInput, UserPreferences, ApiError } from '../types';
import { createSubjectId } from '../utils/subjectId';

// Abstract API client interface for dependency inversion
export interface ApiClient {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data: any): Promise<T>;
  put<T>(endpoint: string, data: any): Promise<T>;
  delete(endpoint: string): Promise<void>;
}

// Mock API client implementation with localStorage persistence
class MockApiClient implements ApiClient {
  private getStorageKey(endpoint: string): string {
    return `mockapi_${endpoint.replace(/\//g, '_')}`;
  }

  private getStoredData<T>(endpoint: string): T | null {
    try {
      const key = this.getStorageKey(endpoint);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private setStoredData<T>(endpoint: string, data: T): void {
    try {
      const key = this.getStorageKey(endpoint);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to store data in localStorage:', error);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    console.log(`Mock API: GET ${endpoint}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (endpoint === '/courses') {
      const storedCourses = this.getStoredData<Course[]>(endpoint);
      return (storedCourses || []) as unknown as T;
    }
    
    return this.getStoredData<T>(endpoint) || ([] as unknown as T);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    console.log(`Mock API: POST ${endpoint}`, data);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (endpoint === '/courses') {
      const existingCourses = this.getStoredData<Course[]>(endpoint) || [];
      const newCourses = [...existingCourses, data];
      this.setStoredData(endpoint, newCourses);
    } else {
      this.setStoredData(endpoint, data);
    }
    
    return data as T;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    console.log(`Mock API: PUT ${endpoint}`, data);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (endpoint.startsWith('/courses/')) {
      const courseId = endpoint.split('/').pop();
      const existingCourses = this.getStoredData<Course[]>('/courses') || [];
      const updatedCourses = existingCourses.map(course => 
        course.id === courseId ? data : course
      );
      this.setStoredData('/courses', updatedCourses);
    } else {
      this.setStoredData(endpoint, data);
    }
    
    return data as T;
  }

  async delete(endpoint: string): Promise<void> {
    console.log(`Mock API: DELETE ${endpoint}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (endpoint.startsWith('/courses/')) {
      const courseId = endpoint.split('/').pop();
      const existingCourses = this.getStoredData<Course[]>('/courses') || [];
      const filteredCourses = existingCourses.filter(course => course.id !== courseId);
      this.setStoredData('/courses', filteredCourses);
    }
  }
}

const apiClient = new MockApiClient();

// Helper function to handle API errors
const handleApiError = (error: any): never => {
  const apiError: ApiError = {
    message: error.message || 'An unexpected error occurred',
    code: error.code,
    details: error,
  };
  throw apiError;
};

// --- Course API ---

export const getCourses = async (): Promise<Course[]> => {
  try {
    return await apiClient.get<Course[]>('/courses');
  } catch (error) {
    return handleApiError(error);
  }
};

export const addCourse = async (courseInput: CourseInput): Promise<Course> => {
  try {
    const course: Course = {
      ...courseInput,
      id: crypto.randomUUID(),
      subjectId: createSubjectId(courseInput.name),
      credits: Number(courseInput.credits),
      semester: Number(courseInput.semester),
      isInCalendar: false,
      isCompleted: false,
    };
    return await apiClient.post<Course>('/courses', course);
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateCourse = async (id: string, course: Course): Promise<Course> => {
  try {
    return await apiClient.put<Course>(`/courses/${id}`, course);
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  try {
    return await apiClient.delete(`/courses/${id}`);
  } catch (error) {
    return handleApiError(error);
  }
};

export const toggleCompleted = async (id: string, course: Course, newStatus?: boolean): Promise<Course> => {
  try {
    const isCompleted = newStatus !== undefined ? newStatus : !course.isCompleted;
    const updatedCourse = { 
      ...course, 
      isCompleted,
      // Si el curso se marca como completado, automáticamente lo removemos del calendario
      isInCalendar: isCompleted ? false : course.isInCalendar
    };
    return await apiClient.put<Course>(`/courses/${id}`, updatedCourse);
  } catch (error) {
    return handleApiError(error);
  }
};

// Sync courses from file upload to localStorage
export const syncCoursesToStorage = async (courses: Course[]): Promise<void> => {
  try {
    // Store all courses in the mock API's localStorage
    localStorage.setItem('mockapi__courses', JSON.stringify(courses));
    console.log('Synced courses to storage:', courses.length);
  } catch (error) {
    console.warn('Failed to sync courses to storage:', error);
  }
};

// --- Preferences API ---

export const getUserPreferences = async (): Promise<UserPreferences> => {
  try {
    return await apiClient.get<UserPreferences>('/preferences');
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateUserPreferences = async (prefs: UserPreferences): Promise<void> => {
  try {
    return await apiClient.post<void>('/preferences', prefs);
  } catch (error) {
    return handleApiError(error);
  }
}; 