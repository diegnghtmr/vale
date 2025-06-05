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
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('courseForm.courseNamePlaceholder')}
          className="p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          placeholder={t('courseForm.groupPlaceholder')}
          className="p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
          placeholder={t('courseForm.creditsPlaceholder')}
          className="p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={handleSave}
          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-md"
          title={t('courseList.actions.save')}
        >
          <Check className="h-5 w-5" />
        </button>
        <button
          onClick={onCancel}
          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md"
          title={t('courseList.actions.cancel')}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 