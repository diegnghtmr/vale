import React, { useState, useEffect } from 'react';
import { Course, CourseEvent } from './types';
import { CourseForm } from './components/CourseForm';
import { FileUpload } from './components/FileUpload';
import { PeriodSelector } from './components/PeriodSelector';
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
import { FloatingParticles, DecorativeWaves } from './components/FloatingParticles';
import { CalendarIcon as AnimatedCalendarIcon, UploadIcon as AnimatedUploadIcon, DownloadIcon as AnimatedDownloadIcon } from './components/AnimatedIcons';
import { animations } from './utils/animations';

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

  // Calcular los créditos totales de las materias en el calendario
  const coursesInCalendar = filteredCourses.filter(course => course.isInCalendar);
  const totalCredits = coursesInCalendar.reduce((sum, course) => sum + Number(course.credits), 0);



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
      const isValid = course.name && 
                      (course.credits !== null && course.credits !== undefined && course.credits !== '') && 
                      course.schedule?.length > 0;
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
      // Cobre principal - acorde al accent primary
      { bg: '#f5ebe8', border: '#c5775b', text: '#8b4513' },
      // Coral cálido - acorde al accent secondary  
      { bg: '#f7ede9', border: '#cb9a88', text: '#a0755e' },
      // Verde azulado - acorde al success
      { bg: '#eef4f6', border: '#698aa2', text: '#4a6b7a' },
      // Beige cálido - acorde al accent tertiary
      { bg: '#f8f2ed', border: '#eac5a7', text: '#c49a7a' },
      // Terracota suave
      { bg: '#f4e7e4', border: '#b8746b', text: '#8d5550' },
      // Gris cálido - acorde al texto secundario
      { bg: '#f0edea', border: '#877070', text: '#6b5656' },
      // Marrón caoba - mejor contraste
      { bg: '#f2e9e4', border: '#a67c5a', text: '#6b4423' },
      // Rosa tierra
      { bg: '#f6ebe9', border: '#c5877c', text: '#9a675e' },
      // Verde oliva
      { bg: '#f2f4f0', border: '#8fa785', text: '#6d7d63' },
      // Lavanda suave
      { bg: '#f3f0f4', border: '#a497a3', text: '#7d7279' },
    ] : [
      // Cobre brillante para modo oscuro
      { bg: '#d1968c', border: '#e7beac', text: '#262624' },
      // Coral profundo
      { bg: '#cb9a88', border: '#e7beac', text: '#262624' },
      // Verde azulado claro
      { bg: '#9db3b7', border: '#b5c8cc', text: '#262624' },
      // Beige cálido profundo
      { bg: '#c49a7a', border: '#d4b896', text: '#262624' },
      // Terracota vibrante
      { bg: '#c5877c', border: '#d4a399', text: '#262624' },
      // Gris cálido claro
      { bg: '#9a9997', border: '#b5b3b0', text: '#262624' },
      // Marrón caoba brillante
      { bg: '#a67c5a', border: '#c49a7a', text: '#faf5f4' },
      // Rosa tierra vibrante
      { bg: '#c5877c', border: '#d4a399', text: '#262624' },
      // Verde oliva claro
      { bg: '#8fa785', border: '#a8bb9f', text: '#262624' },
      // Lavanda claro
      { bg: '#a497a3', border: '#b8adb4', text: '#262624' },
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
          description: `${slot.startTime} - ${slot.endTime}${course.classroom ? ` • ${course.classroom}` : ''}`,
          start: start.toISOString(),
          end: end.toISOString(),
          backgroundColor: colors[colorIndex].bg,
          borderColor: colors[colorIndex].border,
          textColor: colors[colorIndex].text,
          extendedProps: {
            credits: course.credits,
            semester: course.semester,
            group: course.group,
            classroom: course.classroom,
            details: course.details,
            description: `${slot.startTime} - ${slot.endTime}${course.classroom ? ` • ${course.classroom}` : ''}`,
            dayKey: slot.day 
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
        location: event.extendedProps?.classroom || '',
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
    const headers = ['Subject', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Description', 'Location'];
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
        `"${event.extendedProps?.classroom || ''}"`,
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
                      "filters"
                      "courses"
                      "forms"
                      "calendar";
                  }
                  
                  @media (min-width: 768px) {
                    .main-layout {
                      grid-template-columns: 1fr 1fr;
                      grid-template-areas:
                        "filters filters"
                        "forms courses"
                        "calendar calendar";
                    }
                  }

                  .area-forms { grid-area: forms; }
                  .area-courses { grid-area: courses; }
                  .area-filters { grid-area: filters; }
                  .area-calendar { grid-area: calendar; }
                `}
              </style>

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
                    {t('courseList.courseCount', { count: filteredCourses.length })}
                  </div>
                </div>
                <div className="content-body courses-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
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
                      borderRight: '1px solid var(--border-primary)',
                      borderRadius: '12px 0 0 0',
                      fontWeight: activeTab === 'form' ? 'var(--font-semibold)' : 'var(--font-medium)',
                      fontSize: 'var(--text-base)',
                      height: 'auto',
                      flex: '1',
                      justifyContent: 'center',
                      transition: 'all var(--duration-normal) var(--ease-out)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <AnimatedCalendarIcon size={20} isActive={activeTab === 'form'} />
                    {t('courseForm.addCourse')}
                    {activeTab === 'form' && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--accent-primary)',
                      }} />
                    )}
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
                      borderRadius: '0 12px 0 0',
                      fontWeight: activeTab === 'upload' ? 'var(--font-semibold)' : 'var(--font-medium)',
                      fontSize: 'var(--text-base)',
                      height: 'auto',
                      flex: '1',
                      justifyContent: 'center',
                      transition: 'all var(--duration-normal) var(--ease-out)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <AnimatedUploadIcon size={20} isActive={activeTab === 'upload'} />
                    {t('fileUpload.uploadSchedule')}
                    {activeTab === 'upload' && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--accent-primary)',
                      }} />
                    )}
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
                    <div>
                      <PeriodSelector onUpload={handleFileUpload} />
                      <FileUpload onUpload={handleFileUpload} />
                    </div>
                  )}
                </div>
              </section>
              
              {/* Área del Calendario */}
              <section className="card animate-fade-in content-section area-calendar">
                <div className="section-header">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <h2 className="section-title">
                      {t('calendar.title')}
                    </h2>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 'var(--space-3)', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        gap: 'var(--space-3)', 
                        alignItems: 'center'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--space-2)',
                          padding: 'var(--space-2) var(--space-3)',
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: '8px',
                          border: '1px solid var(--border-primary)'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-primary)'
                          }} />
                          <span style={{ fontWeight: 'var(--font-medium)' }}>
                            {t('calendar.scheduledCoursesCount', { count: coursesInCalendar.length })}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--space-2)',
                          padding: 'var(--space-2) var(--space-3)',
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: '8px',
                          border: '1px solid var(--border-primary)'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-primary)'
                          }} />
                          <span style={{ fontWeight: 'var(--font-semibold)' }}>
                            {totalCredits} {t('calendar.totalCredits')}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <ExportButton onClick={handleExportICS} text="iCal" />
                        <ExportButton onClick={handleExportCSV} text="CSV" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-body">
                  <div style={{ overflowX: 'auto', margin: '0 -1.5rem', padding: '0 1.5rem' }}>
                    <div style={{ minWidth: '700px' }}>
                      <Calendar events={generateCalendarEvents(coursesInCalendar)} />
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