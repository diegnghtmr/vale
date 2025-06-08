import { useState, useCallback, ChangeEvent } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  handleChange: (field: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: unknown) => void;
  setValues: (values: T) => void;
  resetForm: () => void;
  isValid: boolean;
}

/**
 * Custom hook for form state management with validation
 * @param options - Configuration object with initial values, validation, and submit handler
 * @returns Form state and handlers
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form values
  const validateForm = useCallback(
    (formValues: T) => {
      if (!validate) return {};
      return validate(formValues);
    },
    [validate]
  );

  // Handle input changes
  const handleChange = useCallback(
    (field: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      
      setValues(prev => ({
        ...prev,
        [field]: value,
      }));

      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors]
  );

  // Set individual field value
  const setFieldValue = useCallback((field: keyof T, value: unknown) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      const formErrors = validateForm(values);
      setErrors(formErrors);

      const hasErrors = Object.keys(formErrors).length > 0;
      if (hasErrors || !onSubmit) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Check if form is valid
  const isValid = Object.keys(validateForm(values)).length === 0;

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
    resetForm,
    isValid,
  };
} 