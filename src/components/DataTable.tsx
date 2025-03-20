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
} from '@tanstack/react-table';
import { Edit2, Trash2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { Tooltip } from './ui/Tooltip';

// Define the structure of your data
interface StudentData {
  id: number;
  'اللقب و الاسم': string;
  'هل لديه مشكلة يريد مناقشتها': string; // This should match the type of the response
  // Add other fields as necessary
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
        id: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
          const isComplete = checkFormCompletion(row.original as any);
          return (
            <span
              className={clsx(
                'px-2 py-1 text-xs font-medium rounded-md',
                isComplete
                  ? `bg-green-100 text-green-800 ${isDarkMode ? 'button-success-dark' : ''}`
                  : `bg-yellow-100 text-yellow-800 ${isDarkMode ? 'button-warning-dark' : ''}`
              )}
            >
              {isComplete ? 'مكتمل' : 'غير مكتمل'}
            </span>
          );
        },
      },
      {
        id: 'hasIssue',
        header: 'المشكلة',
        cell: ({ row }) => {
          const response = row.original['هل لديه مشكلة يريد مناقشتها'];
          return (
            <span className="flex justify-center items-center w-full h-full">
              {response === 'نعم' ? (
                <Tooltip content="لديه مشكلة يريد مناقشتها" isDarkMode={isDarkMode}>
                  <div className="flex justify-center items-center w-full h-full">
                    <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-400 animate-pulse"></div>
                  </div>
                </Tooltip>
              ) : response === 'لا' ? (
                <Tooltip content="لا يوجد مشكلة" isDarkMode={isDarkMode}>
                  <div className="flex justify-center items-center w-full h-full">
                    <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-400 animate-pulse"></div>
                  </div>
                </Tooltip>
              ) : null
              }
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
              onClick={() => handleDelete(row.original as StudentData)}
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
      'المؤسسة',
      'المديرية',
      'اللقب و الاسم',
      'الجنس',
      'الإعادة',
      'القسم',
      'السوابق الصحية',
      'تاريخ الميلاد',
      'مكان الميلاد',
      'العنوان',
      'عدد الإخوة الذكور',
      'عدد الاخوة الاناث',
      'رتبته في العائلة',
      'مهنة الاب',
      'المستوى الدراسي للأب',
      'هل الأب متوفي',
      'مهنة الأم',
      'المستوى الدراسي للأم',
      'هل الأم متوفية',
      'هل الأبوين منفصلان',
      'هل لديه كفيل',
      'متابعة الأب',
      'متابعة الأم',
      'متابعة الكفيل',
      'المواد المفضلة',
      'سبب تفضيلها',
      'المواد الصعبة',
      'سبب صعوبتها',
      'الجذع المشترك المرغوب',
      'المواد المميزة للجذع',
      'سبب اهتمامه بالدراسة',
      'ممن يطلب المساعدة عند الصعوبة',
      'وسيلة أخرى لفهم الدروس',
      'هل تشجعه معاملة الأستاذ',
      'هل تحفزه مكافأة والديه',
      'هل ناقش مشروعه الدراسي مع والديه',
      'سبب عدم مناقشته لمشروعه الدراسي',
      'سبب اهتمامه بالدراسة',
      'أسباب أخرى للاهتمام بالدراسة',
      'المهنة التي يتمناها في المستقبل',
      'سبب اختيارها',
      'المستوى الدراسي الذي تتطلبه المهنة',
      'القطاع المرغوب للعمل فيه',
      'قطاعات أخرى مهتم بها',
      'هل لديه نشاط ترفيهي',
      'كيف يقضي أوقات فراغه',
      'مجالات أخرى للترفيه',
      'هل لديه معلومات كافية حول مشروعه المستقبلي',
      'ما المعلومات التي يحتاجها',
      'هل يعاني من صعوبات دراسية',
      'ما هي الصعوبات',
      'هل لديه مشكلة يريد مناقشتها',
      'ما هي المشكلة'
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
                    {flexRender(header.column.columnDef.header, header.getContext())}
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