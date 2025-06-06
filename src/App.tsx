import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Upload as UploadIcon, Download } from 'lucide-react';
import { Course, CourseEvent } from './types';
import { CourseForm } from './components/CourseForm';
import { FileUpload } from './components/FileUpload';
import { Calendar } from './components/Calendar';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeTransition } from './components/ThemeTransition';
import { LanguageSelector } from './components/LanguageSelector';
import { useTheme } from './context/ThemeContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { CourseList } from './components/CourseList';
import { CourseFilters, CourseFilters as CourseFiltersType } from './components/CourseFilters';
import * as api from './services/api';
import { checkConflict } from './utils/schedule';
import * as ics from 'ics';
import { FloatingParticles, DecorativeWaves, ScrollResponsiveWaves } from './components/FloatingParticles';
import { CalendarIcon as AnimatedCalendarIcon, UploadIcon as AnimatedUploadIcon, DownloadIcon as AnimatedDownloadIcon } from './components/AnimatedIcons';
import { animations } from './utils/animations';
import { RippleEffect, SparkleEffect } from './components/CreativeEffects';

interface ExportButtonProps {
  onClick: () => void;
  text: string;
}

function ExportButton({ onClick, text }: ExportButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (buttonRef.current) {
      const hoverAnimation = animations.hoverScale(buttonRef.current);
      
      const handleMouseEnter = () => hoverAnimation.play();
      const handleMouseLeave = () => hoverAnimation.reverse();
      
      const button = buttonRef.current;
      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="btn btn-secondary btn-sm"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--text-xs)',
        minWidth: 'auto'
      }}
    >
      <AnimatedDownloadIcon size={16} isActive={false} />
      <span>{text}</span>
    </button>
  );
}

function AppContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'upload'>('form');
  const { theme, isTransitioning } = useTheme();
  const { t } = useTranslation();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [filters, setFilters] = useState<CourseFiltersType>({
    semester: '',
    timeSlot: '',
    name: '',
    credits: '',
  });

  const formSectionRef = React.useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const height = entries[0]?.contentRect.height;
      if (height) {
        setFormHeight(height);
      }
    });

    const node = formSectionRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

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

  const handleExportICS = () => {
    const eventsToExport = generateCalendarEvents(courses.filter(c => c.isInCalendar));
    const icsEvents = eventsToExport.map(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);

      return {
        title: event.title,
        description: event.extendedProps?.description || '',
        start: [start.getUTCFullYear(), start.getUTCMonth() + 1, start.getUTCDate(), start.getUTCHours(), start.getUTCMinutes()],
        end: [end.getUTCFullYear(), end.getUTCMonth() + 1, end.getUTCDate(), end.getUTCHours(), end.getUTCMinutes()],
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
      } as ics.EventAttributes;
    });

    const { error, value } = ics.createEvents(icsEvents);

    if (error) {
      console.error(error);
      return;
    }

    const blob = new Blob([value!], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'horario.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    const eventsToExport = generateCalendarEvents(courses.filter(c => c.isInCalendar));
    const headers = ['Subject', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Description'];
    const rows = eventsToExport.map(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return [
        `"${event.title}"`,
        start.toLocaleDateString(),
        start.toLocaleTimeString(),
        end.toLocaleDateString(),
        end.toLocaleTimeString(),
        `"${event.extendedProps?.description || ''}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'horario.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setActiveTab('form');
    // Scroll to the top of the form for better visibility on mobile
    const formElement = document.querySelector('.area-forms');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--error)',
            borderLeft: '4px solid var(--error)',
            borderRadius: '12px',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 'var(--font-medium)',
            padding: 'var(--space-5) var(--space-6)',
            maxWidth: '500px',
            minWidth: '380px',
            whiteSpace: 'pre-line',
            lineHeight: 'var(--leading-relaxed)',
            boxShadow: '0 8px 25px rgba(201, 87, 77, 0.15)',
          },
          iconTheme: {
            primary: '#c9574d',
            secondary: '#ffffff',
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
    <>
      {/* Theme Transition Overlay */}
      <ThemeTransition isTransitioning={isTransitioning} targetTheme={theme} />
      
      {/* Partículas flotantes de fondo */}
      <FloatingParticles count={15} maxSize={8} minSize={3} />
      
      <div className="container animate-fade-in" style={{ minHeight: '100vh', paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-20)', position: 'relative' }}>
        {/* Ondas decorativas fijas en la parte inferior */}
        <DecorativeWaves />
        
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 var(--space-4)', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Header */}
            <header className="card-elevated animate-slide-in-left" style={{ 
              padding: 'var(--space-8)',
              borderRadius: '16px'
            }}>
              <div className="header-layout">
                <style>
                  {`
                    .header-layout {
                      display: flex;
                      flex-wrap: wrap;
                      gap: var(--space-4);
                      justify-content: space-between;
                      align-items: center;
                    }
                    .header-text {
                      flex: 1;
                      min-width: 280px;
                    }
                    .header-actions {
                      display: flex;
                      align-items: center;
                      gap: var(--space-3);
                      flex-shrink: 0;
                    }
                    @media (max-width: 767px) {
                      .header-layout {
                        flex-direction: column;
                        align-items: center;
                      }
                      .header-text {
                        width: 100%;
                        text-align: center;
                      }
                      .header-actions {
                        order: -1;
                        width: 100%;
                        justify-content: center;
                        margin-bottom: var(--space-6);
                      }
                    }
                  `}
                </style>
                <div className="header-text">
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
                <div className="header-actions">
                  <LanguageSelector />
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {/* Contenido Principal con Layout Horizontal */}
            <main style={{ 
              display: 'grid',
              gap: 'var(--space-6)',
              alignItems: 'start'
            }} className="main-layout">
              <style>
                {`
                  .main-layout {
                    grid-template-columns: 1fr;
                    grid-template-areas:
                      "forms"
                      "courses"
                      "filters"
                      "calendar";
                  }
                  
                  @media (min-width: 768px) {
                    .main-layout {
                      grid-template-columns: 1fr 1fr;
                      grid-template-areas:
                        "forms courses"
                        "filters filters"
                        "calendar calendar";
                    }
                  }

                  .area-forms { grid-area: forms; }
                  .area-courses { grid-area: courses; }
                  .area-filters { grid-area: filters; }
                  .area-calendar { grid-area: calendar; }
                `}
              </style>

              {/* Área de Formularios */}
              <section ref={formSectionRef} className="card animate-fade-in area-forms" style={{ 
                overflow: 'hidden',
                padding: '0',
                borderRadius: '12px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px 12px 0 0'
                }}>
                  <RippleEffect>
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
                      <AnimatedCalendarIcon size={20} isActive={activeTab === 'form'} />
                      {t('courseForm.addCourse')}
                    </button>
                  </RippleEffect>
                  <RippleEffect>
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
                      <AnimatedUploadIcon size={20} isActive={activeTab === 'upload'} />
                      {t('fileUpload.uploadSchedule')}
                    </button>
                  </RippleEffect>
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
              </section>

              {/* Área de Lista de Cursos */}
              <section 
                className="card animate-fade-in content-section area-courses"
                style={{
                  height: isDesktop && formHeight > 0 ? `${formHeight}px` : 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <div className="section-header">
                  <h2 className="section-title">
                    {t('courseList.title', 'Courses')}
                  </h2>
                  <div className="section-badge">
                    {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                  </div>
                </div>
                <div className="content-body" style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
                    <div style={{padding: 'var(--space-6)'}}>
                        <CourseList
                            courses={filteredCourses}
                            onEdit={handleEditCourse}
                            onDelete={handleDeleteCourse}
                            onToggleCalendar={handleToggleCalendar}
                        />
                    </div>
                </div>
              </section>

              {/* Área de Filtros */}
              <section className="card animate-fade-in content-section area-filters">
                <div className="section-header">
                  <h2 className="section-title">
                    {t('courseFilters.title', 'Course Filters')}
                  </h2>
                </div>
                <div className="content-body">
                  <CourseFilters onFilterChange={setFilters} courses={courses} />
                </div>
              </section>
              
              {/* Área del Calendario */}
              <section className="card animate-fade-in content-section area-calendar">
                <div className="section-header">
                  <h2 className="section-title">
                    {t('calendar.title', 'Schedule')}
                  </h2>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <ExportButton onClick={handleExportICS} text="iCal" />
                    <ExportButton onClick={handleExportCSV} text="CSV" />
                  </div>
                </div>
                <div className="content-body">
                  <div style={{ overflowX: 'auto', margin: '0 -1.5rem', padding: '0 1.5rem' }}>
                    <div style={{ minWidth: '700px' }}>
                      <Calendar events={generateCalendarEvents(filteredCourses.filter(course => course.isInCalendar))} />
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <React.Suspense fallback="Loading...">
      <AppContent />
    </React.Suspense>
  );
}