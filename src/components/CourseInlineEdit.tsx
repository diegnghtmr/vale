import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Course } from '../types';
import { Check, X } from 'lucide-react';

interface CourseInlineEditProps {
  course: Course;
  onSave: (updatedCourse: Course) => void;
  onCancel: () => void;
}

export function CourseInlineEdit({ course, onSave, onCancel }: CourseInlineEditProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(course.name);
  const [group, setGroup] = useState(course.group);
  const [credits, setCredits] = useState(course.credits);

  const handleSave = () => {
    onSave({ ...course, name, group, credits: Number(credits) });
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr',
        gap: 'var(--space-4)'
      }} className="inline-edit-grid">
        <style>
          {`
            @media (min-width: var(--breakpoint-md)) {
              .inline-edit-grid {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
          `}
        </style>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('courseForm.courseNamePlaceholder')}
          className="form-input"
        />
        <input
          type="text"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          placeholder={t('courseForm.groupPlaceholder')}
          className="form-input"
        />
        <input
          type="number"
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
          placeholder={t('courseForm.creditsPlaceholder')}
          className="form-input"
        />
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 'var(--space-2)', 
        marginTop: 'var(--space-4)' 
      }}>
        <button
          onClick={handleSave}
          className="btn-sm"
          style={{
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
          title={t('courseList.actions.save')}
        >
          <Check style={{ height: 'var(--space-5)', width: 'var(--space-5)' }} />
        </button>
        <button
          onClick={onCancel}
          className="btn-sm"
          style={{
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
          title={t('courseList.actions.cancel')}
        >
          <X style={{ height: 'var(--space-5)', width: 'var(--space-5)' }} />
        </button>
      </div>
    </div>
  );
} 