import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCourses } from '../hooks/useCourses';
import { useSubjectCompletion } from '../context/SubjectCompletionContext';
import { Course } from '../types';

interface DashboardFilters {
  semester: string;
  completionStatus: 'all' | 'completed' | 'pending';
  search: string;
}

export function Dashboard() {
  const { t } = useTranslation();
  const { courses, toggleCompleted } = useCourses();
  
  const [filters, setFilters] = useState<DashboardFilters>({
    semester: '',
    completionStatus: 'all',
    search: '',
  });

  // Group courses by subjectId to get unique subjects
  const uniqueSubjects = useMemo(() => {
    const subjectMap = new Map<string, Course>();
    
    courses.forEach(course => {
      const existingSubject = subjectMap.get(course.subjectId);
      if (!existingSubject || course.semester < existingSubject.semester) {
        // Keep the course from the earliest semester for each subject
        subjectMap.set(course.subjectId, course);
      }
    });
    
    return Array.from(subjectMap.values());
  }, [courses]);

  // Apply filters to unique subjects
  const filteredSubjects = useMemo(() => {
    return uniqueSubjects.filter(subject => {
      // Semester filter
      if (filters.semester && subject.semester.toString() !== filters.semester) {
        return false;
      }
      
      // Completion status filter
      if (filters.completionStatus === 'completed' && !subject.isCompleted) {
        return false;
      }
      if (filters.completionStatus === 'pending' && subject.isCompleted) {
        return false;
      }
      
      // Search filter
      if (filters.search && !subject.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [uniqueSubjects, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSubjects = uniqueSubjects.length;
    const completedSubjects = uniqueSubjects.filter(s => s.isCompleted).length;
    const totalCredits = uniqueSubjects.reduce((sum, subject) => sum + subject.credits, 0);
    const completedCredits = uniqueSubjects
      .filter(s => s.isCompleted)
      .reduce((sum, subject) => sum + subject.credits, 0);
    const progressPercentage = totalSubjects > 0 ? Math.round((completedSubjects / totalSubjects) * 100) : 0;
    
    return {
      totalSubjects,
      completedSubjects,
      totalCredits,
      completedCredits,
      progressPercentage,
    };
  }, [uniqueSubjects]);

  // Get available semesters for filter
  const availableSemesters = useMemo(() => {
    const semesters = [...new Set(courses.map(c => c.semester))].sort((a, b) => a - b);
    return semesters;
  }, [courses]);

  const handleToggleSubject = async (subjectId: string) => {
    // Find any course with this subjectId to toggle
    const courseToToggle = courses.find(c => c.subjectId === subjectId);
    if (courseToToggle) {
      await toggleCompleted(courseToToggle.id);
    }
  };

  const resetFilters = () => {
    setFilters({
      semester: '',
      completionStatus: 'all',
      search: '',
    });
  };

  return (
    <div style={{ 
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'var(--font-primary)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}>
          {t('dashboard.title', 'Dashboard de Materias')}
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
        }}>
          {t('dashboard.subtitle', 'Gestiona el progreso de tus materias académicas')}
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--accent-primary)',
            marginBottom: '4px',
          }}>
            {stats.completedSubjects}
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
          }}>
            {t('dashboard.completedSubjects', 'Materias Completadas')}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--accent-primary)',
            marginBottom: '4px',
          }}>
            {stats.totalSubjects}
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
          }}>
            {t('dashboard.totalSubjects', 'Total de Materias')}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--accent-primary)',
            marginBottom: '4px',
          }}>
            {stats.completedCredits}
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
          }}>
            {t('dashboard.completedCredits', 'Créditos Completados')}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--accent-primary)',
            marginBottom: '4px',
          }}>
            {stats.progressPercentage}%
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
          }}>
            {t('dashboard.progress', 'Progreso')}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '32px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <span style={{
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}>
            {t('dashboard.overallProgress', 'Progreso General')}
          </span>
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}>
            {stats.completedSubjects} / {stats.totalSubjects} materias
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--bg-tertiary)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${stats.progressPercentage}%`,
            height: '100%',
            background: 'var(--accent-primary)',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '16px',
        }}>
          {t('dashboard.filters', 'Filtros')}
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'end',
        }}>
          {/* Semester Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '4px',
            }}>
              {t('dashboard.semester', 'Semestre')}
            </label>
            <select
              value={filters.semester}
              onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-primary)',
                borderRadius: '6px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
              }}
            >
              <option value="">{t('dashboard.allSemesters', 'Todos los semestres')}</option>
              {availableSemesters.map(semester => (
                <option key={semester} value={semester}>
                  {t('dashboard.semesterNumber', `Semestre ${semester}`, { number: semester })}
                </option>
              ))}
            </select>
          </div>

          {/* Completion Status Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '4px',
            }}>
              {t('dashboard.status', 'Estado')}
            </label>
            <select
              value={filters.completionStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, completionStatus: e.target.value as any }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-primary)',
                borderRadius: '6px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
              }}
            >
              <option value="all">{t('dashboard.allStatuses', 'Todos los estados')}</option>
              <option value="completed">{t('dashboard.completed', 'Completadas')}</option>
              <option value="pending">{t('dashboard.pending', 'Pendientes')}</option>
            </select>
          </div>

          {/* Search Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '4px',
            }}>
              {t('dashboard.search', 'Buscar')}
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder={t('dashboard.searchPlaceholder', 'Buscar por nombre...')}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-primary)',
                borderRadius: '6px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Reset Button */}
          <div>
            <button
              onClick={resetFilters}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--border-primary)',
                borderRadius: '6px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {t('dashboard.resetFilters', 'Limpiar Filtros')}
            </button>
          </div>
        </div>
      </div>

      {/* Subjects List */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}>
            {t('dashboard.subjects', 'Materias')}
          </h3>
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}>
            {filteredSubjects.length} {t('dashboard.subjectsFound', 'materias encontradas')}
          </span>
        </div>

        {filteredSubjects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-secondary)',
          }}>
            {t('dashboard.noSubjects', 'No se encontraron materias con los filtros aplicados')}
          </div>
        ) : (
          <div 
            className="courses-scroll-area"
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            <div style={{
              display: 'grid',
              gap: '12px',
            }}>
              {filteredSubjects.map((subject) => (
              <div
                key={subject.subjectId}
                style={{
                  padding: '20px',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '12px',
                  background: subject.isCompleted ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
              >
                {/* Header with title and status */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                  gap: '16px',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      margin: '0',
                      lineHeight: '1.4',
                      textDecoration: subject.isCompleted ? 'line-through' : 'none',
                      opacity: subject.isCompleted ? 0.7 : 1,
                    }}>
                      {subject.name}
                    </h4>
                  </div>
                  
                  <button
                    onClick={() => handleToggleSubject(subject.subjectId)}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '8px',
                      background: subject.isCompleted ? 'var(--error)' : 'var(--accent-primary)',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {subject.isCompleted ? '↶ Reactivar' : '✓ Completar'}
                  </button>
                </div>

                {/* Subject details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '24px',
                  padding: '16px 0 0 0',
                  borderTop: '1px solid var(--border-primary)',
                  alignItems: 'center',
                }}>
                  {/* Semestre */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {t('dashboard.semesterLabel', 'Semestre')}
                    </span>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                    }}>
                      {subject.semester}
                    </span>
                  </div>
                  
                  {/* Créditos */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {t('dashboard.creditsLabel', 'Créditos')}
                    </span>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                    }}>
                      {subject.credits}
                    </span>
                  </div>
                  
                  {/* Estado */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'flex-end',
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                                          }}>
                        {t('dashboard.statusLabel', 'Estado')}
                      </span>
                    {subject.isCompleted ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        padding: '6px 12px',
                        background: 'var(--accent-primary)',
                        color: 'white',
                        borderRadius: '16px',
                        fontWeight: '500',
                        gap: '4px',
                      }}>
                        ✓ {t('dashboard.completed', 'Completada')}
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        padding: '6px 12px',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: '16px',
                        fontWeight: '500',
                        gap: '4px',
                      }}>
                        ⏳ {t('dashboard.pending', 'Pendiente')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 