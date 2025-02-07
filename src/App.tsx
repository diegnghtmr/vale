import React, { useState } from 'react';
import { Calendar as CalendarIcon, Upload as UploadIcon } from 'lucide-react';
import { Course, CourseEvent, Schedule } from './types';
import { CourseForm } from './components/CourseForm';
import { FileUpload } from './components/FileUpload';
import { Calendar } from './components/Calendar';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSelector } from './components/LanguageSelector';
import { useTheme } from './context/ThemeContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { CourseList } from './components/CourseList';
import { CourseFilters, CourseFilters as CourseFiltersType } from './components/CourseFilters';

function AppContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'upload'>('form');
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [filters, setFilters] = useState<CourseFiltersType>({
    semester: '',
    timeSlot: '',
    name: '',
    credits: '',
  });

  const filteredCourses = courses.filter(course => {
    if (filters.semester && course.semester.toString() !== filters.semester) return false;
    if (filters.timeSlot && course.timeSlot !== filters.timeSlot) return false;
    if (filters.name && !course.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.credits && course.credits.toString() !== filters.credits) return false;
    return true;
  });

  const handleCourseSubmit = (course: Course) => {
    if (editingCourse) {
      setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...course, id: editingCourse.id } : c));
      setEditingCourse(null);
      toast.success(t('courseForm.updateSuccess'));
    } else {
      const newCourse = { ...course, id: crypto.randomUUID(), isInCalendar: false };
      setCourses((prev) => [...prev, newCourse]);
      toast.success(t('courseForm.addSuccess'));
    }
  };

  const handleFileUpload = (data: Course[]) => {
    const validCourses = data.filter(course => {
      const isValid = course.name && course.credits && course.schedule?.length > 0;
      if (!isValid) {
        toast.error(`${t('fileUpload.invalidCourse')}: ${course.name || t('fileUpload.unnamedCourse')}`);
      }
      return isValid;
    }).map(course => ({ ...course, id: crypto.randomUUID(), isInCalendar: false }));

    setCourses(validCourses);
  };

  const generateCalendarEvents = (coursesToShow: Course[]): CourseEvent[] => {
    const events: CourseEvent[] = [];
    const colors = theme === 'light' ? [
      { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
      { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
      { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
      { bg: '#ede9fe', border: '#8b5cf6', text: '#5b21b6' },
      { bg: '#ffedd5', border: '#f97316', text: '#9a3412' },
      { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
      { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' },
      { bg: '#ccfbf1', border: '#14b8a6', text: '#115e59' },
    ] : [
      { bg: '#1d4ed8', border: '#60a5fa', text: '#ffffff' },
      { bg: '#15803d', border: '#4ade80', text: '#ffffff' },
      { bg: '#b91c1c', border: '#f87171', text: '#ffffff' },
      { bg: '#6d28d9', border: '#a78bfa', text: '#ffffff' },
      { bg: '#c2410c', border: '#fb923c', text: '#ffffff' },
      { bg: '#b45309', border: '#fbbf24', text: '#ffffff' },
      { bg: '#be185d', border: '#f472b6', text: '#ffffff' },
      { bg: '#0f766e', border: '#2dd4bf', text: '#ffffff' },
    ];

    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    monday.setHours(0, 0, 0, 0);

    coursesToShow.forEach((course, courseIndex) => {
      const colorIndex = courseIndex % colors.length;
      
      course.schedule.forEach((slot) => {
        const dayOffset = {
          monday: 0,
          tuesday: 1,
          wednesday: 2,
          thursday: 3,
          friday: 4,
        }[slot.day];

        const slotDate = new Date(monday);
        slotDate.setDate(monday.getDate() + dayOffset);

        const [startHour, startMinute] = slot.startTime.split(':').map(Number);
        const [endHour, endMinute] = slot.endTime.split(':').map(Number);

        const start = new Date(slotDate);
        start.setHours(startHour, startMinute, 0);

        const end = new Date(slotDate);
        end.setHours(endHour, endMinute, 0);

        events.push({
          id: `${course.id}-${slot.day}`,
          title: `${course.name} - S${course.semester} G${course.group} (${course.credits} cr)`,
          description: `${slot.startTime} - ${slot.endTime}`,
          start: start.toISOString(),
          end: end.toISOString(),
          backgroundColor: colors[colorIndex].bg,
          borderColor: colors[colorIndex].border,
          textColor: colors[colorIndex].text,
          extendedProps: {
            credits: course.credits
          }
        });
      });
    });

    return events;
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setActiveTab('form');
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    toast.success(t('courseList.deleteSuccess'));
  };

  const handleToggleCalendar = (id: string, add: boolean) => {
    if (add) {
      const courseToAdd = courses.find(c => c.id === id);
      if (!courseToAdd) return;

      let conflictDetails: { existingCourse: Course; newSlot: Schedule; existingSlot: Schedule } | null = null;

      for (const existingCourse of courses.filter(c => c.isInCalendar && c.id !== id)) {
        for (const newSlot of courseToAdd.schedule) {
          for (const existingSlot of existingCourse.schedule) {
            if (newSlot.day === existingSlot.day) {
              const newStart = new Date(`1970-01-01T${newSlot.startTime}`);
              const newEnd = new Date(`1970-01-01T${newSlot.endTime}`);
              const existingStart = new Date(`1970-01-01T${existingSlot.startTime}`);
              const existingEnd = new Date(`1970-01-01T${existingSlot.endTime}`);

              if (
                (newStart >= existingStart && newStart < existingEnd) ||
                (newEnd > existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd)
              ) {
                conflictDetails = {
                  existingCourse,
                  newSlot,
                  existingSlot
                };
                break;
              }
            }
          }
          if (conflictDetails) break;
        }
        if (conflictDetails) break;
      }

      if (conflictDetails) {
        const { existingCourse, newSlot, existingSlot } = conflictDetails;
        const message = [
          t('calendar.conflictDetected'),
          `\n• ${t('calendar.courseToAdd')}: "${courseToAdd.name}"`,
          `\n• ${t('calendar.conflictsWith')}: "${existingCourse.name}"`,
          `\n• ${t('calendar.day')}: ${t(`courseForm.days.${newSlot.day}`)}`,
          `\n• ${t('calendar.timeOverlap')}: ${newSlot.startTime}-${newSlot.endTime}`,
          `\n• ${t('calendar.existingSlot')}: ${existingSlot.startTime}-${existingSlot.endTime}`,
          `\n\n${t('calendar.selectDifferentTime')}`
        ].join('');
        
        toast.error(message, {
          duration: 6000,
          style: {
            maxWidth: '500px',
            padding: '16px',
            whiteSpace: 'pre-line'
          },
        });
        return;
      }
    }

    setCourses(prev => prev.map(course =>
      course.id === id ? { ...course, isInCalendar: add } : course
    ));
    toast.success(add ? t('calendar.courseAdded') : t('calendar.courseRemoved'));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-800/20">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                {t('common.appTitle')}
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                {t('common.appDescription')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-800/20 overflow-hidden">
            <nav className="flex space-x-8 p-4 border-b border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('form')}
                className={`${
                  activeTab === 'form'
                    ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                } flex items-center pb-3 px-1 border-b-2 font-medium text-sm transition-all`}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                {t('courseForm.addCourse')}
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`${
                  activeTab === 'upload'
                    ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                } flex items-center pb-3 px-1 border-b-2 font-medium text-sm transition-all`}
              >
                <UploadIcon className="h-5 w-5 mr-2" />
                {t('fileUpload.uploadSchedule')}
              </button>
            </nav>

            <div className="p-6">
              {activeTab === 'form' ? (
                <CourseForm onSubmit={handleCourseSubmit} initialData={editingCourse} />
              ) : (
                <FileUpload onUpload={handleFileUpload} />
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-800/20 overflow-hidden">
                <CourseFilters onFilterChange={setFilters} courses={courses} />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-800/20 overflow-hidden">
                <CourseList
                  courses={filteredCourses}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                  onToggleCalendar={handleToggleCalendar}
                />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-800/20 overflow-hidden p-4">
              <Calendar events={generateCalendarEvents(filteredCourses.filter(course => course.isInCalendar))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <React.Suspense fallback="Loading...">
      <AppContent />
    </React.Suspense>
  );
}