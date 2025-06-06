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
    <div style={{ padding: 'var(--space-4)' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Filter style={{ height: 'var(--space-5)', width: 'var(--space-5)', color: 'var(--text-secondary)' }} />
          <h3 className="card-title">{t('courseFilters.title')}</h3>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr',
        gap: 'var(--space-4)'
      }} className="filters-grid">
        <style>
          {`
            @media (min-width: var(--breakpoint-sm)) {
              .filters-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
            @media (min-width: var(--breakpoint-lg)) {
              .filters-grid {
                grid-template-columns: repeat(4, 1fr) !important;
              }
            }
          `}
        </style>
        
        {/* Semester Filter */}
        <div className="form-group">
          <label className="form-label">
            {t('courseFilters.semester')}
          </label>
          <select
            value={filters.semester}
            onChange={(e) => handleFilterChange('semester', e.target.value)}
            className="form-input form-select"
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
        <div className="form-group">
          <label className="form-label">
            {t('courseFilters.timeSlot')}
          </label>
          <select
            value={filters.timeSlot}
            onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
            className="form-input form-select"
          >
            <option value="">{t('courseFilters.allTimeSlots')}</option>
            <option value="day">{t('courseForm.timeSlotDay')}</option>
            <option value="night">{t('courseForm.timeSlotNight')}</option>
          </select>
        </div>

        {/* Course Name Filter */}
        <div className="form-group">
          <label className="form-label">
            {t('courseForm.courseName')}
          </label>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            placeholder={t('courseFilters.searchByName')}
            className="form-input"
          />
        </div>

        {/* Credits Filter */}
        <div className="form-group">
          <label className="form-label">
            {t('courseFilters.credits')}
          </label>
          <select
            value={filters.credits}
            onChange={(e) => handleFilterChange('credits', e.target.value)}
            className="form-input form-select"
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