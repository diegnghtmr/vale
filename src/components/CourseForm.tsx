import React, { useState, useEffect } from 'react';
import { GraduationCap, Save, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Course, Schedule } from '../types';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { checkConflict, checkSelfConflict } from '../utils/schedule';
import { TimeInput } from './TimeInput';
import { FormError } from './FormError';
import { handleNumericInput } from '../utils/input';

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
  const { t, i18n } = useTranslation();
  const [course, setCourse] = useState<Course>(initialData || initialCourse);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [hasSelfConflict, setHasSelfConflict] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCourse(initialData);
    } else {
      setCourse(initialCourse);
    }
    setHasSelfConflict(false);
  }, [initialData]);

  useEffect(() => {
    if (course.schedule.length > 0 && initialData?.isInCalendar) {
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

    if (checkSelfConflict(course.schedule)) {
      setHasSelfConflict(true);
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
    if (hasSelfConflict) setHasSelfConflict(false);
    const newSchedule = [...course.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setCourse({ ...course, schedule: newSchedule });
  };

  const addSchedule = () => {
    if (hasSelfConflict) setHasSelfConflict(false);
    setCourse({
      ...course,
      schedule: [...course.schedule, { day: 'monday', startTime: '', endTime: '' }],
    });
  };

  const removeSchedule = (index: number) => {
    if (hasSelfConflict) setHasSelfConflict(false);
    const newSchedule = course.schedule.filter((_, i) => i !== index);
    setCourse({ ...course, schedule: newSchedule });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <h2 className="title-subsection" style={{ marginBottom: 'var(--space-2)' }}>
          {t('courseForm.title')}
        </h2>
        
        {/* Course Info Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr',
          gap: 'var(--space-6)'
        }} className="course-info-grid">
          <style>
            {`
              @media (min-width: var(--breakpoint-md)) {
                .course-info-grid {
                  grid-template-columns: 1fr 1fr !important;
                }
              }
            `}
          </style>
          
          {/* Course Name */}
          <div className="form-group">
            <label className="form-label">{t('courseForm.courseName')}</label>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                left: 'var(--space-3)', 
                top: '50%', 
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <GraduationCap style={{ height: 'var(--space-5)', width: 'var(--space-5)', color: 'var(--text-tertiary)' }} />
              </div>
              <input
                type="text"
                required
                value={course.name}
                onChange={(e) => setCourse({ ...course, name: e.target.value })}
                className="form-input"
                style={{ paddingLeft: 'var(--space-10)' }}
                placeholder={t('courseForm.courseNamePlaceholder')}
              />
            </div>
          </div>

          {/* Credits */}
          <div className="form-group">
            <label className="form-label">{t('courseForm.credits')}</label>
            <input
              type="number"
              required
              min="1"
              value={course.credits}
              onInput={handleNumericInput}
              onChange={(e) => setCourse({ ...course, credits: e.target.value })}
              className="form-input"
              placeholder={t('courseForm.creditsPlaceholder')}
            />
          </div>

          {/* Semester */}
          <div className="form-group">
            <label className="form-label">{t('courseForm.semester')}</label>
            <input
              type="number"
              required
              min="1"
              max="10"
              value={course.semester}
              onInput={handleNumericInput}
              onChange={(e) => setCourse({ ...course, semester: e.target.value })}
              className="form-input"
              placeholder={t('courseForm.semesterPlaceholder')}
            />
          </div>

          {/* Time Slot */}
          <div className="form-group">
            <label className="form-label">{t('courseForm.timeSlot')}</label>
            <select
              value={course.timeSlot}
              onChange={(e) => setCourse({ ...course, timeSlot: e.target.value as 'day' | 'night' })}
              className="form-input form-select"
            >
              <option value="day">{t('courseForm.timeSlotDay')}</option>
              <option value="night">{t('courseForm.timeSlotNight')}</option>
            </select>
          </div>

          {/* Group */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">{t('courseForm.group')}</label>
            <input
              type="text"
              required
              value={course.group}
              onChange={(e) => setCourse({ ...course, group: e.target.value })}
              className="form-input"
              placeholder={t('courseForm.groupPlaceholder')}
            />
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--space-6)', 
        paddingTop: 'var(--space-8)', 
        borderTop: '1px solid var(--border-secondary)' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-2)'
        }}>
          <h2 className="title-subsection" style={{ margin: '0' }}>
            {t('courseForm.schedule')}
          </h2>
          <button
            type="button"
            onClick={addSchedule}
            className="btn btn-accent btn-md"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 'var(--space-2)',
              minWidth: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            <Plus style={{ height: 'var(--space-4)', width: 'var(--space-4)' }} />
            {t('courseForm.addTimeSlot')}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {conflictError && <FormError message={conflictError} />}
          
          {hasSelfConflict && (
            <FormError 
              message={
                i18n.language === 'es'
                  ? 'El curso tiene horarios que se solapan. Por favor, revisa los horarios.'
                  : 'The course has conflicting time slots. Please check the schedules.'
              }
            />
          )}

          {course.schedule.map((schedule, index) => (
            <div
              key={index}
              className="card"
              style={{ 
                padding: 'var(--space-6)',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px'
              }}
            >
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr',
                gap: 'var(--space-6)',
                alignItems: 'end'
              }} className="schedule-grid">
                <style>
                  {`
                    @media (min-width: var(--breakpoint-md)) {
                      .schedule-grid {
                        grid-template-columns: 2fr 1.5fr 1.5fr auto !important;
                      }
                    }
                  `}
                </style>
                
                <div className="form-group">
                  <label className="form-label">{t('courseForm.day')}</label>
                  <select
                    value={schedule.day}
                    onChange={(e) => handleScheduleChange(index, 'day', e.target.value as Schedule['day'])}
                    className="form-input form-select"
                  >
                    {DAYS.map((day) => (
                      <option key={day} value={day}>
                        {t(`courseForm.days.${day}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('courseForm.startTime')}</label>
                  <TimeInput
                    required
                    value={schedule.startTime}
                    onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('courseForm.endTime')}</label>
                  <TimeInput
                    required
                    value={schedule.endTime}
                    onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      color: 'var(--error)',
                      borderColor: 'var(--error)',
                      padding: 'var(--space-2) var(--space-3)',
                      minWidth: 'auto'
                    }}
                  >
                    <Trash2 style={{ height: 'var(--space-4)', width: 'var(--space-4)' }} />
                    <span style={{ display: 'none' }} className="remove-text">
                      {t('courseForm.remove')}
                    </span>
                  </button>
                  <style>
                    {`
                      @media (min-width: var(--breakpoint-md)) {
                        .remove-text {
                          display: inline !important;
                        }
                      }
                    `}
                  </style>
                </div>
              </div>
            </div>
          ))}

          {course.schedule.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--space-8)', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '12px', 
              border: '2px dashed var(--border-primary)',
              margin: 'var(--space-4) 0'
            }}>
              <p style={{ 
                color: 'var(--text-secondary)',
                margin: '0',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-medium)'
              }}>
                {t('courseForm.noTimeSlots')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        paddingTop: 'var(--space-8)', 
        borderTop: '1px solid var(--border-secondary)' 
      }}>
        <button
          type="submit"
          className="btn btn-primary btn-lg animate-scale-in"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-4) var(--space-8)',
            minWidth: '200px',
            justifyContent: 'center'
          }}
        >
          <Save style={{ height: 'var(--space-5)', width: 'var(--space-5)' }} />
          {t('courseForm.submit')}
        </button>
      </div>
    </form>
  );
}