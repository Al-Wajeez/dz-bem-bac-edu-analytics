import type { Student } from '../components/tcs/AnnualAnalysis';
import { FilterState } from '../lib/AnnualfilterStore';

export function filterStudents(students: Student[], filters: FilterState): Student[] {
  return students.filter((student) => {
    if (filters.gender.length && !filters.gender.includes(student['الجنس'])) return false;
    if (filters.repeat.length && !filters.repeat.includes(student['الإعادة'])) return false;
    if (filters.directorate.length && !filters.directorate.includes(student['المديرية'])) return false;
    if (filters.school.length && !filters.school.includes(student['المؤسسة'])) return false;
    if (filters.department.length && !filters.department.includes(student['القسم'])) return false;
    if (filters.decision.length && !filters.decision.includes(student['القرار'] as 'ينتقل إلى قسم أعلى' | 'يعيد السنة')) return false;
    if (filters.profile.length && !filters.profile.includes(student['الملمح'] as 'جذع مشترك علوم وتكنولوجيا' | 'جذع مشترك آداب وفلسفة')) return false;
    // Subject/term filtering
    if (filters.subjectTerm.length === 1 && filters.subject.length) {
      //const term = filters.subjectTerm[0];
      for (const subj of filters.subject) {
        if (student[subj] == null || student[subj] === '') return false;
      }
    }
    return true;
  });
} 