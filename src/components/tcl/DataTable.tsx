import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { Edit2, Trash2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import { Tooltip } from '../ui/Tooltip';

// Define the structure of your data
interface StudentData {
  id: number;
  'المديرية': string;
  'المؤسسة': string;
  'اللقب و الاسم': string;
  'الجنس': string;
  'الإعادة': string;
  'القسم': string;
  'معدل الفصل 1': number;
  'معدل القبول (الفصل الأول)': string;
  'معدل الفصل 2': number;
  'معدل الفصلين (الأول والثاني)': number;
  'معدل القبول (الفصل الثاني)': string;
  'معدل الفصل 3': number;
  'المعدل السنوي': number;
  'معدل القبول (المعدل السنوي)': string;
  'رغبة التلميذ (إستبيان الميول و الإهتمامات)  - الفصل الأول': string;
  'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني': string;
  'تصحيح الرغبة': string;
  'الرغبة النهائية للتلميذ - الفصل الثالث': string;
  'اللغة العربية وآدابها': number;
  'اللغة العربية وآدابها ف 2': number;
  'متوسط المعدلين (اللغة العربية)': number;
  'اللغة العربية وآدابها ف 3': number;
  'المعدل السنوي (اللغة العربية)': number;
  'التاريخ والجغرافيا': number;
  'التاريخ والجغرافيا ف 2': number;
  'متوسط المعدلين (التاريخ والجغرافيا)': number;
  'التاريخ والجغرافيا ف 3': number;
  'المعدل السنوي (التاريخ والجغرافيا)': number;
  'اللغة الفرنسية': number;
  'اللغة الفرنسية ف 2': number;
  'متوسط المعدلين (اللغة الفرنسية)': number;
  'اللغة الفرنسية ف 3': number;
  'المعدل السنوي (اللغة الفرنسية)': number;
  'اللغة الانجليزية': number;
  'اللغة الانجليزية ف 2': number;
  'متوسط المعدلين (اللغة الانجليزية)': number;
  'اللغة الانجليزية ف 3': number;
  'المعدل السنوي (اللغة الانجليزية)': number;
  'شعبة آداب وفلسفة (ت.ت)': number;
  'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ت)': number;
  'شعبة اللغات الأجنبية (ت.ت)': number;
  'ترتيب التلميذ (اللغات الأجنبية) (ت.ت)': number;
  'التوجيه التدريجي (ت.ت)': string;
  'التوافق مع الرغبة (ت.ت)': string;
  'شعبة آداب وفلسفة (ت.م)': number;
  'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)': number;
  'شعبة اللغات الأجنبية (ت.م)': number;
  'ترتيب التلميذ (اللغات الأجنبية) (ت.م)': number;
  'التوجيه المسبق (ت.م)': string;
  'التوافق مع الرغبة (ت.م)': string;
  'ثبات الرغبة (ت.م)': string;
  'شعبة آداب وفلسفة (ت.ن)': number;
  'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ن)': number;
  'شعبة اللغات الأجنبية (ت.ن)': number;
  'ترتيب التلميذ (اللغات الأجنبية) (ت.ن)': number;
  'التوجيه النهائي (ت.ن)': string; 
  'التوافق مع الرغبة (ت.ن)': string; 
  'ثبات الرغبة (ت.ن)': string;
  'إقتراح مستشار التوجيه': string;
  'إقتراح الأساتذة': string;
  'قرار مجلس القبول والتوجيه': string;
  'حالة الطعن': string;
  'تأسيس الطعن': string;
  'قرار الطعن': string;
  'الشعبة المطعون فيها': string;
  'الشعبة المرغوب فيها': string;
  'قرار اللجنة الولائية للطعن': string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  globalFilter: string;
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  isDarkMode: boolean; // Accept dark mode state as a prop
}

export function DataTable({
  data,
  columns,
  onEdit,
  onDelete,
  globalFilter,
  sorting,
  setSorting,
  pageSize,
  setPageSize,
  isDarkMode, // Destructure the prop
}: DataTableProps<StudentData>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<StudentData | null>(null);


  const table = useReactTable({
    data,
    columns: [
      {
        id: 'id',
        header: 'الرقم',
        cell: ({ row }) => (pageIndex * pageSize) + (row.index + 1),
      },
      ...columns,
      {
        id: 'studentDesireSurvey',
        header: 'رغبة التلميذ (إستبيان الميول و الإهتمامات) - الفصل الأول',
        accessorKey: 'رغبة التلميذ (إستبيان الميول و الإهتمامات) - الفصل الأول',
        cell: ({ row }) => {
          const value = row.original['رغبة التلميذ (إستبيان الميول و الإهتمامات) - الفصل الأول'];
          return value ? value : '-';
        },
      },
      {
        id: 'initialWishCard',
        header: 'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني',
        accessorKey: 'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني',
        cell: ({ row }) => {
          const value = row.original['رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني'];
          return value ? value : '-';
        },
      },
      {
        id: 'desireCorrection',
        header: 'تصحيح الرغبة',
        accessorKey: 'تصحيح الرغبة',
        cell: ({ row }) => {
          const value = row.original['تصحيح الرغبة'];
          return value ? value : '-';
        },
      },
      {
        id: 'finalStudentDesire',
        header: 'الرغبة النهائية للتلميذ - الفصل الثالث',
        accessorKey: 'الرغبة النهائية للتلميذ - الفصل الثالث',
        cell: ({ row }) => {
          const value = row.original['الرغبة النهائية للتلميذ - الفصل الثالث'];
          return value ? value : '-';
        },
      },            
      {
        id: 'firstSemesterAcceptance',
        header: 'معدل القبول (الفصل الأول)',
        cell: ({ row }) => {
          const grade = Number(row.original['معدل الفصل 1']) || 0;
          row.original['معدل القبول (الفصل الأول)'] = grade >= 10 ? 'مقبول' : 'غير مقبول';
          return (
            <span className={clsx(
              'px-2 py-1 text-xs font-medium rounded-md',
              grade >= 10 
                ? `bg-green-100 text-green-800 ${isDarkMode ? 'button-success-dark' : ''}`
                : `bg-red-100 text-red-800 ${isDarkMode ? 'button-failed-dark' : ''}`
            )}>
              {row.original['معدل القبول (الفصل الأول)']}
            </span>
          );
        },
      },
      {
        id: 'secondSemesterAcceptance',
        header: 'معدل القبول (الفصل الثاني)',
        cell: ({ row }) => {
          const grade = Number(row.original['معدل الفصل 1']) || 0;
          row.original['معدل القبول (الفصل الثاني)'] = grade >= 10 ? 'مقبول' : 'غير مقبول';
          return (
            <span className={clsx(
              'px-2 py-1 text-xs font-medium rounded-md',
              grade >= 10 
                ? `bg-green-100 text-green-800 ${isDarkMode ? 'button-success-dark' : ''}`
                : `bg-red-100 text-red-800 ${isDarkMode ? 'button-failed-dark' : ''}`
            )}>
              {row.original['معدل القبول (الفصل الثاني)']}
            </span>
          );
        },
      },
      {
        id: 'semesterAverage',
        header: 'معدل الفصلين (الأول والثاني)',
        cell: ({ row }) => {
          const grade1 = Number(row.original['معدل الفصل 1']) || 0;
          const grade2 = Number(row.original['معدل الفصل 2']) || 0;
          
          if (isNaN(grade1) || isNaN(grade2)) {
            row.original['معدل الفصلين (الأول والثاني)'] = null;
            return '—';
          }
    
          const average = (grade1 + grade2) / 2;
          row.original['معدل الفصلين (الأول والثاني)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'semesterAverageAcceptance',
        header: 'معدل القبول (الفصلين)',
        cell: ({ row }) => {
          const rawGrade1 = row.original['معدل الفصل 1'];
          const rawGrade2 = row.original['معدل الفصل 2'];
      
          const grade1 = rawGrade1 !== undefined && rawGrade1 !== '' ? Number(rawGrade1) : null;
          const grade2 = rawGrade2 !== undefined && rawGrade2 !== '' ? Number(rawGrade2) : null;
      
          if (grade1 === null || grade2 === null || isNaN(grade1) || isNaN(grade2)) {
            row.original['معدل القبول (الفصلين)'] = null;
            return <span className="text-gray-400">-</span>;
          }
      
          const average = (grade1 + grade2) / 2;
          const result = average >= 10 ? 'مقبول' : 'غير مقبول';
          row.original['معدل القبول (الفصلين)'] = result;
      
          return (
            <span className={clsx(
              'px-2 py-1 text-xs font-medium rounded-md',
              average >= 10 
                ? `bg-green-100 text-green-800 ${isDarkMode ? 'button-success-dark' : ''}`
                : `bg-red-100 text-red-800 ${isDarkMode ? 'button-failed-dark' : ''}`
            )}>
              {result}
            </span>
          );
        },
      },      
      {
        id: 'yearlyAverage',
        header: 'المعدل السنوي',
        cell: ({ row }) => {
          const grade1 = Number(row.original['معدل الفصل 1']) || 0;
          const grade2 = Number(row.original['معدل الفصل 2']) || 0;
          const grade3 = Number(row.original['معدل الفصل 3']) || 0;
          
          if (isNaN(grade1) || isNaN(grade2) || isNaN(grade3)) {
            row.original['المعدل السنوي'] = null;
            return '—';
          }
    
          const average = (grade1 + grade2 + grade3) / 3;
          row.original['المعدل السنوي'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'yearlyAverageAcceptance',
        header: 'معدل القبول (المعدل السنوي)',
        cell: ({ row }) => {
          const grade1 = Number(row.original['معدل الفصل 1']) || 0;
          const grade2 = Number(row.original['معدل الفصل 2']) || 0;
          const grade3 = Number(row.original['معدل الفصل 3']) || 0;
          
          if (isNaN(grade1) || isNaN(grade2) || isNaN(grade3)) {
            row.original['معدل القبول (المعدل السنوي)'] = null;
            return '—';
          }
    
          const average = (grade1 + grade2 + grade3) / 3;
          row.original['معدل القبول (المعدل السنوي)'] = average >= 10 ? 'مقبول' : 'غير مقبول';
          return (
            <span className={clsx(
              'px-2 py-1 text-xs font-medium rounded-md',
              average >= 10 
                ? `bg-green-100 text-green-800 ${isDarkMode ? 'button-success-dark' : ''}`
                : `bg-red-100 text-red-800 ${isDarkMode ? 'button-failed-dark' : ''}`
            )}>
              {row.original['معدل القبول (المعدل السنوي)']}
            </span>
          );
        },
      },
      {
        id: 'arabicAverage',
        header: 'متوسط المعدلين (اللغة العربية)',
        cell: ({ row }) => {
          const grade1 = Number(row.original['اللغة العربية وآدابها']) || 0;
          const grade2 = Number(row.original['اللغة العربية وآدابها ف 2']) || 0;
          const average = (grade1 + grade2) / 2;
          row.original['متوسط المعدلين (اللغة العربية)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'arabicYearlyAverage',
        header: 'المعدل السنوي (اللغة العربية)',
        cell: ({ row }) => {
          const grade1 = Number(row.original['اللغة العربية وآدابها']) || 0;
          const grade2 = Number(row.original['اللغة العربية وآدابها ف 2']) || 0;
          const grade3 = Number(row.original['اللغة العربية وآدابها ف 3']) || 0;
          const average = (grade1 + grade2 + grade3) / 3;
          row.original['المعدل السنوي (اللغة العربية)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'historyAverage',
        header: 'متوسط المعدلين (التاريخ والجغرافيا)',
        cell: ({ row }) => {
          const grade1 = Number(row.original['التاريخ والجغرافيا']) || 0;
          const grade2 = Number(row.original['التاريخ والجغرافيا ف 2']) || 0;
          const average = (grade1 + grade2) / 2;
          row.original['متوسط المعدلين (التاريخ والجغرافيا)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'historyYearlyAverage',
        header: 'المعدل السنوي (التاريخ والجغرافيا)',
        cell: ({ row }) => {
          const grade1 = Number(row.original['التاريخ والجغرافيا']) || 0;
          const grade2 = Number(row.original['التاريخ والجغرافيا ف 2']) || 0;
          const grade3 = Number(row.original['التاريخ والجغرافيا ف 3']) || 0;
          const average = (grade1 + grade2 + grade3) / 3;
          row.original['المعدل السنوي (التاريخ والجغرافيا)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'frenchAverage',
        header: 'متوسط المعدلين (اللغة الفرنسية)',
        cell: ({ row }) => {
          const grade1 = Number(row.original['اللغة الفرنسية']) || 0;
          const grade2 = Number(row.original['اللغة الفرنسية ف 2']) || 0;
          const average = (grade1 + grade2) / 2;
          row.original['متوسط المعدلين (اللغة الفرنسية)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'frenchYearlyAverage',
        header: 'المعدل السنوي (اللغة الفرنسية)',
        cell: ({ row }) => {
          const grade1 = Number(row.original['اللغة الفرنسية']) || 0;
          const grade2 = Number(row.original['اللغة الفرنسية ف 2']) || 0;
          const grade3 = Number(row.original['اللغة الفرنسية ف 3']) || 0;
          const average = (grade1 + grade2 + grade3) / 3;
          row.original['المعدل السنوي (اللغة الفرنسية)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'englishAverage',
        header: 'متوسط المعدلين (اللغة الانجليزية)',
        cell: ({ row }) => {
          const grade1 = Number(row.original['اللغة الانجليزية']) || 0;
          const grade2 = Number(row.original['اللغة الانجليزية ف 2']) || 0;
          const average = (grade1 + grade2) / 2;
          row.original['متوسط المعدلين (اللغة الانجليزية)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'englishYearlyAverage',
        header: 'المعدل السنوي (اللغة الانجليزية)',
        cell: ({ row }) => {
          const grade1 = Number(row.original['اللغة الانجليزية']) || 0;
          const grade2 = Number(row.original['اللغة الانجليزية ف 2']) || 0;
          const grade3 = Number(row.original['اللغة الانجليزية ف 3']) || 0;
          const average = (grade1 + grade2 + grade3) / 3;
          row.original['المعدل السنوي (اللغة الانجليزية)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
/*....................First............................*/
      {
        id: 'artsFirstSemester',
        header: 'شعبة آداب وفلسفة (ت.ت)',
        cell: ({ row }) => {
          const arabic = Number(row.original['اللغة العربية وآدابها']) || 0;
          const history = Number(row.original['التاريخ والجغرافيا']) || 0;
          const french = Number(row.original['اللغة الفرنسية']) || 0;
          const english = Number(row.original['اللغة الانجليزية']) || 0;
          
          const average = ((arabic * 5) + (history * 2) + (french * 2) + (english * 1)) / 10;
          row.original['شعبة آداب وفلسفة (ت.ت)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'artsRank',
        header: 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ت)',
        cell: ({ table, row }) => {
          const allRows = table.getCoreRowModel().rows;
          const scores = allRows.map(r => ({
            id: r.id,
            value: Number(r.original['شعبة آداب وفلسفة (ت.ت)']) || 0
          }));
          
          const sorted = [...scores].sort((a, b) => b.value - a.value);
          const rankMap = new Map<string, number>();
          let currentRank = 1;
          
          sorted.forEach((item, index) => {
            if (index > 0 && item.value !== sorted[index-1].value) {
              currentRank = index + 1;
            }
            rankMap.set(item.id, currentRank);
          });
          
          const rank = rankMap.get(row.id) || 0;
          row.original['ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ت)'] = rank;
          return rank || '-';
        },
      },
      {
        id: 'languagesFirstSemester',
        header: 'شعبة اللغات الأجنبية (ت.ت)',
        cell: ({ row }) => {
          const arabic = Number(row.original['اللغة العربية وآدابها']) || 0;
          const history = Number(row.original['التاريخ والجغرافيا']) || 0;
          const french = Number(row.original['اللغة الفرنسية']) || 0;
          const english = Number(row.original['اللغة الانجليزية']) || 0;
          
          const average = ((arabic * 3) + (history * 1) + (french * 3) + (english * 3)) / 10;
          row.original['شعبة اللغات الأجنبية (ت.ت)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'languagesFirstSemesterRank',
        header: 'ترتيب التلميذ (اللغات الأجنبية) (ت.ت)',
        cell: ({ table, row }) => {
          const allRows = table.getCoreRowModel().rows;
          const scores = allRows.map(r => ({
            id: r.id,
            value: Number(r.original['شعبة اللغات الأجنبية (ت.ت)']) || 0
          }));
          
          const sorted = [...scores].sort((a, b) => b.value - a.value);
          const rankMap = new Map<string, number>();
          let currentRank = 1;
          
          sorted.forEach((item, index) => {
            if (index > 0 && item.value !== sorted[index-1].value) {
              currentRank = index + 1;
            }
            rankMap.set(item.id, currentRank);
          });
          
          const rank = rankMap.get(row.id) || 0;
          row.original['ترتيب التلميذ (اللغات الأجنبية) (ت.ت)'] = rank;
          return rank || '-';
        },
      },
      {
        id: 'firstSemesterWishMatch',
        header: 'التوافق مع الرغبة (ت.ت)',
        cell: ({ row }) => {
          const wish = row.original['رغبة التلميذ (إستبيان الميول و الإهتمامات)  - الفصل الأول'];
          const direction = row.original['التوجيه التدريجي (ت.ت)'];
      
          if (!wish || !direction) {
            row.original['التوافق مع الرغبة (ت.ت)'] = null;
            return '-';
          }
      
          const isMatch = wish === direction;
          row.original['التوافق مع الرغبة (ت.ت)'] = isMatch ? 'تتفق ورغبة التلميذ' : 'لا تتفق ورغبة التلميذ';
      
          return (
            <span className={clsx(
              'px-2 py-1 text-xs font-medium rounded-md',
              isMatch
                ? `bg-green-100 text-green-800 ${isDarkMode ? 'button-success-dark' : ''}`
                : `bg-red-100 text-red-800 ${isDarkMode ? 'button-failed-dark' : ''}`
            )}>
              {row.original['التوافق مع الرغبة (ت.ت)']}
            </span>
          );
        },
      },
/*....................Second............................*/
      {
        id: 'artsSecondSemester',
        header: 'شعبة آداب وفلسفة (ت.م)',
        cell: ({ row }) => {
          const arabic = Number(row.original['متوسط المعدلين (اللغة العربية)']) || 0;
          const history = Number(row.original['متوسط المعدلين (التاريخ والجغرافيا)']) || 0;
          const french = Number(row.original['متوسط المعدلين (اللغة الفرنسية)']) || 0;
          const english = Number(row.original['متوسط المعدلين (اللغة الانجليزية)']) || 0;
          
          const average = ((arabic * 5) + (history * 2) + (french * 2) + (english * 1)) / 10;
          row.original['شعبة آداب وفلسفة (ت.م)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'artsSecondSemesterRank',
        header: 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)',
        cell: ({ table, row }) => {
          const allRows = table.getCoreRowModel().rows;
          const scores = allRows.map(r => ({
            id: r.id,
            value: Number(r.original['شعبة آداب وفلسفة (ت.م)']) || 0
          }));
          
          const sorted = [...scores].sort((a, b) => b.value - a.value);
          const rankMap = new Map<string, number>();
          let currentRank = 1;
          
          sorted.forEach((item, index) => {
            if (index > 0 && item.value !== sorted[index-1].value) {
              currentRank = index + 1;
            }
            rankMap.set(item.id, currentRank);
          });
          
          const rank = rankMap.get(row.id) || 0;
          row.original['ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)'] = rank;
          return rank || '-';
        },
      },
      {
        id: 'languagesSecondSemester',
        header: 'شعبة اللغات الأجنبية (ت.م)',
        cell: ({ row }) => {
          const arabic = Number(row.original['متوسط المعدلين (اللغة العربية)']) || 0;
          const history = Number(row.original['متوسط المعدلين (التاريخ والجغرافيا)']) || 0;
          const french = Number(row.original['متوسط المعدلين (اللغة الفرنسية)']) || 0;
          const english = Number(row.original['متوسط المعدلين (اللغة الانجليزية)']) || 0;
          
          const average = ((arabic * 3) + (history * 1) + (french * 3) + (english * 3)) / 10;
          row.original['شعبة اللغات الأجنبية (ت.م)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'languagesSecondSemesterRank',
        header: 'ترتيب التلميذ (اللغات الأجنبية) (ت.م)',
        cell: ({ table, row }) => {
          const allRows = table.getCoreRowModel().rows;
          const scores = allRows.map(r => ({
            id: r.id,
            value: Number(r.original['شعبة اللغات الأجنبية (ت.م)']) || 0
          }));
          
          const sorted = [...scores].sort((a, b) => b.value - a.value);
          const rankMap = new Map<string, number>();
          let currentRank = 1;
          
          sorted.forEach((item, index) => {
            if (index > 0 && item.value !== sorted[index-1].value) {
              currentRank = index + 1;
            }
            rankMap.set(item.id, currentRank);
          });
          
          const rank = rankMap.get(row.id) || 0;
          row.original['ترتيب التلميذ (اللغات الأجنبية) (ت.م)'] = rank;
          return rank || '-';
        },
      },
      {
        id: 'secondSemesterWishMatch',
        header: 'التوافق مع الرغبة (ت.م)',
        cell: ({ row }) => {
          const wish = row.original['رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني'];
          const direction = row.original['التوجيه المسبق (ت.م)'];
      
          if (!wish || !direction) {
            row.original['التوافق مع الرغبة (ت.م)'] = null;
            return '-';
          }
      
          const isMatch = wish === direction;
          row.original['التوافق مع الرغبة (ت.م)'] = isMatch ? 'تتفق ورغبة التلميذ' : 'لا تتفق ورغبة التلميذ';
      
          return (
            <span className={clsx(
              'px-2 py-1 text-xs font-medium rounded-md',
              isMatch
                ? `bg-green-100 text-green-800 ${isDarkMode ? 'button-success-dark' : ''}`
                : `bg-red-100 text-red-800 ${isDarkMode ? 'button-failed-dark' : ''}`
            )}>
              {row.original['التوافق مع الرغبة (ت.م)']}
            </span>
          );
        },
      },      
      {
        id: 'secondSemesterWishStability',
        header: 'ثبات الرغبة (ت.م)',
        cell: ({ row }) => {
          const firstDirection = row.original['التوجيه التدريجي (ت.ت)'];
          const secondDirection = row.original['التوجيه المسبق (ت.م)'];
      
          if (!firstDirection || !secondDirection) {
            row.original['ثبات الرغبة (ت.م)'] = null;
            return '-';
          }
      
          row.original['ثبات الرغبة (ت.م)'] = firstDirection === secondDirection ? 'ثبات الرغبة' : 'تغير الرغبة';
      
          return (
            <span className={clsx(
              'px-2 py-1 text-xs font-medium rounded-md',
              firstDirection === secondDirection
                ? `bg-green-100 text-green-800 ${isDarkMode ? 'button-success-dark' : ''}`
                : `bg-red-100 text-red-800 ${isDarkMode ? 'button-failed-dark' : ''}`
            )}>
              {row.original['ثبات الرغبة (ت.م)']}
            </span>
          );
        },
      },  
/*....................Third............................*/    
      {
        id: 'artsThirdSemester',
        header: 'شعبة آداب وفلسفة (ت.ن)',
        cell: ({ row }) => {
          const arabic = Number(row.original['المعدل السنوي (اللغة العربية)']) || 0;
          const history = Number(row.original['المعدل السنوي (التاريخ والجغرافيا)']) || 0;
          const french = Number(row.original['المعدل السنوي (اللغة الفرنسية)']) || 0;
          const english = Number(row.original['المعدل السنوي (اللغة الانجليزية)']) || 0;
          
          const average = ((arabic * 5) + (history * 2) + (french * 2) + (english * 1)) / 10;
          row.original['شعبة آداب وفلسفة (ت.ن)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'artsThirdSemesterRank',
        header: 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ن)',
        cell: ({ table, row }) => {
          const allRows = table.getCoreRowModel().rows;
          const scores = allRows.map(r => ({
            id: r.id,
            value: Number(r.original['شعبة آداب وفلسفة (ت.ن)']) || 0
          }));
          
          const sorted = [...scores].sort((a, b) => b.value - a.value);
          const rankMap = new Map<string, number>();
          let currentRank = 1;
          
          sorted.forEach((item, index) => {
            if (index > 0 && item.value !== sorted[index-1].value) {
              currentRank = index + 1;
            }
            rankMap.set(item.id, currentRank);
          });
          
          const rank = rankMap.get(row.id) || 0;
          row.original['ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ن)'] = rank;
          return rank || '-';
        },
      },
      {
        id: 'languagesThirdSemester',
        header: 'شعبة اللغات الأجنبية (ت.ن)',
        cell: ({ row }) => {
          const arabic = Number(row.original['المعدل السنوي (اللغة العربية)']) || 0;
          const history = Number(row.original['المعدل السنوي (التاريخ والجغرافيا)']) || 0;
          const french = Number(row.original['المعدل السنوي (اللغة الفرنسية)']) || 0;
          const english = Number(row.original['المعدل السنوي (اللغة الانجليزية)']) || 0;
          
          const average = ((arabic * 3) + (history * 1) + (french * 3) + (english * 3)) / 10;
          row.original['شعبة اللغات الأجنبية (ت.ن)'] = average.toFixed(2);
          return average.toFixed(2);
        },
      },
      {
        id: 'languagesThirdSemesterRank',
        header: 'ترتيب التلميذ (اللغات الأجنبية) (ت.ن)',
        cell: ({ table, row }) => {
          const allRows = table.getCoreRowModel().rows;
          const scores = allRows.map(r => ({
            id: r.id,
            value: Number(r.original['شعبة اللغات الأجنبية (ت.ن)']) || 0
          }));
          
          const sorted = [...scores].sort((a, b) => b.value - a.value);
          const rankMap = new Map<string, number>();
          let currentRank = 1;
          
          sorted.forEach((item, index) => {
            if (index > 0 && item.value !== sorted[index-1].value) {
              currentRank = index + 1;
            }
            rankMap.set(item.id, currentRank);
          });
          
          const rank = rankMap.get(row.id) || 0;
          row.original['ترتيب التلميذ (اللغات الأجنبية) (ت.ن)'] = rank;
          return rank || '-';
        },
      },
      {
        id: 'thirdSemesterWishMatch',
        header: 'التوافق مع الرغبة (ت.ن)',
        cell: ({ row }) => {
          const wish = row.original['الرغبة النهائية للتلميذ - الفصل الثالث'] || '-';
          const direction = row.original['التوجيه النهائي (ت.ن)'] || '-';
      
          const isMatch = wish === direction;
          const result = isMatch ? 'تتفق ورغبة التلميذ' : 'لا تتفق ورغبة التلميذ';
      
          return (
            <span className={clsx(
              'px-2 py-1 text-xs font-medium rounded-md',
              isMatch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            )}>
              {result}
            </span>
          );
        },
      },      
      {
        id: 'thirdSemesterWishStability',
        header: 'ثبات الرغبة (ت.ن)',
        cell: ({ row }) => {
          const secondDirection = row.original['التوجيه المسبق (ت.م)'];
          const thirdDirection = row.original['التوجيه النهائي (ت.ن)'];
      
          if (!secondDirection || !thirdDirection) {
            row.original['ثبات الرغبة (ت.ن)'] = null;
            return '-';
          }
      
          row.original['ثبات الرغبة (ت.ن)'] = secondDirection === thirdDirection ? 'ثبات الرغبة' : 'تغير الرغبة';
      
          return (
            <span className={clsx(
              'px-2 py-1 text-xs font-medium rounded-md',
              secondDirection === thirdDirection
                ? `bg-green-100 text-green-800 ${isDarkMode ? 'button-success-dark' : ''}`
                : `bg-red-100 text-red-800 ${isDarkMode ? 'button-failed-dark' : ''}`
            )}>
              {row.original['ثبات الرغبة (ت.ن)']}
            </span>
          );
        },
      },      
      {
        id: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
          const isComplete = checkFormCompletion(row.original);
          row.original['الحالة'] = isComplete ? 'مكتمل' : 'غير مكتمل';
          return (
            <span className={clsx(
                'px-2 py-1 text-xs font-medium rounded-md',
                isComplete
                  ? `bg-green-100 text-green-800 ${isDarkMode ? 'button-success-dark' : ''}`
                  : `bg-yellow-100 text-yellow-800 ${isDarkMode ? 'button-warning-dark' : ''}`
            )}>
              {row.original['الحالة']}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-center space-x-2">
            <button
              className="text-blue-400 hover:text-blue-600"
              onClick={() => onEdit(row.original)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
            </button>
          </div>
        ),
      },
    ],
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({ pageIndex, pageSize });
        setPageIndex(newPagination.pageIndex);
        setPageSize(newPagination.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Function to check if all required fields are filled
  const checkFormCompletion = (rowData: any) => {
    const requiredFields = [
      'المديرية',
      'المؤسسة',
      'اللقب و الاسم',
      'الجنس',
      'الإعادة',
      'القسم',
      'معدل الفصل 1',
      'معدل القبول (الفصل الأول)',
      'معدل الفصل 2',
      'معدل الفصلين (الأول والثاني)',
      'معدل القبول (الفصل الثاني)',
      'معدل الفصل 3',
      'المعدل السنوي',
      'معدل القبول (المعدل السنوي)',
      'رغبة التلميذ (إستبيان الميول و الإهتمامات)  - الفصل الأول',
      'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني',
      'تصحيح الرغبة',
      'الرغبة النهائية للتلميذ - الفصل الثالث',
      'اللغة العربية وآدابها',
      'اللغة العربية وآدابها ف 2',
      'متوسط المعدلين (اللغة العربية)',
      'اللغة العربية وآدابها ف 3',
      'المعدل السنوي (اللغة العربية)',
      'التاريخ والجغرافيا',
      'التاريخ والجغرافيا ف 2',
      'متوسط المعدلين (التاريخ والجغرافيا)',
      'التاريخ والجغرافيا ف 3',
      'المعدل السنوي (التاريخ والجغرافيا)',
      'اللغة الفرنسية',
      'اللغة الفرنسية ف 2',
      'متوسط المعدلين (اللغة الفرنسية)',
      'اللغة الفرنسية ف 3',
      'المعدل السنوي (اللغة الفرنسية)',
      'اللغة الانجليزية',
      'اللغة الانجليزية ف 2',
      'متوسط المعدلين (اللغة الانجليزية)',
      'اللغة الانجليزية ف 3',
      'المعدل السنوي (اللغة الانجليزية)',
      'شعبة آداب وفلسفة (ت.ت)',
      'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ت)',
      'شعبة اللغات الأجنبية (ت.ت)',
      'ترتيب التلميذ (اللغات الأجنبية) (ت.ت)',
      'التوجيه التدريجي (ت.ت)',
      'التوافق مع الرغبة (ت.ت)',
      'شعبة آداب وفلسفة (ت.م)',
      'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)',
      'شعبة اللغات الأجنبية (ت.م)',
      'ترتيب التلميذ (اللغات الأجنبية) (ت.م)',
      'التوجيه المسبق (ت.م)',
      'التوافق مع الرغبة (ت.م)',
      'ثبات الرغبة (ت.م)',
      'شعبة آداب وفلسفة (ت.ن)',
      'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ن)',
      'شعبة اللغات الأجنبية (ت.ن)',
      'ترتيب التلميذ (اللغات الأجنبية) (ت.ن)',
      'التوجيه النهائي (ت.ن)', 
      'التوافق مع الرغبة (ت.ن)', 
      'ثبات الرغبة (ت.ن)',
      'إقتراح مستشار التوجيه',
      'إقتراح الأساتذة',
      'قرار مجلس القبول والتوجيه',
      'حالة الطعن',
      'تأسيس الطعن',
      'قرار الطعن',
      'الشعبة المطعون فيها',
      'الشعبة المرغوب فيها',
      'قرار اللجنة الولائية للطعن',
    ];

    return requiredFields.every(field => {
      const value = rowData[field];
      return value !== undefined && value !== null && value !== '';
    });
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal: React.FC<{ onConfirm: () => void; onClose: () => void; row: StudentData | null }> = ({ onConfirm, onClose, row }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" dir="rtl">
        <div className={`bg-white p-6 rounded-lg shadow-lg ${isDarkMode ? 'table-dark' : ''}`}>
          <h2 className="text-xl font-bold mb-4">تأكيد الحذف</h2>
          <p>هل أنت متأكد أنك تريد حذف التلميذ (ة): <strong className={`px-2 py-1 bg-red-100 text-red-400 rounded ${isDarkMode ? 'button-failed-dark' : ''}`}>{row?.['اللقب و الاسم']}</strong>؟ هذه العملية لا يمكن التراجع عنها.</p>
          <div className="mt-6 text-left">
            <button onClick={onConfirm} className={`ml-2 px-4 py-2 bg-red-500 text-white rounded ${isDarkMode ? 'button-failed-dark hover:bg-red-900' : ''}`}>نعم، احذف</button>
            <button onClick={onClose} className={`px-4 py-2 bg-gray-300 text-black rounded ${isDarkMode ? 'button-dark hover:bg-gray-900' : ''}`}>إلغاء</button>
          </div>
        </div>
      </div>
    );
  };

  // Update the onDelete function
  const handleDelete = (row: StudentData) => {
    setRowToDelete(row); // Set the row to delete
    setShowDeleteConfirmationModal(true); // Show the confirmation modal
  };

  // Confirm delete function
  const confirmDelete = async () => {
    if (rowToDelete) {
      await onDelete(rowToDelete); // Call the onDelete function passed as a prop
      setRowToDelete(null); // Reset the row to delete
    }
    setShowDeleteConfirmationModal(false); // Close the confirmation modal
  };

  return (
    <div className={`overflow-x-auto ${isDarkMode ? 'dark-mode' : ''}`} dir="rtl">
      
      {/* Add a fixed-width container for the table */}
      <div className="w-full overflow-x-auto" style={{ maxWidth: '100vw' }}>
        <table className={`min-w-full ${isDarkMode ? 'table-dark' : ''}`} style={{ minWidth: 'max-content', width: '100%' }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-2 px-4 text-center text-sm font-medium text-gray-500 cursor-pointer whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanHide() && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            header.column.toggleVisibility();
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
                        >
                          {header.column.getIsVisible() ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-center divide-y divide-gray-100">
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={clsx(
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-white hover:bg-gray-200',
                  isDarkMode ? 'table-body-dark bg-white hover:bg-gray-800' : 'table-body-light'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-2 px-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className={`hidden sm:flex sm:flex-1 sm:items-center sm:justify-between ${isDarkMode ? 'table-dark' : ''}`}>
          <div>
            <p className={`text-sm text-gray-700 ${isDarkMode ? 'table-dark text-gray-100' : ''}`}>
              إظهار <span className="font-medium">{table.getState().pagination.pageIndex * pageSize + 1}</span> إلى{' '}
              <span className="font-medium">
                {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, table.getFilteredRowModel().rows.length)}
              </span>{' '}
              من <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> تلميذ
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ChevronLast className="w-5 h-5" />
            </button>
            <span className={`text-sm text-gray-700 ${isDarkMode ? 'table-dark text-gray-100' : ''}`}>
              الصفحة {table.getState().pagination.pageIndex + 1} من {table.getPageCount()}
            </span>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ChevronFirst className="w-5 h-5" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal 
          onConfirm={confirmDelete} 
          onClose={() => setShowDeleteConfirmationModal(false)} 
          row={rowToDelete} 
        />
      )}
    </div>
  );
}