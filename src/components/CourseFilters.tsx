import React from 'react';
import { Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Course } from '../types';

interface CourseFiltersProps {
  onFilterChange: (filters: CourseFilters) => void;
  courses: Course[];
}

export interface CourseFilters {
  semester: string;
  timeSlot: string;
  name: string;
  credits: string;
}

export function CourseFilters({ onFilterChange, courses }: CourseFiltersProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = React.useState<CourseFilters>({
    semester: '',
    timeSlot: '',
    name: '',
    credits: '',
  });

  // Get unique semesters and credits for select options
  const semesters = Array.from(new Set(courses.map(c => c.semester))).sort((a, b) => Number(a) - Number(b));
  const credits = Array.from(new Set(courses.map(c => c.credits))).sort((a, b) => Number(a) - Number(b));

  const handleFilterChange = (key: keyof CourseFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <Filter className="h-5 w-5" />
        <h3 className="font-medium">{t('courseFilters.title')}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Semester Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('courseFilters.semester')}
          </label>
          <select
            value={filters.semester}
            onChange={(e) => handleFilterChange('semester', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">{t('courseFilters.allSemesters')}</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {t('courseFilters.semesterNumber', { number: semester })}
              </option>
            ))}
          </select>
        </div>

        {/* Time Slot Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('courseFilters.timeSlot')}
          </label>
          <select
            value={filters.timeSlot}
            onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">{t('courseFilters.allTimeSlots')}</option>
            <option value="day">{t('courseForm.timeSlotDay')}</option>
            <option value="night">{t('courseForm.timeSlotNight')}</option>
          </select>
        </div>

        {/* Course Name Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('courseForm.courseName')}
          </label>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            placeholder={t('courseFilters.searchByName')}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Credits Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('courseFilters.credits')}
          </label>
          <select
            value={filters.credits}
            onChange={(e) => handleFilterChange('credits', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">{t('courseFilters.allCredits')}</option>
            {credits.map((credit) => (
              <option key={credit} value={credit}>
                {t('courseFilters.creditValue', { count: Number(credit) })}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}