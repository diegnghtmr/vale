import React, { useState, useEffect } from 'react';
import { Clock, GraduationCap, Save, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Course, Schedule } from '../types';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { checkConflict } from '../utils/schedule';

interface CourseFormProps {
  onSubmit: (course: Course) => void;
  initialData?: Course | null;
  allCourses: Course[];
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

const initialCourse: Course = {
  name: '',
  credits: '',
  semester: '',
  timeSlot: 'day',
  group: '',
  schedule: [],
};

export function CourseForm({ onSubmit, initialData, allCourses }: CourseFormProps) {
  const { t } = useTranslation();
  const [course, setCourse] = useState<Course>(initialData || initialCourse);
  const [conflictError, setConflictError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setCourse(initialData);
    } else {
      setCourse(initialCourse);
    }
  }, [initialData]);

  useEffect(() => {
    if (course.schedule.length > 0) {
      const coursesInCalendar = allCourses.filter(c => c.isInCalendar);
      const conflict = checkConflict(coursesInCalendar, course, initialData?.id);
      
      if (conflict) {
        const { conflictingCourse, newSlot, conflictingSlot } = conflict;
        const message = [
          t('calendar.conflictDetected'),
          `\n• ${t('calendar.conflictsWith')}: "${conflictingCourse.name}"`,
          `(${conflictingSlot.startTime} - ${conflictingSlot.endTime})`,
          `\n• ${t('calendar.day')}: ${t(`courseForm.days.${newSlot.day}`)}`,
          `${newSlot.startTime} - ${newSlot.endTime}`,
        ].join(' ');
        setConflictError(message);
      } else {
        setConflictError(null);
      }
    } else {
      setConflictError(null);
    }
  }, [course.schedule, allCourses, initialData, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (course.schedule.length === 0) {
      toast.error(t('courseForm.errorNoTimeSlot'));
      return;
    }
    if (conflictError) {
      toast.error(t('calendar.selectDifferentTime'));
      return;
    }
    onSubmit({ ...course, credits: Number(course.credits) });
    setCourse(initialCourse);
  };

  const handleScheduleChange = (index: number, field: keyof Schedule, value: string) => {
    const newSchedule = [...course.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setCourse({ ...course, schedule: newSchedule });
  };

  const addSchedule = () => {
    setCourse({
      ...course,
      schedule: [...course.schedule, { day: 'monday', startTime: '', endTime: '' }],
    });
  };

  const removeSchedule = (index: number) => {
    const newSchedule = course.schedule.filter((_, i) => i !== index);
    setCourse({ ...course, schedule: newSchedule });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('courseForm.title')}</h2>
        
        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('courseForm.courseName')}</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              required
              value={course.name}
              onChange={(e) => setCourse({ ...course, name: e.target.value })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md transition-colors"
              placeholder={t('courseForm.courseNamePlaceholder')}
            />
          </div>
        </div>

        {/* Credits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('courseForm.credits')}</label>
          <input
            type="number"
            required
            min="1"
            value={course.credits}
            onChange={(e) => setCourse({ ...course, credits: e.target.value })}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md transition-colors"
            placeholder={t('courseForm.creditsPlaceholder')}
          />
        </div>

        {/* Semester */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('courseForm.semester')}</label>
          <input
            type="number"
            required
            min="1"
            max="10"
            value={course.semester}
            onChange={(e) => setCourse({ ...course, semester: e.target.value })}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md transition-colors"
            placeholder={t('courseForm.semesterPlaceholder')}
          />
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('courseForm.timeSlot')}</label>
          <select
            value={course.timeSlot}
            onChange={(e) => setCourse({ ...course, timeSlot: e.target.value as 'day' | 'night' })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition-colors"
          >
            <option value="day">{t('courseForm.timeSlotDay')}</option>
            <option value="night">{t('courseForm.timeSlotNight')}</option>
          </select>
        </div>

        {/* Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('courseForm.group')}</label>
          <input
            type="text"
            required
            value={course.group}
            onChange={(e) => setCourse({ ...course, group: e.target.value })}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md transition-colors"
            placeholder={t('courseForm.groupPlaceholder')}
          />
        </div>
      </div>

      {/* Schedule Section */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('courseForm.schedule')}</h2>
          <button
            type="button"
            onClick={addSchedule}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('courseForm.addTimeSlot')}
          </button>
        </div>

        <div className="space-y-4">
          {conflictError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-line">
                    {conflictError}
                  </p>
                </div>
              </div>
            </div>
          )}
          {course.schedule.map((schedule, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('courseForm.day')}</label>
                  <select
                    value={schedule.day}
                    onChange={(e) => handleScheduleChange(index, 'day', e.target.value as Schedule['day'])}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition-colors"
                  >
                    {DAYS.map((day) => (
                      <option key={day} value={day}>
                        {t(`courseForm.days.${day}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('courseForm.startTime')}</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="time"
                      required
                      value={schedule.startTime}
                      onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md transition-colors"
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('courseForm.endTime')}</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="time"
                      required
                      value={schedule.endTime}
                      onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md transition-colors"
                    />
                  </div>
                </div>

                <div className="md:col-span-1 flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('courseForm.remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {course.schedule.length === 0 && (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400">{t('courseForm.noTimeSlots')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all transform hover:scale-105"
        >
          <Save className="h-5 w-5 mr-2" />
          {t('courseForm.submit')}
        </button>
      </div>
    </form>
  );
}