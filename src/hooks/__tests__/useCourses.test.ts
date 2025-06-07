import { renderHook, act } from '@testing-library/react';
import { useCourses } from '../useCourses';
import * as api from '../../services/api';

// Mock the API module
jest.mock('../../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock notification service
jest.mock('../../services/notificationService', () => ({
  notificationService: {
    success: jest.fn(),
    handleApiError: jest.fn(),
  },
}));

describe('useCourses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi.getCourses.mockResolvedValue([]);
  });

  it('should toggle course completion status', async () => {
    const mockCourse = {
      id: '1',
      name: 'Test Course',
      credits: 3,
      semester: 1,
      timeSlot: 'day' as const,
      group: 'A',
      schedule: [],
      isInCalendar: false,
      isCompleted: false,
    };

    const updatedCourse = { ...mockCourse, isCompleted: true };

    mockedApi.getCourses.mockResolvedValue([mockCourse]);
    mockedApi.toggleCompleted.mockResolvedValue(updatedCourse);

    const { result } = renderHook(() => useCourses());

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.courses).toHaveLength(1);
    expect(result.current.courses[0].isCompleted).toBe(false);

    // Toggle completion status
    await act(async () => {
      await result.current.toggleCompleted('1');
    });

    expect(mockedApi.toggleCompleted).toHaveBeenCalledWith('1', mockCourse, true);
    expect(result.current.courses[0].isCompleted).toBe(true);
  });

  it('should handle toggle completion error', async () => {
    const mockCourse = {
      id: '1',
      name: 'Test Course',
      credits: 3,
      semester: 1,
      timeSlot: 'day' as const,
      group: 'A',
      schedule: [],
      isInCalendar: false,
      isCompleted: false,
    };

    mockedApi.getCourses.mockResolvedValue([mockCourse]);
    mockedApi.toggleCompleted.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useCourses());

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Try to toggle completion status
    await act(async () => {
      try {
        await result.current.toggleCompleted('1');
      } catch (error) {
        // Expected to throw
      }
    });

    expect(mockedApi.toggleCompleted).toHaveBeenCalledWith('1', mockCourse, true);
  });

  it('should toggle completion for all courses with the same name', async () => {
    const mockCourses = [
      {
        id: '1',
        name: 'Mathematics 101',
        credits: 3,
        semester: 1,
        timeSlot: 'day' as const,
        group: 'A',
        schedule: [],
        isInCalendar: false,
        isCompleted: false,
      },
      {
        id: '2',
        name: 'Mathematics 101',
        credits: 3,
        semester: 1,
        timeSlot: 'day' as const,
        group: 'B',
        schedule: [],
        isInCalendar: false,
        isCompleted: false,
      },
      {
        id: '3',
        name: 'Physics 101',
        credits: 3,
        semester: 1,
        timeSlot: 'day' as const,
        group: 'A',
        schedule: [],
        isInCalendar: false,
        isCompleted: false,
      },
    ];

    const updatedCourses = mockCourses.map(course => 
      course.name === 'Mathematics 101' ? { ...course, isCompleted: true } : course
    );

    mockedApi.getCourses.mockResolvedValue(mockCourses);
    mockedApi.toggleCompleted.mockImplementation((id, course, newStatus) => 
      Promise.resolve({ ...course, isCompleted: newStatus !== undefined ? newStatus : !course.isCompleted })
    );

    const { result } = renderHook(() => useCourses());

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.courses).toHaveLength(3);

    // Toggle completion for Mathematics 101 group A
    await act(async () => {
      await result.current.toggleCompleted('1');
    });

    // Should have called toggleCompleted for both Mathematics 101 courses
    expect(mockedApi.toggleCompleted).toHaveBeenCalledTimes(2);
    expect(mockedApi.toggleCompleted).toHaveBeenCalledWith('1', mockCourses[0], true);
    expect(mockedApi.toggleCompleted).toHaveBeenCalledWith('2', mockCourses[1], true);

    // Both Mathematics 101 courses should be completed, Physics should remain unchanged
    const mathCourses = result.current.courses.filter(c => c.name === 'Mathematics 101');
    const physicsCourse = result.current.courses.find(c => c.name === 'Physics 101');
    
    mathCourses.forEach(course => {
      expect(course.isCompleted).toBe(true);
    });
    expect(physicsCourse?.isCompleted).toBe(false);
  });
}); 