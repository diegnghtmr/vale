import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Upload as UploadIcon } from 'lucide-react';
import { Course, CourseEvent } from './types';
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
import * as api from './services/api';
import { checkConflict } from './utils/schedule';

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await api.getCourses();
        setCourses(fetchedCourses);
      } catch {
        toast.error('Failed to fetch courses.');
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (filters.semester && course.semester.toString() !== filters.semester) return false;
    if (filters.timeSlot && course.timeSlot !== filters.timeSlot) return false;
    if (filters.name && !course.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.credits && course.credits.toString() !== filters.credits) return false;
    return true;
  });

  const handleCourseSubmit = async (course: Course) => {
    try {
      if (editingCourse) {
        const updatedCourse = await api.updateCourse(editingCourse.id!, { ...course, id: editingCourse.id });
        setCourses(prev => prev.map(c => c.id === editingCourse.id ? updatedCourse : c));
        setEditingCourse(null);
        toast.success(t('courseForm.updateSuccess'));
      } else {
        const newCourse = await api.addCourse(course);
        setCourses((prev) => [...prev, newCourse]);
        toast.success(t('courseForm.addSuccess'));
      }
    } catch {
      toast.error('Failed to save course.');
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
          saturday: 5,
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
    if (editingCourse && editingCourse.id === course.id) {
      // If we are already editing this course, do nothing special,
      // let the submit handler do the work.
      // This case is for the inline editor.
      handleCourseSubmit(course);
    } else {
      setEditingCourse(course);
      setActiveTab('form');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await api.deleteCourse(id);
      setCourses(courses.filter(course => course.id !== id));
      toast.success(t('courseList.deleteSuccess'));
    } catch {
      toast.error('Failed to delete course.');
    }
  };

  const handleToggleCalendar = (id: string, add: boolean) => {
    if (add) {
      const courseToAdd = courses.find(c => c.id === id);
      if (!courseToAdd) return;

      const conflictDetails = checkConflict(
        courses.filter(c => c.isInCalendar),
        courseToAdd
      );

      if (conflictDetails) {
        const { conflictingCourse, newSlot, conflictingSlot } = conflictDetails;
        const message = [
          t('calendar.conflictDetected'),
          `\n• ${t('calendar.courseToAdd')}: "${courseToAdd.name}"`,
          `\n• ${t('calendar.conflictsWith')}: "${conflictingCourse.name}"`,
          `\n• ${t('calendar.day')}: ${t(`courseForm.days.${newSlot.day}`)}`,
          `\n• ${t('calendar.timeOverlap')}: ${newSlot.startTime}-${newSlot.endTime}`,
          `\n• ${t('calendar.existingSlot')}: ${conflictingSlot.startTime}-${conflictingSlot.endTime}`,
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
    <div className="container animate-fade-in" style={{ minHeight: '100vh', paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
      <div style={{ maxWidth: 'var(--max-width-2xl)', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Header */}
          <header className="card-elevated animate-slide-in-left" style={{ 
            padding: 'var(--space-8)',
            borderRadius: '16px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 'var(--space-4)'
            }}>
              <div style={{ flex: '1', minWidth: '280px' }}>
                <h1 className="title-section" style={{ 
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  margin: '0 0 var(--space-2) 0',
                  fontSize: 'var(--text-5xl)',
                  fontWeight: 'var(--font-extrabold)',
                  letterSpacing: '-0.02em'
                }}>
                  {t('common.appTitle')}
                </h1>
                <p className="text-body" style={{ 
                  margin: '0',
                  color: 'var(--text-secondary)',
                  fontWeight: 'var(--font-medium)',
                  fontSize: 'var(--text-lg)',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  {t('common.appDescription')}
                </p>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-3)',
                flexShrink: 0
              }}>
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Navigation Tabs */}
          <nav className="card animate-fade-in" style={{ 
            overflow: 'hidden',
            padding: '0',
            borderRadius: '12px'
          }}>
            <div style={{ 
              display: 'flex', 
              background: 'var(--bg-secondary)',
              borderRadius: '12px 12px 0 0'
            }}>
              <button
                onClick={() => setActiveTab('form')}
                className="btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-4) var(--space-6)',
                  backgroundColor: activeTab === 'form' ? 'var(--bg-primary)' : 'transparent',
                  color: activeTab === 'form' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '12px 12px 0 0',
                  fontWeight: activeTab === 'form' ? 'var(--font-semibold)' : 'var(--font-medium)',
                  fontSize: 'var(--text-base)',
                  height: 'auto',
                  flex: '1',
                  justifyContent: 'center',
                  transition: 'all var(--duration-normal) var(--ease-out)',
                  boxShadow: activeTab === 'form' ? '0 -2px 0 var(--accent-primary)' : 'none'
                }}
              >
                <CalendarIcon style={{ height: 'var(--space-5)', width: 'var(--space-5)' }} />
                {t('courseForm.addCourse')}
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className="btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-4) var(--space-6)',
                  backgroundColor: activeTab === 'upload' ? 'var(--bg-primary)' : 'transparent',
                  color: activeTab === 'upload' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '12px 12px 0 0',
                  fontWeight: activeTab === 'upload' ? 'var(--font-semibold)' : 'var(--font-medium)',
                  fontSize: 'var(--text-base)',
                  height: 'auto',
                  flex: '1',
                  justifyContent: 'center',
                  transition: 'all var(--duration-normal) var(--ease-out)',
                  boxShadow: activeTab === 'upload' ? '0 -2px 0 var(--accent-primary)' : 'none'
                }}
              >
                <UploadIcon style={{ height: 'var(--space-5)', width: 'var(--space-5)' }} />
                {t('fileUpload.uploadSchedule')}
              </button>
            </div>

            <div style={{ 
              padding: 'var(--space-8)',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '0 0 12px 12px'
            }}>
              {activeTab === 'form' ? (
                <CourseForm 
                  onSubmit={handleCourseSubmit} 
                  initialData={editingCourse}
                  allCourses={courses}
                />
              ) : (
                <FileUpload onUpload={handleFileUpload} />
              )}
            </div>
          </nav>

          {/* Content Grid */}
          <main style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr',
            gap: 'var(--space-6)',
            alignItems: 'start'
          }} className="content-grid">
            <style>
              {`
                @media (min-width: var(--breakpoint-lg)) {
                  .content-grid {
                    grid-template-columns: 1fr 1fr !important;
                  }
                }
              `}
            </style>
            
            {/* Left Column - Filters and Course List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {/* Course Filters */}
              <section className="card animate-fade-in content-section">
                <div className="section-header">
                  <h2 className="section-title">
                    {t('courseFilters.title', 'Course Filters')}
                  </h2>
                </div>
                <div className="content-body">
                  <CourseFilters onFilterChange={setFilters} courses={courses} />
                </div>
              </section>
              
              {/* Course List */}
              <section className="card animate-fade-in content-section">
                <div className="section-header">
                  <h2 className="section-title">
                    {t('courseList.title', 'Courses')}
                  </h2>
                  <div className="section-badge">
                    {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                  </div>
                </div>
                <div className="content-body">
                  <CourseList
                    courses={filteredCourses}
                    onEdit={handleEditCourse}
                    onDelete={handleDeleteCourse}
                    onToggleCalendar={handleToggleCalendar}
                  />
                </div>
              </section>
            </div>
            
            {/* Right Column - Calendar */}
            <section className="card animate-fade-in content-section" style={{ 
              height: 'fit-content',
              position: 'sticky',
              top: 'var(--space-6)'
            }}>
              <div className="section-header">
                <h2 className="section-title">
                  {t('calendar.title', 'Schedule')}
                </h2>
                <div className="section-badge">
                  {filteredCourses.filter(course => course.isInCalendar).length} in calendar
                </div>
              </div>
              <div className="content-body">
                <Calendar events={generateCalendarEvents(filteredCourses.filter(course => course.isInCalendar))} />
              </div>
            </section>
          </main>
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