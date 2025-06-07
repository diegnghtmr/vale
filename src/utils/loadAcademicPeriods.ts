export interface AcademicPeriod {
  label: string;
  path: string;
  load: () => Promise<any>;
  year: number;
  semester: number;
}

const modules = import.meta.glob('/docs/academic-periods/*/*.json');

const periods: AcademicPeriod[] = Object.entries(modules)
  .filter(([path]) => !path.includes('/archives/'))
  .map(([path, load]) => {
    const match = /academic-(\d{4})-s(\d)/.exec(path);
    const year = match ? Number(match[1]) : 0;
    const semester = match ? Number(match[2]) : 0;
    
    // Check if the JSON filename contains "preview"
    const isPreview = path.toLowerCase().includes('preview');
    const label = isPreview ? `${year} S${semester} (preview)` : `${year} S${semester}`;
    
    return {
      label,
      path,
      load: load as () => Promise<any>,
      year,
      semester
    };
  })
  .sort((a, b) =>
    b.year - a.year || b.semester - a.semester
  );

export function getAcademicPeriods(): AcademicPeriod[] {
  return periods;
} 