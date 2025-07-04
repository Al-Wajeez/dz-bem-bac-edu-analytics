import React, { useState, useMemo } from 'react';
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
  'تاريخ الميلاد': string;
  'الجنس': string;
  'الإعادة': string;
  'القسم': string;

  'اللغة العربية ف 1': number;
  'اللغة العربية ف 2': number;
  'اللغة العربية ف 3': number;
  'اللغة العربية م س': number;
  'العربية ش ت م': number;

  'اللغة اﻷمازيغية ف 1': number;
  'اللغة اﻷمازيغية ف 2': number;
  'اللغة اﻷمازيغية ف 3': number;
  'اللغة اﻷمازيغية م س': number;
  'اﻷمازيغية ش ت م': number;

  'اللغة الفرنسية ف 1': number;
  'اللغة الفرنسية ف 2': number;
  'اللغة الفرنسية ف 3': number;
  'اللغة الفرنسية م س': number;
  'الفرنسية ش ت م': number;

  'اللغة الإنجليزية ف 1': number;
  'اللغة الإنجليزية ف 2': number;
  'اللغة الإنجليزية ف 3': number;
  'اللغة الإنجليزية م س': number;
  'الإنجليزية ش ت م': number;

  'التربية الإسلامية ف 1': number;
  'التربية الإسلامية ف 2': number;
  'التربية الإسلامية ف 3': number;
  'التربية الإسلامية م س': number;
  'ت إسلامية ش ت م': number;

  'التربية المدنية ف 1': number;
  'التربية المدنية ف 2': number;
  'التربية المدنية ف 3': number;
  'التربية المدنية م س': number;
  'ت مدنية ش ت م': number;

  'التاريخ والجغرافيا ف 1': number;
  'التاريخ والجغرافيا ف 2': number;
  'التاريخ والجغرافيا ف 3': number;
  'التاريخ والجغرافيا م س': number;
  'تاريخ جغرافيا ش ت م': number;

  'الرياضيات ف 1': number;
  'الرياضيات ف 2': number;
  'الرياضيات ف 3': number;
  'الرياضيات م س': number;
  'رياضيات ش ت م': number;

  'ع الطبيعة و الحياة ف 1': number;
  'ع الطبيعة و الحياة ف 2': number;
  'ع الطبيعة و الحياة ف 3': number;
  'ع الطبيعة و الحياة م س': number;
  'علوم ط ش ت م': number;

  'ع الفيزيائية والتكنولوجيا ف 1': number;
  'ع الفيزيائية والتكنولوجيا ف 2': number;
  'ع الفيزيائية والتكنولوجيا ف 3': number;
  'ع الفيزيائية والتكنولوجيا م س': number;
  'فيزياء ش ت م': number;

  'المعلوماتية ف 1': number;
  'المعلوماتية ف 2': number;
  'المعلوماتية ف 3': number;
  'المعلوماتية م س': number;
  'معلوماتية ش ت م': number;

  'التربية التشكيلية ف 1': number;
  'التربية التشكيلية ف 2': number;
  'التربية التشكيلية ف 3': number;
  'التربية التشكيلية م س': number;
  'ت تشكيلية ش ت م': number;

  'التربية الموسيقية ف 1': number;
  'التربية الموسيقية ف 2': number;
  'التربية الموسيقية ف 3': number;
  'التربية الموسيقية م س': number;
  'ت موسيقية ش ت م': number;

  'ت البدنية و الرياضية ف 1': number;
  'ت البدنية و الرياضية ف 2': number;
  'ت البدنية و الرياضية ف 3': number;
  'ت البدنية و الرياضية م س': number;
  'ت بدنية ش ت م': number;

  'معدل الفصل 1': number;
  'معدل الفصل 2': number;
  'معدل الفصل 3': number;
  'المعدل السنوي': number;
  'معدل ش ت م': number;
  'معدل الإنتقال': number;

  'القرار': string;
  'الملمح': string;
  'الترتيب': string;
  
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

  const subjects = [
    'اللغة العربية',
    'اللغة اﻷمازيغية',
    'اللغة الفرنسية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'التربية المدنية',
    'التاريخ والجغرافيا',
    'الرياضيات',
    'ع الطبيعة و الحياة',
    'ع الفيزيائية والتكنولوجيا',
    'المعلوماتية',
    'التربية التشكيلية',
    'التربية الموسيقية',
    'ت البدنية و الرياضية'

  ];

  
  const processedData = useMemo(() => {
    return data.map((row) => {
      const newRow = { ...row };

      subjects.forEach((subject) => {
        const g1 = Number(row[`${subject} ف 1`]) || 0;
        const g2 = Number(row[`${subject} ف 2`]) || 0;
        const g3 = Number(row[`${subject} ف 3`]) || 0;

        const isValid = !isNaN(g1) && !isNaN(g2) && !isNaN(g3);
        newRow[`${subject} م س`] = isValid ? ((g1 + g2 + g3) / 3).toFixed(2) : null;
      });

      return newRow;
    });
  }, [data]); // Recompute only when `data` changes
  
  const table = useReactTable({
    data: processedData,
    columns: [
      {
        id: 'id',
        header: 'الرقم',
        cell: ({ row }) => (pageIndex * pageSize) + (row.index + 1),
      },
      ...columns,

      {
        id: 'Rank',
        header: 'الترتيب',
        cell: ({ table, row }) => {
          const allRows = table.getCoreRowModel().rows;
          const scores = allRows.map(r => ({
            id: r.id,
            value: Number(r.original['معدل ش ت م']) || 0
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
          row.original['الترتيب'] = rank;
          return rank || '-';
        },
      },

      {
        id: 'decision',
        header: 'القرار',
        cell: ({ row }) => {
          const birthDateStr = row.original['تاريخ الميلاد'];
          const transferGrade = Number(row.original['معدل الإنتقال']) || 0;

          let age = 0;
          if (birthDateStr && typeof birthDateStr === 'string') {
            const [day, month, year] = birthDateStr.split('-').map(Number);
            const birthDate = new Date(year, month - 1, day);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const hasBirthdayPassed =
              today.getMonth() > birthDate.getMonth() ||
              (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
            if (!hasBirthdayPassed) age--;
          }

          // Decision logic
          let suggestion = '';
          if (age < 16) {
            suggestion = transferGrade >= 10 ? 'ينتقل إلى قسم أعلى' : 'يعيد السنة';
          } else {
            suggestion = transferGrade >= 10 ? 'ينتقل إلى قسم أعلى' : 'يوجه إلى التكوين المهني';
          }

          // Save to original object
          row.original['القرار'] = suggestion;

          return (
            <span
              className={clsx(
                'px-2 py-1 text-sm font-medium rounded-md',
                suggestion === 'ينتقل إلى قسم أعلى'
                  ? `bg-green-100 text-green-800 ${isDarkMode ? 'button-success-dark' : ''}`
                  : suggestion === 'يعيد السنة'
                  ? `bg-red-100 text-red-800 ${isDarkMode ? 'button-failed-dark' : ''}`
                  : `bg-yellow-100 text-yellow-800 ${isDarkMode ? 'button-warning-dark' : ''}`
              )}
            >
              {suggestion}
            </span>
          );
        },
      },


      {
        id: 'profile',
        header: 'الملمح',
        cell: ({ row }) => {
          const arabicGrade = Number(row.original['اللغة العربية م س']) || 0;
          const frenchGrade = Number(row.original['اللغة الفرنسية م س']) || 0;
          const englishGrade = Number(row.original['اللغة الإنجليزية م س']) || 0;
          const historyGrade = Number(row.original['التاريخ والجغرافيا م س']) || 0;
          const mathGrade = Number(row.original['الرياضيات م س']) || 0;
          const scienceGrade = Number(row.original['ع الطبيعة و الحياة م س']) || 0;
          const physicsGrade = Number(row.original['ع الفيزيائية والتكنولوجيا م س']) || 0;
          const transferGrade = Number(row.original['معدل الإنتقال']) || 0;
          
          const tcl = ((arabicGrade * 5) + (frenchGrade * 4) + (englishGrade * 3) + (historyGrade * 2)) / 14;
          const tcs = ((arabicGrade * 2) + (mathGrade * 4) + (scienceGrade * 4) + (physicsGrade * 4)) / 14;

          let suggestion = '';
          if (tcl < tcs && transferGrade >= 10) {
            suggestion = 'جذع مشترك علوم وتكنولوجيا';
          } else if (tcl > tcs && transferGrade >= 10) {
            suggestion = 'جذع مشترك آداب وفلسفة';
          } else {
            suggestion = 'غير معني';
          }
      
          row.original['الملمح'] = suggestion;

          return (
            <span
              className={clsx(
                'px-2 py-1 text-sm font-medium rounded-md',
                suggestion === 'جذع مشترك علوم وتكنولوجيا'
                  ? `bg-blue-100 text-blue-800 ${isDarkMode ? 'button-success-dark' : ''}`
                  : suggestion === 'جذع مشترك آداب وفلسفة'
                    ? `bg-fuchsia-100 text-fuchsia-800 ${isDarkMode ? 'button-failed-dark' : ''}`
                    : `bg-gray-100 text-gray-800 ${isDarkMode ? 'bg-gray-800 text-white' : ''}`
              )}
            >
              {suggestion}
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
      
      'معدل الفصل الأول',
      'معدل الفصل الثاني',
      'معدل الفصل الثالث',
      'المعدل سنوي',
      'معدل ش ت م',

      'اللغة العربية ف 1',
      'اللغة العربية ف 2',
      'اللغة العربية ف 3',
      'اللغة العربية م س',
      'العربية ش ت م',

      'اللغة اﻷمازيغية ف 1',
      'اللغة اﻷمازيغية ف 2',
      'اللغة اﻷمازيغية ف 3',
      'اللغة اﻷمازيغية م س',
      'اﻷمازيغية ش ت م',

      'اللغة الفرنسية ف 1',
      'اللغة الفرنسية ف 2',
      'اللغة الفرنسية ف 3',
      'اللغة الفرنسية م س',
      'الفرنسية ش ت م',

      'اللغة الإنجليزية ف 1',
      'اللغة الإنجليزية ف 2',
      'اللغة الإنجليزية ف 3',
      'اللغة الإنجليزية م س',
      'الإنجليزية ش ت م',

      'التربية الإسلامية ف 1',
      'التربية الإسلامية ف 2',
      'التربية الإسلامية ف 3',
      'التربية الإسلامية م س',
      'ت إسلامية ش ت م',

      'التربية المدنية ف 1',
      'التربية المدنية ف 2',
      'التربية المدنية ف 3',
      'التربية المدنية م س',
      'ت مدنية ش ت م',

      'التاريخ والجغرافيا ف 1',
      'التاريخ والجغرافيا ف 2',
      'التاريخ والجغرافيا ف 3',
      'التاريخ والجغرافيا م س',
      'تاريخ جغرافيا ش ت م',

      'الرياضيات ف 1',
      'الرياضيات ف 2',
      'الرياضيات ف 3',
      'الرياضيات م س',
      'رياضيات ش ت م',

      'ع الطبيعة و الحياة ف 1',
      'ع الطبيعة و الحياة ف 2',
      'ع الطبيعة و الحياة ف 3',
      'ع الطبيعة و الحياة م س',
      'علوم ط ش ت م',

      'ع الفيزيائية والتكنولوجيا ف 1',
      'ع الفيزيائية والتكنولوجيا ف 2',
      'ع الفيزيائية والتكنولوجيا ف 3',
      'ع الفيزيائية والتكنولوجيا م س',
      'فيزياء ش ت م',

      'المعلوماتية ف 1',
      'المعلوماتية ف 2',
      'المعلوماتية ف 3',
      'المعلوماتية م س',
      'معلوماتية ش ت م',

      'التربية التشكيلية ف 1',
      'التربية التشكيلية ف 2',
      'التربية التشكيلية ف 3',
      'التربية التشكيلية م س',
      'ت تشكيلية ش ت م',

      'التربية الموسيقية ف 1',
      'التربية الموسيقية ف 2',
      'التربية الموسيقية ف 3',
      'التربية الموسيقية م س',
      'ت موسيقية ش ت م',

      'ت البدنية و الرياضية ف 1',
      'ت البدنية و الرياضية ف 2',
      'ت البدنية و الرياضية ف 3',
      'ت البدنية و الرياضية م س',
      'ت بدنية ش ت م',

      'معدل الفصل 1',
      'معدل الفصل 2',
      'معدل الفصل 3',
      'المعدل السنوي',
      'معدل ش ت م',
      'معدل الإنتقال',

      'إقتراح مستشار التوجيه',
  
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
                    className="py-4 px-4 text-center text-sm font-bold text-gray-500 hover:text-gray-800 cursor-pointer whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center justify-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-100',
                  isDarkMode ? 'table-body-dark bg-white hover:bg-gray-800' : 'table-body-light'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-4 px-4 whitespace-nowrap">
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