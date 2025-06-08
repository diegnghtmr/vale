/**
 * Generates a consistent subject ID from a course name
 * This ensures the same subject has the same ID regardless of semester or group
 */

/**
 * Normalizes a string by removing accents and special characters
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
    .trim();
}

/**
 * Creates a subject ID from a course name
 * Uses the normalized course name to create a consistent identifier
 */
export function createSubjectId(courseName: string): string {
  if (!courseName || typeof courseName !== 'string') {
    return 'unknown-subject';
  }

  const normalized = normalizeString(courseName);
  
  // Create a slug-like identifier
  const slug = normalized
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  return slug || 'unknown-subject';
}

/**
 * Validates if a subject ID is valid
 */
export function isValidSubjectId(subjectId: string): boolean {
  return typeof subjectId === 'string' && subjectId.length > 0 && subjectId !== 'unknown-subject';
} 