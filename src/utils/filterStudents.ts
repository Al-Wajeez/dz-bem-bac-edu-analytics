import type { Student } from '../components/tcs/BEMAnalysis';
import { FilterState } from '../lib/filterStore';

export function filterStudents(students: Student[], filters: FilterState): Student[] {
  return students.filter((student) => {
    if (filters.gender.length && !filters.gender.includes(student['الجنس'])) return false;
    if (filters.repeat.length && !filters.repeat.includes(student['الإعادة'])) return false;
    if (filters.directorate.length && !filters.directorate.includes(student['المديرية'])) return false;
    if (filters.school.length && !filters.school.includes(student['المؤسسة'])) return false;
    if (filters.department.length && !filters.department.includes(student['القسم'])) return false;
    if (filters.decision.length && !filters.decision.includes(student['القرار'])) return false;
    if (filters.profile.length && !filters.profile.includes(student['الملمح'])) return false;
    return true;
  });
} 