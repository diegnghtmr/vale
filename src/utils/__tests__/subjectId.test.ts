import { createSubjectId, isValidSubjectId } from '../subjectId';

describe('subjectId utilities', () => {
  describe('createSubjectId', () => {
    it('should create a consistent ID from a course name', () => {
      const courseName = 'Programación Web';
      const subjectId = createSubjectId(courseName);
      
      expect(subjectId).toBe('programacion-web');
      expect(subjectId).toMatch(/^[a-z0-9-]+$/);
    });

    it('should handle accents and special characters', () => {
      expect(createSubjectId('Matemáticas Avanzadas')).toBe('matematicas-avanzadas');
      expect(createSubjectId('Física I')).toBe('fisica-i');
      expect(createSubjectId('Inglés Técnico')).toBe('ingles-tecnico');
      expect(createSubjectId('C++ Programming')).toBe('c-programming');
    });

    it('should normalize spaces and multiple hyphens', () => {
      expect(createSubjectId('   Multiple   Spaces   ')).toBe('multiple-spaces');
      expect(createSubjectId('Course--With--Hyphens')).toBe('course-with-hyphens');
      expect(createSubjectId('-Leading-And-Trailing-')).toBe('leading-and-trailing');
    });

    it('should return the same ID for similar course names', () => {
      const baseName = 'Algoritmos y Estructuras de Datos';
      const variations = [
        'Algoritmos y Estructuras de Datos',
        'ALGORITMOS Y ESTRUCTURAS DE DATOS',
        '  Algoritmos y Estructuras de Datos  ',
        'Algoritmos y Estructuras de Datos.',
      ];

      const ids = variations.map(createSubjectId);
      const uniqueIds = [...new Set(ids)];
      
      expect(uniqueIds.length).toBe(1);
      expect(ids[0]).toBe('algoritmos-y-estructuras-de-datos');
    });

    it('should handle edge cases', () => {
      expect(createSubjectId('')).toBe('unknown-subject');
      expect(createSubjectId('   ')).toBe('unknown-subject');
      expect(createSubjectId('!@#$%^&*()')).toBe('unknown-subject');
      // @ts-ignore - Testing invalid input
      expect(createSubjectId(null)).toBe('unknown-subject');
      // @ts-ignore - Testing invalid input
      expect(createSubjectId(undefined)).toBe('unknown-subject');
    });

    it('should handle numbers and roman numerals', () => {
      expect(createSubjectId('Cálculo I')).toBe('calculo-i');
      expect(createSubjectId('Química 101')).toBe('quimica-101');
      expect(createSubjectId('Historia del Arte III')).toBe('historia-del-arte-iii');
    });
  });

  describe('isValidSubjectId', () => {
    it('should validate correct subject IDs', () => {
      expect(isValidSubjectId('programacion-web')).toBe(true);
      expect(isValidSubjectId('matematicas-i')).toBe(true);
      expect(isValidSubjectId('fisica-101')).toBe(true);
    });

    it('should reject invalid subject IDs', () => {
      expect(isValidSubjectId('')).toBe(false);
      expect(isValidSubjectId('unknown-subject')).toBe(false);
      // @ts-ignore - Testing invalid input
      expect(isValidSubjectId(null)).toBe(false);
      // @ts-ignore - Testing invalid input
      expect(isValidSubjectId(undefined)).toBe(false);
    });
  });
}); 