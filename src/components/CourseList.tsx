import { Pencil, Trash2, CalendarPlus, CalendarX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Course } from '../types';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  onToggleCalendar: (id: string, add: boolean) => void;
}

export function CourseList({ courses, onEdit, onDelete, onToggleCalendar }: CourseListProps) {
  const { t } = useTranslation();

  if (courses.length === 0) {
    return (
      <div className="mt-4 p-6 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">{t('courseList.noCourses')}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md divide-y divide-gray-200 dark:divide-gray-700">
      {courses.map((course) => (
        <div key={course.id} className="flex items-start justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {course.name} - {t('courseForm.group')} {course.group}
            </h3>
            <div className="mt-1 flex flex-wrap gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">{course.credits} {t('courseForm.credits').toLowerCase()}</p>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('courseForm.semester')} {course.semester}</p>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {course.timeSlot === 'day' ? t('courseForm.timeSlotDay') : t('courseForm.timeSlotNight')}
              </p>
            </div>
            <div className="mt-1 space-y-1">
              {course.schedule.map((slot, index) => (
                <p key={index} className="text-sm text-gray-500 dark:text-gray-400">
                  {t(`courseForm.days.${slot.day}`)}: {slot.startTime} - {slot.endTime}
                </p>
              ))}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(course)}
              className="inline-flex items-center p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
              aria-label={t('courseList.actions.edit')}
              title={t('courseList.actions.edit')}
            >
              <Pencil className="h-4 w-4" />
            </button>
            {course.isInCalendar ? (
              <button
                onClick={() => onToggleCalendar(course.id!, false)}
                className="inline-flex items-center p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md transition-colors"
                aria-label={t('courseList.actions.removeFromCalendar')}
                title={t('courseList.actions.removeFromCalendar')}
              >
                <CalendarX className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => onToggleCalendar(course.id!, true)}
                className="inline-flex items-center p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                aria-label={t('courseList.actions.addToCalendar')}
                title={t('courseList.actions.addToCalendar')}
              >
                <CalendarPlus className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(course.id!)}
              className="inline-flex items-center p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              aria-label={t('courseList.actions.delete')}
              title={t('courseList.actions.delete')}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}