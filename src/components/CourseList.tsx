import { useState } from 'react';
import { Pencil, Trash2, CalendarPlus, CalendarX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Course } from '../types';
import { CourseInlineEdit } from './CourseInlineEdit';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  onToggleCalendar: (id: string, add: boolean) => void;
}

export function CourseList({ courses, onEdit, onDelete, onToggleCalendar }: CourseListProps) {
  const { t } = useTranslation();
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const handleSave = (updatedCourse: Course) => {
    onEdit(updatedCourse);
    setEditingCourseId(null);
  };

  if (courses.length === 0) {
    return (
      <div style={{ 
        marginTop: 'var(--space-4)', 
        padding: 'var(--space-6)', 
        textAlign: 'center',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        border: '2px dashed var(--border-primary)'
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>{t('courseList.noCourses')}</p>
      </div>
    );
  }

  return (
    <div style={{ 
      marginTop: 'var(--space-4)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {courses.map((course, index) => (
        <div key={course.id} style={{ 
          padding: 'var(--space-4)',
          borderTop: index > 0 ? '1px solid var(--border-secondary)' : 'none'
        }}>
          {editingCourseId === course.id ? (
            <CourseInlineEdit 
              course={course} 
              onSave={handleSave} 
              onCancel={() => setEditingCourseId(null)} 
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h3 className="text-label" style={{ color: 'var(--text-primary)' }}>
                  {course.name} - {t('courseForm.group')} {course.group}
                </h3>
                <div style={{ 
                  marginTop: 'var(--space-1)', 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 'var(--space-2)',
                  alignItems: 'center'
                }}>
                  <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                    {course.credits} {t('courseForm.credits').toLowerCase()}
                  </p>
                  <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                  <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                    {t('courseForm.semester')} {course.semester}
                  </p>
                  <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                  <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                    {course.timeSlot === 'day' ? t('courseForm.timeSlotDay') : t('courseForm.timeSlotNight')}
                  </p>
                </div>
                <div style={{ marginTop: 'var(--space-1)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {course.schedule.map((slot, index) => (
                    <p key={index} className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                      {t(`courseForm.days.${slot.day}`)}: {slot.startTime} - {slot.endTime}
                    </p>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => setEditingCourseId(course.id!)}
                  className="btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: 'var(--space-2)',
                    color: 'var(--accent-primary)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all var(--duration-normal) var(--ease-out)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  aria-label={t('courseList.actions.edit')}
                  title={t('courseList.actions.edit')}
                >
                  <Pencil style={{ height: 'var(--space-4)', width: 'var(--space-4)' }} />
                </button>
                {course.isInCalendar ? (
                  <button
                    onClick={() => onToggleCalendar(course.id!, false)}
                    className="btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: 'var(--space-2)',
                      color: 'var(--warning)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all var(--duration-normal) var(--ease-out)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-tertiary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label={t('courseList.actions.removeFromCalendar')}
                    title={t('courseList.actions.removeFromCalendar')}
                  >
                    <CalendarX style={{ height: 'var(--space-4)', width: 'var(--space-4)' }} />
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleCalendar(course.id!, true)}
                    className="btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: 'var(--space-2)',
                      color: 'var(--success)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all var(--duration-normal) var(--ease-out)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-tertiary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label={t('courseList.actions.addToCalendar')}
                    title={t('courseList.actions.addToCalendar')}
                  >
                    <CalendarPlus style={{ height: 'var(--space-4)', width: 'var(--space-4)' }} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(course.id!)}
                  className="btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: 'var(--space-2)',
                    color: 'var(--error)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all var(--duration-normal) var(--ease-out)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  aria-label={t('courseList.actions.delete')}
                  title={t('courseList.actions.delete')}
                >
                  <Trash2 style={{ height: 'var(--space-4)', width: 'var(--space-4)' }} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}