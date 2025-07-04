import React, { useState, useEffect, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import favicon from '../../images/favicon.png'; // Import the image
import { Upload,
  Columns,
  Trash,
  Download,
  Eye,
  Sun,
  Moon,
  Filter,
  ArrowDownWideNarrow
 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getAllData, updateData, deleteData, clearAllData } from '../../lib/dbtcs';
import { DataTable } from './DataTable';
import { EditForm } from './EditForm';
import { ProgressiveDirectiveAnalysis } from './BEMAnalysis';
import { AdvanceDirectiveAnalysisPage } from './AnnualAnalysis';
import { FinalGuidanceAnalysisPage } from './DiffrenceAnalysis';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import ImportModal from './filter/ImportModal';
import { AdvancedFiltersModal, FilterObject } from './filter/AdvancedFiltersModal';
import { motion } from 'framer-motion';
import AdvancedSortingModal from './filter/AdvancedSortingModal';

// Define a type for your student data
interface StudentData {
  [key: string]: any; // Add this line at the top of the interface
  id?: number; // IndexedDB adds an ID automatically
  'اللقب و الاسم': string;
  'تاريخ الميلاد'?: string;
  'الجنس'?: string | { value: string, label: string };
  'الإعادة'?: string | { value: string, label: string };
  'القسم'?: string;
  'المديرية'?: string;
  'المؤسسة'?: string;

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

  'القرار'?: string | { value: string, label: string };
  'الملمح'?: string | { value: string, label: string };
  'الترتيب': number;
  
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<StudentData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [editingRow, setEditingRow] = useState<StudentData | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [sorting, setSorting] = useState<any[]>([]);
  const [filtering, setFiltering] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showGlobalAnalysis, setShowGlobalAnalysis] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const columnHelper = createColumnHelper<any>();
  const [pageSize, setPageSize] = useState<number>(9999);
  //const [showImportMenu, setShowImportMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // State to track the open dropdown
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any[]>([]);
  const [showClearConfirmationModal, setShowClearConfirmationModal] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false); // Add this state
  const [showImportModal, setShowImportModal] = useState(false); // New import modal state
  const [showAdvancedFiltersModal, setShowAdvancedFiltersModal] = useState(false); // Advanced filters modal state
  const [advancedFilters, setAdvancedFilters] = useState<FilterObject[]>([]); // Advanced filters state
  const [filteredData, setFilteredData] = useState<StudentData[]>([]); // Filtered data state
  const [showAdvancedSortingModal, setShowAdvancedSortingModal] = useState(false);
  const [advancedSorting, setAdvancedSorting] = useState<FilterObject[]>([]); // Advanced filters state

  useEffect(() => {
    loadData();
    // Set the initial theme based on the state
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]); // Update class when isDarkMode changes

  async function loadData() {
    const storedData = await getAllData();

    if (storedData.length > 0) {
      setData(storedData as StudentData[]);
      setFilteredData(storedData as StudentData[]); // Initialize filtered data

      const allColumns = Object.keys(storedData[0]).filter(key => key !== 'id');
      setColumns(allColumns);

      const hiddenColumnNames = [
        'القسم',
        'المؤسسة',
        'المديرية',
        'المعدل سنوي',

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

        'القرار',
        'الملمح',
        'الترتيب'
      ]; // 💡 permanent hidden columns

      const visibleCols = allColumns.filter(col => !hiddenColumnNames.includes(col));

      setVisibleColumns(visibleCols);
    } else {
      setData([]);
      setFilteredData([]); // Initialize filtered data as empty
      setColumns([]);
      setVisibleColumns([]);
    }
  }

  // Apply advanced filters to data
  const applyAdvancedFilters = useCallback((filters: FilterObject[]) => {
    setAdvancedFilters(filters);
    
    if (filters.length === 0) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(row => {
      return filters.every(filter => {
        const value = row[filter.column];
        
        if (value === null || value === undefined || value === '') {
          return false;
        }

        switch (filter.operation) {
          case '=':
            if (filter.type === 'string') {
              return String(value).toLowerCase() === String(filter.value).toLowerCase();
            } else if (filter.type === 'number') {
              return Number(value) === Number(filter.value);
            } else if (filter.type === 'date') {
              return new Date(value).toDateString() === (filter.value as Date).toDateString();
            }
            break;
            
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            
          case '>':
            if (filter.type === 'number') {
              return Number(value) > Number(filter.value);
            } else if (filter.type === 'date') {
              return new Date(value) > (filter.value as Date);
            }
            break;
            
          case '<':
            if (filter.type === 'number') {
              return Number(value) < Number(filter.value);
            } else if (filter.type === 'date') {
              return new Date(value) < (filter.value as Date);
            }
            break;
            
          case 'between':
            if (filter.type === 'number') {
              const [min, max] = filter.value as [number, number];
              return Number(value) >= min && Number(value) <= max;
            } else if (filter.type === 'date') {
              const [start, end] = filter.value as [Date, Date];
              const dateValue = new Date(value);
              return dateValue >= start && dateValue <= end;
            }
            break;
        }
        
        return true;
      });
    });

    setFilteredData(filtered);
  }, [data]);

  // Update filtered data when data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const ConfirmationModal: React.FC<{ data: any[]; onClose: () => void }> = ({ data, onClose }) => {
    // Assuming `data` contains the confirmation data with the required fields.
    const { strdirectorate, strschoolName, lastTwoDigits, totalRows } = data[0];

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" dir="rtl">
        <div className={`bg-white p-6 rounded-lg shadow-lg ${isDarkMode ? 'dark-mode' : ''}`}>
          {/* Success Message */}
          <div className="flex flex-col items-center justify-center p-4">
            <svg
              className="w-20 h-20 mr-2 mt-4 mb-8 text-green-600 animate-checkmark"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>

              <p className="text-3xl font-bold mb-6 text-center">{strdirectorate}</p>
              <p className="text-sm font-bold mb-4 text-center">{strschoolName}</p>
              <p className="text-كس mb-4 text-center">{lastTwoDigits}، {totalRows}.</p>

          </div>

          <div className="w-full text-left">
            <button 
              onClick={onClose} 
              className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${isDarkMode ? 'button-dark hover:bg-gray-900' : ''}`}
            >
              غلق
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Clear Confirmation Modal
  const ClearConfirmationModal: React.FC<{ onConfirm: () => void; onClose: () => void }> = ({ onConfirm, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" dir="rtl">
        <div className={`bg-white p-6 rounded-lg shadow-lg ${isDarkMode ? 'table-dark' : ''}`}>
          <h2 className="text-xl font-bold mb-4">تأكيد المسح</h2>
          <p>هل أنت متأكد أنك تريد مسح جميع البيانات؟ هذه العملية لا يمكن التراجع عنها.</p>
          <div className="mt-4 text-left">
            <button onClick={onConfirm} className={`ml-2 px-4 py-2 bg-red-500 text-white rounded ${isDarkMode ? 'button-failed-dark hover:bg-red-900' : ''}`}>نعم، امسح البيانات</button>
            <button onClick={onClose} className={`px-4 py-2 bg-gray-300 text-black rounded ${isDarkMode ? 'button-dark hover:bg-gray-900' : ''}`}>إلغاء</button>
          </div>
        </div>
      </div>
    );
  };

  const handleClearData = () => {
    setShowClearConfirmationModal(true); // Show the confirmation modal
  };

  const confirmClearData = async () => {
      await clearAllData(); // Clear all data in the database
      await loadData(); // Reload the data to update the UI
  
      // Clear file input to allow re-upload
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ''; // Reset file input value
      }

    setShowClearConfirmationModal(false); // Close the confirmation modal
  };  

  // #region handle File Upload
  /*const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // Get the list of files
    if (!files) return;

    const allJsonData: any[] = []; // Array to hold data from all files
    const confirmationEntries: any[] = []; // Array to hold confirmation data for each file

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const workbook = XLSX.read(e.target?.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Get the range of the worksheet
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      
            // Initialize variables
            let lastTwoDigits = '';
            let strdirectorate = '';
            let strschoolName = '';
            let strschoolTrunk ='';
            const jsonData: any[] = [];

            // Process the data
            const excludedHeaders = [31, 29, 27, 25, 23, 21, 19, 17, 15, 13, 11, 9, 7, 5]; // Add any headers you want to skip
            for (let R = 1; R <= range.e.r; R++) {
              const row: any = {};
              const cellB = worksheet[XLSX.utils.encode_cell({ r: R, c: 0 })]; // Column B
        
              // Skip if cell B is empty
              if (!cellB || !cellB.v) continue;
              
              // Get data from columns B to the last column
              for (let C = 0; C <= 33; C++) {
                const headerCell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
                const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
            
                // Skip if no header cell
                if (!headerCell || !headerCell.v) continue;
            
                const header = headerCell.v;
            
                // Skip if header is in the excluded list
                if (excludedHeaders.includes(C)) continue;
            
                // Handle date format if it's the birthdate column
                if (cell && typeof cell.v === 'number' && header === 'تاريخ الميلاد') {
                  const jsDate = XLSX.SSF.parse_date_code(cell.v);
                  row[header] = `${jsDate.y}-${String(jsDate.m).padStart(2, '0')}-${String(jsDate.d).padStart(2, '0')}`;
                } else {
                  row[header] = cell ? cell.v : '';
                }
              }
        
              jsonData.push(row);
            }
  
            allJsonData.push(...jsonData); // Accumulate data from each file

            // Push confirmation data for this file
            confirmationEntries.push({
                strdirectorate,
                strschoolName,
                lastTwoDigits,
                totalRows: jsonData.length,
            });
        };
        reader.readAsBinaryString(file); // Read each file
    }

    // Wait for all files to be processed
    await Promise.all(Array.from(files).map(file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = resolve;
    reader.readAsBinaryString(file);
    })));

    await addData(allJsonData); // Add all accumulated data to the database
    await loadData(); // Reload the data to update the UI

    setConfirmationData(confirmationEntries); // Set the confirmation data for all files
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const handleSavedFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const workbook = XLSX.read(e.target?.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Get the range of the worksheet
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  
      // Start from row 2 (index 1) to skip the header row
      const jsonData = [];
      for (let R = 1; R <= range.e.r; R++) {
        const row: any = {};
        // Get data from columns A to the last column
        for (let C = 0; C <= range.e.c; C++) { // Start from column A (index 0)
          const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
          const header = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })]; // Headers from the first row
          if (header && header.v) {
            // Directly assign the cell value without parsing
            row[header.v] = cell ? cell.v : '';
          }
        }
        jsonData.push(row);
      }
  
      // Ensure that the data structure matches the expected format for the EditForm
      const formattedData = jsonData.map(item => {
        // Create a whitelist of multi-select fields
        const multiSelectFields = [
          'المواد الصعبة',
          'المواد المفضلة',
          'المواد المميزة للجذع',
          'القطاع المرغوب للعمل فيه',
          'سبب اهتمامه بالدراسة',
          'ممن يطلب المساعدة عند الصعوبة',
          'كيف يقضي أوقات فراغه'
        ];
      
        return Object.entries(item).reduce((acc, [key, value]) => {
          // Handle multi-select fields
          if (multiSelectFields.includes(key)) {
            return {
              ...acc,
              [key]: value
                ? value.split(',').map(v => ({
                    value: v.trim(),
                    label: v.trim()
                  }))
                : []
            };
          }
      
          // Handle regular select fields
          const isSelectField = Object.values(Selection)
            .flat()
            .some(field => field.name === key && field.type === 'select');
      
          if (isSelectField) {
        return {
              ...acc,
              [key]: value ? { value: value.trim(), label: value.trim() } : null
            };
          }
      
          return { ...acc, [key]: value };
        }, {});
      });
  
      await addData(formattedData);
      await loadData();
    };
    reader.readAsBinaryString(file);
  };

  const handleFileUpload3 = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const existingData = await getAllData();
    console.log('Existing data:', existingData);
    console.log('Number of existing records:', existingData.length);

    const confirmationEntries: { strdirectorate: string, strschoolName: string, lastTwoDigits: string, totalRows: number }[] = [];
    const dataToUpdate: any[] = [];
    const dataToAdd: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        
        let strdirectorate = '';
        let strschoolName = '';
        let lastTwoDigits = '';

        // Get school information from specific cells regardless of data rows
        const cellA4 = worksheet[XLSX.utils.encode_cell({ r: 3, c: 0 })]; // المؤسسة
        if (cellA4 && cellA4.v) {
          strschoolName = String(cellA4.v);
        }

        const cellA3 = worksheet[XLSX.utils.encode_cell({ r: 2, c: 0 })]; // المديرية
        if (cellA3 && cellA3.v) {
          strdirectorate = String(cellA3.v);
        }

        const cellA5 = worksheet[XLSX.utils.encode_cell({ r: 4, c: 0 })]; // القسم
        if (cellA5 && cellA5.v) {
           lastTwoDigits = String(cellA5.v).slice(-2);
        }

        const jsonData: any[] = [];

        // Process the data rows starting from row 7 (index 6)
        for (let R = 6; R <= range.e.r; R++) {
          const row: any = { 'اللقب و الاسم': '' }; // Initialize with required field
          const cellB = worksheet[XLSX.utils.encode_cell({ r: R, c: 1 })]; // Column B (اللقب و الاسم)

          // Skip if cell B is empty
          if (!cellB || !cellB.v) continue;
          
          // First read the name field (اللقب و الاسم) from column B
          if (cellB && cellB.v) {
            row['اللقب و الاسم'] = String(cellB.v).trim();
          }
          
          // Get data from columns B to AQ (indices 1 to 42, total 42 columns starting from B)
          // Headers are in row 6 (index 5)
          for (let C = 1; C <= 49; C++) { // Loop through relevant data columns
            const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
            const headerCell = worksheet[XLSX.utils.encode_cell({ r: 5, c: C })]; // Headers from row 6
            
            if (headerCell && headerCell.v) {
                const header = String(headerCell.v).trim();
                // Ensure header is not empty and not the name column itself (already processed)
                if (header && header !== 'اللقب و الاسم') {
                    if (cell) {
                        if (header === 'تاريخ الميلاد' && typeof cell.v === 'number') {
                            const jsDate = XLSX.SSF.parse_date_code(cell.v);
                            row[header] = `${jsDate.y}-${String(jsDate.m).padStart(2, '0')}-${String(jsDate.d).padStart(2, '0')}`;
                        } else {
                            // Assign other cell values directly
                            row[header] = cell.v;
                        }
                    } else {
                        // Assign empty string if cell is empty
                        row[header] = '';
                    }
                }
            }
          }

          // Add school and directorate information to the row
          row['المؤسسة'] = strschoolName;
          row['المديرية'] = strdirectorate;

          // Determine the section (القسم) based on school type and last two digits
          const strschoolTrunkMatch = String(cellA5?.v || '').match(/جدع مشترك (آداب|علوم)/);
          if (strschoolName.startsWith('متوسطة')) {
              row['القسم'] = lastTwoDigits;
          } else if (strschoolName.startsWith('ثانوية')) {
              row['القسم'] = strschoolTrunkMatch ? 'جذع مشترك ' + strschoolTrunkMatch[1] + ' ' + lastTwoDigits : '';
          }

          jsonData.push(row);
        }

        // Process the extracted data for updating or adding
        for (const newRow of jsonData) {
          const existingRow = existingData.find((exRow: any) => 
            String(exRow['اللقب و الاسم']).trim() === String(newRow['اللقب و الاسم']).trim()
          );

          if (existingRow) {
            // Update existing row with non-empty values from newRow
            const updatedRow: any = { ...existingRow };
            for (const key in newRow) {
              // Ensure key is a valid property and value is not empty
              if (Object.prototype.hasOwnProperty.call(newRow, key) && newRow[key] !== '' && key !== 'id') {
                updatedRow[key] = newRow[key];
              }
            }
            dataToUpdate.push(updatedRow);
          } else {
            // Add new row
            dataToAdd.push(newRow);
          }
        }

        confirmationEntries.push({
          strdirectorate,
          strschoolName,
          lastTwoDigits,
          totalRows: jsonData.length,
        });
      };
      reader.readAsBinaryString(file);
    }

    // Wait for all files to be processed and data categorized
    await Promise.all(Array.from(files).map(file => new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(); // Resolve when reading is done
      reader.readAsBinaryString(file);
    })));

    // Perform database operations
    if (dataToUpdate.length > 0) {
      console.log('Updating records:', dataToUpdate);
      // Use a loop for updating as updateData likely handles one record at a time
      for (const record of dataToUpdate) {
        // Ensure the record has an ID for update
        if (record.id !== undefined) {
           await updateData(record.id, record);
        } else {
            console.error('Attempted to update a record without an ID:', record);
        }
      }
    }

    if (dataToAdd.length > 0) {
      console.log('Adding new records:', dataToAdd);
      await addData(dataToAdd); // addData can likely handle an array
    }

    await loadData(); // Reload the data to update the UI

    setConfirmationData(confirmationEntries);
    setShowConfirmationModal(true);
  };*/
  // #endregion
  
  const handleEdit = (row: any) => {
    setEditingRow(row);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteData(row.id);
      await loadData();
    }
  };

  const handleSubmitEdit = async (formData: any) => {
    if (editingRow && editingRow.id !== undefined) {
      await updateData(editingRow.id, formData);
    }
    setEditingRow(null);
    await loadData();
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev =>
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  // Define tableColumns here, before it's used
  const tableColumns = visibleColumns.map(col => 
    columnHelper.accessor(col, {
      header: col,
      cell: info => info.getValue(),
      enableSorting: true, // Enable sorting for each column
    })
  );

  const exportDataToXLSX = async () => {
    const workbook = XLSX.utils.book_new();
    
    // Define the order of columns as per your form
    const columnOrder = [
      'اللقب و الاسم',
      'تاريخ الميلاد',
      'الجنس',
      'الإعادة',
      'القسم',
      'المديرية',
      'المؤسسة',

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

      'القرار',
      'الملمح',
      'الترتيب'
    ];
  
    // Define select fields and their types
    const selectFieldsConfig: Record<string, 'single' | 'multi'> = {
      'اللقب و الاسم' : 'single',
      'تاريخ الميلاد' : 'single',
      'الجنس' : 'single',
      'الإعادة' : 'single',
      'القسم' : 'single',
      'المديرية' : 'single',
      'المؤسسة' : 'single',

      'اللغة العربية ف 1' : 'single',
      'اللغة العربية ف 2' : 'single',
      'اللغة العربية ف 3' : 'single',
      'اللغة العربية م س' : 'single',
      'العربية ش ت م' : 'single',

      'اللغة اﻷمازيغية ف 1' : 'single',
      'اللغة اﻷمازيغية ف 2' : 'single',
      'اللغة اﻷمازيغية ف 3' : 'single',
      'اللغة اﻷمازيغية م س' : 'single',
      'اﻷمازيغية ش ت م' : 'single',

      'اللغة الفرنسية ف 1' : 'single',
      'اللغة الفرنسية ف 2' : 'single',
      'اللغة الفرنسية ف 3' : 'single',
      'اللغة الفرنسية م س' : 'single',
      'الفرنسية ش ت م' : 'single',

      'اللغة الإنجليزية ف 1' : 'single',
      'اللغة الإنجليزية ف 2' : 'single',
      'اللغة الإنجليزية ف 3' : 'single',
      'اللغة الإنجليزية م س' : 'single',
      'الإنجليزية ش ت م' : 'single',

      'التربية الإسلامية ف 1' : 'single',
      'التربية الإسلامية ف 2' : 'single',
      'التربية الإسلامية ف 3' : 'single',
      'التربية الإسلامية م س' : 'single',
      'ت إسلامية ش ت م' : 'single',

      'التربية المدنية ف 1' : 'single',
      'التربية المدنية ف 2' : 'single',
      'التربية المدنية ف 3' : 'single',
      'التربية المدنية م س' : 'single',
      'ت مدنية ش ت م' : 'single',

      'التاريخ والجغرافيا ف 1' : 'single',
      'التاريخ والجغرافيا ف 2' : 'single',
      'التاريخ والجغرافيا ف 3' : 'single',
      'التاريخ والجغرافيا م س' : 'single',
      'تاريخ جغرافيا ش ت م' : 'single',

      'الرياضيات ف 1' : 'single',
      'الرياضيات ف 2' : 'single',
      'الرياضيات ف 3' : 'single',
      'الرياضيات م س' : 'single',
      'رياضيات ش ت م' : 'single',

      'ع الطبيعة و الحياة ف 1' : 'single',
      'ع الطبيعة و الحياة ف 2' : 'single',
      'ع الطبيعة و الحياة ف 3' : 'single',
      'ع الطبيعة و الحياة م س' : 'single',
      'علوم ط ش ت م' : 'single',

      'ع الفيزيائية والتكنولوجيا ف 1' : 'single',
      'ع الفيزيائية والتكنولوجيا ف 2' : 'single',
      'ع الفيزيائية والتكنولوجيا ف 3' : 'single',
      'ع الفيزيائية والتكنولوجيا م س' : 'single',
      'فيزياء ش ت م' : 'single',

      'المعلوماتية ف 1' : 'single',
      'المعلوماتية ف 2' : 'single',
      'المعلوماتية ف 3' : 'single',
      'المعلوماتية م س' : 'single',
      'معلوماتية ش ت م' : 'single',

      'التربية التشكيلية ف 1' : 'single',
      'التربية التشكيلية ف 2' : 'single',
      'التربية التشكيلية ف 3' : 'single',
      'التربية التشكيلية م س' : 'single',
      'ت تشكيلية ش ت م' : 'single',

      'التربية الموسيقية ف 1' : 'single',
      'التربية الموسيقية ف 2' : 'single',
      'التربية الموسيقية ف 3' : 'single',
      'التربية الموسيقية م س' : 'single',
      'ت موسيقية ش ت م' : 'single',

      'ت البدنية و الرياضية ف 1' : 'single',
      'ت البدنية و الرياضية ف 2' : 'single',
      'ت البدنية و الرياضية ف 3' : 'single',
      'ت البدنية و الرياضية م س' : 'single',
      'ت بدنية ش ت م' : 'single',

      'معدل الفصل 1' : 'single',
      'معدل الفصل 2' : 'single',
      'معدل الفصل 3' : 'single',
      'المعدل السنوي' : 'single',
      'معدل ش ت م' : 'single',
      'معدل الإنتقال' : 'single',

      'القرار' : 'single',
      'الملمح' : 'single',
      'الترتيب' : 'single'
    };

    // Prepare data for export
    const exportData = data.map(row => {
      return columnOrder.reduce((acc, column) => {
        const value = row[column];
        
        // Handle select fields
        if (selectFieldsConfig[column]) {
          if (selectFieldsConfig[column] === 'multi') {
            // Handle multi-select arrays
            if (Array.isArray(value)) {
              // If it's an array of objects with value/label properties
              acc[column] = value.map(v => v?.label || v?.value || v).join(',');
            } else if (typeof value === 'string') {
              // If it's a string, split by comma and join with Arabic comma
              acc[column] = value.split(',').map(v => v.trim()).join(',');
            } else {
              acc[column] = '';
            }
        } else {
            // Handle single select objects
            acc[column] = value?.label || value?.value || value || '';
          }
        }
        // Handle date field
        else if (column === 'تاريخ الميلاد' && value) {
          const date = new Date(value);
          acc[column] = `${String(date.getDate()).padStart(2, '0')}-${
            String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
        }
        // Handle other fields
        else {
          acc[column] = value || '';
        }
        
        return acc;
      }, {} as Record<string, any>);
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'الوجيز_شهادة_التعليم_المتوسط.xlsx');
  };
    
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleImportComplete = async (importedData: any[]) => {
    try {
      // Just reload the data from database since import modal handles all operations
      await loadData();
      
      // Show success message
      setConfirmationData([{
        strdirectorate: 'تم الاستيراد بنجاح.',
        strschoolName: 'الفصل ينبض بالحياة بوجود هذا العدد الرائع من الطلاب!',
        lastTwoDigits: 'تم تسجيل جميع الحضور',
        totalRows: 'وذلك بإضافت ' + importedData.length + ' تلميذ(ة)'
      }]);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error('Error completing import:', error);
    }
  };

  const hiddenColumn = [
    'المعدل سنوي',
    /*'المؤسسة',
    'المديرية',
    '',

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
    'المعدل السنوي'*/

  ]; // 💡 permanent hidden columns

  return (
    <div className={`max-h-screen ${isDarkMode ? 'dark-mode' : 'light-mode'}`} dir="rtl">
      {/* Top Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-10 py-2 ${isDarkMode ? 'nav-dark' : 'nav-light'}`}>
        <div className="max-w-full mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center">
                  <img
                    src={favicon} // Use the imported image
                    alt="Hero Image"
                    onClick={() => navigate('/')}
                    className="w-10 h-10 md:w-10 md:h-10 ml-2 rounded-lg transition-transform duration-300 hover:scale-110 hover:rotate-12"
                  />
              <span className="text-grey-600 font-semibold text-lg ml-8">تحليل نتائج شهادة التعليم المتوسط</span>
                  <div className="ml-10 flex space-x-4 gap-4">
                <button
                  onClick={() => {
                    setShowAnalysis(false);
                    setShowGlobalAnalysis(false);
                    setShowStudentList(false);
                      }}
                      disabled={data.length === 0}
                      className={`px-3 py-2 text-sm font-medium 
                        ${!showAnalysis && !showGlobalAnalysis && !showStudentList
                          ? `text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg ${isDarkMode ? 'text-bleu-400 hover:text-bleu-500 bg-gray-900' : ''}` 
                          : 'text-gray-500 hover:text-gray-700'} 
                        ${isDarkMode && (showAnalysis || showGlobalAnalysis || showStudentList) ? 'text-gray-400 hover:text-gray-300' : ''}`}
                >
                  قاعدة البيانات
                </button>
                  
                <button
                  onClick={() => {
                    setShowAnalysis(true);
                    setShowGlobalAnalysis(false);
                    setShowStudentList(false);
                      }}
                      disabled={data.length === 0}
                      className={`px-3 py-2 text-sm font-medium 
                        ${showAnalysis 
                          ? `text-green-600 hover:text-green-800 bg-green-50 rounded-lg ${isDarkMode ? 'text-green-400 hover:text-green-500 bg-green-900' : ''}`
                          : 'text-gray-500 hover:text-gray-700'} 
                        ${isDarkMode && !showAnalysis ? 'text-gray-400 hover:text-gray-300' : ''}`}
                    >
                      تحليل نتائج الشهادة
                </button>

                <button
                  onClick={() => {
                    setShowGlobalAnalysis(true);
                    setShowAnalysis(false);
                    setShowStudentList(false);
                  }}
                  disabled={data.length === 0}
                  className={`px-3 py-2 text-sm font-medium 
                    ${showGlobalAnalysis 
                      ? `text-orange-600 hover:text-orange-800 bg-orange-50 rounded-lg ${isDarkMode ? 'text-orange-400 hover:text-orange-500 bg-orange-900' : ''}`
                      : 'text-gray-500 hover:text-gray-700'} 
                    ${isDarkMode && !showGlobalAnalysis ? 'text-gray-400 hover:text-gray-300' : ''}`}
                >
                  تحليل النتائج السنوية
                  </button>

                  <button
                    onClick={() => {
                      setShowStudentList(true);
                      setShowGlobalAnalysis(false);
                      setShowAnalysis(false);
                    }}
                    disabled={data.length === 0}
                    className={`px-3 py-2 text-sm font-medium 
                      ${showStudentList 
                        ? `text-purple-600 hover:text-purple-800 bg-purple-50 rounded-lg ${isDarkMode ? 'text-purple-400 hover:text-purple-500 bg-purple-900' : ''}`
                        : 'text-gray-500 hover:text-gray-700'} 
                      ${isDarkMode && !showStudentList ? 'text-gray-400 hover:text-gray-300' : ''}`}
                  >
                    مقارنة النتائج
                  </button>

                    {/* Dark/Light Mode Toggle */}
                    <button
                      onClick={toggleDarkMode}
                      className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showGlobalAnalysis ? (
        <AdvanceDirectiveAnalysisPage data={data as any} isDarkMode={isDarkMode}/>
      ) : showAnalysis ? (
        <ProgressiveDirectiveAnalysis data={data as any} isDarkMode={isDarkMode}/>
      ) : showStudentList ? (
        <FinalGuidanceAnalysisPage data={data as any} isDarkMode={isDarkMode}/>
      ) : (
        <>
          {/* Toolbar */}
          <div className={`border-b border-gray-200 bg-white py-6 mt-16 ${isDarkMode ? 'nav-dark' : 'nav-light'}`}>
                <div className="max-w-full mx-auto px-4">
                  <div className="flex items-center space-x-4 py-2">
                <span className="font-medium">الادوات |</span>

                {/* filters button */}
                <div className="relative">
                  <input
                        type="text"
                        value={filtering}
                        onChange={e => setFiltering(e.target.value)}
                        placeholder="تصفية السجلات..."
                            className={`w-full px-3 py-2 text-sm border border-gray-300 border-gray-300 rounded-md mr-2 ${isDarkMode ? 'columnMenu-dark border border-gray-500' : 'columnMenu-light'}`}
                      />
                </div>

                {/* columns button */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpenDropdown(openDropdown === 'columnMenu' ? null : 'columnMenu')}
                    disabled={data.length === 7}
                    className={`inline-flex items-center px-3 py-1.5 mr-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 ${isDarkMode ? 'button-dark text-gray-50 hover:bg-gray-900' : 'button-light'}`}
                  >
                    الأعمدة
                    <Columns className="w-4 h-4 mr-2" />
                  </motion.button>
                    <div id="columnMenu" className={`absolute z-10 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-80 overflow-y-auto ${isDarkMode ? 'columnMenu-dark' : 'columnMenu-light'} ${openDropdown === 'columnMenu' ? '' : 'hidden'}`}>
                      <div className="py-1">
                        {columns
                        .filter(column => !hiddenColumn.includes(column))
                        .map((column, index) => (
                              <label key={column} className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isDarkMode ? 'columnMenu-dark hover:bg-gray-800' : 'columnMenu-light'}`}>
                            <input
                              type="checkbox"
                              checked={visibleColumns.includes(column)}
                              onChange={() => toggleColumn(column)}
                              className="ml-2"
                              disabled={index < 1}
                            />
                            {column}
                          </label>
                        ))}
                      </div>
                    </div>
                </div>

                {/* page size button */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpenDropdown(openDropdown === 'pageSizeMenu' ? null : 'pageSizeMenu')}
                    disabled={data.length === 0}
                    className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 ${isDarkMode ? 'button-dark hover:bg-gray-900' : 'button-light'}`}
                  >
                    عدد الصفوف
                    <Eye className="w-4 h-4 mr-2" />
                  </motion.button>
                    {openDropdown === 'pageSizeMenu' && (
                      <div id="pageSizeMenu" className={`absolute z-10 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${isDarkMode ? 'columnMenu-dark' : 'columnMenu-light'}`}>
                        <div className="py-1">
                          {[10, 25, 50, -1].map(size => (
                            <button
                              key={size}
                              onClick={() => {
                                setPageSize(size === -1 ? data.length : size);
                                      setOpenDropdown(null);
                              }}
                                    className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right ${isDarkMode ? 'columnMenu-dark hover:bg-gray-800' : 'columnMenu-light'}`}
                            >
                              {size === -1 ? 'الكل' : size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Advanced Filters button */}
                <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAdvancedFiltersModal(true)}
                    disabled={data.length === 0}
                    className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded transition-all duration-200 ${
                      advancedFilters.length > 0
                        ? `border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100 ${isDarkMode ? 'border-purple-500 text-purple-300 bg-purple-900 hover:bg-purple-800' : ''}`
                        : `border-gray-300 text-gray-700 bg-white hover:bg-gray-50 ${isDarkMode ? 'button-dark hover:bg-gray-900' : 'button-light'}`
                    }`}
                  >
                    
                    المرشحات المتقدمة
                    {advancedFilters.length > 0 && (
                      <span className={`mr-2 px-2 py-0.5 text-xs rounded-full ${
                        isDarkMode 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {advancedFilters.length}
                      </span>
                    )}
                    <Filter className={`w-4 h-4 mr-2 ${advancedFilters.length > 0 ? 'animate-pulse' : ''}`} />
                  </motion.button>
                </div>

                {/* Advanced Sorting button */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAdvancedSortingModal(true)}
                    disabled={data.length === 0}
                    className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded transition-all duration-200 ${
                      advancedSorting.length > 0
                        ? `border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 ${isDarkMode ? 'border-orange-500 text-orange-300 bg-orange-900 hover:bg-orange-800' : ''}`
                        : `border-gray-300 text-gray-700 bg-white hover:bg-gray-50 ${isDarkMode ? 'button-dark hover:bg-gray-900' : 'button-light'}`
                    }`}
                  >
                    الفرز المتقدم
                    {advancedSorting.length > 0 && (
                      <span className={`mr-2 px-2 py-0.5 text-xs rounded-full ${
                        isDarkMode 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {advancedSorting.length}
                      </span>
                    )}
                    <ArrowDownWideNarrow className={`w-4 h-4 mr-2 ${advancedSorting.length > 0 ? 'animate-pulse' : ''}`} />
                  </motion.button>
                </div>

                <span className="font-medium"> | </span>

                {/* import button 
                <div className="relative">
                  <button 
                    onClick={() => setShowImportModal(true)}
                    className={`inline-flex items-center px-3 py-1.5 border border-green-300 text-sm font-medium rounded text-green-700 bg-white hover:bg-green-50 ${isDarkMode ? 'button-dark hover:bg-gray-900' : 'button-light'}`}
                  >
                    استيراد التلاميذ
                    <Upload className="w-4 h-4 mr-2" />
                  </button>
                </div>*/}

                {/* export button */}
                <button
                  onClick={exportDataToXLSX}
                      disabled={data.length === 0}
                      className={`inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded text-blue-700 bg-white hover:bg-blue-50 ${isDarkMode ? 'button-dark hover:bg-gray-900' : ''}`}
                >
                  تصدير إلى XLSX
                  <Download className="w-4 h-4 mr-2" />
                </button>

                {/* clear data button */}
                <button
                  onClick={handleClearData}
                      disabled={data.length === 0}
                      className={`inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50 ${isDarkMode ? 'button-failed-dark hover:bg-red-900' : ''}`}
                >
                  مسح البيانات
                  <Trash className="w-4 h-4 mr-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
              <div className="max-w-full mx-auto px-12 py-12">
            {data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-100 text-center text-gray-500">
                    <img 
                      alt="Platform Dashboard"
                      width="320"
                      height="320"
                      className=""
                      loading="lazy" 
                      decoding="async" 
                      src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    />
                    <p className={`text-lg font-semibold text-gray-400 py-4 mt-4 ${isDarkMode ? 'nav-dark' : ''}`}>
                    أين الجميع؟ يبدو أن الفصل فارغ تمامًا!
                </p>
                <p className="text-sm text-gray-400">
                      لا توجد بيانات متاحة حاليًا. الرجاء إضافة تلاميذ إلى قاعدة البيانات لعرض التحليلات.
                    </p>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowImportModal(true)}
                        className={`inline-flex items-center px-3 py-1.5 mt-4 border border-blue-300 text-sm font-medium rounded text-blue-700 bg-white hover:bg-blue-100 ${isDarkMode ? 'button-dark bg-blue-50 hover:bg-blue-800' : ''}`}
                      >
                        استيراد البيانات
                        <Upload className="w-4 h-4 mr-2" />
                      </button>
                    </div>
              </div>
            ) : (
              <DataTable
                data={filteredData as any}
                columns={tableColumns as any}
                onEdit={handleEdit}
                onDelete={handleDelete}
                globalFilter={filtering}
                sorting={sorting}
                setSorting={setSorting}
                pageSize={pageSize}
                setPageSize={setPageSize}
                    isDarkMode={isDarkMode}
              />
            )}
          </div>

          {editingRow && (
            <EditForm
              data={editingRow}
              onSubmit={handleSubmitEdit}
              onClose={() => setEditingRow(null)}
              columns={columns}
                  isDarkMode={isDarkMode}
            />
              )}
            </>
          )}
      <Analytics />
      
      {/* Render the confirmation modal */}
      {showConfirmationModal && (
        <ConfirmationModal data={confirmationData} onClose={() => setShowConfirmationModal(false)} />
      )}

      {showClearConfirmationModal && (
        <ClearConfirmationModal 
          onConfirm={confirmClearData} 
          onClose={() => setShowClearConfirmationModal(false)} 
        />
      )}

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
        isDarkMode={isDarkMode}
      />

      <AdvancedFiltersModal
        isOpen={showAdvancedFiltersModal}
        onClose={() => setShowAdvancedFiltersModal(false)}
        columns={columns}
        data={data}
        onApplyFilters={applyAdvancedFilters}
        isDarkMode={isDarkMode}
      />

      <AdvancedSortingModal
        isOpen={showAdvancedSortingModal}
        onClose={() => setShowAdvancedSortingModal(false)}
        columns={columns}
        data={data}
        onApplySorting={rules => {
          setSorting(
            rules.map(rule => ({
              id: rule.column,
              desc: rule.direction === 'desc'
            }))
          );
          setAdvancedSorting(rules);
        }}
        initialRules={advancedSorting}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}