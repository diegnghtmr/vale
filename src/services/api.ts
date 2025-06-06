import { Course, UserPreferences } from '../types';

// Mock API client - in a real app, this would be axios or fetch
// const apiClient = 'http://localhost:3001/api';

// --- Course API ---

export const getCourses = async (): Promise<Course[]> => {
  // In a real app, you would fetch this from the server.
  // For now, we'll return an empty array or mock data.
  // const response = await apiClient.get('/courses');
  // return response.data;
  console.log('API: Fetching courses (mocked)');
  return []; 
};

export const addCourse = async (course: Omit<Course, 'id' | 'isInCalendar'>): Promise<Course> => {
  // const response = await apiClient.post('/courses', course);
  // return response.data;
  console.log('API: Adding course (mocked)', course);
  const newCourse = { ...course, id: new Date().toISOString(), isInCalendar: false };
  return newCourse;
};

export const updateCourse = async (id: string, course: Course): Promise<Course> => {
  // const response = await apiClient.put(`/courses/${id}`, course);
  // return response.data;
  console.log('API: Updating course (mocked)', id, course);
  return course;
};

export const deleteCourse = async (id: string): Promise<void> => {
  // await apiClient.delete(`/courses/${id}`);
  console.log('API: Deleting course (mocked)', id);
};

// --- Preferences API ---

export const getUserPreferences = async (): Promise<UserPreferences> => {
  // const response = await apiClient.get('/preferences');
  // return response.data;
  console.log('API: Fetching preferences (mocked)');
  return {};
};

export const updateUserPreferences = async (prefs: UserPreferences): Promise<void> => {
  // await apiClient.post('/preferences', prefs);
  console.log('API: Updating preferences (mocked)', prefs);
}; 