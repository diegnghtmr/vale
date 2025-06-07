import React, { memo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Pencil, Trash2, CalendarPlus, CalendarX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Course } from '../types';

interface VirtualizedCourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  onToggleCalendar: (id: string, add: boolean) => void;
  height?: number;
  width?: number | string;
  itemHeight?: number;
}

interface CourseItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    courses: Course[];
    onEdit: (course: Course) => void;
    onDelete: (id: string) => void;
    onToggleCalendar: (id: string, add: boolean) => void;
    t: any;
  };
}

/**
 * Individual course item component for virtualized list
 */
const CourseItem = memo(function CourseItem({ index, style, data }: CourseItemProps) {
  const { courses, onEdit, onDelete, onToggleCalendar, t } = data;
  const course = courses[index];

  if (!course) return null;

  return (
    <div style={style}>
      <div
        style={{
          padding: 'var(--space-4)',
          borderTop: index > 0 ? '1px solid var(--border-secondary)' : 'none',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h3 className="text-label" style={{ color: 'var(--text-primary)' }}>
              {course.name} - {t('courseForm.group')} {course.group}
            </h3>
            <div
              style={{
                marginTop: 'var(--space-1)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
                alignItems: 'center',
              }}
            >
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

            {/* Classroom and Details */}
            {(course.classroom || course.details) && (
              <div
                style={{
                  marginTop: 'var(--space-1)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-2)',
                  alignItems: 'center',
                }}
              >
                {course.classroom && (
                  <>
                    <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                      {t('courseForm.classroom')}: {course.classroom}
                    </p>
                    {course.details && <span style={{ color: 'var(--text-tertiary)' }}>•</span>}
                  </>
                )}
                {course.details && (
                  <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                    {t('courseForm.details')}: {course.details}
                  </p>
                )}
              </div>
            )}

            <div style={{ marginTop: 'var(--space-1)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {course.schedule.map((slot, index) => (
                <p key={`${slot.day}-${slot.startTime}-${slot.endTime}-${index}`} className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                  {t(`courseForm.days.${slot.day}`)}: {slot.startTime} - {slot.endTime}
                </p>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={() => onEdit(course)}
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
                transition: 'all var(--duration-normal) var(--ease-out)',
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
                  transition: 'all var(--duration-normal) var(--ease-out)',
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
                  transition: 'all var(--duration-normal) var(--ease-out)',
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
                transition: 'all var(--duration-normal) var(--ease-out)',
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
      </div>
    </div>
  );
});

/**
 * Virtualized course list component for better performance with large datasets
 * Automatically switches between regular and virtualized rendering based on course count
 */
export const VirtualizedCourseList = memo(function VirtualizedCourseList({
  courses,
  onEdit,
  onDelete,
  onToggleCalendar,
  height = 400,
  width = "100%",
  itemHeight = 120,
}: VirtualizedCourseListProps) {
  const { t } = useTranslation();

  if (courses.length === 0) {
    return (
      <div
        style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-6)',
          textAlign: 'center',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '2px dashed var(--border-primary)',
        }}
      >
        <p style={{ color: 'var(--text-secondary)' }}>{t('courseList.noCourses')}</p>
      </div>
    );
  }

  // Use virtualization only for large lists (>20 items)
  const shouldVirtualize = courses.length > 20;

  if (!shouldVirtualize) {
    // Render normally for small lists
    return (
      <div
        style={{
          marginTop: 'var(--space-4)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {courses.map((course, index) => (
          <CourseItem
            key={course.id || `course-${index}-${course.name}-${course.group}`}
            index={index}
            style={{}}
            data={{
              courses,
              onEdit,
              onDelete,
              onToggleCalendar,
              t,
            }}
          />
        ))}
      </div>
    );
  }

  // Render virtualized list for large datasets
  return (
    <div
      style={{
        marginTop: 'var(--space-4)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <List
        height={height}
        width={width}
        itemCount={courses.length}
        itemSize={itemHeight}
        itemData={{
          courses,
          onEdit,
          onDelete,
          onToggleCalendar,
          t,
        }}
      >
        {CourseItem}
      </List>
    </div>
  );
}); 